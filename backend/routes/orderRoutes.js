// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/create', protect, authorize('student'), createOrder);
router.get('/', protect, authorize('admin'), getOrders);
router.get('/my', protect, authorize('student'), getMyOrders);

module.exports = router;
