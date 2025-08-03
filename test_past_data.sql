-- Thêm dữ liệu test cho ngày trong quá khứ
-- Thêm time slots cho tuần trước (2025-01-20 đến 2025-01-26)

-- Time slots cho ngày 2025-01-20 (Thứ 2)
INSERT INTO `doctor_time_slot` (`doctor_id`, `work_shift_id`, `slot_date`, `start_time`, `end_time`, `status`, `is_active`) VALUES
(15, 80, '2025-01-20', '07:00:00', '07:30:00', 'Available', 1),
(15, 80, '2025-01-20', '07:45:00', '08:15:00', 'Available', 1),
(15, 80, '2025-01-20', '08:30:00', '09:00:00', 'Available', 1),
(15, 80, '2025-01-20', '09:15:00', '09:45:00', 'Available', 1),
(15, 80, '2025-01-20', '10:00:00', '10:30:00', 'Available', 1),
(15, 80, '2025-01-20', '10:45:00', '11:15:00', 'Available', 1),
(15, 80, '2025-01-20', '11:30:00', '12:00:00', 'Available', 1),
(15, 80, '2025-01-20', '13:30:00', '14:00:00', 'Available', 1),
(15, 80, '2025-01-20', '14:15:00', '14:45:00', 'Available', 1),
(15, 80, '2025-01-20', '15:00:00', '15:30:00', 'Available', 1),
(15, 80, '2025-01-20', '15:45:00', '16:15:00', 'Available', 1),
(15, 80, '2025-01-20', '16:30:00', '17:00:00', 'Available', 1);

-- Time slots cho ngày 2025-01-21 (Thứ 3)
INSERT INTO `doctor_time_slot` (`doctor_id`, `work_shift_id`, `slot_date`, `start_time`, `end_time`, `status`, `is_active`) VALUES
(15, 80, '2025-01-21', '07:00:00', '07:30:00', 'Available', 1),
(15, 80, '2025-01-21', '07:45:00', '08:15:00', 'Available', 1),
(15, 80, '2025-01-21', '08:30:00', '09:00:00', 'Available', 1),
(15, 80, '2025-01-21', '09:15:00', '09:45:00', 'Available', 1),
(15, 80, '2025-01-21', '10:00:00', '10:30:00', 'Available', 1),
(15, 80, '2025-01-21', '10:45:00', '11:15:00', 'Available', 1),
(15, 80, '2025-01-21', '11:30:00', '12:00:00', 'Available', 1),
(15, 80, '2025-01-21', '13:30:00', '14:00:00', 'Available', 1),
(15, 80, '2025-01-21', '14:15:00', '14:45:00', 'Available', 1),
(15, 80, '2025-01-21', '15:00:00', '15:30:00', 'Available', 1),
(15, 80, '2025-01-21', '15:45:00', '16:15:00', 'Available', 1),
(15, 80, '2025-01-21', '16:30:00', '17:00:00', 'Available', 1);

-- Time slots cho ngày 2025-01-22 (Thứ 4)
INSERT INTO `doctor_time_slot` (`doctor_id`, `work_shift_id`, `slot_date`, `start_time`, `end_time`, `status`, `is_active`) VALUES
(15, 80, '2025-01-22', '07:00:00', '07:30:00', 'Available', 1),
(15, 80, '2025-01-22', '07:45:00', '08:15:00', 'Available', 1),
(15, 80, '2025-01-22', '08:30:00', '09:00:00', 'Available', 1),
(15, 80, '2025-01-22', '09:15:00', '09:45:00', 'Available', 1),
(15, 80, '2025-01-22', '10:00:00', '10:30:00', 'Available', 1),
(15, 80, '2025-01-22', '10:45:00', '11:15:00', 'Available', 1),
(15, 80, '2025-01-22', '11:30:00', '12:00:00', 'Available', 1),
(15, 80, '2025-01-22', '13:30:00', '14:00:00', 'Available', 1),
(15, 80, '2025-01-22', '14:15:00', '14:45:00', 'Available', 1),
(15, 80, '2025-01-22', '15:00:00', '15:30:00', 'Available', 1),
(15, 80, '2025-01-22', '15:45:00', '16:15:00', 'Available', 1),
(15, 80, '2025-01-22', '16:30:00', '17:00:00', 'Available', 1);

-- Thêm appointments cho các time slots trong quá khứ
-- Lấy ID của time slots vừa tạo (giả sử ID bắt đầu từ 1000)
-- Appointment cho ngày 2025-01-20 - Đã khám xong
INSERT INTO `appointments` (`name`, `age`, `gender`, `email`, `phone`, `customer_id`, `doctor_id`, `reason`, `payment_status`, `payment_method`, `time_slot_id`, `status`, `doctor_note`, `diagnosis`, `is_examined`) VALUES
('Nguyễn Văn An', 45, 'Nam', 'an@gmail.com', '0123456789', 3, 15, 'Đau đầu, mệt mỏi', 'Đã thanh toán', 'cash', 1000, 'Đã khám xong', 'Nghỉ ngơi đầy đủ, uống thuốc theo đơn', 'Đau đầu do căng thẳng', 1),
('Trần Thị Bình', 32, 'Nữ', 'binh@gmail.com', '0987654321', 3, 15, 'Sốt, ho', 'Đã thanh toán', 'cash', 1001, 'Đã khám xong', 'Uống thuốc hạ sốt, nghỉ ngơi', 'Cảm cúm thông thường', 1),
('Lê Văn Cường', 28, 'Nam', 'cuong@gmail.com', '0123456788', 3, 15, 'Đau bụng', 'Đã thanh toán', 'cash', 1002, 'Đã khám xong', 'Ăn uống điều độ, tránh đồ cay nóng', 'Viêm dạ dày nhẹ', 1);

-- Appointment cho ngày 2025-01-21 - Đang khám
INSERT INTO `appointments` (`name`, `age`, `gender`, `email`, `phone`, `customer_id`, `doctor_id`, `reason`, `payment_status`, `payment_method`, `time_slot_id`, `status`, `is_examined`) VALUES
('Phạm Thị Dung', 35, 'Nữ', 'dung@gmail.com', '0123456787', 3, 15, 'Đau lưng', 'Chưa thanh toán', 'cash', 1012, 'Đang khám', 0);

-- Appointment cho ngày 2025-01-22 - Đã hủy
INSERT INTO `appointments` (`name`, `age`, `gender`, `email`, `phone`, `customer_id`, `doctor_id`, `reason`, `payment_status`, `payment_method`, `time_slot_id`, `status`, `is_examined`) VALUES
('Hoàng Văn Em', 40, 'Nam', 'em@gmail.com', '0123456786', 3, 15, 'Khám tổng quát', 'Chưa thanh toán', 'cash', 1024, 'Đã hủy', 0);

-- Appointment cho ngày 2025-01-22 - Đã xác nhận
INSERT INTO `appointments` (`name`, `age`, `gender`, `email`, `phone`, `customer_id`, `doctor_id`, `reason`, `payment_status`, `payment_method`, `time_slot_id`, `status`, `is_examined`) VALUES
('Vũ Thị Phương', 29, 'Nữ', 'phuong@gmail.com', '0123456785', 3, 15, 'Khám sức khỏe định kỳ', 'Chưa thanh toán', 'cash', 1025, 'Đã xác nhận', 0); 