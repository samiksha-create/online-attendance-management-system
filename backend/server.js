// server.js
// Entry point for the Online Attendance Management System backend

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB (skip auto-connect when running under Jest — tests manage their own connection)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

// ---------- Global Middleware ----------
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ---------- Health Check ----------
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

// ---------- Routes ----------
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));

// ---------- Error Handling ----------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only start listening when NOT under test (Supertest imports the app directly)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
