// FileModal.js
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element for accessibility

const FileModal = ({ isOpen, closeModal, fileUrl }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="File Modal"
    >
      <iframe title="File Viewer" src={fileUrl} width="100%" height="100%" />
      <button onClick={closeModal}>Close Modal</button>
    </Modal>
  );
};

export default FileModal;
