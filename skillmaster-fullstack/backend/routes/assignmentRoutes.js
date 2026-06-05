// routes/assignmentRoutes.js
const express = require('express');
const router = express.Router();
const { createAssignment, getAssignments, submitAssignment, gradeAssignment, getMyAssignments, updateAssignment } = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, authorize('faculty', 'admin'), upload.single('file'), createAssignment);
router.put('/:id', protect, authorize('faculty', 'admin'), upload.single('file'), updateAssignment);
router.get('/my', protect, authorize('student'), getMyAssignments);
router.get('/course/:courseId', protect, getAssignments);
router.post('/:id/submit', protect, authorize('student'), upload.single('file'), submitAssignment);
router.put('/:id/grade/:studentId', protect, authorize('faculty', 'admin'), gradeAssignment);

module.exports = router;
