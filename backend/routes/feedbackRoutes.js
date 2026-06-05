// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const { addFeedback, getCourseFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('student'), addFeedback);
router.get('/:courseId', getCourseFeedback);

module.exports = router;
