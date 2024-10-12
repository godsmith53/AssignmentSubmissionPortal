const User = require('../models/user');
const Assignment = require('../models/assignment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register Admin
exports.registerAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new User({ username, password: hashedPassword, role: 'admin' });
        await newAdmin.save();
        res.status(201).send({ message: 'Admin registered successfully.' });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

// Login Admin
exports.loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await User.findOne({ username });
        
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(400).send({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
        res.send({ token });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

// Get Assignments for Admin
exports.getAssignmentsForAdmin = async (req, res) => {
    try {
        const assignments = await Assignment.find({ adminId: req.user._id }).populate('userId', 'username');
        res.send(assignments);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

// Accept Assignment
exports.acceptAssignment = async (req, res) => {
    try {
        await Assignment.findByIdAndUpdate(req.params.id, { status: 'accepted', adminId: req.user._id });
        res.send({ message: 'Assignment accepted.' });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

// Reject Assignment
exports.rejectAssignment = async (req, res) => {
    try {
        await Assignment.findByIdAndUpdate(req.params.id, { status: 'rejected', adminId: req.user._id });
        res.send({ message: 'Assignment rejected.' });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};