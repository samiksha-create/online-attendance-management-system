// routes/attendanceRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const {
  markAttendance,
  updateAttendance,
  getAttendanceBySubject,
  getMyAttendance,
  getAttendanceReport,
} = require('../controllers/attendanceController');

// Teacher marks/updates attendance
router.post('/', protect, authorize('teacher'), markAttendance);
router.put('/:id', protect, authorize('teacher'), updateAttendance);
router.get('/subject/:subjectId', protect, authorize('teacher', 'admin'), getAttendanceBySubject);

// Student views own attendance
router.get('/student', protect, authorize('student'), getMyAttendance);

// Admin/Teacher reports
router.get('/report', protect, authorize('admin', 'teacher'), getAttendanceReport);

module.exports = router;
