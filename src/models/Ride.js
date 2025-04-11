const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    pickupLocation: {
        lat: Number,
        lng: Number,
        address: String
    },
    dropoffLocation: {
        lat: Number,
        lng: Number,
        address: String
    },
    status: {
        type: String,
        enum: ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'],
        default: 'requested'
    },
    fare: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'wallet', 'card'],
        default: 'cash'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Ride', rideSchema);
