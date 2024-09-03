import React from 'react';
import './Popup.css';

function Popup({ message, onClose, isError = false }) {
  return (
    <div className="popup-overlay">
      <div className={`popup ${isError ? 'error' : 'success'}`}>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

export default Popup;