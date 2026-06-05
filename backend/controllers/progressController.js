// controllers/progressController.js
const Progress = require('../models/Progress');
const Lecture = require('../models/Lecture');
const Course = require('../models/Course');
const generateCertificate = require('../utils/generateCertificate');

// @desc    Update progress (mark lecture complete)
// @route   PUT /api/progress/update
exports.updateProgress = async (req, res) => {
  const { courseId, lectureId } = req.body;

  let progress = await Progress.findOne({ student: req.user._id, course: courseId });

  if (!progress) {
    progress = await Progress.create({ student: req.user._id, course: courseId });
  }

  if (!progress.completedLectures.includes(lectureId)) {
    progress.completedLectures.push(lectureId);
  }

  // Calculate percentage
  const course = await Course.findById(courseId);
  const totalLectures = course.lectures.length;
  progress.percentage = totalLectures > 0
    ? Math.round((progress.completedLectures.length / totalLectures) * 100)
    : 0;

  // Check completion
  if (progress.percentage === 100 && !progress.completed) {
    progress.completed = true;
    const user = await require('../models/User').findById(req.user._id);
    const date = new Date().toLocaleDateString('en-IN');
    const certFile = await generateCertificate(user.name, course.title, date);
    progress.certificateUrl = `/uploads/certificates/${certFile}`;
  }

  progress.lastAccessed = Date.now();
  await progress.save();

  res.json(progress);
};

// @desc    Get progress for a course
// @route   GET /api/progress/:courseId
exports.getProgress = async (req, res) => {
  const progress = await Progress.findOne({
    student: req.user._id,
    course: req.params.courseId
  }).populate('completedLectures', 'title');

  if (!progress) return res.json({ percentage: 0, completedLectures: [], completed: false });
  res.json(progress);
};

// @desc    Get all progress for student
exports.getMyProgress = async (req, res) => {
  const progressList = await Progress.find({ student: req.user._id })
    .populate('course', 'title thumbnail');
  
  // Filter out any entries where the course has been deleted
  const filteredProgress = progressList.filter(p => !!p.course);
  
  res.json(filteredProgress);
};
