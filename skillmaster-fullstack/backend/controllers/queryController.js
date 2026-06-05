// controllers/queryController.js
const Query = require('../models/Query');

// @desc    Create student query
// @route   POST /api/queries
exports.createQuery = async (req, res) => {
  const { courseId, question } = req.body;
  const query = await Query.create({
    student: req.user._id,
    course: courseId,
    question
  });
  res.status(201).json(query);
};

// @desc    Get student's own queries
// @route   GET /api/queries/my
exports.getMyQueries = async (req, res) => {
  const queries = await Query.find({ student: req.user._id }).populate('course', 'title');
  res.json(queries);
};

// @desc    Get queries for a specific course
// @route   GET /api/queries/course/:courseId
exports.getQueriesByCourse = async (req, res) => {
  const queries = await Query.find({ 
    course: req.params.courseId,
    student: req.user._id 
  }).sort({ createdAt: -1 });
  res.json(queries);
};

// @desc    Get queries for faculty's courses
// @route   GET /api/queries/faculty
exports.getFacultyQueries = async (req, res) => {
  const queries = await Query.find().populate({
    path: 'course',
    match: { faculty: req.user._id },
    select: 'title'
  }).populate('student', 'name email');
  
  // Filter out queries where course is null (match didn't work)
  const filtered = queries.filter(q => q.course !== null);
  res.json(filtered);
};

// @desc    Answer query
// @route   PUT /api/queries/:id/answer
exports.answerQuery = async (req, res) => {
  const { answer } = req.body;
  const query = await Query.findById(req.params.id);
  if (!query) return res.status(404).json({ message: 'Query not found' });

  query.answer = answer;
  query.isResolved = true;
  query.repliedBy = req.user._id;
  query.repliedAt = Date.now();
  await query.save();

  res.json(query);
};
