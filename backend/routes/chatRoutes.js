const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const promiseDb = db.promise();

// 🔹 1. Tạo hoặc lấy phòng chat theo customer
router.post('/start', async (req, res) => {
  const { customerId } = req.body;
  try {
    const [rooms] = await promiseDb.query(
      `SELECT id FROM chat_rooms WHERE customer_id = ? LIMIT 1`,
      [customerId]
    );

    let roomId;
    if (rooms.length > 0) {
      roomId = rooms[0].id;
    } else {
      const [result] = await promiseDb.query(
        `INSERT INTO chat_rooms (customer_id) VALUES (?)`,
        [customerId]
      );
      roomId = result.insertId;
    }

    res.json({ roomId });
  } catch (err) {
    console.error('❌ Lỗi tạo/lấy phòng chat:', err);
    res.status(500).json({ error: 'Không thể tạo hoặc lấy phòng chat' });
  }
});

// 🔹 2. Lấy tin nhắn theo room_id
router.get('/:roomId/messages', async (req, res) => {
  const { roomId } = req.params;
  try {
    const [messages] = await promiseDb.query(`
      SELECT cm.*, 
             CASE 
               WHEN cm.sender_type = 'customer' THEN (SELECT name FROM customers WHERE id = cm.sender_id)
               WHEN cm.sender_type = 'doctor' THEN (SELECT name FROM doctors WHERE id = cm.sender_id)
               WHEN cm.sender_type = 'admin' THEN 'Admin'
               ELSE 'Bot'
             END AS sender_name
      FROM chat_messages cm
      WHERE cm.room_id = ?
      ORDER BY cm.created_at ASC
    `, [roomId]);

    res.json(messages);
  } catch (err) {
    console.error('❌ Lỗi lấy tin nhắn:', err);
    res.status(500).json({ error: 'Không thể lấy tin nhắn' });
  }
});

// 🔹 3. Lấy tin nhắn theo customer_id
router.get('/chat/messages/:customer_id', async (req, res) => {
  const { customer_id } = req.params;
  try {
    const [rooms] = await promiseDb.query(
      'SELECT id FROM chat_rooms WHERE customer_id = ?',
      [customer_id]
    );

    if (rooms.length === 0) return res.json([]);

    const room_id = rooms[0].id;
    const [messages] = await promiseDb.query(
      'SELECT * FROM chat_messages WHERE room_id = ? ORDER BY created_at ASC',
      [room_id]
    );

    res.json(messages);
  } catch (err) {
    console.error('❌ Lỗi lấy tin nhắn theo customer_id:', err);
    res.status(500).json({ error: 'Lỗi lấy tin nhắn' });
  }
});

// 🔹 4. Gán bác sĩ vào phòng chat
router.post('/assign', async (req, res) => {
  const { roomId, doctorId } = req.body;
  try {
    await promiseDb.query(
      `UPDATE chat_rooms SET assigned_doctor_id = ? WHERE id = ?`,
      [doctorId, roomId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Lỗi gán bác sĩ:', err);
    res.status(500).json({ error: 'Không thể gán bác sĩ' });
  }
});

// 🔹 5. Lấy danh sách tất cả các cuộc trò chuyện
router.get('/rooms', async (req, res) => {
  try {
    const [rooms] = await promiseDb.query(`
      SELECT r.id, r.customer_id, r.assigned_doctor_id,
             COALESCE(c.name, 'Khách') AS customer_name,
             (
               SELECT message FROM chat_messages 
               WHERE room_id = r.id 
               ORDER BY created_at DESC 
               LIMIT 1
             ) AS last_message,
             r.updated_at
      FROM chat_rooms r
      LEFT JOIN customers c ON r.customer_id = c.id
      ORDER BY r.updated_at DESC
    `);

    res.json(rooms);
  } catch (err) {
    console.error('❌ Lỗi lấy danh sách phòng:', err);
    res.status(500).json({ error: 'Không thể lấy danh sách phòng' });
  }
});
// 🔹 6. Lấy danh sách phòng chat của một khách hàng cụ thể
router.get('/rooms/customer/:customerId', async (req, res) => {
  const { customerId } = req.params;

  try {
    const [rooms] = await promiseDb.query(`
      SELECT r.id, r.customer_id, r.assigned_doctor_id,
             COALESCE(d.name, 'Bệnh viện ABC') AS doctor_name,
             (
               SELECT message FROM chat_messages 
               WHERE room_id = r.id 
               ORDER BY created_at DESC 
               LIMIT 1
             ) AS last_message,
             r.updated_at
      FROM chat_rooms r
      LEFT JOIN doctors d ON r.assigned_doctor_id = d.id
      WHERE r.customer_id = ?
      ORDER BY r.updated_at DESC
    `, [customerId]);

    res.json(rooms);
  } catch (err) {
    console.error('❌ Lỗi khi lấy phòng theo customer:', err);
    res.status(500).json({ error: 'Không thể lấy phòng chat của khách hàng' });
  }
});
// GET /api/chat/rooms/unassigned
router.get('/rooms/unassigned', async (req, res) => {
  try {
    const [rows] = await promiseDb.query(`
      SELECT cr.id, cr.customer_id, cr.assigned_doctor_id, cr.updated_at, 
             cu.name AS customer_name
      FROM chat_rooms cr
      JOIN customers cu ON cr.customer_id = cu.id
      WHERE cr.assigned_doctor_id IS NULL
      ORDER BY cr.updated_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Lỗi khi lấy unassigned rooms:', err);
    res.status(500).json({ error: 'Không thể lấy danh sách phòng chưa gán bác sĩ' });
  }
});

// 🔥 THÊM API LẤY TẤT CẢ PHÒNG CHAT
router.get('/rooms/all', async (req, res) => {
  try {
    const [rows] = await promiseDb.query(`
      SELECT cr.id, cr.customer_id, cr.assigned_doctor_id, cr.updated_at,
             cu.name AS customer_name,
             d.name AS doctor_name
      FROM chat_rooms cr
      JOIN customers cu ON cr.customer_id = cu.id
      LEFT JOIN doctors d ON cr.assigned_doctor_id = d.id
      ORDER BY cr.updated_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Lỗi khi lấy tất cả phòng chat:', err);
    res.status(500).json({ error: 'Không thể lấy danh sách tất cả phòng chat' });
  }
});
// POST /api/chat/assign
// routes/chatRoutes.js (hoặc tương tự)
router.post('/assign', async (req, res) => {
  const { roomId, doctorId } = req.body;

  if (!roomId || !doctorId) {
    return res.status(400).json({ error: 'Thiếu dữ liệu' });
  }

  try {
    const [result] = await promiseDb.query(
      `UPDATE chat_rooms SET assigned_doctor_id = ?, updated_at = NOW() WHERE id = ?`,
      [doctorId, roomId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy phòng để cập nhật' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('❌ Lỗi gán bác sĩ:', err);
    res.status(500).json({ error: 'Không thể gán bác sĩ' });
  }
});
// GET /api/chat/rooms/doctor/:doctorId
// routes/chatRoutes.js
// 🔹 7. Lấy các room được gán cho bác sĩ cụ thể
// Lấy danh sách phòng theo bác sĩ
router.get('/rooms/doctor/:doctorId', async (req, res) => {
  const { doctorId } = req.params;
  try {
    const [rows] = await promiseDb.query(`
      SELECT r.*, c.name as customer_name
      FROM chat_rooms r
      LEFT JOIN customers c ON r.customer_id = c.id
      WHERE r.assigned_doctor_id = ?
    `, [doctorId]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});




module.exports = router;
