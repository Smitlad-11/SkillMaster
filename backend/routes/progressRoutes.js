// routes/progressRoutes.js
const express = require('express');
const router = express.Router();
const { updateProgress, getProgress, getMyProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.put('/update', protect, authorize('student'), updateProgress);
router.get('/my', protect, authorize('student'), getMyProgress);
router.get('/:courseId', protect, authorize('student'), getProgress);

module.exports = router;
