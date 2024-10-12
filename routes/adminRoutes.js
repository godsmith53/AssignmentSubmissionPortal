const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAssignmentsForAdmin, acceptAssignment, rejectAssignment } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/assignments', authMiddleware, getAssignmentsForAdmin);
router.post('/assignments/:id/accept', authMiddleware, acceptAssignment);
router.post('/assignments/:id/reject', authMiddleware, rejectAssignment);

module.exports = router;