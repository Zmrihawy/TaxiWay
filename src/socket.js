const { io } = require('./server');

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for driver location updates
  socket.on('driverLocation', ({ rideId, coords }) => {
    // Broadcast to users subscribed to this ride
    socket.to(rideId).emit('locationUpdate', { rideId, coords });
  });

  // When a rider joins a ride room to receive updates
  socket.on('joinRide', (rideId) => {
    socket.join(rideId);
    console.log(`User ${socket.id} joined room ${rideId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});