// backend/socket/chatSocket.js

const { promiseDb } = require('../config/db.config');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🟢 Người dùng đã kết nối:', socket.id);

    // 1. Bác sĩ đăng ký
    socket.on('registerDoctor', ({ doctor_id }) => {
      socket.doctor_id = doctor_id;
      console.log(`👨‍⚕️ Bác sĩ ${doctor_id} đã đăng ký`);
    });

    // 2. Bác sĩ tham gia phòng chat
    socket.on('joinRoom', async ({ room_id, role }) => {
      if (!room_id) return;

      console.log(`🔔 ${role} đã tham gia room_${room_id}`);
      socket.join(`room_${room_id}`);

      if (role === 'admin') {
        socket.isAdmin = true;
      }

      // 🔥 NẾU LÀ BÁC SĨ, GỬI THÔNG BÁO CHO NGƯỜI DÙNG
      if (role === 'doctor') {
        try {
          // Lấy thông tin bác sĩ
          const [doctorInfo] = await promiseDb.query(
            'SELECT name FROM doctors WHERE id = ?',
            [socket.doctor_id]
          );

          if (doctorInfo.length > 0) {
            const doctorName = doctorInfo[0].name;
            
            // Gửi thông báo cho tất cả trong phòng (bao gồm customer)
            io.to(`room_${room_id}`).emit('doctorJoined', {
              room_id,
              doctor_id: socket.doctor_id,
              doctor_name: doctorName,
              message: `👨‍⚕️ Bác sĩ ${doctorName} đã tham gia phòng chat và sẵn sàng tư vấn!`,
              timestamp: new Date().toISOString()
            });

            // 🔥 THÔNG BÁO CHO ADMIN VỀ VIỆC BÁC SĨ JOIN
            io.to('admin').emit('doctorJoinedAdmin', {
              room_id,
              doctor_id: socket.doctor_id,
              doctor_name: doctorName,
              message: `👨‍⚕️ Bác sĩ ${doctorName} đã tham gia phòng #${room_id}`,
              timestamp: new Date().toISOString()
            });

            console.log(`👨‍⚕️ Bác sĩ ${doctorName} đã tham gia phòng ${room_id}`);
          }
        } catch (err) {
          console.error('❌ Lỗi khi lấy thông tin bác sĩ:', err);
        }
      }
    });

    // 3. Admin phân công bác sĩ vào phòng
    socket.on('assignDoctor', async ({ room_id, doctor_id }) => {
      if (!room_id || !doctor_id) {
        console.warn('⚠️ Thiếu thông tin khi gán bác sĩ');
        return;
      }

      try {
        // 🔥 CẬP NHẬT DATABASE
        await promiseDb.query(
          'UPDATE chat_rooms SET assigned_doctor_id = ?, updated_at = NOW() WHERE id = ?',
          [doctor_id, room_id]
        );

        // 🔥 THÔNG BÁO CHO PHÒNG CHAT
        io.to(`room_${room_id}`).emit('doctorAssigned', { doctor_id });
        
        // 🔥 THÔNG BÁO CHO TẤT CẢ ADMIN
        io.to('admin').emit('doctorAssignedNotification', {
          room_id,
          doctor_id,
          timestamp: new Date().toISOString()
        });
        
        // 🔥 CẬP NHẬT DANH SÁCH PHÒNG CHO TẤT CẢ ADMIN
        const [roomInfo] = await promiseDb.query(`
          SELECT cr.id, cr.customer_id, cr.assigned_doctor_id, cr.updated_at,
                 cu.name AS customer_name
          FROM chat_rooms cr
          LEFT JOIN customers cu ON cr.customer_id = cu.id
          WHERE cr.id = ?
        `, [room_id]);
        
        if (roomInfo.length > 0) {
          io.to('admin').emit('roomUpdated', roomInfo[0]);
        }
        
        console.log(`👨‍⚕️ Gán bác sĩ ${doctor_id} cho phòng ${room_id} thành công!`);
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
        // Hạn chế: Admin chỉ được xem khi phòng đã gán bác sĩ
        const [[room]] = await promiseDb.query(
          'SELECT assigned_doctor_id FROM chat_rooms WHERE id = ? LIMIT 1',
          [room_id]
        );
        if (!room) {
          console.warn('⚠️ Không tìm thấy phòng:', room_id);
          return;
        }
        const isAdminSocket = socket.isAdmin === true || sender_type === 'admin';
        if (isAdminSocket && room.assigned_doctor_id) {
          socket.emit('messageRejected', {
            reason: 'admin_read_only',
            message: 'Phòng đã có bác sĩ, admin chỉ được xem.',
            timestamp: new Date().toISOString(),
          });
          return;
        }
        // Bảo vệ: Chỉ bác sĩ được gán mới được nhắn trong phòng đã gán
        if (sender_type === 'doctor' && room.assigned_doctor_id && Number(room.assigned_doctor_id) !== Number(sender_id)) {
          socket.emit('messageRejected', {
            reason: 'doctor_not_assigned',
            message: 'Bạn không phải bác sĩ được gán cho phòng này.',
            timestamp: new Date().toISOString(),
          });
          return;
        }

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
        
        // 🔥 THÔNG BÁO CHO ADMIN VỀ TIN NHẮN MỚI
        io.to('admin').emit('newMessageNotification', {
          room_id,
          sender_id,
          message: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.error('❌ Lỗi khi gửi replyMessage:', err);
      }
    });

    // 4.1. Khách hàng gửi tin nhắn
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
        
        // 🔥 THÔNG BÁO CHO ADMIN VỀ TIN NHẮN MỚI
        io.to('admin').emit('newMessageNotification', {
          room_id,
          customer_id,
          message: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
          timestamp: new Date().toISOString()
        });
        
        // 🔥 CẬP NHẬT DANH SÁCH PHÒNG CHO TẤT CẢ ADMIN
        const [roomInfo] = await promiseDb.query(`
          SELECT cr.id, cr.customer_id, cr.assigned_doctor_id, cr.updated_at,
                 c.name AS customer_name
          FROM chat_rooms cr
          LEFT JOIN customers c ON cr.customer_id = c.id
          WHERE cr.id = ?
        `, [room_id]);
        
        if (roomInfo.length > 0) {
          io.to('admin').emit('roomUpdated', roomInfo[0]);
        }
        
        console.log('📨 Gửi tin nhắn thành công:', newMsg);
      } catch (err) {
        console.error('❌ Lỗi khi gửi tin nhắn:', err);
      }
    });

    // 5. Admin rời khỏi phòng chat
    socket.on('leaveRoom', ({ room_id, role }) => {
      if (!room_id) return;
      
      console.log(`🔌 ${role} rời khỏi phòng ${room_id}`);
      socket.leave(`room_${room_id}`);
    });

    // 6. Admin đăng ký nhận tin nhắn mới
    socket.on('registerAdmin', () => {
      socket.join('admin');
      socket.isAdmin = true;
      console.log('📩 Admin đã tham gia kênh nhận tin nhắn mới');
      
      // 🔥 GỬI NGAY DANH SÁCH PHÒNG HIỆN TẠI CHO ADMIN MỚI
      socket.emit('adminRegistered', { message: 'Admin đã được đăng ký thành công' });
    });

    // 7. Admin lấy danh sách tất cả room (cả đã và chưa có bác sĩ)
    socket.on('getAllRooms', async () => {
      try {
        const [rows] = await promiseDb.query(`
          SELECT 
            r.*, 
            d.name AS doctor_name,
            c.name AS customer_name
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

    // 9. Ngắt kết nối
    socket.on('disconnect', () => {
      console.log('🔌 Người dùng đã ngắt kết nối:', socket.id);
    });
  });
};