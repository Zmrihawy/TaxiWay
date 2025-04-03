const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

// @desc Register a new user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, password, role } = req.body;

    try {
        let userExists = await User.findOne({ phone });
        if (userExists) return res.status(400).json({ message: 'Phone already registered' });

        const user = await User.create({ name, phone, password, role });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            phone: user.phone,
            role: user.role,
            token: generateToken(user)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Login user
// @route POST /api/auth/login
const loginUser = async (req, res) => {
    const { phone, password } = req.body;

    try {
        const user = await User.findOne({ phone });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        res.json({
            _id: user.id,
            name: user.name,
            phone: user.phone,
            role: user.role,
            token: generateToken(user)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };