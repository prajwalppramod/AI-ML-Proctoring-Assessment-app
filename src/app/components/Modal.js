// src/components/Modal.js
import React, { useEffect, useState } from 'react';
import '../styles/styles.css'; 

const Modal = ({ isOpen, onClose, onConfirm, message }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (isOpen) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer); // Clear the timer if the component unmounts or countdown changes
      } else {
        onConfirm(); // Trigger the onClose function when countdown reaches 0
      }
    }
  }, [countdown, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal center-content">
        <img src="https://cdn.pixabay.com/photo/2016/07/01/22/33/industrial-safety-1492046_1280.png" className='caution-image' alt="Caution" />
        <p>{message}</p>
        <p>Auto-closing in {countdown} seconds...</p>
        <div className="modal-buttons">
          <button className='button yes-button' onClick={onConfirm}>Yes</button>
          <button className='button no-button' onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;


// import React from 'react';
// import '../styles/styles.css'; 
// const Modal = ({ isOpen, onClose, onConfirm, message }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal  center-content">
//       <img src="https://cdn.pixabay.com/photo/2016/07/01/22/33/industrial-safety-1492046_1280.png" className='caution-image' alt="alternatetext"/>
//         <p>{message}</p>
//         <div className="modal-buttons">
//           <button className='button yes-button' onClick={onConfirm}>Yes</button>
//           <button className='button no-button' onClick={onClose}>No</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;
