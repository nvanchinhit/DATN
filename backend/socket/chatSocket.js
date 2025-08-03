// backend/socket/chatSocket.js

const db = require('../config/db.config');
const promiseDb = db.promise();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🟢 Người dùng đã kết nối:', socket.id);

    // Gửi xác nhận kết nối về client
    socket.emit('connected', {
      message: 'Kết nối socket thành công',
      socketId: socket.id,
    });

    // 1. Khách hàng gửi tin nhắn
    socket.on('sendMessage', async (data) => {
      const { customer_id, room_id, message } = data;

      if (!room_id || !message?.trim() || !customer_id) {
        console.warn('⚠️ Dữ liệu gửi không hợp lệ:', data);
        return;
      }

      try {
        // Cập nhật thời gian phòng chat
        await promiseDb.query(
          'UPDATE chat_rooms SET updated_at = NOW() WHERE id = ?',
          [room_id]
        );

        // Lưu tin nhắn vào DB
        await promiseDb.query(
          'INSERT INTO chat_messages (room_id, sender_id, sender_type, message) VALUES (?, ?, ?, ?)',
          [room_id, customer_id, 'customer', message]
        );

        // Gửi tin nhắn tới phòng
        const newMsg = {
          room_id,
          sender_id: customer_id,
          sender_type: 'customer',
          message,
          created_at: new Date().toISOString(),
        };

        io.to(`room_${room_id}`).emit('newMessage', newMsg);
        console.log('📨 Gửi tin nhắn thành công:', newMsg);
      } catch (err) {
        console.error('❌ Lỗi khi gửi tin nhắn:', err);
      }
    });

    // 2. Người dùng tham gia phòng
    socket.on('joinRoom', ({ room_id, role }) => {
      if (!room_id) {
        console.warn('⚠️ Thiếu room_id khi joinRoom');
        return;
      }

      socket.join(`room_${room_id}`);
      console.log(`🔔 ${role} đã tham gia room_${room_id}`);
    });

    // 3. Admin phân công bác sĩ vào phòng
    socket.on('assignDoctor', async ({ room_id, doctor_id }) => {
      if (!room_id || !doctor_id) {
        console.warn('⚠️ Thiếu thông tin khi gán bác sĩ');
        return;
      }

      try {
        await promiseDb.query(
          'UPDATE chat_rooms SET assigned_doctor_id = ?, updated_at = NOW() WHERE id = ?',
          [doctor_id, room_id]
        );

        io.to(`room_${room_id}`).emit('doctorAssigned', { doctor_id });
        console.log(`👨‍⚕️ Gán bác sĩ ${doctor_id} cho phòng ${room_id}`);
      } catch (err) {
        console.error('❌ Lỗi khi gán bác sĩ:', err);
      }
    });

    // 4. Bác sĩ hoặc admin gửi tin nhắn
    socket.on('replyMessage', async ({ room_id, sender_id, sender_type, message }) => {
  if (!room_id || !sender_id || !sender_type || !message?.trim()) {
    console.warn('⚠️ Dữ liệu replyMessage không hợp lệ');
    return;
  }

  try {
    await promiseDb.query(
      'INSERT INTO chat_messages (room_id, sender_id, sender_type, message) VALUES (?, ?, ?, ?)',
      [room_id, sender_id, sender_type, message]
    );

    await promiseDb.query(
      'UPDATE chat_rooms SET updated_at = NOW() WHERE id = ?',
      [room_id]
    );

    const newMsg = {
      room_id,
      sender_id,
      sender_type,
      message,
      created_at: new Date().toISOString(),
    };

    io.to(`room_${room_id}`).emit('newMessage', newMsg);
  } catch (err) {
    console.error('❌ Lỗi khi gửi replyMessage:', err);
  }
});


    // 5. Admin đăng ký nhận tin nhắn mới
    socket.on('registerAdmin', () => {
      socket.join('admin');
      console.log('📩 Admin đã tham gia kênh nhận tin nhắn mới');
    });
      // 7. Admin lấy danh sách tất cả room (cả đã và chưa có bác sĩ)
socket.on('getAllRooms', async () => {
  try {
    const [rows] = await promiseDb.query(`
      SELECT 
        r.*, 
        d.name AS doctor_name,
        c.full_name AS customer_name
      FROM chat_rooms r
      LEFT JOIN doctors d ON r.assigned_doctor_id = d.id
      LEFT JOIN customers c ON r.customer_id = c.id
      ORDER BY r.updated_at DESC
    `);
    socket.emit('roomList', rows);
  } catch (err) {
    console.error('❌ Lỗi khi lấy tất cả room:', err);
  }
});

// 8. Admin lấy tin nhắn của một room (nếu muốn lấy qua socket thay vì REST API)
socket.on('getRoomMessages', async (room_id) => {
  try {
    const [rows] = await promiseDb.query(
      'SELECT * FROM chat_messages WHERE room_id = ? ORDER BY created_at ASC',
      [room_id]
    );
    socket.emit('roomMessages', rows);
  } catch (err) {
    console.error('❌ Lỗi khi lấy tin nhắn phòng:', err);
  }
});

    // 6. Ngắt kết nối
    socket.on('disconnect', () => {
      console.log('🔌 Người dùng đã ngắt kết nối:', socket.id);
    });
  });
};
