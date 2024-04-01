import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import './EditEmployeeForm.css';

const EditEmployeeForm = ({ employeeData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(employeeData);
  }, [employeeData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();

      // Append all fields from formData
      Object.keys(formData).forEach(key => {
        if (key !== 'uploadAadhar' && key !== 'uploadPAN' && key !== 'uploadCV') {
        formDataToSend.append(key, formData[key]);
        }
      });

      // Append file data
      if (formData.uploadAadhar) {
        formDataToSend.append('uploadAadhar', formData.uploadAadhar);
      }
      if (formData.uploadPAN) {
        formDataToSend.append('uploadPAN', formData.uploadPAN);
      }
      if (formData.uploadCV) {
        formDataToSend.append('uploadCV', formData.uploadCV);
      }

      await axios.put(`http://localhost:5000/employees/${formData._id}`, formDataToSend);
      onSave(formData); // Update the parent component with the saved data
      window.location.reload(); // Reload the page
    } catch (error) {
      console.error('Error saving employee data:', error);
    }
  };

  const handleFileChange = (fieldName, event) => {
    const file = event.target.files[0];
    setFormData({ ...formData, [fieldName]: file });
  };

  return (
    <div className="editupdatedform">
      <div className="editemployeeform">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mail"
              fullWidth
              variant="outlined"
              name="Mail"
              value={formData.Mail}
              onChange={handleChange}
            />
          </Grid>
          {/* Include other TextField components for other fields */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Address"
              fullWidth
              variant="outlined"
              name="Address"
              value={formData.Address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mobile"
              fullWidth
              variant="outlined"
              name="Mobile"
              value={formData.Mobile}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="CTC"
              fullWidth
              variant="outlined"
              name="CTC"
              value={formData.CTC}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Category"
              fullWidth
              variant="outlined"
              name="CategoryName"
              value={formData.CategoryName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Aadhar"
              fullWidth
              variant="outlined"
              name="Aadhar"
              value={formData.Aadhar}
              onChange={handleChange}
            />
            <input
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => handleFileChange('uploadAadhar', e)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="PAN"
              fullWidth
              variant="outlined"
              name="PAN"
              value={formData.PAN}
              onChange={handleChange}
            />
            <input
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => handleFileChange('uploadPAN', e)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="CV"
              fullWidth
              variant="outlined"
              name="CV"
              value={formData.CV}
              onChange={handleChange}
            />
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange('uploadCV', e)}
            />
          </Grid>
        </Grid>
        <div className="button-wrapper">
          <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
          <Button variant="contained" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeForm;
