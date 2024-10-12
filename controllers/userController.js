const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Assignment = require('../models/assignment');

// Register User
exports.registerUser = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).send({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.send({ token });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

// Upload Assignment
exports.uploadAssignment = async (req, res) => {
    const { task, admin } = req.body;

    try {
        // Find the admin by username
        const adminUser = await User.findOne({ username: admin });
        if (!adminUser) {
            return res.status(400).send({ message: 'Admin not found.' });
        }

        // Create a new assignment with the admin's ObjectId
        const assignment = new Assignment({
            userId: req.user._id,
            task,
            adminId: adminUser._id, // Use the ObjectId of the admin
        });
        
        await assignment.save();
        res.status(201).send({ message: 'Assignment uploaded successfully.' });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

// Fetch All Admins (for users)
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('-password');
        res.send(admins);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};