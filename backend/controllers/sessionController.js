// controllers/sessionController.js
const LiveSession = require('../models/LiveSession');

// @desc    Schedule live session
// @route   POST /api/sessions
exports.createSession = async (req, res) => {
  const { title, description, date, time, link, courseId } = req.body;
  const session = await LiveSession.create({
    title, description, date, time, link,
    course: courseId,
    faculty: req.user._id
  });
  res.status(201).json(session);
};

// @desc    Get sessions for student's enrolled courses
// @route   GET /api/sessions/my
exports.getMySessions = async (req, res) => {
  const User = require('../models/User');
  const user = await User.findById(req.user._id);
  const sessions = await LiveSession.find({ course: { $in: user.enrolledCourses } })
    .populate('course', 'title thumbnail')
    .populate('faculty', 'name avatar')
    .sort({ date: 1 });
  res.json(sessions);
};

// @desc    Get sessions created by faculty
// @route   GET /api/sessions/faculty
exports.getFacultySessions = async (req, res) => {
  const sessions = await LiveSession.find({ faculty: req.user._id })
    .populate('course', 'title')
    .sort({ date: 1 });
  res.json(sessions);
};

// @desc    Get session by courseId
// @route   GET /api/sessions/course/:courseId
exports.getCourseSessions = async (req, res) => {
  const sessions = await LiveSession.find({ course: req.params.courseId })
    .populate('faculty', 'name')
    .sort({ date: 1 });
  res.json(sessions);
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
exports.deleteSession = async (req, res) => {
  const session = await LiveSession.findById(req.params.id);
  if (!session) return res.status(404).json({ message: 'Session not found' });
  
  if (session.faculty.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await session.deleteOne();
  res.json({ message: 'Session deleted' });
};
