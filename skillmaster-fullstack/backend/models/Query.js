// models/Query.js
const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  question: { type: String, required: true },
  answer: { type: String, default: '' },
  isResolved: { type: Boolean, default: false },
  repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  repliedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Query', querySchema);
