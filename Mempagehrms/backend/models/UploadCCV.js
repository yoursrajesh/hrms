const mongoose = require('mongoose');

const uploadCCVSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  length: Number,
  chunkSize: Number,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const UploadCCV = mongoose.model('UploadCCV', uploadCCVSchema);

module.exports = UploadCCV;
