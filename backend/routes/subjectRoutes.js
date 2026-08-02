// routes/subjectRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const {
  createSubject,
  getSubjects,
  assignTeacher,
  updateSubject,
  deleteSubject,
} = require('../controllers/subjectController');

// Any authenticated role can view subjects
router.get('/', protect, getSubjects);

// Admin-only operations
router.post('/', protect, authorize('admin'), createSubject);
router.put('/:id', protect, authorize('admin'), updateSubject);
router.delete('/:id', protect, authorize('admin'), deleteSubject);
router.put('/:id/assign-teacher', protect, authorize('admin'), assignTeacher);

module.exports = router;
