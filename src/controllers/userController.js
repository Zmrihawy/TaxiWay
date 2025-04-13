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

// @desc Toggle driver availability (online/offline)
// @route PUT /api/users/availability
// @access Private (driver only)
const updateDriverAvailability = async (req, res) => {
    const { availability } = req.body;
    const validStatuses = ['offline', 'ready', 'busy']; // Only these statuses can be set from a driver 
  
    if (!validStatuses.includes(availability)) {
      return res.status(400).json({
         message: `Invalid availability value. Drivers can only set: ${validStatuses.join(', ')}`
         });
    }
  
    try {
      const user = await User.findById(req.user._id);
  
      if (user.role !== 'driver') {
        return res.status(403).json({ message: 'Only drivers can update availability' });
      }
  
      user.availability = availability;
      await user.save();
  
      res.json({ message: `Availability updated to ${availability}`, availability });
    } catch (err) {
      res.status(500).json({ message: 'Failed to update availability' });
    }
  };

module.exports = { getProfile, updateProfile, getAllUsers, updateLocation, updateDriverAvailability };