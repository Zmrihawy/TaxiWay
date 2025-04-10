const User = require('../models/User');

// @desc Get logged-in user profile
// @route GET /api/users/profile
// @access Private
const getProfile = async (req, res) => {
    res.json(req.user);
};

// @desc Update logged-in user profile
// @route PUT /api/users/profile
// @access Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = req.body.name || user.name;
        user.profileImage = req.body.profileImage || user.profileImage;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            phone: updatedUser.phone,
            profileImage: updatedUser.profileImage,
            role: updatedUser.role,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Get all users (Admin only)
// @route GET /api/users
// @access Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Update user GPS location
const updateLocation = async (req, res) => {
    const { lat, lng } = req.body;
  
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
  
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          currentLocation: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        },
        { new: true }
      );
  
      res.json({ message: 'Location updated', location: user.currentLocation });
    } catch (err) {
      res.status(500).json({ message: 'Failed to update location' });
    }
  };

module.exports = { getProfile, updateProfile, getAllUsers, updateLocation };