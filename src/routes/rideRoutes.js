const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    requestRide,
    acceptRide,
    updateRideStatus,
    getMyRides,
    getNearbyDrivers
} = require('../controllers/rideController');

const router = express.Router();

router.post('/request', protect, requestRide);
router.put('/:id/accept', protect, acceptRide);
router.put('/:id/status', protect, updateRideStatus);
router.get('/my', protect, getMyRides);
router.get('/nearby-drivers', protect, getNearbyDrivers);

module.exports = router;