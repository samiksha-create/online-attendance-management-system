// routes/adminRoutes.js
// All routes here require: authenticated + role === 'admin'

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const {
  addTeacher,
  getTeachers,
  updateTeacher,
  deleteTeacher,
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} = require('../controllers/adminController');

router.use(protect, authorize('admin'));

// Teacher management
router.post('/teachers', addTeacher);
router.get('/teachers', getTeachers);
router.put('/teachers/:id', updateTeacher);
router.delete('/teachers/:id', deleteTeacher);

// Student management
router.post('/students', addStudent);
router.get('/students', getStudents);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

module.exports = router;
