// backend/controllers/schedule.controller.js

const db = require('../config/db.config');

// Các tham số cấu hình cho việc chia slot
const SLOT_DURATION_MINUTES = 30; 
const BREAK_IN_MINUTES = 15;      

/**
 * Thuật toán chia ca làm việc lớn thành các slot nhỏ
 */
const generateTimeSlots = (shift) => {
    const slots = [];
    const { id: work_shift_id, doctor_id, work_date, start_time, end_time } = shift;

    let currentTime = new Date(`${work_date}T${start_time}`);
    const shiftEndTime = new Date(`${work_date}T${end_time}`);

    while (currentTime < shiftEndTime) {
        const slotStartTime = new Date(currentTime);
        const slotEndTime = new Date(slotStartTime.getTime() + SLOT_DURATION_MINUTES * 60000);

        if (slotEndTime > shiftEndTime) {
            break;
        }

        const sqlStartTime = slotStartTime.toTimeString().split(' ')[0];
        const sqlEndTime = slotEndTime.toTimeString().split(' ')[0];

        slots.push([
            work_shift_id,
            doctor_id,
            work_date,
            sqlStartTime,
            sqlEndTime,
            'Available'
        ]);

        currentTime = new Date(slotEndTime.getTime() + BREAK_IN_MINUTES * 60000);
    }
    return slots;
};

// ======================= EXPORTED FUNCTIONS (ĐÃ SỬA LỖI) =======================

// 1. Controller để tạo một ca làm việc và các slot con
exports.createWorkShift = (req, res) => {
    const { doctorId, workDate, shiftName, startTime, endTime } = req.body;

    if (!doctorId || !workDate || !shiftName || !startTime || !endTime) {
        return res.status(400).json({ success: false, message: "Vui lòng cung cấp đủ thông tin." });
    }

    // Hành động 1: Tạo ca làm việc gốc
    const shiftSql = 'INSERT INTO doctor_work_shifts (doctor_id, work_date, shift_name, start_time, end_time) VALUES (?, ?, ?, ?, ?)';
    db.query(shiftSql, [doctorId, workDate, shiftName, startTime, endTime], (err, result) => {
        if (err) {
            console.error("Lỗi khi tạo work_shift:", err);
            return res.status(500).json({ success: false, message: 'Lỗi khi tạo ca làm việc.' });
        }

        const newShiftId = result.insertId;
        const newShift = { id: newShiftId, doctor_id: doctorId, work_date: workDate, start_time: startTime, end_time: endTime };

        // Hành động 2: Thuật toán chia nhỏ
        const timeSlots = generateTimeSlots(newShift);

        if (timeSlots.length === 0) {
            return res.status(201).json({ success: true, message: 'Tạo ca làm việc thành công (không có slot nào được tạo).', shiftId: newShiftId });
        }
        
        // Hành động 3: Insert hàng loạt các slot con
        const slotSql = 'INSERT INTO doctor_time_slot (work_shift_id, doctor_id, slot_date, start_time, end_time, status) VALUES ?';
        db.query(slotSql, [timeSlots], (err, result) => {
            if (err) {
                console.error("Lỗi khi tạo time_slots:", err);
                // Nếu tạo slot con thất bại, xóa ca làm việc gốc đã tạo để đảm bảo toàn vẹn
                db.query('DELETE FROM doctor_work_shifts WHERE id = ?', [newShiftId], () => {
                    res.status(500).json({ success: false, message: 'Lỗi khi tạo các khung giờ làm việc chi tiết.' });
                });
                return;
            }
            
            res.status(201).json({ success: true, message: `Tạo ca làm việc và ${timeSlots.length} khung giờ thành công!`, shiftId: newShiftId });
        });
    });
};

// 2. Controller để lấy tất cả các ca làm việc trong một ngày
exports.getShiftsByDate = (req, res) => {
    const { date } = req.query;
    if (!date) {
        return res.status(400).json({ success: false, message: "Vui lòng cung cấp ngày (date)." });
    }

    const sql = `
        SELECT 
            ws.id, 
            ws.doctor_id,
            d.name as doctor_name,
            ws.work_date,
            ws.shift_name,
            ws.start_time,
            ws.end_time,
            ws.status
        FROM doctor_work_shifts ws
        JOIN doctors d ON ws.doctor_id = d.id
        WHERE ws.work_date = ?
        ORDER BY d.name, ws.start_time
    `;

    db.query(sql, [date], (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy danh sách ca làm việc:", err);
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
        }
        res.json({ success: true, data: results });
    });
};

// 3. Controller để hủy một ca làm việc
exports.cancelWorkShift = (req, res) => {
    const { shiftId } = req.params;

    // Hành động 1: Cập nhật ca làm việc gốc
    const updateShiftSql = "UPDATE `doctor_work_shifts` SET `status` = 'Cancelled' WHERE `id` = ?";
    db.query(updateShiftSql, [shiftId], (err, result) => {
        if (err) {
             return res.status(500).json({ success: false, message: 'Lỗi khi hủy ca làm việc.' });
        }
        if (result.affectedRows === 0) {
             return res.status(404).json({ success: false, message: 'Không tìm thấy ca làm việc này.' });
        }
        
        // Hành động 2: Cập nhật tất cả các slot con còn trống
        const updateSlotsSql = "UPDATE `doctor_time_slot` SET `status` = 'Cancelled' WHERE `work_shift_id` = ? AND `status` = 'Available'";
        db.query(updateSlotsSql, [shiftId], (err, result) => {
            if (err) {
                // Nếu bước này lỗi, ca làm việc vẫn ở trạng thái 'Cancelled', không quá nghiêm trọng.
                return res.status(500).json({ success: false, message: 'Lỗi khi hủy các khung giờ con.' });
            }

            res.json({ success: true, message: 'Hủy ca làm việc và các khung giờ trống thành công.' });
        });
    });
};