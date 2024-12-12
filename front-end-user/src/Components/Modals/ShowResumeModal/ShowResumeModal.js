import React from 'react';
import './ShowResumeModal.css';

const Modal = ({ isOpen, onClose, resumeUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        <h2 className='modal-title'>رزومه فعلی</h2>
        <iframe
            src={resumeUrl}
            style={{ width: '100%', height: '500px' }}
            title="Resume"
        />
      </div>
    </div>
  );
};

export default Modal;
