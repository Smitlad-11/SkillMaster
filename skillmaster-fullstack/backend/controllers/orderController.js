// controllers/orderController.js
const razorpay = require('../config/razorpay');
const Order = require('../models/Order');
const Course = require('../models/Course');

// @desc    Create Razorpay order
// @route   POST /api/orders/create
exports.createOrder = async (req, res) => {
  const { courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  // Check if already enrolled
  if (course.enrolledStudents.includes(req.user._id)) {
    return res.status(400).json({ message: 'Already enrolled in this course' });
  }

  // Free course - enroll directly
  if (course.price === 0) {
    await Course.findByIdAndUpdate(courseId, { $addToSet: { enrolledStudents: req.user._id } });
    await require('../models/User').findByIdAndUpdate(req.user._id, { $addToSet: { enrolledCourses: courseId } });
    return res.json({ message: 'Enrolled successfully (free course)', free: true });
  }

  try {
    const options = {
      amount: course.price * 100, // paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    await Order.create({
      student: req.user._id,
      course: courseId,
      amount: course.price,
      razorpayOrderId: razorpayOrder.id,
    });

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      courseName: course.title,
    });
  } catch (error) {
    console.error('Razorpay Error:', error);
    return res.status(500).json({ 
      message: 'Failed to initiate payment.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      hint: 'Ensure your Razorpay API keys are configured correctly and your account is in Test Mode.'
    });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
exports.getOrders = async (req, res) => {
  const orders = await Order.find({ status: 'paid' })
    .populate('student', 'name email')
    .populate('course', 'title price')
    .sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Get my orders (student)
// @route   GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ student: req.user._id })
    .populate('course', 'title thumbnail price')
    .sort({ createdAt: -1 });
  res.json(orders);
};
