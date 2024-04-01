const express = require('express');
const router = express.Router();
const multer = require('multer');

// Example path in employeeRoutes.js
const Employee = require('../models/Employee'); // Corrected case

const UploadAadhar = require('../models/UploadAadhar');
const UploadPan = require('../models/UploadPan');
const UploadCCV = require('../models/UploadCCV');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle employee creation
router.post('/employee', async (req, res) => {
  try {
    const employeeData = req.body;
    const newEmployee = await Employee.create(employeeData);
    res.status(200).json({ message: 'Employee saved', employee: newEmployee });
  } catch (error) {
    console.error('Error saving employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to handle file uploads for Aadhar
router.post('/uploadAadhar', upload.single('uploadAadhar'), async (req, res) => {
  try {
    const fileData = req.file;
    const uploadedFile = await UploadAadhar.create(fileData);
    res.status(200).json({ message: 'File uploaded', file: uploadedFile });
  } catch (error) {
    console.error('Error uploading Aadhar file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to handle file uploads for PAN
router.post('/uploadPan', upload.single('uploadPan'), async (req, res) => {
  try {
    const fileData = req.file;
    const uploadedFile = await UploadPan.create(fileData);
    res.status(200).json({ message: 'File uploaded', file: uploadedFile });
  } catch (error) {
    console.error('Error uploading PAN file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to handle file uploads for CCV
router.post('/uploadCCV', upload.single('uploadCCV'), async (req, res) => {
  try {
    const fileData = req.file;
    const uploadedFile = await UploadCCV.create(fileData);
    res.status(200).json({ message: 'File uploaded', file: uploadedFile });
  } catch (error) {
    console.error('Error uploading CCV file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ...

router.get('/employees', async (req, res) => {
  try {
    console.log('Fetching employees...');
    const employees = await Employee.find();
    console.log('Fetched employees:', employees);
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
