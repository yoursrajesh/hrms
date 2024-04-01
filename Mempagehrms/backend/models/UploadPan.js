const mongoose = require('mongoose');

const uploadPanSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  length: Number,
  chunkSize: Number,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const UploadPan = mongoose.model('UploadPan', uploadPanSchema);

module.exports = UploadPan;
