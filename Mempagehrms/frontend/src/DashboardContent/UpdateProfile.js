import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
const SubmittedData = () => {
  const [formSubmissions, setFormSubmissions] = useState(
    JSON.parse(localStorage.getItem('formSubmissions')) || []
  );

  const [editIndex, setEditIndex] = useState(null);

  const displayTable = () => {
    return formSubmissions.map((formData, index) => (
      <tr key={index}>
        <td>{formData.date}</td>
        <td>{formData.recruiter}</td>
        <td>{formData.domain}</td>
        <td>{formData.candidate}</td>
         <td>{formData.mobile}</td>
        <td>{formData.email}</td>
        <td>{formData.experience}</td>
        <td>{formData.ctc}</td>
        <td>{formData.ectc}</td>
        <td>{formData.noticePeriod}</td>
        <td>{formData.remarks}</td>
        <td>{formData.resume}</td>
        <td>
          <div className="btn-group-action">
            <button className="btn btn-warning btn-sm" onClick={() => editRow(index)}>
              Edit
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => deleteRow(index)}>
              Delete
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  const editRow = (index) => {
    setEditIndex(index);
  };

  const saveEdit = () => {
    // Update the data in the formSubmissions array for the specific row
    formSubmissions[editIndex] = {
      date: document.getElementById('editDate').value,
      recruiter: document.getElementById('editRecruiter').value,
      domain: document.getElementById('editDomain').value,
      candidate: document.getElementById('editCandidate').value,
      mobile: document.getElementById('editMobile').value,
      email: document.getElementById('editEmail').value,
      experience: document.getElementById('editExperience').value,
      ctc: document.getElementById('editCTC').value,
      ectc: document.getElementById('editECTC').value,
      noticePeriod: document.getElementById('editNoticePeriod').value,
      remarks: document.getElementById('editRemarks').value,
      resume: document.getElementById('editResume').value,
      // Repeat similar lines for other fields
    };

    // Close the modal
    setEditIndex(null);

    // Update the table
    updateTable();
  };

  const updateTable = () => {
    // Save the updated data in local storage
    localStorage.setItem('formSubmissions', JSON.stringify(formSubmissions));
  };

  const deleteRow = (index) => {
    // Remove the selected row from formSubmissions
    formSubmissions.splice(index, 1);

    // Update the table
    updateTable();
  };

  return (
    <div className="card-container">
      <div className="card-content">
        <h1 className="text-center mb-4">Submitted Data</h1>

        {/* Table container with a fixed header */}
        <div className="table-container">
          <table className="table">
            <thead className="fixed-header">
              <tr>
                <th>Date</th>
                <th>Recruiter</th>
                <th>Domain</th>
                <th>Candidate</th>
                
                <th>Mobile</th>
                <th>Email</th>
                <th>Experience</th>
                <th>CTC</th>
                <th>ECTC</th>
                <th>Notice period</th>
                <th>Remarks</th>
                <th>Resume</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{displayTable()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubmittedData;
