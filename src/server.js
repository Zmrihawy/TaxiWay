const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();


// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Log requests

// Default route
app.get('/', (req, res) => {
    res.send('TaxiWay API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`My server running on port ${PORT}`));