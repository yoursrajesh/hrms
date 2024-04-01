import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import FileViewer from 'react-file-viewer';
import DocViewer from 'react-doc-viewer';
import { Document, Page } from 'react-docx';
import { renderAsyncDocument, renderAsyncPage } from 'react-docx';

import './UpdateEmployeePage.css';
import { blue } from '@material-ui/core/colors';

const UpdateEmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [fileData, setFileData] = useState({});
  const [selectedFileType, setSelectedFileType] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const result = await axios.get('http://localhost:5000/employees');
        setEmployees(result.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const openFile = async (fileType, employeeId) => {
    try {
      const response = await axios.get(`http://localhost:5000/file/${fileType}/${employeeId}`, {
        responseType: 'arraybuffer',
      });

      const contentType = response.headers['content-type'];

      if (contentType.startsWith('image')) {
        setFileData({
          url: URL.createObjectURL(new Blob([response.data], { type: contentType })),
          type: fileType,
        });
      } else {
        setFileData({
          url: URL.createObjectURL(new Blob([response.data], { type: contentType })),
          type: fileType,
          extension: contentType.split('/')[1],
        });
      }

      setSelectedFileType(fileType);
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error fetching file data:', error);
    }
  };

    const renderFileViewer = () => {
    if (selectedFileType === 'aadhar' || selectedFileType === 'pan') {
      // Display Aadhar and PAN files as images
      return (
        <img
          src={fileData?.url}
          alt={`${selectedFileType.toUpperCase()} File`}
          style={{ width: '100%', height: 'auto', maxWidth: '600px', maxHeight: '300px', objectFit: 'cover' }}
        />
      );
    } else if (selectedFileType === 'cv') {
      // Determine content type based on file extension
      const fileExtension = fileData.extension.toLowerCase();
       if (fileExtension === 'pdf') {
        // Display PDF using react-file-viewer
        return(
          <div style={{ width: '100%', height: '60vh' }}> <FileViewer fileType={fileExtension} filePath={fileData.url} style={{ width: '100%',  height: '100px', objectFit: 'cover' }}  />
          </div>);
        
      } 
      else if (selectedFileType === 'cv') {
        // Display CV files using react-file-viewer
        return (
          <div style={{ width: '100%', height: '60vh' }}>
          <FileViewer
            fileType="docx"  // Set the appropriate fileType for doc/docx files
            filePath={fileData.url}
            style={{ width: '100%',  height: '100px', objectFit: 'cover' }}
          />
          </div>
        );
      }
     
    } else {
      // Handle other file types or conditions
      return null;
    }
  };
  

  const closeModal = () => {
    setModalIsOpen(false);
    setFileData({});
    setSelectedFileType('');
    setSelectedEmployee(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsChange = (rowsPerPage) => {
    setItemsPerPage(rowsPerPage);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <div>
      <h2>Employee List</h2>
      <table className="user-table">        <thead className='headeroftable'>
          <tr>
            <th>S.N</th>
            <th>Start Date</th>
            <th>EmpId</th>
            <th>Supervisor</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Mobile</th>
            <th>Mail</th>
            <th>Aadhar</th>
            <th>PAN</th>
            <th>UAN</th>
            <th>Address</th>
            <th>CTC</th>
            <th>Category</th>
            <th>Documents</th>
          </tr>
        </thead>
        <tbody>
          {employees.slice(startIndex, endIndex).map((employee, index) => (
            <tr key={employee._id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
              <td>{index + 1}</td>
              <td>{new Date(employee.StartDate).toLocaleDateString('en-GB')}</td>
              <td>{employee.EmpId}</td>
              <td>{employee.Supervisor}</td>
              <td>{employee.Name}</td>
              <td>{employee.Mobile}</td>
              <td>{employee.Mobile}</td>
              <td>{employee.Mail}</td>
              <td>{employee.Aadhar}</td>
              <td>{employee.PAN}</td>
              <td>{employee.UAN}</td>
              <td>{employee.Address}</td>
              <td>{employee.CTC}</td>
              <td>{employee.CategoryName}</td>
              <td className="file-buttons">
                <button onClick={() => openFile('aadhar', employee._id)}>
                  <img
                    src="https://res.cloudinary.com/dd70o0ihc/image/upload/v1709633909/A-letters-png_mkk0ai.jpg"
                    className="imgicon"
                    style={{ height: '25px', width: '30px' }}
                    alt="Aadhar Icon"
                  />
                </button>
                <button onClick={() => openFile('pan', employee._id)}>
                  <img
                    src="https://res.cloudinary.com/dd70o0ihc/image/upload/v1709634152/p-letters-png_th01mi.jpg"
                    className="imgicon"
                    style={{ height: '25px', width: '30px' }}
                    alt="PAN Icon"
                  />
                </button>
                <button onClick={() => openFile('cv', employee._id)}>
                  <img
                    src="https://res.cloudinary.com/dd70o0ihc/image/upload/v1709634152/CV-letters-png_mzdq7s.jpg"
                    className="imgicon"
                    style={{ height: '25px', width: '30px' }}
                    alt="CV Icon"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-bar">
      <span className="pagination-dropdown">
        <select onChange={(e) => handleRowsChange(parseInt(e.target.value, 10))}>
          <option value="1">10 Rows</option>
          <option value="2">20 Rows</option>
          <option value="3">30 Rows</option>
          {/* Add more options as needed */}
        </select>
        </span>
        <button
          className={`pagination-icon ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          {'❮'}
        </button>
        <span className="pagination-input">
          <input
            type="number"
            value={currentPage}
            onChange={(e) => handlePageChange(parseInt(e.target.value, 10))}
            min="1"
            max={Math.ceil(employees.length / itemsPerPage)}
          />
        </span>
        <button
          className={`pagination-icon ${currentPage === Math.ceil(employees.length / itemsPerPage) ? 'disabled' : ''}`}
          onClick={() => handlePageChange(Math.min(currentPage + 1, Math.ceil(employees.length / itemsPerPage)))}
          disabled={currentPage === Math.ceil(employees.length / itemsPerPage)}
        >
          {'❯'}
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="File Modal"
        className="modal-content"
        style={{
          content: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '1px solid #ccc',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '10px',
            background: '#fff',
            maxWidth: '80vw',
            maxHeight: '70vh',
            
            marginTop: '5px',
          },
          overlay: {
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: '1000',
          },
        }}
      >
        <div className="close-icon" onClick={closeModal}>
          &#10006;
        </div>
        <h3>{selectedFileType.toUpperCase()} File - {selectedEmployee?.Name}</h3>
        {selectedFileType === 'aadhar' || selectedFileType === 'pan' ? (
          <img
            src={fileData?.url}
            alt={`${selectedFileType.toUpperCase()} File`}
            style={{ width: '500px', height: '300px', objectFit: 'cover' }}
          />
        ) : (
          renderFileViewer()
        )}
      </Modal>
    </div>
  );
};

export default UpdateEmployeePage;

