const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const crypto = require("crypto");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();


// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Log requests,

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Default route
app.get('/', (req, res) => {
    res.send('TaxiWay API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    const secret = crypto.randomBytes(64).toString("hex");
    console.log("Generated JWT_SECRET:", secret);
    console.log(`My server running on port ${PORT}`)});