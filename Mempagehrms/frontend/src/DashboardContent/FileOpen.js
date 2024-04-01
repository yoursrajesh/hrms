// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import Modal from 'react-modal';
// // // import './fileopen.css'
// // Modal.setAppElement('#root');
// // const FileOpen = () => {
// //   const [filesList, setFilesList] = useState([]);
// //   const [selectedFile, setSelectedFile] = useState(null);
// //   const [modalIsOpen, setModalIsOpen] = useState(false);
// //   useEffect(() => {
// //     fetchFilesList();
// //   }, []);
// //   const fetchFilesList = async () => {
// //     try {
// //       const response = await axios.get('http://localhost:5000/files');
// //       setFilesList(response.data);
// //     } catch (error) {
// //       console.error('Error fetching files:', error);
// //     }
// //   };
// //   const openModal = (file) => {
// //     setSelectedFile(file);
// //     setModalIsOpen(true);
// //   };
// //   const closeModal = () => {
// //     setSelectedFile(null);
// //     setModalIsOpen(false);
// //   };
// //   return (
// //     <div className="file-open-container">
// //       <h2>Uploaded Files:</h2>
// //       <ul className="uploaded-files">
// //         {filesList.map((file) => (
// //           <li key={file.filename}>
// //             <button className="file-button" onClick={() => openModal(file)}>
// //               {file.filename}
// //             </button>
// //           </li>
// //         ))}
// //       </ul>
// //       <Modal
// //         isOpen={modalIsOpen}
// //         onRequestClose={closeModal}
// //         contentLabel="File Modal"
// //         className="file-modal"
// //       >
// //         {selectedFile && (
// //           <iframe
// //             title="File Preview"
// //             src={`http://localhost:5000/file/${selectedFile.filename}`}
// //             width="100%"
// //             height="100%"
// //           />
// //         )}
// //         <button className="close-modal-button" onClick={closeModal}>
// //           Close Modal
// //         </button>
// //       </Modal>
// //     </div>
// //   );
// // };
// // export default FileOpen;










// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Modal from 'react-modal';

// Modal.setAppElement('#root');

// const FileOpen = () => {
//   const [filesList, setFilesList] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [modalIsOpen, setModalIsOpen] = useState(false);

//   useEffect(() => {
//     fetchFilesList();
//   }, []);

//   const fetchFilesList = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/files');
//       setFilesList(response.data);
//     } catch (error) {
//       console.error('Error fetching files:', error);
//     }
//   };

//   const openModal = (file) => {
//     setSelectedFile(file);
//     setModalIsOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedFile(null);
//     setModalIsOpen(false);
//   };

//   return (
//     <div className="file-open-container">
//       <h2>Uploaded Files:</h2>
//       <ul className="uploaded-files">
//         {filesList.map((file) => (
//           <li key={file.filename}>
//             <button className="file-button" onClick={() => openModal(file)}>
//               {file.filename}
//             </button>
//           </li>
//         ))}
//       </ul>

//       {/* Modal for displaying the selected file */}
//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={closeModal}
//         contentLabel="File Modal"
//         className="file-modal"
//       >
//         {selectedFile && (
//           <iframe
//             title="File Preview"
//             src={`http://localhost:5000/file/${selectedFile.filename}`}
//             width="100%"
//             height="100%"
//           />
//         )}
//         <button className="close-modal-button" onClick={closeModal}>
//           Close Modal
//         </button>
//       </Modal>
//     </div>
//   );
// };

// export default FileOpen;












import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');



const FileOpen = ({ onViewResume }) => {
  const [filesList, setFilesList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetchFilesList();
  }, []);

  const fetchFilesList = async () => {
    try {
      const response = await axios.get('http://localhost:5000/files');
      setFilesList(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const openModal = (file) => {
    setSelectedFile(file);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedFile(null);
    setModalIsOpen(false);
  };

  const handleViewResume = async (userId) => {
    if (onViewResume) {
      onViewResume(userId);
    }
  };

  return (
    <div className="file-open-container">
      <h2>Uploaded Files:</h2>
      <ul className="uploaded-files">
        {filesList.map((file) => (
          <li key={file.filename}>
            <button className="file-button" onClick={() => openModal(file)}>
              {file.filename}
            </button>
          </li>
        ))}
      </ul>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="File Modal"
        className="file-modal"
      >
        {selectedFile && (
          <iframe
            title="File Preview"
            src={`http://localhost:5000/file/${selectedFile.filename}`}
            width="100%"
            height="100%"
          />
        )}
        <button className="close-modal-button" onClick={closeModal}>
          Close Modal
        </button>
      </Modal>
    </div>
  );
};

export default FileOpen;
