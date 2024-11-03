// src/components/CameraAI.js

"use client"; // Mark as a Client Component
import FullscreenHandler from './FullScreenHandler';
import { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

const CameraAI = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cheatingAlert, setCheatingAlert] = useState('');

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
            if (sessionStarted) {
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

  return (
    <div>
      
      <canvas ref={canvasRef} width="640" height="480" className='webcam-canvas'></canvas>
      <video ref={videoRef} autoPlay muted width="640" height="480" style={{ visibility: 'hidden' }}></video>
      {cheatingAlert && <div style={{ color: 'red', fontWeight: 'bold' }}>{cheatingAlert}</div>}
    </div>
  );
};

export default CameraAI;
//<video ref={videoRef} autoPlay muted width="640" height="480" style={{ display: 'none' }}></video>