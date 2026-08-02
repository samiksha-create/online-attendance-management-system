// models/Attendance.js
// Attendance schema - one record per student, per subject, per date
// A compound unique index prevents duplicate attendance entries for the same day

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late'],
      required: true,
      default: 'Present',
    },
    remarks: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate attendance entry for the same student/subject/date
attendanceSchema.index({ student: 1, subject: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
