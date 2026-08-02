// models/Subject.js
// Subject schema - created by Admin, assigned to a Teacher, enrolled by Students

const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    department: {
      type: String,
      trim: true,
      default: '',
    },
    semester: {
      type: Number,
      default: 1,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subject', subjectSchema);
