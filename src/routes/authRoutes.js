const express = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// @route POST /api/auth/register.
router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('phone', 'Phone is required').isMobilePhone(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
    ],
    registerUser
);

// @route POST /api/auth/login
router.post('/login', loginUser);

module.exports = router;