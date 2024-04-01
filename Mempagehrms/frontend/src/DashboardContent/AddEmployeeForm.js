import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, CircularProgress } from "@material-ui/core";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddEmployeeForm.css';

const AddEmployeeForm = ({ onClose, onSubmit, initialData }) => {
  const [employee, setEmployee] = useState({
    StartDate: '',
    EmpId: '',
    Supervisor: '',
    Name: '',
    Mobile: '',
    Mail: '',
    Password: '',
    Aadhar: '',
    PAN: '',
    UAN: '',
    Address: '',
    CTC: '',
    Category_id: '',
    uploadAadhar: null,
    uploadPAN: null,
    uploadCV: null,
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await axios.get('http://localhost:5000/categories');
        setCategoryOptions(result.data.results);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setEmployee(initialData || {
      StartDate: '',
      EmpId: '',
      Supervisor: '',
      Name: '',
      Mobile: '',
      Mail: '',
      Password: '',
      Aadhar: '',
      PAN: '',
      UAN: '',
      Address: '',
      CTC: '',
      Category_id: '',
      uploadAadhar: null,
      uploadPAN: null,
      uploadCV: null,
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mobile Number Validation
    if (name === 'Mobile' && !/^\d{0,10}$/.test(value)) {
      // Display an error message or handle invalid input
      return;
    }

    // Aadhar Validation
    if (name === 'Aadhar' && !/^\d{0,12}$/.test(value)) {
      // Display an error message or handle invalid input
      return;
    }

    // // Email Validation
    // if (name === 'Mail' && !/@/.test(value)) {
    //   // Display an error message or handle invalid input
    //   return;
    // }

    setEmployee((prevEmployee) => ({ ...prevEmployee, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    // File type validation logic
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (!files[0] || !allowedTypes.includes(files[0].type)) {
      // Display an error message or handle invalid file type
      return;
    }

    setEmployee((prevEmployee) => ({ ...prevEmployee, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();
    Object.entries(employee).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const url = initialData ? `http://localhost:5000/employee/${initialData._id}` : 'http://localhost:5000/employee';

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const result = initialData
        ? await axios.put(url, formData, config)
        : await axios.post(url, formData, config);

      console.log('Server Response:', result);

      if (result.status === 200 && result.data && result.data.message === 'Employee saved successfully') {
        onSubmit(employee);
        onClose();

        // Show success alert
        window.alert('Details successfully submitted');
      } else {
        const errorMessage = result.data && result.data.message ? result.data.message : 'Failed to save employee. No specific error message received from the server.';
        window.alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error adding/editing employee:', error);

     
    }
  };



  return (
    // Render the form components
    <div className="employee-form card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', width: '1200px', height: '450px', margin: '30px', overflowX: 'hidden',overflowY: 'hidden' }}>
      <form encType="multipart/form-data" className="card-body" onSubmit={handleSubmit}>
        
        
      <div className="row">
          <div className="col-3">
            <TextField
              type="date"
              fullWidth
              variant="outlined"
              name="StartDate"
              value={employee.StartDate}
              onChange={handleChange}
            />
          </div>
          <div className="col-3">
            <TextField
              label="EmpId"
              fullWidth
              variant="outlined"
              name="EmpId"
              value={employee.EmpId}
              onChange={handleChange}
            />
          </div>
          <div className="col-3">
            <TextField
              label="Supervisor"
              fullWidth
              variant="outlined"
              name="Supervisor"
              value={employee.Supervisor}
              onChange={handleChange}
            />
          </div>
          <div className="col-3">
            <TextField
              label="Name"
              fullWidth
              variant="outlined"
              name="Name"
              value={employee.Name}
              onChange={handleChange}
            />
          </div>
          </div>
          <div className="row">
          <div className="col-3">
            <TextField
              label="Mobile"
              type="text"
              fullWidth
              variant="outlined"
              name="Mobile"
              value={employee.Mobile}
              onChange={handleChange}
            />
          </div>
       
        {/* Add more fields as needed */}
        
          <div className="col-3">
            <TextField
              label="Mail"
              fullWidth
              variant="outlined"
              name="Mail"
              value={employee.Mail}
              onChange={handleChange}
            />
          </div>
          <div className="col-3">
            <TextField
              label="Password"
              fullWidth
              variant="outlined"
              name="Password"
              value={employee.Password}
              onChange={handleChange}
            />
          </div>
          <div className="col-3">
            <TextField
              label="Aadhar"
              fullWidth
              variant="outlined"
              name="Aadhar"
              value={employee.Aadhar}
              onChange={handleChange}
            />
          </div>
          </div>
          <div className="row">
          <div className="col-3">
            <TextField
              label="PAN"
              fullWidth
              variant="outlined"
              name="PAN"
              value={employee.PAN}
              onChange={handleChange}
            />
          </div>
        
        {/* Add more fields as needed */}
        
          <div className="col-3">
            <TextField
              label="UAN"
              fullWidth
              variant="outlined"
              name="UAN"
              value={employee.UAN}
              onChange={handleChange}
            />
          </div>
          <div className="col-3">
            <TextField
              label="Address"
              fullWidth
              variant="outlined"
              name="Address"
              value={employee.Address}
              onChange={handleChange}
            />
          </div>
          <div className="col-3">
            <TextField
              label="CTC"
              fullWidth
              variant="outlined"
              name="CTC"
              value={employee.CTC}
              onChange={handleChange}
            />
          </div>
          </div>
          <div className="row mb-3">
  <div className="col-3 uploadfields">
    <label htmlFor="category" className="form-label"></label>
    <select
      name="Category_id"
      id="category"
      className="form-select custom-select form-control rounded-0 custom-input"
      onChange={handleChange}
      value={employee.Category_id}
    >
      <option value={null}>Select Category</option>
      {Array.isArray(categoryOptions) &&
        categoryOptions.map((c) => (
          <option key={c._id} value={c._id}>
            {c.categoryName}
          </option>
        ))}
    </select>
  </div>

  <div className="col-3 uploadfields">
    <label htmlFor="uploadAadhar" className="form-label">
      Upload Aadhar
    </label>
    <input
      type="file"
      name="uploadAadhar"
      id="uploadAadhar"
      onChange={handleFileChange}
      className="form-control rounded-0"
      accept=".jpeg, .jpg, .png"
    />
    
  </div>

  <div className="col-3 uploadfields">
    <label htmlFor="uploadPAN" className="form-label">
      Upload PAN
    </label>
    <input
      type="file"
      name="uploadPAN"
      id="uploadPAN"
      onChange={handleFileChange}
      className="form-control rounded-0"
      accept=".jpeg, .jpg, .png"
    />
    {/* Add your custom text here */}
  </div>

  <div className="col-3 uploadfields">
    <label htmlFor="uploadCV" className="form-label">
      Upload CV
    </label>
    <input
      type="file"
      name="uploadCV"
      id="uploadCV"
      onChange={handleFileChange}
      className="form-control rounded-0"
      accept=".pdf, .doc, .docx"
    />
    {/* Add your custom text here */}
  </div>
</div>


        {/* Submit button */}
        <div className="col-12 mt-3">
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : (initialData ? 'Edit Employee' : 'Submit')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployeeForm;