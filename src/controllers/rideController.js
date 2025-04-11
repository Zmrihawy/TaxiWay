const Ride = require('../models/Ride');

// @desc Request a ride
// @route POST /api/rides/request
// @access Private (Rider)
const requestRide = async (req, res) => {
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

module.exports = {
    requestRide,
    acceptRide,
    updateRideStatus,
    getMyRides
};