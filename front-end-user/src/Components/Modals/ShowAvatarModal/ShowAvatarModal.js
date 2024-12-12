import React from 'react';
import './ShowAvatarModal.css'; // You can style your modal here

const Modal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        <h2 className='modal-title'>عکس پروفایل فعلی</h2> {/* "Current Profile Picture" */}
        <img src={imageUrl} alt="Profile" style={{ width: '100%', height: 'auto' }} />
      </div>
    </div>
  );
};

export default Modal;
