// controllers/adminController.js
// Admin-only operations: manage teachers and students (CRUD)

const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const { asyncHandler } = require('../middleware/errorHandler');

/* ---------------------- TEACHER MANAGEMENT ---------------------- */

// @desc    Add a new teacher
// @route   POST /api/admin/teachers
// @access  Private/Admin
const addTeacher = asyncHandler(async (req, res) => {
  const { name, email, password, phone, department } = req.body;

  const exists = await Teacher.findOne({ email });
  if (exists) {
    return res.status(400).json({ success: false, message: 'Teacher with this email already exists' });
  }

  const teacher = await Teacher.create({ name, email, password, phone, department });

  res.status(201).json({ success: true, message: 'Teacher added successfully', data: teacher });
});

// @desc    Get all teachers (supports search + pagination)
// @route   GET /api/admin/teachers?search=&page=&limit=
// @access  Private/Admin
const getTeachers = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 10 } = req.query;

  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const total = await Teacher.countDocuments(query);
  const teachers = await Teacher.find(query)
    .populate('subjects', 'name code')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: teachers.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: teachers,
  });
});

// @desc    Update a teacher
// @route   PUT /api/admin/teachers/:id
// @access  Private/Admin
const updateTeacher = asyncHandler(async (req, res) => {
  const { name, email, phone, department, isActive } = req.body;

  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    return res.status(404).json({ success: false, message: 'Teacher not found' });
  }

  teacher.name = name ?? teacher.name;
  teacher.email = email ?? teacher.email;
  teacher.phone = phone ?? teacher.phone;
  teacher.department = department ?? teacher.department;
  teacher.isActive = isActive ?? teacher.isActive;

  const updated = await teacher.save();

  res.status(200).json({ success: true, message: 'Teacher updated successfully', data: updated });
});

// @desc    Delete a teacher
// @route   DELETE /api/admin/teachers/:id
// @access  Private/Admin
const deleteTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    return res.status(404).json({ success: false, message: 'Teacher not found' });
  }

  await teacher.deleteOne();

  res.status(200).json({ success: true, message: 'Teacher deleted successfully' });
});

/* ---------------------- STUDENT MANAGEMENT ---------------------- */

// @desc    Add a new student
// @route   POST /api/admin/students
// @access  Private/Admin
const addStudent = asyncHandler(async (req, res) => {
  const { name, email, password, rollNumber, phone, department, semester } = req.body;

  const exists = await Student.findOne({ $or: [{ email }, { rollNumber }] });
  if (exists) {
    return res.status(400).json({ success: false, message: 'Student with this email or roll number already exists' });
  }

  const student = await Student.create({ name, email, password, rollNumber, phone, department, semester });

  res.status(201).json({ success: true, message: 'Student added successfully', data: student });
});

// @desc    Get all students (supports search + pagination)
// @route   GET /api/admin/students?search=&page=&limit=
// @access  Private/Admin
const getStudents = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 10 } = req.query;

  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { rollNumber: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const total = await Student.countDocuments(query);
  const students = await Student.find(query)
    .populate('subjects', 'name code')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: students.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: students,
  });
});

// @desc    Update a student
// @route   PUT /api/admin/students/:id
// @access  Private/Admin
const updateStudent = asyncHandler(async (req, res) => {
  const { name, email, phone, department, semester, isActive } = req.body;

  const student = await Student.findById(req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  student.name = name ?? student.name;
  student.email = email ?? student.email;
  student.phone = phone ?? student.phone;
  student.department = department ?? student.department;
  student.semester = semester ?? student.semester;
  student.isActive = isActive ?? student.isActive;

  const updated = await student.save();

  res.status(200).json({ success: true, message: 'Student updated successfully', data: updated });
});

// @desc    Delete a student
// @route   DELETE /api/admin/students/:id
// @access  Private/Admin
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  await student.deleteOne();

  res.status(200).json({ success: true, message: 'Student deleted successfully' });
});

module.exports = {
  addTeacher,
  getTeachers,
  updateTeacher,
  deleteTeacher,
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
};
