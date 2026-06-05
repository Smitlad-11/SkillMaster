// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const {
  getCourses, getAllCourses, getCourse, createCourse,
  updateCourse, deleteCourse, getMyCourses, togglePublish, rateCourse,
  getCourseStudentsWithProgress
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getCourses);
router.get('/all', protect, authorize('admin'), getAllCourses);
router.get('/my-courses', protect, authorize('faculty', 'admin'), getMyCourses);
router.get('/:id/students-progress', protect, authorize('faculty', 'admin'), getCourseStudentsWithProgress);
router.post('/', protect, authorize('faculty', 'admin'), upload.single('thumbnail'), createCourse);
router.get('/:id', getCourse);
router.put('/:id', protect, authorize('faculty', 'admin'), upload.single('thumbnail'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);
router.put('/:id/publish', protect, authorize('faculty', 'admin'), togglePublish);
router.post('/:id/rate', protect, authorize('student'), rateCourse);

module.exports = router;
