const io = require('socket.io')(3000, {
  cors: { origin: "*" }
});

let rooms = {};

io.on('connection', (socket) => {
  console.log('Một thiết bị vừa kết nối:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push(socket.id);

    // Người vào đầu tiên là Player 1, người vào thứ hai là Player 2
    let role = rooms[roomId].length === 1 ? 'player1' : 'player2';
    socket.emit('room_joined', { role: role });
    
    console.log(`Thiết bị ${socket.id} vào phòng ${roomId} với vai trò ${role}`);
  });

  // Chuyển tiếp nước đi của người này sang màn hình người kia
  socket.on('make_move', (data) => {
    socket.to(data.roomId).emit('update_board', data);
  });
});

console.log('Server Shogi đang chạy tại cổng 3000...');
