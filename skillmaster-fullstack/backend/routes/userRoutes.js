// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers, getUser, toggleBlock, deleteUser, getDashboardStats, createUser, updateUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/stats', protect, authorize('admin'), getDashboardStats);
router.route('/')
  .get(protect, authorize('admin'), getUsers)
  .post(protect, authorize('admin'), createUser);

router.route('/:id')
  .get(protect, authorize('admin'), getUser)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

router.put('/:id/block', protect, authorize('admin'), toggleBlock);

module.exports = router;
