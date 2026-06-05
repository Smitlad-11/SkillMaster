// controllers/lectureController.js
const Lecture = require('../models/Lecture');
const Course = require('../models/Course');

// @desc    Get single lecture
// @route   GET /api/lectures/:id
exports.getLecture = async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
  res.json(lecture);
};

// @desc    Get lectures for a course
// @route   GET /api/lectures/course/:courseId
exports.getLectures = async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.courseId }).sort('order');
  res.json(lectures);
};

// @desc    Create a lecture
// @route   POST /api/lectures
exports.createLecture = async (req, res) => {
  const { title, description, courseId, isFree, order } = req.body;

  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  if (course.faculty.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const lecture = await Lecture.create({
    title, description,
    course: courseId,
    videoUrl: req.files?.video ? `/uploads/videos/${req.files.video[0].filename}` : '',
    pdfUrl: req.files?.pdf ? `/uploads/pdfs/${req.files.pdf[0].filename}` : '',
    isFree: isFree === 'true',
    order: order || 0,
  });

  // Add lecture to course
  await Course.findByIdAndUpdate(courseId, { $push: { lectures: lecture._id } });

  res.status(201).json(lecture);
};

// @desc    Update a lecture
// @route   PUT /api/lectures/:id
exports.updateLecture = async (req, res) => {
  let lecture = await Lecture.findById(req.params.id);
  if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

  const course = await Course.findById(lecture.course);
  if (course.faculty.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to update this lecture' });
  }

  const updates = { ...req.body };
  if (req.files?.video) updates.videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
  if (req.files?.pdf) updates.pdfUrl = `/uploads/pdfs/${req.files.pdf[0].filename}`;

  lecture = await Lecture.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.json(lecture);
};

// @desc    Delete a lecture
// @route   DELETE /api/lectures/:id
exports.deleteLecture = async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

  const course = await Course.findById(lecture.course);
  if (course.faculty.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to delete this lecture' });
  }

  await Course.findByIdAndUpdate(lecture.course, { $pull: { lectures: lecture._id } });
  await lecture.deleteOne();

  res.json({ message: 'Lecture deleted' });
};
