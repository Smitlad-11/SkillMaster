// controllers/userController.js
const User = require('../models/User');
const Course = require('../models/Course');
const Order = require('../models/Order');
const validatePassword = require('../utils/passwordValidator');

// @desc    Get all users (Admin)
// @route   GET /api/users
exports.getUsers = async (req, res) => {
  const { page = 1, limit = 10, role, search } = req.query;
  const query = {};

  if (role) query.role = role;
  if (search) query.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } }
  ];

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-password')
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
};

// @desc    Get single user (Admin)
// @route   GET /api/users/:id
exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password').populate('enrolledCourses', 'title thumbnail');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// @desc    Block/Unblock user (Admin)
// @route   PUT /api/users/:id/block
exports.toggleBlock = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'admin') return res.status(400).json({ message: 'Cannot block admin' });

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}`, isBlocked: user.isBlocked });
};

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.deleteOne();
  res.json({ message: 'User deleted' });
};

// @desc    Admin dashboard stats
// @route   GET /api/users/stats
exports.getDashboardStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalFaculty = await User.countDocuments({ role: 'faculty' });
  const totalCourses = await Course.countDocuments();
  const publishedCourses = await Course.countDocuments({ isPublished: true });
  const revenueData = await Order.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: { $month: '$createdAt' }, revenue: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  const totalRevenue = await Order.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  res.json({
    totalUsers, totalStudents, totalFaculty, totalCourses, publishedCourses,
    totalRevenue: totalRevenue[0]?.total || 0,
    revenueData,
  });
};

// @desc    Create a new user (Admin)
// @route   POST /api/users
exports.createUser = async (req, res) => {
  const { name, email, password, role, bio, phone } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const passwordCheck = validatePassword(password);
  if (!passwordCheck.isValid) {
    return res.status(400).json({ message: passwordCheck.message });
  }
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'student',
    bio: bio || '',
    phone: phone || ''
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Update an existing user (Admin)
// @route   PUT /api/users/:id
exports.updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Prevent changing admin to another role, or someone else to admin arbitrarily (optional safeguard, but since admin is doing it, we just update)
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
  user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
  
  if (req.body.password) {
    const passwordCheck = validatePassword(req.body.password);
    if (!passwordCheck.isValid) {
      return res.status(400).json({ message: passwordCheck.message });
    }
    user.password = req.body.password; // pre-save will hash it
  }

  const updatedUser = await user.save();
  
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    bio: updatedUser.bio,
    phone: updatedUser.phone
  });
};
