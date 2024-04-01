const mongoose = require('mongoose');

const uploadAadharSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  length: Number,
  chunkSize: Number,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const UploadAadhar = mongoose.model('UploadAadhar', uploadAadharSchema);

module.exports = UploadAadhar;
