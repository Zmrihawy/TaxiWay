const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['rider', 'driver', 'admin'], default: 'rider' },
    rating: { type: Number, default: 5.0 },
    profileImage: { type: String },
    currentLocation: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: [0, 0]
        }
    }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Create 2dsphere index for geospatial queries
UserSchema.index({ currentLocation: '2dsphere' });

const User = mongoose.model('User', UserSchema);
module.exports = User;