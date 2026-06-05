// controllers/feedbackController.js
const Feedback = require('../models/Feedback');
const Course = require('../models/Course');

// @desc    Add feedback
// @route   POST /api/feedback
exports.addFeedback = async (req, res) => {
  const { courseId, rating, comment } = req.body;

  const existing = await Feedback.findOne({ student: req.user._id, course: courseId });
  if (existing) {
    existing.rating = rating;
    existing.comment = comment;
    await existing.save();
    return res.json({ message: 'Feedback updated' });
  }

  await Feedback.create({ student: req.user._id, course: courseId, rating, comment });
  res.status(201).json({ message: 'Feedback submitted' });
};

// @desc    Get feedback for course
// @route   GET /api/feedback/:courseId
exports.getCourseFeedback = async (req, res) => {
  const feedback = await Feedback.find({ course: req.params.courseId })
    .populate('student', 'name avatar')
    .sort({ createdAt: -1 });
  res.json(feedback);
};
