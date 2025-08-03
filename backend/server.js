// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http'); 
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app); // ✅ Dùng để gắn socket

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
const mainRouter = require('./routes/index');
app.use('/api', mainRouter);


// Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

// Gọi socket handler
const chatSocket = require('./socket/chatSocket');
chatSocket(io); // truyền io vào xử lý

// ✅ Phải dùng server.listen thay vì app.listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Backend server đang chạy tại http://localhost:${PORT}`);
});
