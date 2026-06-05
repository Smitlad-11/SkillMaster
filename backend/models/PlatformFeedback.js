const mongoose = require('mongoose');

const platformFeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('PlatformFeedback', platformFeedbackSchema);
