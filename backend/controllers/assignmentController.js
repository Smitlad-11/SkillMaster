const User = require('../models/User');
const Assignment = require('../models/Assignment');

// @desc    Create assignment
// @route   POST /api/assignments
exports.createAssignment = async (req, res) => {
  const { title, description, courseId, dueDate, maxMarks, referenceLink } = req.body;

  const assignment = await Assignment.create({
    title, description, course: courseId,
    faculty: req.user._id, dueDate, maxMarks,
    referenceLink: referenceLink || '',
    fileUrl: req.file ? `/uploads/assignments/${req.file.filename}` : '',
  });

  res.status(201).json(assignment);
};

// @desc    Get assignments for the logged-in student
// @route   GET /api/assignments/my
exports.getMyAssignments = async (req, res) => {
  const user = await User.findById(req.user._id);
  const assignments = await Assignment.find({ course: { $in: user.enrolledCourses } })
    .populate('course', 'title thumbnail')
    .populate('faculty', 'name avatar')
    .sort({ dueDate: 1 });
  
  res.json(assignments);
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
exports.updateAssignment = async (req, res) => {
  let assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

  if (assignment.faculty.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const { title, description, dueDate, maxMarks, referenceLink } = req.body;
  
  if (title) assignment.title = title;
  if (description) assignment.description = description;
  if (dueDate) assignment.dueDate = dueDate;
  if (maxMarks) assignment.maxMarks = maxMarks;
  if (referenceLink !== undefined) assignment.referenceLink = referenceLink;

  if (req.file) {
    assignment.fileUrl = `/uploads/assignments/${req.file.filename}`;
  }

  await assignment.save();
  res.json(assignment);
};

// @desc    Get assignments for course
// @route   GET /api/assignments/course/:courseId
exports.getAssignments = async (req, res) => {
  const assignments = await Assignment.find({ course: req.params.courseId })
    .populate('faculty', 'name');
  res.json(assignments);
};

// @desc    Submit assignment
// @route   POST /api/assignments/:id/submit
exports.submitAssignment = async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

  const existing = assignment.submissions.findIndex(s => s.student.toString() === req.user._id.toString());
  const { link } = req.body;

  if (existing >= 0) {
    if (req.file) assignment.submissions[existing].fileUrl = `/uploads/assignments/${req.file.filename}`;
    if (link !== undefined) assignment.submissions[existing].link = link;
    assignment.submissions[existing].submittedAt = Date.now();
  } else {
    assignment.submissions.push({
      student: req.user._id,
      fileUrl: req.file ? `/uploads/assignments/${req.file.filename}` : '',
      link: link || ''
    });
  }

  await assignment.save();
  res.json({ message: 'Assignment submitted successfully' });
};

// @desc    Grade assignment
// @route   PUT /api/assignments/:id/grade/:studentId
exports.gradeAssignment = async (req, res) => {
  const { marks, feedback } = req.body;
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

  const submission = assignment.submissions.find(s => s.student.toString() === req.params.studentId);
  if (!submission) return res.status(404).json({ message: 'Submission not found' });

  submission.marks = marks;
  submission.feedback = feedback;
  submission.status = 'graded';

  await assignment.save();
  res.json({ message: 'Assignment graded successfully' });
};
