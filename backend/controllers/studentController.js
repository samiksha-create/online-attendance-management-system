// controllers/studentController.js
// Student-only operations: view own profile

const Student = require('../models/Student');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get logged-in student's profile
// @route   GET /api/student/profile
// @access  Private/Student
const getProfile = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user.id).populate('subjects', 'name code');

  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  res.status(200).json({ success: true, data: student });
});

// @desc    Update logged-in student's own profile (limited fields)
// @route   PUT /api/student/profile
// @access  Private/Student
const updateProfile = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  const student = await Student.findById(req.user.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  student.phone = phone ?? student.phone;
  const updated = await student.save();

  res.status(200).json({ success: true, message: 'Profile updated successfully', data: updated });
});

module.exports = { getProfile, updateProfile };
