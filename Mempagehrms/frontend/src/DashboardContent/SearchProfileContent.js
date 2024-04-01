
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { pdfjs } from 'react-pdf';
import UpdateForm from './UpdateForm';
import SearchProfileContent from './SearchPage';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

import FileViewer from 'react-file-viewer';
import './UpdateProfileContent.css';


const getWeekNumber = (date) => {
  const currentDate = new Date(date);
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startOfYear) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return weekNumber;
};

const Modal = ({ isOpen, onRequestClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* <button className="modal-close" onClick={onRequestClose}>
          Close
        </button> */}
        <div className="close-icon" onClick={onRequestClose}>
    &#10006; {/* HTML entity for close icon (X) */}
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
  const [resumeUrl, setResumeUrl] = useState([]);
  const [filteredUserDetails, setFilteredUserDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  

    

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/all');
        setUserDetails(response.data);
        console.log('User Details:', response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchData();
  }, []);
  
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


  const handleSearch = (searchQuery) => {
    if (
      searchQuery.mobile === '' &&
      searchQuery.candidate === '' &&
      searchQuery.domain === '' &&
      searchQuery.secondaryskills === '' &&
      searchQuery.email === '' &&
      searchQuery.experience === '' &&
      !searchQuery.searchWeekly &&
      !searchQuery.searchMonthly &&
      searchQuery.startDate === '' &&
      searchQuery.endDate === ''
    ) {
      setSearchError('Please select at least one search field.');
      setFilteredUserDetails([]);
      return;
    }
  
    setSearchError('');
  
    // Sort the userDetails array by startDate in descending order
    const sortedUserDetails = [...userDetails].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  
    const filteredData = sortedUserDetails.filter((user) => {
      const matchMobile = searchQuery.mobile === '' || user.mobile.includes(searchQuery.mobile);
      const matchCandidate = searchQuery.candidate === '' || user.candidate.includes(searchQuery.candidate);
      const matchDomain = searchQuery.domain === '' || user.domain.includes(searchQuery.domain);
      const matchSecondarySkills = searchQuery.secondaryskills === '' || user.secondaryskills.includes(searchQuery.secondaryskills);
      const matchEmail = searchQuery.email === '' || user.email.includes(searchQuery.email);
      const matchExperience = searchQuery.experience === '' || user.experience.includes(searchQuery.experience);
      const matchDateRange =
        (searchQuery.startDate === '' || user.startDate >= searchQuery.startDate) &&
        (searchQuery.endDate === '' || user.startDate <= searchQuery.endDate);
  
      const matchDomainExperience =
        (searchQuery.domain === '' || user.domain.includes(searchQuery.domain)) &&
        (searchQuery.experience === '' || user.experience.includes(searchQuery.experience));
  
      if (searchQuery.searchWeekly) {
        // Get the week number of the current user's startDate
        const userWeek = getWeekNumber(new Date(user.startDate));
        // Get the week number of the latest date in the sorted list
        const latestWeek = getWeekNumber(new Date(sortedUserDetails[0].startDate));
  
        return (
          userWeek === latestWeek &&
          matchMobile &&
          matchCandidate &&
          matchEmail &&
          matchDateRange &&
          matchDomainExperience
        );
      }
  
      if (searchQuery.searchMonthly) {
        const userMonth = new Date(user.startDate).getMonth();
        const currentMonth = new Date().getMonth();
  
        return userMonth === currentMonth && matchMobile && matchCandidate && matchEmail && matchDateRange && matchDomainExperience;
      }
  
      return (
        matchMobile && matchCandidate && matchEmail && matchDateRange && matchDomainExperience && matchSecondarySkills
      );
    });
  
    setFilteredUserDetails(filteredData);
    setSerialNumbers(Array.from({ length: filteredData.length }, (_, index) => index + 1));
    setCurrentPage(1);
  };
  
  const itemsPerPage = 50;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUserDetails.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUserDetails.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <SearchProfileContent onSearch={handleSearch} />
      {searchError && <p style={{ color: 'red' }}>{searchError}</p>}
      {filteredUserDetails.length > 0 && (
        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date</th>
                <th>Recruiter</th>
                <th>primary Skills</th>
                <th>Secondary Skills</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Exp</th>
                <th>CTC </th>
                <th>ECTC</th>
                <th>NP</th>
                <th>PAN</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user, index) => (
                <tr key={user._id}>
                  <td>{serialNumbers[index]}</td>
                  <td>{formatDate(user.startDate)}</td>
                  <td>{user.recruiter}</td>
                  <td>{user.domain}</td>
                  <td>{user.secondaryskills}</td>
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

      {showUpdateModal && (
        <UpdateForm
          _id={selectedUserId}
          isOpen={true}
          onRequestClose={handleUpdateFormClose}
          initialData={userDetails.find((user) => user._id === selectedUserId)}
        />
      )}

      {resumeUrl.length > 0 && (
        <div>
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
            <Viewer fileUrl={resumeUrl[0]} />
          </Worker>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination-container1">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

{showUpdateModal && (
         <Modal isOpen={true} onRequestClose={handleUpdateFormClose}>
         {/* Content for the UpdateForm in the modal */}
         <UpdateForm
           _id={selectedUserId}
           isOpen={true}
           onRequestClose={handleUpdateFormClose}
           initialData={userDetails.find((user) => user._id === selectedUserId)}
         />
       </Modal>
      )}

      {showResumeModal && (
        <Modal isOpen={showResumeModal} onRequestClose={() => setShowResumeModal(false)}>
          {/* Display whatever content you want in the modal */}
          <div>
           
          </div>
        </Modal>
      )}

      {/* File Viewer Modal */}
      {selectedFile && (
        <Modal isOpen={true} onRequestClose={() => setSelectedFile(null)}>
          <FileViewer
            fileType={selectedFile.type}
            filePath={selectedFile.url}
          />
        </Modal>
      )}
    </div>
  );
};

export default UpdateProfileContent;



