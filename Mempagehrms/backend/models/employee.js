const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true,
  },
  empId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  aadhar: {
    type: String,
    required: true,
  },
  pan: {
    type: String,
    required: true,
  },
  uan: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  ctc: {
    type: String,
    required: true,
  },
  category_id: {
    type: String,
    required: true,
  },
  uploadAadhar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadAadhar',
  },
  uploadPan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadPan',
  },
  uploadCCV: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadCCV',
  },
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
