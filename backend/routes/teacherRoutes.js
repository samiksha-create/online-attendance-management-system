// routes/teacherRoutes.js
// All routes here require: authenticated + role === 'teacher'

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { getAssignedSubjects, getStudentList } = require('../controllers/teacherController');

router.use(protect, authorize('teacher'));

router.get('/subjects', getAssignedSubjects);
router.get('/students', getStudentList);

module.exports = router;
