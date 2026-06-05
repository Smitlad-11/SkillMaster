// models/Assignment.js
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date, required: true },
  maxMarks: { type: Number, default: 100 },
  fileUrl: { type: String, default: '' },
  referenceLink: { type: String, default: '' },
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fileUrl: String,
    link: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
    marks: { type: Number, default: null },
    feedback: { type: String, default: '' },
    status: { type: String, enum: ['submitted', 'graded'], default: 'submitted' }
  }],
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
