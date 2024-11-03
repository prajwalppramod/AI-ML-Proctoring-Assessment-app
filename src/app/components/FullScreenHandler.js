"use client"; // Mark as a Client Component
import { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import Modal from './Modal';
import Questionnaire from './Questionnaire';


const FullscreenHandler = (userID) => {
  const [sessionStarted, setSessionStarted] = useState(false);
  const sessionStartedRef = useRef(sessionStarted);
  const [showExitModal, setShowExitModal] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cheatingAlert, setCheatingAlert] = useState('');

  // Sync ref with state
  useEffect(() => {
    sessionStartedRef.current = sessionStarted;
  }, [sessionStarted]);

  const enterFullscreen = async () => {
    const elem = document.documentElement;
    try {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
    } catch (error) {
      console.error("Error attempting to enter fullscreen mode:", error);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(console.error);
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen().catch(console.error);
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen().catch(console.error);
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen().catch(console.error);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (document.fullscreenElement) {
        if (event.key === 'Escape' || event.key === 'F11') {
          event.preventDefault();
          if (sessionStartedRef.current) {
            setShowExitModal(true);
          }
        }
      }
    };


    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        setSessionStarted(true);
      } else if (sessionStartedRef.current) {
        setShowExitModal(true);
      }
    };

    const handleContextMenu = (event) => {
      event.preventDefault();
      alert('Right-click is not allowed during the session.');
    };

    const handleKeyDownGlobal = (event) => {
      if (event.ctrlKey && (event.key === 'c' || event.key === 'v')) {
        event.preventDefault();
        alert('Copy/Paste is not allowed during the session.');
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && sessionStarted) {
        exitFullscreen();
        setSessionStarted(false);
      } else {
        if (document.fullscreenElement) {
          setTimeout(enterFullscreen);
        }
      }
    };

    const handleCtrlNumberCombo = (event) => {
      if (event.ctrlKey && /[0-9]/.test(event.key)) {
        if (sessionStartedRef.current) {
          exitFullscreen();
          setSessionStarted(false);
          alert('Test ended due to keyboard shortcut.');
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDownGlobal);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleCtrlNumberCombo);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDownGlobal);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleCtrlNumberCombo);
    };
  }, [sessionStarted]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const model = await blazeface.load();
        detectFaces(model);
      } catch (error) {
        console.error('Error accessing the camera: ', error);
      }
    };

    const detectFaces = async (model) => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const predictions = await model.estimateFaces(videoRef.current, false);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        if (predictions.length > 0) {
          predictions.forEach(prediction => {
            ctx.beginPath();
            ctx.lineWidth = "4";
            ctx.strokeStyle = "red";
            ctx.rect(
              prediction.topLeft[0],
              prediction.topLeft[1],
              prediction.bottomRight[0] - prediction.topLeft[0],
              prediction.bottomRight[1] - prediction.topLeft[1]
            );
            ctx.stroke();
          });
          if (predictions.length > 1) {
            setCheatingAlert('Multiple faces detected. Potential cheating detected.');
            if (sessionStartedRef.current) {
              exitFullscreen();
              setSessionStarted(false);
              alert('Test ended due to multiple faces detection.');
            }
          } else {
            setCheatingAlert('');
          }
        } else {
          setCheatingAlert('');
        }
      }
      requestAnimationFrame(() => detectFaces(model));
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startSession = () => {
    enterFullscreen();
    setSessionStarted(true);
  };

  const closeExitModal = () => {
    enterFullscreen();
    setShowExitModal(false);
  };

  const confirmExit = () => {
    exitFullscreen();
    setSessionStarted(false);
    setShowExitModal(false);
  };

  return (
    <div className='center-content pt-10 cam-video'>
      {!sessionStarted && <button className='button' onClick={startSession}>Start Test</button>}
      {sessionStarted && <h2>Session Started</h2> && <p>Press Esc to end the test</p>}
      {/* {sessionStarted && <div className='form-class-one'>
        <div className='form-class-two'><iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfI6yhkufm3NRYFWVCAVYT0xW_cEeMdT0QJXugh675IqtbIGg/viewform?embedded=true" width="640" height="950" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe></div></div>} */}
      {sessionStarted && <div className='form-class-one'><Questionnaire userID={userID} /> </div>}
      <canvas ref={canvasRef} width="320" height="240" className='webcam-canvas'></canvas>
      <Modal
        isOpen={showExitModal}
        onClose={closeExitModal}
        onConfirm={confirmExit}
        message="Are you sure you want to exit the session? Exiting will end the test."
      />

      <video ref={videoRef} autoPlay muted width="20" height="15" style={{ visibility: 'hidden' }}></video>
      {cheatingAlert && <div style={{ color: 'red', fontWeight: 'bold' }}>{cheatingAlert}</div>}
    </div>
  );
};

export default FullscreenHandler;