const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    requestRide,
    acceptRide,
    updateRideStatus,
    getMyRides
} = require('../controllers/rideController');

const router = express.Router();

router.post('/request', protect, requestRide);
router.put('/:id/accept', protect, acceptRide);
router.put('/:id/status', protect, updateRideStatus);
router.get('/my', protect, getMyRides);

module.exports = router;