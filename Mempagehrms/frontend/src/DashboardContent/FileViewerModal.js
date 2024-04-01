import React from 'react';
import Modal from 'react-modal';
import FileViewer from 'react-file-viewer';

const FileViewerModal = ({ isOpen, onRequestClose, fileData }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="File Viewer Modal"
      className="modal-content"
      // ... (styles and other props)
    >
      <div className="close-icon" onClick={onRequestClose}>
        &#10006; {/* HTML entity for close icon (X) */}
      </div>
      <h3>{`File Viewer - ${fileData.fileName}`}</h3>
      {fileData.fileName.endsWith('.pdf') ? (
        <FileViewer
          fileType="pdf"
          filePath={fileData.url}
          // ... (styles and other props)
        />
      ) : fileData.fileName.endsWith('.docx') || fileData.fileName.endsWith('.doc') ? (
        <FileViewer
          fileType="docx"
          filePath={fileData.url}
          // ... (styles and other props)
        />
      ) : (
        <p>Unsupported file format for the given file.</p>
      )}
    </Modal>
  );
};

export default FileViewerModal;
