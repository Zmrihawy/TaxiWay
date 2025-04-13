const Ride = require('../models/Ride');
const User = require('../models/User');

// @desc Request a ride
// @route POST /api/rides/request
// @access Private (Rider)
const requestRide = async (req, res) => {
        // Only rider can request a ride (We can ofcourse edit this later)
    if (req.user.role !== 'rider') {
        return res.status(403).json({ message: 'Only riders can request rides' });
    }

    const { pickupLocation, dropoffLocation, paymentMethod } = req.body;

    try {
        const ride = await Ride.create({
            rider: req.user._id,
            pickupLocation,
            dropoffLocation,
            paymentMethod
        });

        res.status(201).json(ride);
    } catch (error) {
        res.status(500).json({ message: 'Could not create ride' });
    }
};

// @desc Driver accepts ride
// @route PUT /api/rides/:id/accept
// @access Private (Driver)
const acceptRide = async (req, res) => {
        // Only driver can accept a ride (We can ofcourse add admins here later)
    if (req.user.role !== 'driver') {
        return res.status(403).json({ message: 'Only drivers can accept rides' });
    }

    try {
        const ride = await Ride.findById(req.params.id);

        if (!ride || ride.status !== 'requested') {
            return res.status(400).json({ message: 'Ride not available' });
        }

        ride.driver = req.user._id;
        ride.status = 'accepted';

        await ride.save();

        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: 'Error accepting ride' });
    }
};

// @desc Update ride status
// @route PUT /api/rides/:id/status
// @access Private (Driver or Rider)
const updateRideStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const ride = await Ride.findById(req.params.id);

        if (!ride) return res.status(404).json({ message: 'Ride not found' });

        // For later: add authorization check here

        // Ensure current user is involved in this ride (Rider owner the ride OR the driver who accepted the ride)
        const isOwner = [ride.rider.toString(), ride.driver?.toString()].includes(req.user._id.toString());
        if (!isOwner) return res.status(403).json({ message: 'You are not authorized to update this ride' });

        // Role-based allowed statuses
        const ALLOWED_STATUSES_BY_ROLE = {
            rider: ['cancelled'],
            driver: ['in_progress', 'completed', 'cancelled']
        };

        if (!ALLOWED_STATUSES_BY_ROLE[req.user.role]?.includes(status)) {
            return res.status(403).json({ message: 'Not allowed to set this status' });
        }

        ride.status = status;
        await ride.save();

        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: 'Error updating status' });
    }
};

// @desc Get all rides for logged-in user
// @route GET /api/rides/my
// @access Private
const getMyRides = async (req, res) => {
    try {
        const rides = await Ride.find({
            $or: [{ rider: req.user._id }, { driver: req.user._id }]
        }).sort({ createdAt: -1 });

        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rides' });
    }
};

// @desc Get nearby drivers for rider
// @route GET /api/rides/nearby-drivers
// @access Private
const getNearbyDrivers = async (req, res) => {
    const { lat, lng, maxDistance = 5000 } = req.query;
  
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
  
    try {
      const drivers = await User.find({
        role: 'driver',
        availability: 'ready', // only show available drivers
        currentLocation: {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: parseInt(maxDistance) // in meters
          }
        }
      }).select('-password'); // exclude password field
  
      res.json({ count: drivers.length, drivers });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch nearby drivers' });
    }
  };

module.exports = {
    requestRide,
    acceptRide,
    updateRideStatus,
    getMyRides,
    getNearbyDrivers
};