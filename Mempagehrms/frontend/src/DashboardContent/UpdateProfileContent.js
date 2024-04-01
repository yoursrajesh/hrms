
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faFilePdf, faSpinner } from '@fortawesome/free-solid-svg-icons';
import UpdateForm from './UpdateForm';
import FileViewer from 'react-file-viewer';
import { pdfjs } from 'react-pdf';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './UpdateProfileContent.css';

// Simple Modal component
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

const UpdateProfileContent = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/all?page=${currentPage}&limit=${itemsPerPage}`);

        // Sort the data based on the createdAt field in descending order
        const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Reverse the array to display data in descending order
        const reversedData = sortedData.reverse();

        // Assign serial numbers based on the sorted order
        const dataWithSerialNumbers = reversedData.map((user, index) => ({ ...user, serialNumber: index + 1 }));

        setUserDetails(dataWithSerialNumbers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage]);

  
  
  

  // Function to sort by a particular field
  const handleSort = (field) => {
    const sortedUserDetails = [...userDetails].sort((a, b) => {
      if (a[field] < b[field]) {
        return -1;
      }
      if (a[field] > b[field]) {
        return 1;
      }
      return 0;
    });
    setUserDetails(sortedUserDetails);
  };

  // Rest of the component code...
  const handleRowsChange = (rowsPerPage) => {
    setItemsPerPage(rowsPerPage);
  };

  const handleUpdateClick = (userId) => {
    setSelectedUserId(userId);

    setTimeout(() => {
      const updateFormElement = document.getElementById('updateForm');
      if (updateFormElement) {
        updateFormElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);

    setShowUpdateModal(true);
  };

  const handleUpdateFormClose = () => {
    setShowUpdateModal(false);
    window.location.reload();
    
  };

  const handleViewResume = async (user) => {
    console.log('User Resume Data:', user.resume);
    console.log('User Details:', user);

    if (user.resume && user.resume.data && user.resume.fileName) {
      try {
        const resumeDetails = {
          data: user.resume.data,
          fileName: user.resume.fileName,
        };

        const blob = new Blob([new Uint8Array(resumeDetails.data.data)], { type: 'application/octet-stream' });
        const fileType = resumeDetails.fileName.split('.').pop().toLowerCase(); // Extracting file extension

        // Check file type and handle accordingly
        if (fileType === 'pdf' || fileType === 'doc' || fileType === 'docx') {
          const url = URL.createObjectURL(blob);

          // Use react-file-viewer for PDF, DOC, and DOCX files
          setSelectedFile({
            name: user.resume.fileName,
            url: url,
            type: fileType,
          });
        } else {
          console.log('Unsupported file type. Opening in a new window or tab.');
          // Open the file using the Blob URL in a new window or tab
          window.open(URL.createObjectURL(blob), '_blank');
        }
      } catch (error) {
        console.error('Error fetching or displaying resume:', error);
      }
    } else {
      console.log('Invalid resume data for this user');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/deleteUser/${userId}`);
      const updatedUserDetails = userDetails.filter((user) => user._id !== userId);
      setUserDetails(updatedUserDetails);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const userDetailsWithSerial = userDetails.map((user, index) => ({ ...user, serialNumber: index + 1 }));

  const totalPages = Math.ceil(userDetailsWithSerial.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedUserDetails = userDetailsWithSerial.slice(startIndex, endIndex);

  const PaginationBar = ({ currentPage, totalPages, onPageChange, onRowsChange, itemsPerPage }) => {
    return (
      <div className="pagination-bar">
        <span className="pagination-dropdown">
          <select onChange={(e) => onRowsChange(parseInt(e.target.value, 10))}>
            <option value="0">Select</option>
            <option value="10">10 Rows</option>
            <option value="20">20 Rows</option>
            <option value="30">30 Rows</option>
            <option value="50">50 Rows</option>
            <option value="100">100 Rows</option>
          </select>
        </span>
        <button
          className={`pagination-icon ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          {'❮'}
        </button>
        <span className="pagination-input">
          <input
            type="number"
            value={currentPage}
            onChange={(e) => onPageChange(parseInt(e.target.value, 10))}
            min="1"
            max={totalPages}
          />
        </span>
        <button
          className={`pagination-icon ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          {'❯'}
        </button>
      </div>
    );
  };

  return (
    <div>
      {loading ? (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            <p>Loading...</p>
          </div>
        </div>
      ) : (
        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
              <th>S.No </th>
                <th >StartDate </th>
                <th onClick={() => handleSort('recruiter')}>Recruiter <span className="sort-indicator">&#9660;</span></th>
                <th onClick={() => handleSort('domain')}>Primary Skills <span className="sort-indicator">&#9660;</span></th>
                <th onClick={() => handleSort('secondaryskills')}>Secondaryskills <span className="sort-indicator">&#9660;</span></th>
                <th >Name </th>
                <th >Name </th>
                <th >Mobile </th>
                <th >Email </th>
                <th onClick={() => handleSort('experience')}>Exp <span className="sort-indicator">&#9660;</span></th>
                <th onClick={() => handleSort('ctc')}>CTC <span className="sort-indicator">&#9660;</span></th>
                <th onClick={() => handleSort('ectc')}>ECTC <span className="sort-indicator">&#9660;</span></th>
                <th onClick={() => handleSort('noticePeriod')}>NP <span className="sort-indicator">&#9660;</span></th>
                <th >PAN </th>
                <th >Remarks </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUserDetails.map((user) => (
                <tr key={user._id}>
                  <td>{user.serialNumber}</td>
                  <td>{formatDate(user.startDate)}</td>
                  <td>{user.recruiter}</td>
                  <td>{user.domain}</td>
                  <td>{user.secondaryskills}</td>
                  <td>{user.candidate}</td>
                  <td>{user.candidate}</td>
                  <td>{user.mobile}</td>
                  <td>{user.email}</td>
                  <td>{user.experience}</td>
                  <td>{user.ctc}</td>
                  <td>{user.ectc}</td>
                  <td>{user.noticePeriod}</td>
                  <td>{user.panNo}</td>
                  <td>{user.remarks}</td>
                  <td>
                  <div className="action-buttons-container">
       <button onClick={() => handleViewResume(user)}>
          <img src='https://res.cloudinary.com/dd70o0ihc/image/upload/v1709094638/cv_huzwyk.png' style={{  height:'18px'  }} />
       </button>
     <button className="action-button update-button" onClick={() => handleUpdateClick(user._id)}>
         <img src='https://res.cloudinary.com/dd70o0ihc/image/upload/v1709093602/edit_qasdb4.png'   style={{ height:'18px' }} />
        </button>
       <button className="action-button delete-button" onClick={() => handleDelete(user._id)}>
<img src='https://res.cloudinary.com/dd70o0ihc/image/upload/v1709093602/icons8-delete-100_mnd1qs.png' style={{ height:'18px' }} />
</button>
      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        onRowsChange={(rowsPerPage) => handleRowsChange(rowsPerPage)}
        itemsPerPage={itemsPerPage}
      />

      {showUpdateModal && (
        <Modal isOpen={true} onRequestClose={handleUpdateFormClose}>
          <UpdateForm
            _id={selectedUserId}
            isOpen={true}
            onRequestClose={handleUpdateFormClose}
            initialData={userDetails.find((user) => user._id === selectedUserId)}
          />
        </Modal>
      )}

{selectedFile && (
  <Modal isOpen={true} onRequestClose={() => setSelectedFile(null)}>
    <a href={selectedFile.url} download>
          Download Resume
        </a>
    <div>
      {selectedFile.type === 'pdf' || selectedFile.type === 'docx' ? (
        <FileViewer fileType={selectedFile.type} filePath={selectedFile.url} />
      ) : (
        <div>
          <p>This file cannot be previewed.</p>
        </div>
      )}
      <div>
        
      </div>
    </div>
  </Modal>
)}



    </div>
  );
};

export default UpdateProfileContent;
