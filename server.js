const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// 1. Tự động lấy cổng do Render cấp
const PORT = process.env.PORT || 3000;

// 2. Khởi tạo Socket.io với cấu hình chặn lỗi CORS
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// 3. Tạo một trang chủ nhỏ để test link
app.get('/', (req, res) => {
  res.send('<h1>Server Taikyoku Shogi đang hoạt động rất tốt!</h1>');
});

// 4. LOGIC GAME
let rooms = {};

io.on('connection', (socket) => {
  console.log('🟢 Một thiết bị vừa kết nối:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push(socket.id);

    let role = rooms[roomId].length === 1 ? 'player1' : 'player2';
    socket.emit('room_joined', { role: role });
    
    console.log(`Thiết bị ${socket.id} vào phòng ${roomId} với vai trò ${role}`);
  });

  socket.on('make_move', (data) => {
    socket.to(data.roomId).emit('update_board', data);
  });
  
  socket.on('disconnect', () => {
    console.log('🔴 Thiết bị đã ngắt kết nối:', socket.id);
  });
});

// 5. Lắng nghe
server.listen(PORT, () => {
  console.log(`🚀 Server Shogi đang chạy tại cổng ${PORT}...`);
});
