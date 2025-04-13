const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getProfile, updateProfile, getAllUsers, updateLocation, updateDriverAvailability } = require('../controllers/userController');

const router = express.Router();

// @route GET /api/users/profile - Get user profile
// @access Private
router.get('/profile', protect, getProfile);

// @route PUT /api/users/profile - Update user profile
// @access Private
router.put('/profile', protect, updateProfile);

// @route GET /api/users - Get all users (Admin only)
// @access Private/Admin
router.get('/', protect, adminOnly, getAllUsers);

// @route PUT /api/location - Update user location
// @access Private
router.put('/location', protect, updateLocation);

// @route PUT /api/availability - Update driver availability
// @access Private/Driver
router.put('/availability', protect, updateDriverAvailability);

module.exports = router;