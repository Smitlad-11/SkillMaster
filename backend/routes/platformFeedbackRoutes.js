const express = require('express');
const { getPlatformFeedback, submitPlatformFeedback } = require('../controllers/platformFeedbackController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, submitPlatformFeedback)
  .get(protect, authorize('admin'), getPlatformFeedback);

module.exports = router;
