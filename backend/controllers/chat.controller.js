const db = require("../config/db.config");

// Lấy tin nhắn theo room
exports.getMessages = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM chat_messages WHERE room_id = ? ORDER BY created_at ASC", [
      req.params.roomId,
    ]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Lỗi lấy tin nhắn" });
  }
};

// Gán phòng cho bác sĩ
exports.assignRoomToDoctor = async (req, res) => {
  const { room_id, doctor_id } = req.body;
  try {
    await db.query("UPDATE chat_rooms SET doctor_id = ? WHERE id = ?", [doctor_id, room_id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Lỗi phân công phòng" });
  }
};
