import React from 'react';

const Modal = ({ isOpen, onRequestClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="close-icon" onClick={onRequestClose}>
          &#10006;
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
