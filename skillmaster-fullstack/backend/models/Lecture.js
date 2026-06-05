// models/Lecture.js
const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  videoUrl: { type: String, required: true },
  pdfUrl: { type: String, default: '' },
  duration: { type: Number, default: 0 }, // in seconds
  order: { type: Number, default: 0 },
  isFree: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Lecture', lectureSchema);
