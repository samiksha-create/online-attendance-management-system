// routes/studentRoutes.js
// All routes here require: authenticated + role === 'student'

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { getProfile, updateProfile } = require('../controllers/studentController');

router.use(protect, authorize('student'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
