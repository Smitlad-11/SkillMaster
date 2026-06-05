// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  price: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  language: { type: String, default: 'English' },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    review: String,
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  totalDuration: { type: String, default: '' }, // e.g. "12 Weeks" or "10 Hours"
  tags: [String],
  requirements: [String],
  whatYouLearn: [String],
}, { timestamps: true });

// Calculate average rating
courseSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
  }
};

module.exports = mongoose.model('Course', courseSchema);
