const PlatformFeedback = require('../models/PlatformFeedback');

// @desc    Submit platform feedback
// @route   POST /api/platform-feedback
// @access  Private (Student/Faculty)
const submitPlatformFeedback = async (req, res) => {
  try {
    const { name, email, role, rating, message } = req.body;

    if (!rating || !message) {
      return res.status(400).json({ success: false, message: 'Please provide rating and message' });
    }

    const feedback = await PlatformFeedback.create({
      name,
      email,
      role,
      rating,
      message,
    });

    res.status(201).json({
      success: true,
      data: feedback,
      message: 'Feedback submitted successfully',
    });
  } catch (error) {
    console.error('Platform feedback submission error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all platform feedback
// @route   GET /api/platform-feedback
// @access  Private/Admin
const getPlatformFeedback = async (req, res) => {
  try {
    const feedbackList = await PlatformFeedback.find().sort('-createdAt');

    res.status(200).json({
      success: true,
      count: feedbackList.length,
      data: feedbackList,
    });
  } catch (error) {
    console.error('Get platform feedback error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  submitPlatformFeedback,
  getPlatformFeedback,
};
