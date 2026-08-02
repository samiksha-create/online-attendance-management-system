// controllers/teacherController.js
// Teacher-only operations: view assigned subjects and student lists

const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get subjects assigned to the logged-in teacher
// @route   GET /api/teacher/subjects
// @access  Private/Teacher
const getAssignedSubjects = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.user.id).populate('subjects');

  if (!teacher) {
    return res.status(404).json({ success: false, message: 'Teacher not found' });
  }

  res.status(200).json({ success: true, count: teacher.subjects.length, data: teacher.subjects });
});

// @desc    Get list of students (optionally filtered by department/semester)
// @route   GET /api/teacher/students?department=&semester=
// @access  Private/Teacher
const getStudentList = asyncHandler(async (req, res) => {
  const { department, semester } = req.query;

  const query = {};
  if (department) query.department = department;
  if (semester) query.semester = Number(semester);

  const students = await Student.find(query).select('-password').sort({ name: 1 });

  res.status(200).json({ success: true, count: students.length, data: students });
});

// @desc    Verify a subject belongs to the logged-in teacher (helper for attendance routes)
// @access  Internal use
const verifySubjectOwnership = async (teacherId, subjectId) => {
  const subject = await Subject.findOne({ _id: subjectId, teacher: teacherId });
  return subject;
};

module.exports = { getAssignedSubjects, getStudentList, verifySubjectOwnership };
