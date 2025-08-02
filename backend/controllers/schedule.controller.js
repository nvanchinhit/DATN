// file: backend/controllers/schedule.controller.js

const db = require('../config/db.config');

// file: backend/controllers/schedule.controller.js

/**
 * Thuật toán chia một ca làm việc lớn (ví dụ: sáng 7h-12h) thành các khung giờ khám nhỏ.
 * @param {object} shift - Đối tượng chứa thông tin ca làm việc.
 * @returns {Array} - Mảng các khung giờ nhỏ, sẵn sàng để INSERT vào database.
 */
const generateTimeSlots = (shift) => {
    const slots = [];
    const { id: work_shift_id, doctor_id, work_date, start_time, end_time } = shift;
    
    // Cấu hình thời gian của mỗi slot
    const SLOT_DURATION_MINUTES = 15; 
    
    // Chuyển đổi thời gian string thành đối tượng Date để tính toán
    let currentTime = new Date(`${work_date}T${start_time}`);
    const shiftEndTime = new Date(`${work_date}T${end_time}`);

    while (currentTime < shiftEndTime) {
        const slotStartTime = new Date(currentTime);
        const slotEndTime = new Date(slotStartTime.getTime() + SLOT_DURATION_MINUTES * 60000);

        // Nếu thời gian kết thúc của slot cuối cùng vượt quá giờ kết thúc của ca, thì không tạo slot đó
        if (slotEndTime > shiftEndTime) break;

        slots.push([
            work_shift_id,
            doctor_id,
            work_date,
            slotStartTime.toTimeString().split(' ')[0], // Format thành 'HH:mm:ss'
            slotEndTime.toTimeString().split(' ')[0],
            'Available', // Trạng thái ban đầu luôn là 'Available'
            1            // Mặc định bác sĩ luôn BẬT (active) các slot khi mới tạo
        ]);
        
        // =============================================================
        // ✅ SỬA LỖI TẠI ĐÂY:
        // Cập nhật currentTime bằng chính thời gian kết thúc của slot vừa tạo
        // để slot tiếp theo bắt đầu ngay lập tức, không có thời gian nghỉ.
        currentTime = slotEndTime;
        // =============================================================
    }
    return slots;
};
/**
 * 1. Controller để tạo một ca làm việc (work shift) và tự động tạo các khung giờ (time slots) con.
 */
exports.createWorkShift = (req, res) => {
    const doctorId = req.user.id; 
    // Sửa ở đây: đổi `shiftName` thành `name` để khớp với frontend
    const { workDate, name, startTime, endTime } = req.body; 

    // Sửa ở đây: kiểm tra `name` thay vì `shiftName`
    if (!workDate || !name || !startTime || !endTime) { 
        return res.status(400).json({ success: false, message: "Vui lòng cung cấp đủ thông tin ca làm việc." });
    }

    const shiftSql = 'INSERT INTO doctor_work_shifts (doctor_id, work_date, shift_name, start_time, end_time) VALUES (?, ?, ?, ?, ?)';
    // Sửa ở đây: truyền biến `name` vào câu SQL
    db.query(shiftSql, [doctorId, workDate, name, startTime, endTime], (err, result) => {
        if (err) {
            console.error("Lỗi khi tạo work_shift:", err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ success: false, message: 'Bạn đã tạo ca làm việc này cho ngày đã chọn.' });
            }
            return res.status(500).json({ success: false, message: 'Lỗi server khi tạo ca làm việc.' });
        }

        const newShiftId = result.insertId;
        const newShift = { id: newShiftId, doctor_id: doctorId, work_date: workDate, start_time: startTime, end_time: endTime };
        const timeSlots = generateTimeSlots(newShift);

        if (timeSlots.length === 0) {
            return res.status(201).json({ success: true, message: 'Tạo ca làm việc thành công.', shiftId: newShiftId });
        }
        
        const slotSql = 'INSERT INTO doctor_time_slot (work_shift_id, doctor_id, slot_date, start_time, end_time, status, is_active) VALUES ?';
        db.query(slotSql, [timeSlots], (err, slotResult) => {
            if (err) {
                console.error("Lỗi khi tạo time_slots:", err);
                db.query('DELETE FROM doctor_work_shifts WHERE id = ?', [newShiftId]); 
                return res.status(500).json({ success: false, message: 'Lỗi khi tạo các khung giờ chi tiết.' });
            }
            res.status(201).json({ success: true, message: `Tạo ca làm việc và ${timeSlots.length} khung giờ thành công!`, shiftId: newShiftId });
        });
    });
};
/**
 * 2. Controller để lấy lịch (cả ca và slot) của bác sĩ đã đăng nhập theo một ngày cụ thể.
 */
exports.getScheduleForDoctorByDate = (req, res) => {
    const doctorId = req.user.id;
    const { date } = req.query;
    if (!date) {
        return res.status(400).json({ success: false, message: "Vui lòng cung cấp ngày." });
    }

    // Lấy thông tin các ca làm việc (sáng, chiều)
    const shiftsSql = `
        SELECT ws.id, ws.shift_name, ws.start_time, ws.end_time, ws.status 
        FROM doctor_work_shifts ws 
        WHERE ws.work_date = ? AND ws.doctor_id = ? 
        ORDER BY ws.start_time
    `;
    db.query(shiftsSql, [date, doctorId], (err, shifts) => {
        if (err) return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy ca làm việc.' });
        
        // Lấy thông tin các khung giờ chi tiết
        const slotsSql = `
            SELECT id, work_shift_id, start_time, end_time, status, is_active 
            FROM doctor_time_slot 
            WHERE slot_date = ? AND doctor_id = ? 
            ORDER BY start_time
        `;
        db.query(slotsSql, [date, doctorId], (err, slots) => {
            if (err) return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy khung giờ.' });
            
            // Chuyển đổi giá trị `is_active` từ 0/1 thành true/false để frontend dễ xử lý
            const formattedSlots = slots.map(slot => ({
                ...slot,
                is_active: !!slot.is_active // Chuyển 1 -> true, 0 -> false
            }));

            res.json({ success: true, data: { shifts, slots: formattedSlots } });
        });
    });
};

/**
 * 3. Controller để hủy một ca làm việc.
 * Khi hủy một ca lớn, tất cả các slot con chưa được đặt cũng sẽ bị vô hiệu hóa.
 */
exports.cancelWorkShift = (req, res) => {
    const { shiftId } = req.params;
    const doctorId = req.user.id;

    // Cập nhật trạng thái của ca làm việc lớn
    const updateShiftSql = "UPDATE `doctor_work_shifts` SET `status` = 'Cancelled' WHERE `id` = ? AND `doctor_id` = ?";
    db.query(updateShiftSql, [shiftId, doctorId], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Lỗi khi hủy ca làm việc.' });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy ca làm việc này hoặc bạn không có quyền.' });
        
        // Tắt (is_active = 0) tất cả các slot con của ca đó MÀ CHƯA CÓ AI ĐẶT
        const updateSlotsSql = "UPDATE `doctor_time_slot` SET `is_active` = 0 WHERE `work_shift_id` = ? AND `status` = 'Available'";
        db.query(updateSlotsSql, [shiftId], (err, slotResult) => {
            if (err) return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật các khung giờ con.' });
            res.json({ success: true, message: 'Hủy ca làm việc thành công.' });
        });
    });
};

/**
 * 4. Controller để BẬT/TẮT một khung giờ khám nhỏ (slot).
 * Đây là hành động bác sĩ chủ động đóng/mở một slot cụ thể.
 */
exports.toggleSlotStatus = (req, res) => {
    const { slotId } = req.params;
    const doctorId = req.user.id;

    // Bước 1: Kiểm tra xem slot có tồn tại và đã có người đặt chưa
    const findSlotSql = "SELECT `status` FROM `doctor_time_slot` WHERE `id` = ? AND `doctor_id` = ?";
    db.query(findSlotSql, [slotId, doctorId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
        if (results.length === 0) return res.status(404).json({ success: false, message: "Không tìm thấy khung giờ này." });

        const currentStatus = results[0].status;
        if (currentStatus === 'Booked') {
            return res.status(400).json({ success: false, message: "Không thể tắt khung giờ đã có bệnh nhân đặt." });
        }

        // Bước 2: Chỉ cập nhật cột `is_active`.
        // Dùng `is_active = !is_active` để đảo ngược giá trị (0 thành 1, 1 thành 0)
        const updateSlotSql = "UPDATE `doctor_time_slot` SET `is_active` = !is_active WHERE `id` = ?";
        db.query(updateSlotSql, [slotId], (err, updateResult) => {
            if (err) return res.status(500).json({ success: false, message: "Lỗi khi cập nhật trạng thái khung giờ." });
            res.json({ success: true, message: `Đã thay đổi trạng thái hoạt động của khung giờ.` });
        });
    });
};