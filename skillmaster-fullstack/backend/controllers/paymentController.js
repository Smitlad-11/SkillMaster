// controllers/paymentController.js
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Verify Razorpay payment signature
// @route   POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body).digest('hex');

  if (expected !== razorpay_signature) {
    return res.status(400).json({ message: 'Payment verification failed' });
  }

  const order = await Order.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    { status: 'paid', razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature },
    { new: true }
  );

  if (!order) return res.status(404).json({ message: 'Order not found' });

  // Enroll student
  await User.findByIdAndUpdate(order.student, { $addToSet: { enrolledCourses: order.course } });
  await Course.findByIdAndUpdate(order.course, { $addToSet: { enrolledStudents: order.student } });

  res.json({ message: 'Payment successful! Course enrolled.' });
};
