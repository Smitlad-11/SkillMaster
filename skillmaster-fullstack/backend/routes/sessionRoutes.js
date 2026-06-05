// routes/sessionRoutes.js
const express = require('express');
const router = express.Router();
const { createSession, getMySessions, getCourseSessions, deleteSession, getFacultySessions } = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('faculty', 'admin'), createSession);
router.get('/my', protect, authorize('student'), getMySessions);
router.get('/faculty', protect, authorize('faculty', 'admin'), getFacultySessions);
router.get('/course/:courseId', protect, getCourseSessions);
router.delete('/:id', protect, authorize('faculty', 'admin'), deleteSession);

module.exports = router;
