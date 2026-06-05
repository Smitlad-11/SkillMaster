// routes/queryRoutes.js
const express = require('express');
const router = express.Router();
const { createQuery, getMyQueries, getFacultyQueries, answerQuery, getQueriesByCourse } = require('../controllers/queryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('student'), createQuery);
router.get('/my', protect, authorize('student'), getMyQueries);
router.get('/course/:courseId', protect, authorize('student'), getQueriesByCourse);
router.get('/faculty', protect, authorize('faculty', 'admin'), getFacultyQueries);
router.put('/:id/answer', protect, authorize('faculty', 'admin'), answerQuery);

module.exports = router;
