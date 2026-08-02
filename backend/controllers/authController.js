// controllers/authController.js
// Handles registration and login for Admin, Teacher, Student with JWT issuance

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const { asyncHandler } = require('../middleware/errorHandler');

// Map role string to its Mongoose model
const getModelByRole = (role) => {
  switch (role) {
    case 'admin':
      return Admin;
    case 'teacher':
      return Teacher;
    case 'student':
      return Student;
    default:
      return null;
  }
};

// Generate signed JWT containing id + role
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

// @desc    Register a new user (admin/teacher/student)
// @route   POST /api/auth/register
// @access  Public (in production, admin creation should be restricted/seeded)
const register = asyncHandler(async (req, res) => {
  const { role, name, email, password, rollNumber, department, phone, semester } = req.body;

  const Model = getModelByRole(role);
  if (!Model) {
    return res.status(400).json({ success: false, message: 'Invalid role specified' });
  }

  const existingUser = await Model.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists with this email' });
  }

  const userData = { name, email, password, department, phone };

  if (role === 'student') {
    if (!rollNumber) {
      return res.status(400).json({ success: false, message: 'Roll number is required for students' });
    }
    userData.rollNumber = rollNumber;
    userData.semester = semester || 1;
  }

  const user = await Model.create(userData);

  res.status(201).json({
    success: true,
    message: `${role} registered successfully`,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    },
  });
});

// @desc    Login user (admin/teacher/student)
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Email, password, and role are required' });
  }

  const Model = getModelByRole(role);
  if (!Model) {
    return res.status(400).json({ success: false, message: 'Invalid role specified' });
  }

  // Explicitly select password since schema has select: false
  const user = await Model.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    },
  });
});

// @desc    Get currently logged-in user's profile
// @route   GET /api/auth/me
// @access  Private (any authenticated role)
const getMe = asyncHandler(async (req, res) => {
  const { id, role } = req.user;
  const Model = getModelByRole(role);

  const user = await Model.findById(id).populate('subjects', 'name code');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({ success: true, data: user });
});

module.exports = { register, login, getMe };
