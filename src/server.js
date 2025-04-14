const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

const server = http.createServer(app);  // Set up socket.IO server
const io = socketIo(server, {
    cors: {
      origin: "*", // adjust later for security
      methods: ["GET", "POST"]
    }
  });

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Log requests,

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/rides', require('./routes/rideRoutes'));

// Default route
app.get('/', (req, res) => {
    res.send('TaxiWay API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`My server running on port ${PORT}`));

module.exports = { io };