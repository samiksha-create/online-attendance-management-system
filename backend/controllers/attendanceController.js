// controllers/attendanceController.js
// Core attendance operations: mark, update, view (by teacher/admin/student), reports

const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Mark attendance for one or more students (bulk) for a subject/date
// @route   POST /api/attendance
// @access  Private/Teacher
const markAttendance = asyncHandler(async (req, res) => {
  const { subjectId, date, records } = req.body;
  // records: [{ studentId, status, remarks }]

  if (!subjectId || !date || !Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ success: false, message: 'subjectId, date, and records array are required' });
  }

  // Ensure this teacher actually owns the subject
  const subject = await Subject.findOne({ _id: subjectId, teacher: req.user.id });
  if (!subject) {
    return res.status(403).json({ success: false, message: 'You are not assigned to this subject' });
  }

  const results = [];
  const errors = [];

  for (const record of records) {
    try {
      const attendance = await Attendance.findOneAndUpdate(
        { student: record.studentId, subject: subjectId, date },
        {
          student: record.studentId,
          subject: subjectId,
          teacher: req.user.id,
          date,
          status: record.status,
          remarks: record.remarks || '',
        },
        { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
      );
      results.push(attendance);
    } catch (err) {
      errors.push({ studentId: record.studentId, error: err.message });
    }
  }

  res.status(201).json({
    success: true,
    message: 'Attendance marked successfully',
    markedCount: results.length,
    errors,
    data: results,
  });
});

// @desc    Update a single attendance record
// @route   PUT /api/attendance/:id
// @access  Private/Teacher
const updateAttendance = asyncHandler(async (req, res) => {
  const { status, remarks } = req.body;

  const attendance = await Attendance.findById(req.params.id);
  if (!attendance) {
    return res.status(404).json({ success: false, message: 'Attendance record not found' });
  }

  // Only the teacher who marked it (or an admin) may update it
  if (req.user.role === 'teacher' && attendance.teacher.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Not authorized to update this record' });
  }

  attendance.status = status ?? attendance.status;
  attendance.remarks = remarks ?? attendance.remarks;

  const updated = await attendance.save();

  res.status(200).json({ success: true, message: 'Attendance updated successfully', data: updated });
});

// @desc    Get attendance records for a subject on a given date (teacher view)
// @route   GET /api/attendance/subject/:subjectId?date=
// @access  Private/Teacher/Admin
const getAttendanceBySubject = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;
  const { date } = req.query;

  const query = { subject: subjectId };
  if (date) query.date = date;

  const records = await Attendance.find(query)
    .populate('student', 'name rollNumber')
    .populate('subject', 'name code')
    .sort({ date: -1 });

  res.status(200).json({ success: true, count: records.length, data: records });
});

// @desc    Get logged-in student's own attendance (optionally filtered by subject)
// @route   GET /api/attendance/student?subjectId=
// @access  Private/Student
const getMyAttendance = asyncHandler(async (req, res) => {
  const { subjectId } = req.query;

  const query = { student: req.user.id };
  if (subjectId) query.subject = subjectId;

  const records = await Attendance.find(query)
    .populate('subject', 'name code')
    .populate('teacher', 'name')
    .sort({ date: -1 });

  // Calculate summary: total classes, present, absent, late, percentage
  const total = records.length;
  const present = records.filter((r) => r.status === 'Present').length;
  const absent = records.filter((r) => r.status === 'Absent').length;
  const late = records.filter((r) => r.status === 'Late').length;
  const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : '0.00';

  res.status(200).json({
    success: true,
    summary: { total, present, absent, late, percentage },
    data: records,
  });
});

// @desc    Admin/Teacher: get full attendance report (with optional filters)
// @route   GET /api/attendance/report?subjectId=&studentId=&from=&to=
// @access  Private/Admin/Teacher
const getAttendanceReport = asyncHandler(async (req, res) => {
  const { subjectId, studentId, from, to } = req.query;

  const query = {};
  if (subjectId) query.subject = subjectId;
  if (studentId) query.student = studentId;
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  // Teachers can only see reports for their own subjects
  if (req.user.role === 'teacher') {
    query.teacher = req.user.id;
  }

  const records = await Attendance.find(query)
    .populate('student', 'name rollNumber department')
    .populate('subject', 'name code')
    .populate('teacher', 'name')
    .sort({ date: -1 });

  res.status(200).json({ success: true, count: records.length, data: records });
});

module.exports = {
  markAttendance,
  updateAttendance,
  getAttendanceBySubject,
  getMyAttendance,
  getAttendanceReport,
};
