require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const path = require('path');

// NEW: Import HTTP and Socket.io
const http = require('http');
const { Server } = require('socket.io');

const app = express();

// NEW: Create the HTTP server and initialize Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://10xcs.vercel.app", // Your React frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// NEW: Middleware to make 'io' available inside our routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Connect Database
connectDB();

// Route Mountpoints
app.use('/api/auth', require('./routes/auth')); 
app.use('/api/roadmap', require('./routes/roadmap'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/community', require('./routes/community'));
app.use('/api/upload', require('./routes/upload'));
// NEW: Basic Socket Connection Logger
io.on('connection', (socket) => {
  console.log('⚡ A user connected to WebSockets');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
// CRITICAL: Change app.listen to server.listen!
server.listen(PORT, () => console.log(`Server actively running on port ${PORT}`));