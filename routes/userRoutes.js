const express = require('express');
const router = express.Router();
const { registerUser, loginUser, uploadAssignment, getAllAdmins } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/upload', authMiddleware, uploadAssignment);
router.get('/admins', getAllAdmins);

module.exports = router;