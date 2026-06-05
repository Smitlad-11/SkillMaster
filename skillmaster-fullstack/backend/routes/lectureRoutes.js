// routes/lectureRoutes.js
const express = require('express');
const router = express.Router();
const { getLecture, getLectures, createLecture, updateLecture, deleteLecture } = require('../controllers/lectureController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const lectureUpload = upload.fields([{ name: 'video', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]);

router.get('/:id', protect, getLecture);
router.get('/course/:courseId', protect, getLectures);
router.post('/', protect, authorize('faculty', 'admin'), lectureUpload, createLecture);
router.put('/:id', protect, authorize('faculty', 'admin'), lectureUpload, updateLecture);
router.delete('/:id', protect, authorize('faculty', 'admin'), deleteLecture);

module.exports = router;
