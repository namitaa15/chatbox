// server/server.js

// 1. Load environment variables
require('dotenv').config();

// 2. Import core modules
const express = require('express');
const http = require('http');
const cors = require('cors');

// 3. Import your own modules
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const Message = require('./models/Message');

// 4. Connect to MongoDB
connectDB();

// 5. Initialize Express
const app = express();

// 6. Apply global middleware
app.use(cors());
app.use(express.json());

// 7. Mount your routes
app.use('/api', authRoutes);
// Protect all chat routes with authMiddleware
app.use('/api/chats', authMiddleware, chatRoutes);

// 8. Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',        // in production, replace '*' with your frontend URL
    methods: ['GET', 'POST']
  }
});

// 9. Handle real-time events
io.on('connection', (socket) => {
  console.log(`🟢 Client connected: ${socket.id}`);

  // Join a chat room
  socket.on('join', (room) => {
    socket.join(room);
    console.log(`→ Socket ${socket.id} joined room ${room}`);
  });

  // Receive and broadcast new messages
  socket.on('message', async ({ chatId, senderId, text }) => {
    // 1) Save to database
    const message = await Message.create({ chatId, senderId, text });
    // 2) Broadcast to everyone in the room
    io.to(chatId).emit('message', message);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});

// 10. Start listening
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});