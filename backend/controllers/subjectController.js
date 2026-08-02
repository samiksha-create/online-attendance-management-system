// controllers/subjectController.js
// Admin creates subjects and assigns teachers; all roles can view subjects

const Subject = require('../models/Subject');
const Teacher = require('../models/Teacher');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private/Admin
const createSubject = asyncHandler(async (req, res) => {
  const { name, code, department, semester } = req.body;

  const exists = await Subject.findOne({ code: code?.toUpperCase() });
  if (exists) {
    return res.status(400).json({ success: false, message: 'Subject code already exists' });
  }

  const subject = await Subject.create({ name, code, department, semester });

  res.status(201).json({ success: true, message: 'Subject created successfully', data: subject });
});

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private (all roles)
const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find().populate('teacher', 'name email').sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: subjects.length, data: subjects });
});

// @desc    Assign a teacher to a subject
// @route   PUT /api/subjects/:id/assign-teacher
// @access  Private/Admin
const assignTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.body;

  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    return res.status(404).json({ success: false, message: 'Teacher not found' });
  }

  subject.teacher = teacher._id;
  await subject.save();

  // Add subject to teacher's subject list if not already present
  if (!teacher.subjects.includes(subject._id)) {
    teacher.subjects.push(subject._id);
    await teacher.save();
  }

  res.status(200).json({ success: true, message: 'Teacher assigned successfully', data: subject });
});

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Private/Admin
const updateSubject = asyncHandler(async (req, res) => {
  const { name, code, department, semester } = req.body;

  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }

  subject.name = name ?? subject.name;
  subject.code = code ? code.toUpperCase() : subject.code;
  subject.department = department ?? subject.department;
  subject.semester = semester ?? subject.semester;

  const updated = await subject.save();

  res.status(200).json({ success: true, message: 'Subject updated successfully', data: updated });
});

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }

  await subject.deleteOne();

  res.status(200).json({ success: true, message: 'Subject deleted successfully' });
});

module.exports = { createSubject, getSubjects, assignTeacher, updateSubject, deleteSubject };
