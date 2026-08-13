// controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const validatePassword = require('../utils/passwordValidator');

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  const passwordCheck = validatePassword(password);
  if (!passwordCheck.isValid) {
    return res.status(400).json({ message: passwordCheck.message });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User already exists' });

  // Prevent admin self-registration
  const safeRole = role === 'admin' ? 'student' : role || 'student';

  const user = await User.create({ name, email, password, role: safeRole });
  res.status(201).json({
    message: 'Registration successful! Please login to continue.',
    _id: user._id, name: user.name, email: user.email,
    role: user.role
  });
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });
  if (user.isBlocked) return res.status(403).json({ message: 'Account is blocked. Contact admin.' });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

  res.json({
    _id: user._id, name: user.name, email: user.email,
    role: user.role, avatar: user.avatar, bio: user.bio, phone: user.phone,
    token: generateToken(user._id),
  });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('enrolledCourses', 'title thumbnail price');
  res.json(user);
};

// @desc    Update user profile
// @route   PUT /api/auth/update
exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (req.body.name) user.name = req.body.name;
  if (req.body.bio) user.bio = req.body.bio;
  if (req.body.phone) user.phone = req.body.phone;
  if (req.file) user.avatar = req.file.path;
  if (req.body.password) {
    const passwordCheck = validatePassword(req.body.password);
    if (!passwordCheck.isValid) {
      return res.status(400).json({ message: passwordCheck.message });
    }
    user.password = req.body.password;
  }

  await user.save();

  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, bio: user.bio, phone: user.phone });
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found with this email' });
  }

  // Get reset token (unhashed)
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
  const message = `
    <h1>You have requested a password reset</h1>
    <p>Please click on the following link to reset your password:</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
  `;

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ message: 'Email service is not configured on the server. Please contact administrator.' });
    }

    await sendEmail({
      to: user.email,
      subject: 'SkillMaster Password Reset',
      html: message,
    });
    res.status(200).json({ message: 'Email sent successfully. Please check your inbox.' });
  } catch (err) {
    console.error('Email sending failed:', err);
    res.status(500).json({ message: 'Failed to send reset email. Please try again later.' });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  // Hash token from URL
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  // Set new password
  const passwordCheck = validatePassword(req.body.password);
  if (!passwordCheck.isValid) {
    return res.status(400).json({ message: passwordCheck.message });
  }
  
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
};

// @desc    Change Password
// @route   PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  const user = await User.findById(req.user._id);

  // Check current password
  const isMatch = await user.matchPassword(req.body.currentPassword);
  if (!isMatch) {
    return res.status(400).json({ message: 'Incorrect current password' });
  }

  // Set new password
  const passwordCheck = validatePassword(req.body.newPassword);
  if (!passwordCheck.isValid) {
    return res.status(400).json({ message: passwordCheck.message });
  }

  user.password = req.body.newPassword;
  await user.save();

  res.status(200).json({ message: 'Password updated successfully' });
};
