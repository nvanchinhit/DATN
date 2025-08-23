-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th8 23, 2025 lúc 07:11 AM
-- Phiên bản máy phục vụ: 8.0.30
-- Phiên bản PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `datn`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `admins`
--

CREATE TABLE `admins` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `role_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `phone`, `created_at`, `role_id`) VALUES
(5, 'Admin', 'chinhnvpd10204@gmail.com', '$2b$10$BZwG/okUMMS3e.Qy57cLp.Oj6Ms.x6Y0ltcyCs0Llu1EK9PnaLzjC', '0344757955', '2025-07-26 08:33:06', 1),
(6, 'Admin', 'dunghtpd09940@gmail.com', '$2b$10$8D76XftlXeD3EaPyEUNreOjCt3CYMJIQa3FkG6ZoutWDNjCvN9hTq', '0342907002', '2025-08-01 12:45:26', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `appointments`
--

CREATE TABLE `appointments` (
  `id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` enum('Nam','Nữ','Khác') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Khác',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `payment_status` enum('Chưa thanh toán','Đã thanh toán') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Chưa thanh toán',
  `payment_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '''cash''' COMMENT 'Phương thức thanh toán: cash, online',
  `transaction_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Mã giao dịch thanh toán',
  `paid_amount` decimal(10,2) DEFAULT '0.00' COMMENT 'Số tiền đã thanh toán',
  `payment_date` datetime DEFAULT NULL COMMENT 'Ngày thanh toán',
  `time_slot_id` int DEFAULT NULL,
  `status` enum('Chưa xác nhận','Đã xác nhận','Từ chối','Đã hủy','Đang khám','Đã khám xong') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Chưa xác nhận',
  `reject_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_reviewed` tinyint(1) NOT NULL DEFAULT '0',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `doctor_confirmation` enum('Chưa xác nhận','Đã xác nhận','Từ chối') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Chưa xác nhận',
  `doctor_note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `diagnosis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `follow_up_date` date DEFAULT NULL,
  `is_examined` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `appointments`
--

INSERT INTO `appointments` (`id`, `name`, `age`, `gender`, `email`, `phone`, `customer_id`, `doctor_id`, `reason`, `payment_status`, `payment_method`, `transaction_id`, `paid_amount`, `payment_date`, `time_slot_id`, `status`, `reject_reason`, `is_reviewed`, `address`, `doctor_confirmation`, `doctor_note`, `diagnosis`, `follow_up_date`, `is_examined`) VALUES
(1, 'Nguyễn Văn A', 32, 'Nam', 'a@gmail.com', '0123456789', NULL, 1, 'Khám tổng quát', 'Đã thanh toán', 'cash', NULL, 0.00, NULL, NULL, 'Chưa xác nhận', NULL, 0, NULL, 'Chưa xác nhận', NULL, NULL, NULL, 0),
(2, 'Trần Thị B', 28, 'Nữ', 'b@gmail.com', '0987654321', NULL, 2, 'Nổi mẩn da', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, NULL, 'Chưa xác nhận', NULL, 0, NULL, 'Chưa xác nhận', NULL, NULL, NULL, 0),
(35, 'LÊ CÔNG TUẤN', 22, 'Nam', 'tuanlcpd10779@gmail.com', '0342907002', 3, 15, 'r32w2er2', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, NULL, 'Đã xác nhận', NULL, 0, 'k47 nguyễn lương bằng', 'Chưa xác nhận', NULL, NULL, NULL, 0),
(39, 'LÊ CÔNG TUẤN', 24, 'Nam', 'tuanlcpd10779@gmail.com', '0342907002', 3, 15, 'qffedgfa nê', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, NULL, 'Chưa xác nhận', NULL, 0, 'k47 nguyễn lương bằng', 'Chưa xác nhận', NULL, NULL, NULL, 0),
(43, 'Le van a', 22, 'Nam', 'huyensoaicavip@gmail.com', '0988842674', 3, 15, 'fsdfddf', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, NULL, 'Đã xác nhận', NULL, 0, ' 04 yet keu', 'Chưa xác nhận', NULL, NULL, NULL, 0),
(61, 'LÊ CÔNG TUẤN', 22, 'Nam', 'tuanlcpd10779@gmail.com', '0342907002', 3, 15, 'stessg', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, 715, 'Đã xác nhận', NULL, 0, 'tẻt', 'Chưa xác nhận', NULL, NULL, NULL, 0),
(62, 'LÊ CÔNG TUẤN', 22, 'Nam', 'tuanlcpd10779@gmail.com', '0342907002', 3, 15, 'ykkk', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, 752, 'Từ chối', NULL, 0, 'k47 nguyễn lương bằng', 'Chưa xác nhận', NULL, NULL, NULL, 0),
(77, 'Hà Thị Dung', 21, 'Nữ', 'dunghtpd09940@gmail.com', '0987123456', 15, 15, 'ho', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, 1123, 'Đã khám xong', NULL, 0, 'Cẩm Thịnh', 'Chưa xác nhận', 'ko có gì\n', NULL, NULL, 1),
(78, 'Hà Thị Trang', 9, 'Nữ', 'dunghtpd09940@gmail.com', '0987123456', 15, 15, 'lll', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, 1130, 'Đã khám xong', NULL, 0, 'Hải Châu', 'Chưa xác nhận', NULL, NULL, NULL, 0),
(79, 'BS.Mina', 21, 'Nữ', 'dunghtpd09940@gmail.com', '0987123489', 15, 15, 'ff', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, 1138, 'Đang khám', NULL, 0, 'Cẩm Xuyên', 'Chưa xác nhận', NULL, NULL, NULL, 0),
(80, 'bona', 21, 'Nữ', 'dunghtpd09940@gmail.com', '0987123489', 15, 15, 'dd', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, 1203, 'Đang khám', NULL, 0, 'Cẩm Thịnh', 'Chưa xác nhận', NULL, NULL, NULL, 0),
(81, 'Hà Thị Dung 1', 21, 'Nữ', 'dunghtpd09940@gmail.com', '0342907002', 15, 15, 'jjj', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, 1238, 'Đã khám xong', NULL, 0, 'Hà Tĩnh', 'Chưa xác nhận', NULL, NULL, NULL, 0),
(82, 'Hà Thị Dung h', 9, 'Nữ', 'dunghtpd09940@gmail.com', '0987123456', 15, 15, 'd', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, 1242, 'Đã khám xong', NULL, 0, 'Hà Tĩnh', 'Chưa xác nhận', 'kkkk', NULL, '2025-08-27', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` int NOT NULL,
  `room_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `sender_type` enum('customer','doctor','admin') NOT NULL,
  `message` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `room_id`, `sender_id`, `sender_type`, `message`, `created_at`) VALUES
(1, 1, 15, 'customer', 'xin chào tư vấn về  lịch khám ', '2025-08-03 22:39:51'),
(2, 1, 15, 'doctor', 'bạn cần gì ', '2025-08-04 00:24:13'),
(3, 1, 15, 'customer', 'gói khám ntn a', '2025-08-04 00:25:12'),
(4, 1, 15, 'customer', 'hi', '2025-08-05 22:00:44'),
(5, 1, 15, 'customer', 'xin chào bs', '2025-08-10 19:41:14'),
(6, 1, 15, 'doctor', 'hế lô', '2025-08-23 10:06:55'),
(7, 1, 15, 'customer', 'cc', '2025-08-23 10:08:02');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chat_rooms`
--

CREATE TABLE `chat_rooms` (
  `id` int NOT NULL,
  `customer_id` int DEFAULT NULL,
  `assigned_doctor_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `chat_rooms`
--

INSERT INTO `chat_rooms` (`id`, `customer_id`, `assigned_doctor_id`, `created_at`, `updated_at`) VALUES
(1, 15, 15, '2025-08-03 22:38:29', '2025-08-23 10:08:02');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `customers`
--

CREATE TABLE `customers` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gender` enum('Nam','Nữ','Khác') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `role_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `customers`
--

INSERT INTO `customers` (`id`, `name`, `email`, `password`, `phone`, `gender`, `birthday`, `address`, `avatar`, `is_verified`, `created_at`, `role_id`) VALUES
(1, 'Trần Thị Khách', 'khach1@example.com', '123456', '0909123456', NULL, NULL, '123 Lê Lợi, Q1', NULL, 0, '2025-06-07 14:02:51', 2),
(2, 'Phạm Văn Mua', 'khach2@example.com', '123456', '0909234567', NULL, NULL, '456 Nguyễn Huệ, Q1', NULL, 0, '2025-06-07 14:02:51', 2),
(3, 'LÊ CÔNG TUẤN', 'tuanlcpd10779@gmail.com', '$2b$10$YPtKLl4SwNUWh9yzJ467se6e.1WI8MBQl2Qo1ugImzJsKEK0TKfr6', '0342907002', NULL, NULL, 'k47 nguyễn lương bằng', NULL, 1, NULL, 2),
(4, '1', '1@gmail.com', '$2b$10$ismZdaLNyA799ui91w8THuSzyBoubxrb8mNC6mWzT6SJW/awONtGe', '1', NULL, NULL, '1', NULL, 0, NULL, 2),
(5, 'Nguyễn Văn Chinh', 'vanchinh@gmail.com', '$2b$10$6xSocNzDeYLYwuViP33SD.G9TWBP/mV9mWtAmQEhML.RSu3LY4Cvy', '0344757955', 'Nam', '0000-00-00', 'Hà Tĩnh', '/uploads/1750822486115-Blue Pink Modern Flat Illustrative Heart Care Logo.png', 0, NULL, 2),
(8, 'Nguyễn Văn A', 'chubedu2005@gmail.com', '$2b$10$SR76wvO5gccaCmikmOWCS.wVTdMLOalSw6PlAPee1a1wbz81eWXFK', '0909123456', NULL, NULL, NULL, NULL, 0, NULL, 2),
(9, 'Nguyễn Văn A', 'vchinh2705@gmail.com', '$2b$10$rJ/ioYSMDxpbBPgDiqQwleMnMmswjM92R.cAVF3X.7cpGJ2RIEIEy', '0909123456', NULL, NULL, NULL, NULL, 1, NULL, 2),
(15, 'Hà Thị Dung', 'dunghtpd09940@gmail.com', '$2b$10$sc/qnOX0gEWm/oWb2PxlOem1by/AWvx9DQSs0N0WxE6Jxy4.YVLkS', '0987123456', 'Nữ', '2024-02-15', 'Thôn Hưng Thắng, Xã Cẩm Hưng, Huyện Cẩm Xuyên, Tỉnh Hà Tĩnh', '/uploads/1753173855667-1751948084832-sticker-facebook.gif', 1, NULL, 2),
(16, 'Nguyễn Văn Chính', 'vanchinh20055@gmail.com', '$2b$10$l77j3QTiFw/6PG8rZtrrn.a3JUV7IMXaxi5ohre55oXyM3PcAMcca', '0335942740', 'Nam', '2005-12-27', NULL, NULL, 1, NULL, 2),
(17, 'Chính Văn', 'van.chinh20055@gmail.com', '$2b$10$6Dp.VL95xvuAnx15LBANlekpuCFH8aRC5XHbjD7H.HBehGiMLn3Hy', '0335942740', NULL, NULL, NULL, NULL, 0, NULL, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `doctors`
--

CREATE TABLE `doctors` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `specialization_id` int DEFAULT NULL,
  `img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `introduction` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT 'Mô tả, giới thiệu về bác sĩ',
  `certificate_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `degree_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'URL hình ảnh bằng cấp',
  `experience` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `account_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '''active''',
  `role_id` int DEFAULT NULL,
  `university` varchar(225) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gpa` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `graduation_date` date DEFAULT NULL,
  `degree_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `certificate_source` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `room_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `doctors`
--

INSERT INTO `doctors` (`id`, `name`, `phone`, `email`, `password`, `specialization_id`, `img`, `introduction`, `certificate_image`, `degree_image`, `experience`, `account_status`, `role_id`, `university`, `gpa`, `graduation_date`, `degree_type`, `certificate_source`, `room_number`) VALUES
(1, 'BS. Nguyễn Bác Sĩ', '0909345678', 'bs1@example.com', '$2b$10$abc123Bs1', 1, 'nguyenbacsi.jpg', 'Giáo sư, Tiến sĩ hàng đầu trong lĩnh vực Nội khoa, với hơn 30 năm kinh nghiệm khám và điều trị.', '1751077687528-3.png', '1751077687531-1.png', '', 'active', 3, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'BS. Trần Da Liễu', '0909456789', 'bs2@example.com', '$2b$10$def456Bs2', 2, 'trandalieu.jpg', 'Chuyên gia Da liễu với nhiều năm kinh nghiệm điều trị các bệnh về da, đặc biệt là da thẩm mỹ và laser.', 'cert_bs2.jpg', 'https://i.imgur.com/T0azHTQ.jpeg', NULL, 'active', 3, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 'Đặng Tất Cường', '0342907002', 'tuanlcpd10779@gmail.com', '$2b$10$XK4ydmUKNB1KHvLkJBRI2eHwaeJHddBdXTIDw71eFn01yOmYFvPkS', 1, 'Bằng.jpg', 'GS. TS. Anh hùng lao động Đỗ Tất Cường có kinh nghiệm về lĩnh vực ghép tạng (ghép thận, ghép gan, ghép tim). Hiện là Phó Tổng Giám đốc phụ trách đối ngoại Hệ thống Y tế Vinmec kiêm cố vấn khoa Nội - Bệnh viện ĐKQT Vinmec Times City', '1752541544184-Screenshot 2025-06-22 210430.png', '1751992740185-Cream Bordered Appreciation Certificate.png', 'Công tác tại Khoa Hồi sức cấp cứu tại Bệnh viện 103 - Học viện Quân y a\r\nPhó Giám đốc Bệnh viện Quân y 103\r\nPhó Tổng Giám đốc phụ trách đối ngoại Hệ thống Y tế Vinmec kiêm cố vấn khoa Nội - Bệnh viện ĐKQT Vinmec Times City\r\n\r\n', 'active', 3, ' Trường Đại học Y Hà Nội', '5.0', '1972-02-27', 'TS – Tiến sĩ Y học', ' Bộ y tế', 'P105'),
(18, 'Nguyễn Văn Kỳ', '0988842674', 'kysoaicavip@gmail.com', '$2b$10$5hTr/1PkVC71NINykMutM.4kfyc5DU6qXKHwvvNANhInp9vjjopx6', 3, '1752465681743-small_20_06_2023_05_41_48_828145_jpeg_8ee5a8d83b.jpg', 'GS. TS. Nguyễn Văn Kỳ  có hơn 50 năm kinh nghiệm trong lĩnh vực Ngọai Nhi và là người tiên phong đưa các liệu pháp trong lĩnh vực Y học tái tạo và trị liệu tế bào vào điều trị các bệnh nan y tại Việt Nam thông qua các hoạt động nghiên cứu khoa học (các đề tài nghiên cứu ứng dụng lâm sàng về liệu pháp tế bào gốc, thể tiết, công nghệ gen và liệu pháp miễn dịch trong điều trị bệnh).\r\n\r\nGS. TS. Nguyễn Văn Kỳ được đào tạo chuyên môn nâng cao tại Pháp, Thụy Điển, Nhật Bản, Australia và Mỹ. Giáo sư được các đồng nghiệp quốc tế đánh giá là một trong các chuyên gia hàng đầu về phẫu thuật nội soi nhi khoa của thế giới, đặc biệt về kỹ thuật phẫu thuật nội soi điều trị u nang ống mật chủ (với kinh nghiệm hơn 500 trường hợp) và phẫu thuật nội soi điều trị thoát vị cơ hoành (với hơn 300 trường hợp). Ông đã được mời đi mổ trình diễn và giảng bài tại nhiều hội nghị quốc tế và tại nhiều nơi như Mỹ, Pháp, Italia, Úc, Nhật, Hàn Quốc, Malaysia, Thái Lan, Indonesia, Philippines, Đài Loan. Ông đã đóng góp 09 kỹ thuật hoàn toàn mới về Phẫu thuật Nhi khoa.\r\n\r\nGS Nguyễn Thanh Liêm là người tiên phong trong lĩnh vực ghép tế bào gốc điều trị các bệnh nan y tại Việt Nam (tự kỷ, bại não loạn sản phế quản phổi, xơ gan, đột quỵ, chấn thương sọ não, phổi tắc nghẽn mãn tính,…) và ghép tế bào gốc tạo máu điều trị các bệnh ung thư huyết học, Thalassemia.\r\n\r\nGS. TS Nguyễn Văn Kỳ là thành viên của Hiệp hội Ngoại nhi Thái Bình Dương (PAPS), Hội Điều trị các bệnh lỗ tiểu lệch thấp và rối loạn lưỡng tính quốc tế, Hội đồng Chính sách khoa học và công nghệ Quốc gia (NCSTP). Ông là Chủ tịch Hiệp hội Ngoại nhi Việt Nam (VAPS) và Ủy ban Nghiên cứu Hiệp hội Phẫu thuật nội soi nhi khoa quốc tế (IPEG), Phó chủ tịch Hiệp hội Ngoại nhi châu Á (AAPS). GS cũng là hội viên danh dự Hiệp hội Ngoại nhi Philippines và Hội Phẫu thuật nhi Liên bang Nga. Ông là đại diện của Việt Nam trong Hệ thống Phẫu thuật nhi khoa toàn cầu.', '1752465681745-TDCARE.png', '1752465681745-small_28_02_2019_09_02_38_828416_jpeg_5ee29e2e57.jpg', 'Viện trưởng Viện nghiên cứu Tế bào gốc và công nghệ gen Vinmec\r\nPhụ trách đơn nguyên Phòng khám Y học tái tạo và tâm lý giáo dục - Trung tâm Y học tái tạo và trị liệu tế bào, Bệnh viện Đa khoa Quốc tế Vinmec Times City\r\nGiám đốc - Bệnh viện Đa khoa Quốc tế Vinmec Times City\r\nViện trưởng Viện Nghiên cứu sức khỏe trẻ em\r\nGiám đốc Bệnh viện Nhi trung Ương\r\n\r\n', 'active', 3, 'Đại Học Y', '5.0', '1972-02-20', 'Tiến Sĩ', 'Bộ ý tế', 'P201'),
(19, 'Nguyễn Thị Huyền', '0375393179', 'huyensoaicavip@gmail.com', '$2b$10$XaZ3nidV52qfWo0fpa1Zbuz8Vxf3B3bBg51tCDZSXrP.Z1Vu544Bm', 1, '1752640076829-305758762_560820982511053_7952047815843262362_n.jpg', 'ssddscxc', '1752640076844-TDCARE.png', '1752640076839-305758762_560820982511053_7952047815843262362_n.jpg', 'sád', 'active', 3, 'Năm 1973: Tốt nghiệp Trường Đại học Y Hà Nội', '4.2', '2002-11-11', 'TS – Tiến sĩ Y học', 'bộ y té', 'P102'),
(20, 'LÊ CÔNG TUẤN', '0909123452', 'oanhsoaicavip@gmail.com', '$2b$10$V6xyhwCN1Z26GOrQxrd92em0oGCeTW1h.xo0KBHzOZD5OKQXrThUm', 3, '1752935877130-small_20_06_2023_05_41_48_828145_jpeg_8ee5a8d83b.jpg', 'kjkfdbjdsf', '1752935877132-small_20_06_2023_05_41_48_828145_jpeg_8ee5a8d83b.jpg', '1752935877132-small_20_06_2023_05_41_48_828145_jpeg_8ee5a8d83b.jpg', 'flkvxkklxv', 'active', 3, ' Trường Đại học Y Hà Nội', '5.0', '2000-12-02', 'TS – Tiến sĩ Y học', 'bộ y tế', 'P202'),
(21, 'Hà Thị Dung', NULL, 'dunghtpd09940@gmail.com', '$2b$10$WedGfCgKKA5rZbsE6ytZsOTPYWeOUnJNPKGuCqYvtRnvWc9Wjeiba', 8, NULL, NULL, NULL, NULL, NULL, 'inactive', 3, NULL, NULL, NULL, NULL, NULL, NULL),
(22, 'Code Dự Án Mẫu', '0344757955', 'vanchinh20055@gmail.com', '$2b$10$gQGiPf46myTeKJEmRazz5.wLe9PxmFY/N6.8z3J9dZYmRG8INMjA2', 3, '1753495825937-theme1.png', 'abcd', '1753495825943-abc.png', '1753495825942-Ná»i dung Äoáº¡n vÄn báº£n cá»§a báº¡n.png', 'abcd', 'active', 3, 'abcd', '9', '2006-12-27', 'giỏi', 'facebook', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `doctor_time_slot`
--

CREATE TABLE `doctor_time_slot` (
  `id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `work_shift_id` int DEFAULT NULL,
  `slot_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` enum('Available','Booked','Cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Available',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Bác sĩ bật (1) hoặc tắt (0) khung giờ này'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `doctor_time_slot`
--

INSERT INTO `doctor_time_slot` (`id`, `doctor_id`, `work_shift_id`, `slot_date`, `start_time`, `end_time`, `status`, `is_active`) VALUES
(621, 15, 64, '2025-07-16', '07:00:00', '07:30:00', 'Available', 1),
(622, 15, 64, '2025-07-16', '07:45:00', '08:15:00', 'Available', 1),
(623, 15, 64, '2025-07-16', '08:30:00', '09:00:00', 'Available', 1),
(624, 15, 64, '2025-07-16', '09:15:00', '09:45:00', 'Available', 1),
(625, 15, 64, '2025-07-16', '10:00:00', '10:30:00', 'Available', 1),
(626, 15, 64, '2025-07-16', '10:45:00', '11:15:00', 'Available', 1),
(627, 15, 64, '2025-07-16', '11:30:00', '12:00:00', 'Available', 1),
(628, 15, 65, '2025-07-16', '13:30:00', '14:00:00', 'Available', 1),
(629, 15, 65, '2025-07-16', '14:15:00', '14:45:00', 'Available', 1),
(630, 15, 65, '2025-07-16', '15:00:00', '15:30:00', 'Available', 1),
(631, 15, 65, '2025-07-16', '15:45:00', '16:15:00', 'Available', 1),
(632, 15, 65, '2025-07-16', '16:30:00', '17:00:00', 'Available', 1),
(633, 19, 66, '2025-07-16', '07:00:00', '07:30:00', 'Available', 1),
(634, 19, 66, '2025-07-16', '07:45:00', '08:15:00', 'Available', 1),
(635, 19, 66, '2025-07-16', '08:30:00', '09:00:00', 'Available', 1),
(636, 19, 66, '2025-07-16', '09:15:00', '09:45:00', 'Available', 1),
(637, 19, 66, '2025-07-16', '10:00:00', '10:30:00', 'Available', 1),
(638, 19, 66, '2025-07-16', '10:45:00', '11:15:00', 'Available', 1),
(639, 19, 66, '2025-07-16', '11:30:00', '12:00:00', 'Available', 1),
(640, 19, 67, '2025-07-16', '13:30:00', '14:00:00', 'Available', 1),
(641, 19, 67, '2025-07-16', '14:15:00', '14:45:00', 'Available', 1),
(642, 19, 67, '2025-07-16', '15:00:00', '15:30:00', 'Available', 1),
(643, 19, 67, '2025-07-16', '15:45:00', '16:15:00', 'Available', 1),
(644, 19, 67, '2025-07-16', '16:30:00', '17:00:00', 'Available', 1),
(645, 19, 68, '2025-07-19', '07:00:00', '07:30:00', 'Available', 1),
(646, 19, 68, '2025-07-19', '07:45:00', '08:15:00', 'Available', 1),
(647, 19, 68, '2025-07-19', '08:30:00', '09:00:00', 'Available', 1),
(648, 19, 68, '2025-07-19', '09:15:00', '09:45:00', 'Available', 1),
(649, 19, 68, '2025-07-19', '10:00:00', '10:30:00', 'Available', 1),
(650, 19, 68, '2025-07-19', '10:45:00', '11:15:00', 'Available', 1),
(651, 19, 68, '2025-07-19', '11:30:00', '12:00:00', 'Available', 1),
(652, 20, 69, '2025-07-19', '07:00:00', '07:30:00', 'Available', 0),
(653, 20, 69, '2025-07-19', '07:45:00', '08:15:00', 'Available', 1),
(654, 20, 69, '2025-07-19', '08:30:00', '09:00:00', 'Available', 1),
(655, 20, 69, '2025-07-19', '09:15:00', '09:45:00', 'Available', 1),
(656, 20, 69, '2025-07-19', '10:00:00', '10:30:00', 'Available', 1),
(657, 20, 69, '2025-07-19', '10:45:00', '11:15:00', 'Available', 1),
(658, 20, 69, '2025-07-19', '11:30:00', '12:00:00', 'Available', 1),
(659, 20, 70, '2025-07-19', '13:30:00', '14:00:00', 'Available', 1),
(660, 20, 70, '2025-07-19', '14:15:00', '14:45:00', 'Available', 1),
(661, 20, 70, '2025-07-19', '15:00:00', '15:30:00', 'Available', 1),
(662, 20, 70, '2025-07-19', '15:45:00', '16:15:00', 'Available', 1),
(663, 20, 70, '2025-07-19', '16:30:00', '17:00:00', 'Available', 1),
(664, 15, 71, '2025-07-19', '07:00:00', '07:30:00', 'Available', 1),
(665, 15, 71, '2025-07-19', '07:45:00', '08:15:00', 'Available', 1),
(666, 15, 71, '2025-07-19', '08:30:00', '09:00:00', 'Available', 1),
(667, 15, 71, '2025-07-19', '09:15:00', '09:45:00', 'Available', 1),
(668, 15, 71, '2025-07-19', '10:00:00', '10:30:00', 'Available', 1),
(669, 15, 71, '2025-07-19', '10:45:00', '11:15:00', 'Available', 1),
(670, 15, 71, '2025-07-19', '11:30:00', '12:00:00', 'Available', 1),
(671, 15, 72, '2025-07-19', '13:30:00', '14:00:00', 'Available', 1),
(672, 15, 72, '2025-07-19', '14:15:00', '14:45:00', 'Available', 1),
(673, 15, 72, '2025-07-19', '15:00:00', '15:30:00', 'Available', 1),
(674, 15, 72, '2025-07-19', '15:45:00', '16:15:00', 'Available', 1),
(675, 15, 72, '2025-07-19', '16:30:00', '17:00:00', 'Available', 1),
(676, 15, 73, '2025-07-22', '13:30:00', '14:00:00', 'Available', 0),
(677, 15, 73, '2025-07-22', '14:15:00', '14:45:00', 'Available', 0),
(678, 15, 73, '2025-07-22', '15:00:00', '15:30:00', 'Available', 1),
(679, 15, 73, '2025-07-22', '15:45:00', '16:15:00', 'Available', 1),
(680, 15, 73, '2025-07-22', '16:30:00', '17:00:00', 'Available', 1),
(681, 15, 74, '2025-07-23', '13:30:00', '14:00:00', 'Available', 0),
(682, 15, 74, '2025-07-23', '14:15:00', '14:45:00', 'Available', 0),
(683, 15, 74, '2025-07-23', '15:00:00', '15:30:00', 'Available', 1),
(684, 15, 74, '2025-07-23', '15:45:00', '16:15:00', 'Available', 1),
(685, 15, 74, '2025-07-23', '16:30:00', '17:00:00', 'Available', 1),
(686, 15, 75, '2025-07-24', '13:30:00', '14:00:00', 'Available', 1),
(687, 15, 75, '2025-07-24', '14:15:00', '14:45:00', 'Available', 1),
(688, 15, 75, '2025-07-24', '15:00:00', '15:30:00', 'Available', 1),
(689, 15, 75, '2025-07-24', '15:45:00', '16:15:00', 'Available', 1),
(690, 15, 75, '2025-07-24', '16:30:00', '17:00:00', 'Available', 1),
(691, 22, 76, '2025-07-26', '07:00:00', '07:30:00', 'Available', 1),
(692, 22, 76, '2025-07-26', '07:45:00', '08:15:00', 'Available', 1),
(693, 22, 76, '2025-07-26', '08:30:00', '09:00:00', 'Available', 1),
(694, 22, 76, '2025-07-26', '09:15:00', '09:45:00', 'Available', 1),
(695, 22, 76, '2025-07-26', '10:00:00', '10:30:00', 'Available', 1),
(696, 22, 76, '2025-07-26', '10:45:00', '11:15:00', 'Available', 1),
(697, 22, 76, '2025-07-26', '11:30:00', '12:00:00', 'Available', 1),
(698, 22, 77, '2025-07-26', '13:30:00', '14:00:00', 'Available', 1),
(699, 22, 77, '2025-07-26', '14:15:00', '14:45:00', 'Available', 1),
(700, 22, 77, '2025-07-26', '15:00:00', '15:30:00', 'Available', 1),
(701, 22, 77, '2025-07-26', '15:45:00', '16:15:00', 'Available', 1),
(702, 22, 77, '2025-07-26', '16:30:00', '17:00:00', 'Available', 1),
(703, 22, 78, '2025-08-01', '07:00:00', '07:30:00', 'Available', 1),
(704, 22, 78, '2025-08-01', '07:45:00', '08:15:00', 'Available', 1),
(705, 22, 78, '2025-08-01', '08:30:00', '09:00:00', 'Available', 1),
(706, 22, 78, '2025-08-01', '09:15:00', '09:45:00', 'Available', 1),
(707, 22, 78, '2025-08-01', '10:00:00', '10:30:00', 'Available', 1),
(708, 22, 78, '2025-08-01', '10:45:00', '11:15:00', 'Available', 1),
(709, 22, 78, '2025-08-01', '11:30:00', '12:00:00', 'Available', 1),
(710, 22, 79, '2025-08-01', '13:30:00', '14:00:00', 'Available', 1),
(711, 22, 79, '2025-08-01', '14:15:00', '14:45:00', 'Available', 1),
(712, 22, 79, '2025-08-01', '15:00:00', '15:30:00', 'Available', 1),
(713, 22, 79, '2025-08-01', '15:45:00', '16:15:00', 'Available', 1),
(714, 22, 79, '2025-08-01', '16:30:00', '17:00:00', 'Available', 1),
(715, 15, 80, '2025-08-01', '07:00:00', '07:30:00', 'Available', 1),
(716, 15, 80, '2025-08-01', '07:45:00', '08:15:00', 'Available', 1),
(717, 15, 80, '2025-08-01', '08:30:00', '09:00:00', 'Available', 1),
(718, 15, 80, '2025-08-01', '09:15:00', '09:45:00', 'Available', 1),
(719, 15, 80, '2025-08-01', '10:00:00', '10:30:00', 'Available', 1),
(720, 15, 80, '2025-08-01', '10:45:00', '11:15:00', 'Available', 1),
(721, 15, 80, '2025-08-01', '11:30:00', '12:00:00', 'Available', 1),
(722, 15, 81, '2025-08-01', '13:30:00', '14:00:00', 'Available', 1),
(723, 15, 81, '2025-08-01', '14:15:00', '14:45:00', 'Available', 1),
(724, 15, 81, '2025-08-01', '15:00:00', '15:30:00', 'Available', 1),
(725, 15, 81, '2025-08-01', '15:45:00', '16:15:00', 'Available', 1),
(726, 15, 81, '2025-08-01', '16:30:00', '17:00:00', 'Available', 1),
(727, 15, 82, '2025-08-02', '07:00:00', '07:30:00', 'Available', 1),
(728, 15, 82, '2025-08-02', '07:45:00', '08:15:00', 'Available', 1),
(729, 15, 82, '2025-08-02', '08:30:00', '09:00:00', 'Available', 1),
(730, 15, 82, '2025-08-02', '09:15:00', '09:45:00', 'Available', 1),
(731, 15, 82, '2025-08-02', '10:00:00', '10:30:00', 'Available', 1),
(732, 15, 82, '2025-08-02', '10:45:00', '11:15:00', 'Available', 1),
(733, 15, 82, '2025-08-02', '11:30:00', '12:00:00', 'Available', 1),
(734, 15, 83, '2025-08-03', '07:00:00', '07:15:00', 'Available', 1),
(735, 15, 83, '2025-08-03', '07:30:00', '07:45:00', 'Available', 1),
(736, 15, 83, '2025-08-03', '08:00:00', '08:15:00', 'Available', 1),
(737, 15, 83, '2025-08-03', '08:30:00', '08:45:00', 'Available', 1),
(738, 15, 83, '2025-08-03', '09:00:00', '09:15:00', 'Available', 1),
(739, 15, 83, '2025-08-03', '09:30:00', '09:45:00', 'Available', 1),
(740, 15, 83, '2025-08-03', '10:00:00', '10:15:00', 'Available', 1),
(741, 15, 83, '2025-08-03', '10:30:00', '10:45:00', 'Available', 1),
(742, 15, 83, '2025-08-03', '11:00:00', '11:15:00', 'Available', 1),
(743, 15, 83, '2025-08-03', '11:30:00', '11:45:00', 'Available', 1),
(744, 15, 84, '2025-08-03', '13:30:00', '13:45:00', 'Available', 1),
(745, 15, 84, '2025-08-03', '14:00:00', '14:15:00', 'Available', 1),
(746, 15, 84, '2025-08-03', '14:30:00', '14:45:00', 'Available', 1),
(747, 15, 84, '2025-08-03', '15:00:00', '15:15:00', 'Available', 1),
(748, 15, 84, '2025-08-03', '15:30:00', '15:45:00', 'Available', 1),
(749, 15, 84, '2025-08-03', '16:00:00', '16:15:00', 'Available', 1),
(750, 15, 84, '2025-08-03', '16:30:00', '16:45:00', 'Available', 1),
(751, 15, 84, '2025-08-03', '17:00:00', '17:15:00', 'Available', 1),
(752, 15, 85, '2025-08-04', '07:00:00', '08:00:00', 'Available', 1),
(753, 15, 85, '2025-08-04', '08:00:00', '09:00:00', 'Available', 1),
(754, 15, 85, '2025-08-04', '09:00:00', '10:00:00', 'Available', 1),
(755, 15, 85, '2025-08-04', '10:00:00', '11:00:00', 'Available', 1),
(756, 15, 85, '2025-08-04', '11:00:00', '12:00:00', 'Available', 1),
(757, 15, 86, '2025-08-04', '13:30:00', '14:30:00', 'Available', 1),
(758, 15, 86, '2025-08-04', '14:30:00', '15:30:00', 'Available', 1),
(759, 15, 86, '2025-08-04', '15:30:00', '16:30:00', 'Available', 1),
(760, 15, 86, '2025-08-04', '16:30:00', '17:30:00', 'Available', 1),
(761, 15, 87, '2025-08-05', '07:00:00', '07:15:00', 'Available', 0),
(762, 15, 87, '2025-08-05', '07:15:00', '07:30:00', 'Available', 0),
(763, 15, 87, '2025-08-05', '07:30:00', '07:45:00', 'Available', 0),
(764, 15, 87, '2025-08-05', '07:45:00', '08:00:00', 'Available', 0),
(765, 15, 87, '2025-08-05', '08:00:00', '08:15:00', 'Available', 0),
(766, 15, 87, '2025-08-05', '08:15:00', '08:30:00', 'Available', 0),
(767, 15, 87, '2025-08-05', '08:30:00', '08:45:00', 'Available', 0),
(768, 15, 87, '2025-08-05', '08:45:00', '09:00:00', 'Available', 0),
(769, 15, 87, '2025-08-05', '09:00:00', '09:15:00', 'Available', 0),
(770, 15, 87, '2025-08-05', '09:15:00', '09:30:00', 'Available', 0),
(771, 15, 87, '2025-08-05', '09:30:00', '09:45:00', 'Available', 0),
(772, 15, 87, '2025-08-05', '09:45:00', '10:00:00', 'Available', 0),
(773, 15, 87, '2025-08-05', '10:00:00', '10:15:00', 'Available', 0),
(774, 15, 87, '2025-08-05', '10:15:00', '10:30:00', 'Available', 0),
(775, 15, 87, '2025-08-05', '10:30:00', '10:45:00', 'Available', 0),
(776, 15, 87, '2025-08-05', '10:45:00', '11:00:00', 'Available', 0),
(777, 15, 87, '2025-08-05', '11:00:00', '11:15:00', 'Available', 0),
(778, 15, 87, '2025-08-05', '11:15:00', '11:30:00', 'Available', 0),
(779, 15, 87, '2025-08-05', '11:30:00', '11:45:00', 'Available', 0),
(780, 15, 87, '2025-08-05', '11:45:00', '12:00:00', 'Available', 0),
(781, 15, 88, '2025-08-05', '13:30:00', '13:45:00', 'Available', 1),
(782, 15, 88, '2025-08-05', '13:45:00', '14:00:00', 'Available', 1),
(783, 15, 88, '2025-08-05', '14:00:00', '14:15:00', 'Available', 1),
(784, 15, 88, '2025-08-05', '14:15:00', '14:30:00', 'Available', 1),
(785, 15, 88, '2025-08-05', '14:30:00', '14:45:00', 'Available', 1),
(786, 15, 88, '2025-08-05', '14:45:00', '15:00:00', 'Available', 1),
(787, 15, 88, '2025-08-05', '15:00:00', '15:15:00', 'Available', 1),
(788, 15, 88, '2025-08-05', '15:15:00', '15:30:00', 'Available', 1),
(789, 15, 88, '2025-08-05', '15:30:00', '15:45:00', 'Available', 1),
(790, 15, 88, '2025-08-05', '15:45:00', '16:00:00', 'Available', 1),
(791, 15, 88, '2025-08-05', '16:00:00', '16:15:00', 'Available', 1),
(792, 15, 88, '2025-08-05', '16:15:00', '16:30:00', 'Available', 1),
(793, 15, 88, '2025-08-05', '16:30:00', '16:45:00', 'Available', 1),
(794, 15, 88, '2025-08-05', '16:45:00', '17:00:00', 'Available', 1),
(795, 15, 88, '2025-08-05', '17:00:00', '17:15:00', 'Available', 1),
(796, 15, 88, '2025-08-05', '17:15:00', '17:30:00', 'Available', 1),
(797, 15, 89, '2025-08-06', '07:00:00', '07:15:00', 'Available', 1),
(798, 15, 89, '2025-08-06', '07:15:00', '07:30:00', 'Available', 1),
(799, 15, 89, '2025-08-06', '07:30:00', '07:45:00', 'Available', 1),
(800, 15, 89, '2025-08-06', '07:45:00', '08:00:00', 'Available', 1),
(801, 15, 89, '2025-08-06', '08:00:00', '08:15:00', 'Available', 1),
(802, 15, 89, '2025-08-06', '08:15:00', '08:30:00', 'Available', 1),
(803, 15, 89, '2025-08-06', '08:30:00', '08:45:00', 'Available', 1),
(804, 15, 89, '2025-08-06', '08:45:00', '09:00:00', 'Available', 1),
(805, 15, 89, '2025-08-06', '09:00:00', '09:15:00', 'Available', 1),
(806, 15, 89, '2025-08-06', '09:15:00', '09:30:00', 'Available', 1),
(807, 15, 89, '2025-08-06', '09:30:00', '09:45:00', 'Available', 1),
(808, 15, 89, '2025-08-06', '09:45:00', '10:00:00', 'Available', 1),
(809, 15, 89, '2025-08-06', '10:00:00', '10:15:00', 'Available', 1),
(810, 15, 89, '2025-08-06', '10:15:00', '10:30:00', 'Available', 1),
(811, 15, 89, '2025-08-06', '10:30:00', '10:45:00', 'Available', 1),
(812, 15, 89, '2025-08-06', '10:45:00', '11:00:00', 'Available', 1),
(813, 15, 89, '2025-08-06', '11:00:00', '11:15:00', 'Available', 1),
(814, 15, 89, '2025-08-06', '11:15:00', '11:30:00', 'Available', 1),
(815, 15, 89, '2025-08-06', '11:30:00', '11:45:00', 'Available', 1),
(816, 15, 89, '2025-08-06', '11:45:00', '12:00:00', 'Available', 1),
(817, 15, 90, '2025-08-06', '13:30:00', '13:45:00', 'Available', 1),
(818, 15, 90, '2025-08-06', '13:45:00', '14:00:00', 'Available', 1),
(819, 15, 90, '2025-08-06', '14:00:00', '14:15:00', 'Available', 1),
(820, 15, 90, '2025-08-06', '14:15:00', '14:30:00', 'Available', 1),
(821, 15, 90, '2025-08-06', '14:30:00', '14:45:00', 'Available', 1),
(822, 15, 90, '2025-08-06', '14:45:00', '15:00:00', 'Available', 1),
(823, 15, 90, '2025-08-06', '15:00:00', '15:15:00', 'Available', 1),
(824, 15, 90, '2025-08-06', '15:15:00', '15:30:00', 'Available', 1),
(825, 15, 90, '2025-08-06', '15:30:00', '15:45:00', 'Available', 1),
(826, 15, 90, '2025-08-06', '15:45:00', '16:00:00', 'Available', 1),
(827, 15, 90, '2025-08-06', '16:00:00', '16:15:00', 'Available', 1),
(828, 15, 90, '2025-08-06', '16:15:00', '16:30:00', 'Available', 1),
(829, 15, 90, '2025-08-06', '16:30:00', '16:45:00', 'Available', 1),
(830, 15, 90, '2025-08-06', '16:45:00', '17:00:00', 'Available', 1),
(831, 15, 90, '2025-08-06', '17:00:00', '17:15:00', 'Available', 1),
(832, 15, 90, '2025-08-06', '17:15:00', '17:30:00', 'Available', 1),
(833, 15, 91, '2025-08-05', '07:00:00', '07:15:00', 'Available', 1),
(834, 15, 91, '2025-08-05', '07:15:00', '07:30:00', 'Available', 1),
(835, 15, 91, '2025-08-05', '07:30:00', '07:45:00', 'Available', 1),
(836, 15, 91, '2025-08-05', '07:45:00', '08:00:00', 'Available', 1),
(837, 15, 91, '2025-08-05', '08:00:00', '08:15:00', 'Available', 1),
(838, 15, 91, '2025-08-05', '08:15:00', '08:30:00', 'Available', 1),
(839, 15, 91, '2025-08-05', '08:30:00', '08:45:00', 'Available', 1),
(840, 15, 91, '2025-08-05', '08:45:00', '09:00:00', 'Available', 1),
(841, 15, 91, '2025-08-05', '09:00:00', '09:15:00', 'Available', 1),
(842, 15, 91, '2025-08-05', '09:15:00', '09:30:00', 'Available', 1),
(843, 15, 91, '2025-08-05', '09:30:00', '09:45:00', 'Available', 1),
(844, 15, 91, '2025-08-05', '09:45:00', '10:00:00', 'Available', 1),
(845, 15, 91, '2025-08-05', '10:00:00', '10:15:00', 'Available', 1),
(846, 15, 91, '2025-08-05', '10:15:00', '10:30:00', 'Available', 1),
(847, 15, 91, '2025-08-05', '10:30:00', '10:45:00', 'Available', 1),
(848, 15, 91, '2025-08-05', '10:45:00', '11:00:00', 'Available', 1),
(849, 15, 91, '2025-08-05', '11:00:00', '11:15:00', 'Available', 1),
(850, 15, 91, '2025-08-05', '11:15:00', '11:30:00', 'Available', 1),
(851, 15, 91, '2025-08-05', '11:30:00', '11:45:00', 'Available', 1),
(852, 15, 91, '2025-08-05', '11:45:00', '12:00:00', 'Available', 1),
(853, 15, 92, '2025-08-07', '07:00:00', '07:15:00', 'Available', 1),
(854, 15, 92, '2025-08-07', '07:15:00', '07:30:00', 'Available', 1),
(855, 15, 92, '2025-08-07', '07:30:00', '07:45:00', 'Available', 1),
(856, 15, 92, '2025-08-07', '07:45:00', '08:00:00', 'Available', 1),
(857, 15, 92, '2025-08-07', '08:00:00', '08:15:00', 'Available', 1),
(858, 15, 92, '2025-08-07', '08:15:00', '08:30:00', 'Available', 1),
(859, 15, 92, '2025-08-07', '08:30:00', '08:45:00', 'Available', 1),
(860, 15, 92, '2025-08-07', '08:45:00', '09:00:00', 'Available', 1),
(861, 15, 92, '2025-08-07', '09:00:00', '09:15:00', 'Available', 1),
(862, 15, 92, '2025-08-07', '09:15:00', '09:30:00', 'Available', 1),
(863, 15, 92, '2025-08-07', '09:30:00', '09:45:00', 'Available', 1),
(864, 15, 92, '2025-08-07', '09:45:00', '10:00:00', 'Available', 1),
(865, 15, 92, '2025-08-07', '10:00:00', '10:15:00', 'Available', 1),
(866, 15, 92, '2025-08-07', '10:15:00', '10:30:00', 'Available', 1),
(867, 15, 92, '2025-08-07', '10:30:00', '10:45:00', 'Available', 1),
(868, 15, 92, '2025-08-07', '10:45:00', '11:00:00', 'Available', 1),
(869, 15, 92, '2025-08-07', '11:00:00', '11:15:00', 'Available', 1),
(870, 15, 92, '2025-08-07', '11:15:00', '11:30:00', 'Available', 1),
(871, 15, 92, '2025-08-07', '11:30:00', '11:45:00', 'Available', 1),
(872, 15, 92, '2025-08-07', '11:45:00', '12:00:00', 'Available', 1),
(873, 15, 93, '2025-08-07', '13:30:00', '13:45:00', 'Available', 1),
(874, 15, 93, '2025-08-07', '13:45:00', '14:00:00', 'Available', 1),
(875, 15, 93, '2025-08-07', '14:00:00', '14:15:00', 'Available', 1),
(876, 15, 93, '2025-08-07', '14:15:00', '14:30:00', 'Available', 1),
(877, 15, 93, '2025-08-07', '14:30:00', '14:45:00', 'Available', 1),
(878, 15, 93, '2025-08-07', '14:45:00', '15:00:00', 'Available', 1),
(879, 15, 93, '2025-08-07', '15:00:00', '15:15:00', 'Available', 1),
(880, 15, 93, '2025-08-07', '15:15:00', '15:30:00', 'Available', 1),
(881, 15, 93, '2025-08-07', '15:30:00', '15:45:00', 'Available', 1),
(882, 15, 93, '2025-08-07', '15:45:00', '16:00:00', 'Available', 1),
(883, 15, 93, '2025-08-07', '16:00:00', '16:15:00', 'Available', 1),
(884, 15, 93, '2025-08-07', '16:15:00', '16:30:00', 'Available', 1),
(885, 15, 93, '2025-08-07', '16:30:00', '16:45:00', 'Available', 1),
(886, 15, 93, '2025-08-07', '16:45:00', '17:00:00', 'Available', 1),
(887, 15, 93, '2025-08-07', '17:00:00', '17:15:00', 'Available', 1),
(888, 15, 93, '2025-08-07', '17:15:00', '17:30:00', 'Available', 1),
(889, 15, 94, '2025-08-08', '07:00:00', '07:15:00', 'Available', 1),
(890, 15, 94, '2025-08-08', '07:15:00', '07:30:00', 'Available', 1),
(891, 15, 94, '2025-08-08', '07:30:00', '07:45:00', 'Available', 1),
(892, 15, 94, '2025-08-08', '07:45:00', '08:00:00', 'Available', 1),
(893, 15, 94, '2025-08-08', '08:00:00', '08:15:00', 'Available', 1),
(894, 15, 94, '2025-08-08', '08:15:00', '08:30:00', 'Available', 1),
(895, 15, 94, '2025-08-08', '08:30:00', '08:45:00', 'Available', 1),
(896, 15, 94, '2025-08-08', '08:45:00', '09:00:00', 'Available', 1),
(897, 15, 94, '2025-08-08', '09:00:00', '09:15:00', 'Available', 1),
(898, 15, 94, '2025-08-08', '09:15:00', '09:30:00', 'Available', 1),
(899, 15, 94, '2025-08-08', '09:30:00', '09:45:00', 'Available', 1),
(900, 15, 94, '2025-08-08', '09:45:00', '10:00:00', 'Available', 1),
(901, 15, 94, '2025-08-08', '10:00:00', '10:15:00', 'Available', 1),
(902, 15, 94, '2025-08-08', '10:15:00', '10:30:00', 'Available', 1),
(903, 15, 94, '2025-08-08', '10:30:00', '10:45:00', 'Available', 1),
(904, 15, 94, '2025-08-08', '10:45:00', '11:00:00', 'Available', 1),
(905, 15, 94, '2025-08-08', '11:00:00', '11:15:00', 'Available', 1),
(906, 15, 94, '2025-08-08', '11:15:00', '11:30:00', 'Available', 1),
(907, 15, 94, '2025-08-08', '11:30:00', '11:45:00', 'Available', 1),
(908, 15, 94, '2025-08-08', '11:45:00', '12:00:00', 'Available', 1),
(909, 15, 95, '2025-08-08', '13:30:00', '13:45:00', 'Available', 1),
(910, 15, 95, '2025-08-08', '13:45:00', '14:00:00', 'Available', 1),
(911, 15, 95, '2025-08-08', '14:00:00', '14:15:00', 'Available', 1),
(912, 15, 95, '2025-08-08', '14:15:00', '14:30:00', 'Available', 1),
(913, 15, 95, '2025-08-08', '14:30:00', '14:45:00', 'Available', 1),
(914, 15, 95, '2025-08-08', '14:45:00', '15:00:00', 'Available', 1),
(915, 15, 95, '2025-08-08', '15:00:00', '15:15:00', 'Available', 1),
(916, 15, 95, '2025-08-08', '15:15:00', '15:30:00', 'Available', 1),
(917, 15, 95, '2025-08-08', '15:30:00', '15:45:00', 'Available', 1),
(918, 15, 95, '2025-08-08', '15:45:00', '16:00:00', 'Available', 1),
(919, 15, 95, '2025-08-08', '16:00:00', '16:15:00', 'Available', 1),
(920, 15, 95, '2025-08-08', '16:15:00', '16:30:00', 'Available', 1),
(921, 15, 95, '2025-08-08', '16:30:00', '16:45:00', 'Available', 1),
(922, 15, 95, '2025-08-08', '16:45:00', '17:00:00', 'Available', 1),
(923, 15, 95, '2025-08-08', '17:00:00', '17:15:00', 'Available', 1),
(924, 15, 95, '2025-08-08', '17:15:00', '17:30:00', 'Available', 1),
(925, 15, 96, '2025-08-09', '07:00:00', '07:15:00', 'Available', 1),
(926, 15, 96, '2025-08-09', '07:15:00', '07:30:00', 'Available', 1),
(927, 15, 96, '2025-08-09', '07:30:00', '07:45:00', 'Available', 1),
(928, 15, 96, '2025-08-09', '07:45:00', '08:00:00', 'Available', 1),
(929, 15, 96, '2025-08-09', '08:00:00', '08:15:00', 'Available', 1),
(930, 15, 96, '2025-08-09', '08:15:00', '08:30:00', 'Available', 1),
(931, 15, 96, '2025-08-09', '08:30:00', '08:45:00', 'Available', 1),
(932, 15, 96, '2025-08-09', '08:45:00', '09:00:00', 'Available', 1),
(933, 15, 96, '2025-08-09', '09:00:00', '09:15:00', 'Available', 1),
(934, 15, 96, '2025-08-09', '09:15:00', '09:30:00', 'Available', 1),
(935, 15, 96, '2025-08-09', '09:30:00', '09:45:00', 'Available', 1),
(936, 15, 96, '2025-08-09', '09:45:00', '10:00:00', 'Available', 1),
(937, 15, 96, '2025-08-09', '10:00:00', '10:15:00', 'Available', 1),
(938, 15, 96, '2025-08-09', '10:15:00', '10:30:00', 'Available', 1),
(939, 15, 96, '2025-08-09', '10:30:00', '10:45:00', 'Available', 1),
(940, 15, 96, '2025-08-09', '10:45:00', '11:00:00', 'Available', 1),
(941, 15, 96, '2025-08-09', '11:00:00', '11:15:00', 'Available', 1),
(942, 15, 96, '2025-08-09', '11:15:00', '11:30:00', 'Available', 1),
(943, 15, 96, '2025-08-09', '11:30:00', '11:45:00', 'Available', 1),
(944, 15, 96, '2025-08-09', '11:45:00', '12:00:00', 'Available', 1),
(945, 15, 97, '2025-08-09', '13:30:00', '13:45:00', 'Available', 1),
(946, 15, 97, '2025-08-09', '13:45:00', '14:00:00', 'Available', 1),
(947, 15, 97, '2025-08-09', '14:00:00', '14:15:00', 'Available', 1),
(948, 15, 97, '2025-08-09', '14:15:00', '14:30:00', 'Available', 1),
(949, 15, 97, '2025-08-09', '14:30:00', '14:45:00', 'Available', 1),
(950, 15, 97, '2025-08-09', '14:45:00', '15:00:00', 'Available', 1),
(951, 15, 97, '2025-08-09', '15:00:00', '15:15:00', 'Available', 1),
(952, 15, 97, '2025-08-09', '15:15:00', '15:30:00', 'Available', 1),
(953, 15, 97, '2025-08-09', '15:30:00', '15:45:00', 'Available', 1),
(954, 15, 97, '2025-08-09', '15:45:00', '16:00:00', 'Available', 1),
(955, 15, 97, '2025-08-09', '16:00:00', '16:15:00', 'Available', 1),
(956, 15, 97, '2025-08-09', '16:15:00', '16:30:00', 'Available', 1),
(957, 15, 97, '2025-08-09', '16:30:00', '16:45:00', 'Available', 1),
(958, 15, 97, '2025-08-09', '16:45:00', '17:00:00', 'Available', 1),
(959, 15, 97, '2025-08-09', '17:00:00', '17:15:00', 'Available', 1),
(960, 15, 97, '2025-08-09', '17:15:00', '17:30:00', 'Available', 1),
(961, 15, 98, '2025-08-10', '07:00:00', '07:15:00', 'Available', 1),
(962, 15, 98, '2025-08-10', '07:15:00', '07:30:00', 'Available', 1),
(963, 15, 98, '2025-08-10', '07:30:00', '07:45:00', 'Available', 1),
(964, 15, 98, '2025-08-10', '07:45:00', '08:00:00', 'Available', 1),
(965, 15, 98, '2025-08-10', '08:00:00', '08:15:00', 'Available', 1),
(966, 15, 98, '2025-08-10', '08:15:00', '08:30:00', 'Available', 1),
(967, 15, 98, '2025-08-10', '08:30:00', '08:45:00', 'Available', 1),
(968, 15, 98, '2025-08-10', '08:45:00', '09:00:00', 'Available', 1),
(969, 15, 98, '2025-08-10', '09:00:00', '09:15:00', 'Available', 1),
(970, 15, 98, '2025-08-10', '09:15:00', '09:30:00', 'Available', 1),
(971, 15, 98, '2025-08-10', '09:30:00', '09:45:00', 'Available', 1),
(972, 15, 98, '2025-08-10', '09:45:00', '10:00:00', 'Available', 1),
(973, 15, 98, '2025-08-10', '10:00:00', '10:15:00', 'Available', 1),
(974, 15, 98, '2025-08-10', '10:15:00', '10:30:00', 'Available', 1),
(975, 15, 98, '2025-08-10', '10:30:00', '10:45:00', 'Available', 1),
(976, 15, 98, '2025-08-10', '10:45:00', '11:00:00', 'Available', 1),
(977, 15, 98, '2025-08-10', '11:00:00', '11:15:00', 'Available', 1),
(978, 15, 98, '2025-08-10', '11:15:00', '11:30:00', 'Available', 1),
(979, 15, 98, '2025-08-10', '11:30:00', '11:45:00', 'Available', 1),
(980, 15, 98, '2025-08-10', '11:45:00', '12:00:00', 'Available', 1),
(981, 15, 99, '2025-08-10', '13:30:00', '13:45:00', 'Available', 1),
(982, 15, 99, '2025-08-10', '13:45:00', '14:00:00', 'Available', 1),
(983, 15, 99, '2025-08-10', '14:00:00', '14:15:00', 'Available', 1),
(984, 15, 99, '2025-08-10', '14:15:00', '14:30:00', 'Available', 1),
(985, 15, 99, '2025-08-10', '14:30:00', '14:45:00', 'Available', 1),
(986, 15, 99, '2025-08-10', '14:45:00', '15:00:00', 'Available', 1),
(987, 15, 99, '2025-08-10', '15:00:00', '15:15:00', 'Available', 1),
(988, 15, 99, '2025-08-10', '15:15:00', '15:30:00', 'Available', 1),
(989, 15, 99, '2025-08-10', '15:30:00', '15:45:00', 'Available', 1),
(990, 15, 99, '2025-08-10', '15:45:00', '16:00:00', 'Available', 1),
(991, 15, 99, '2025-08-10', '16:00:00', '16:15:00', 'Available', 1),
(992, 15, 99, '2025-08-10', '16:15:00', '16:30:00', 'Available', 1),
(993, 15, 99, '2025-08-10', '16:30:00', '16:45:00', 'Available', 1),
(994, 15, 99, '2025-08-10', '16:45:00', '17:00:00', 'Available', 1),
(995, 15, 99, '2025-08-10', '17:00:00', '17:15:00', 'Available', 1),
(996, 15, 99, '2025-08-10', '17:15:00', '17:30:00', 'Available', 1),
(997, 15, 100, '2025-08-11', '07:00:00', '07:15:00', 'Available', 1),
(998, 15, 100, '2025-08-11', '07:15:00', '07:30:00', 'Available', 1),
(999, 15, 100, '2025-08-11', '07:30:00', '07:45:00', 'Available', 1),
(1000, 15, 100, '2025-08-11', '07:45:00', '08:00:00', 'Available', 1),
(1001, 15, 100, '2025-08-11', '08:00:00', '08:15:00', 'Available', 1),
(1002, 15, 100, '2025-08-11', '08:15:00', '08:30:00', 'Available', 1),
(1003, 15, 100, '2025-08-11', '08:30:00', '08:45:00', 'Available', 1),
(1004, 15, 100, '2025-08-11', '08:45:00', '09:00:00', 'Available', 1),
(1005, 15, 100, '2025-08-11', '09:00:00', '09:15:00', 'Available', 1),
(1006, 15, 100, '2025-08-11', '09:15:00', '09:30:00', 'Available', 1),
(1007, 15, 100, '2025-08-11', '09:30:00', '09:45:00', 'Available', 1),
(1008, 15, 100, '2025-08-11', '09:45:00', '10:00:00', 'Available', 1),
(1009, 15, 100, '2025-08-11', '10:00:00', '10:15:00', 'Available', 1),
(1010, 15, 100, '2025-08-11', '10:15:00', '10:30:00', 'Available', 1),
(1011, 15, 100, '2025-08-11', '10:30:00', '10:45:00', 'Available', 1),
(1012, 15, 100, '2025-08-11', '10:45:00', '11:00:00', 'Available', 1),
(1013, 15, 100, '2025-08-11', '11:00:00', '11:15:00', 'Available', 1),
(1014, 15, 100, '2025-08-11', '11:15:00', '11:30:00', 'Available', 1),
(1015, 15, 100, '2025-08-11', '11:30:00', '11:45:00', 'Available', 1),
(1016, 15, 100, '2025-08-11', '11:45:00', '12:00:00', 'Available', 1),
(1017, 15, 101, '2025-08-11', '13:30:00', '13:45:00', 'Available', 1),
(1018, 15, 101, '2025-08-11', '13:45:00', '14:00:00', 'Available', 1),
(1019, 15, 101, '2025-08-11', '14:00:00', '14:15:00', 'Available', 1),
(1020, 15, 101, '2025-08-11', '14:15:00', '14:30:00', 'Available', 1),
(1021, 15, 101, '2025-08-11', '14:30:00', '14:45:00', 'Available', 1),
(1022, 15, 101, '2025-08-11', '14:45:00', '15:00:00', 'Available', 1),
(1023, 15, 101, '2025-08-11', '15:00:00', '15:15:00', 'Available', 1),
(1024, 15, 101, '2025-08-11', '15:15:00', '15:30:00', 'Available', 1),
(1025, 15, 101, '2025-08-11', '15:30:00', '15:45:00', 'Available', 1),
(1026, 15, 101, '2025-08-11', '15:45:00', '16:00:00', 'Available', 1),
(1027, 15, 101, '2025-08-11', '16:00:00', '16:15:00', 'Available', 1),
(1028, 15, 101, '2025-08-11', '16:15:00', '16:30:00', 'Available', 1),
(1029, 15, 101, '2025-08-11', '16:30:00', '16:45:00', 'Available', 1),
(1030, 15, 101, '2025-08-11', '16:45:00', '17:00:00', 'Available', 1),
(1031, 15, 101, '2025-08-11', '17:00:00', '17:15:00', 'Available', 1),
(1032, 15, 101, '2025-08-11', '17:15:00', '17:30:00', 'Available', 1),
(1033, 15, 102, '2025-08-12', '07:00:00', '07:15:00', 'Available', 1),
(1034, 15, 102, '2025-08-12', '07:15:00', '07:30:00', 'Available', 1),
(1035, 15, 102, '2025-08-12', '07:30:00', '07:45:00', 'Available', 1),
(1036, 15, 102, '2025-08-12', '07:45:00', '08:00:00', 'Available', 1),
(1037, 15, 102, '2025-08-12', '08:00:00', '08:15:00', 'Available', 1),
(1038, 15, 102, '2025-08-12', '08:15:00', '08:30:00', 'Available', 1),
(1039, 15, 102, '2025-08-12', '08:30:00', '08:45:00', 'Available', 1),
(1040, 15, 102, '2025-08-12', '08:45:00', '09:00:00', 'Available', 1),
(1041, 15, 102, '2025-08-12', '09:00:00', '09:15:00', 'Available', 1),
(1042, 15, 102, '2025-08-12', '09:15:00', '09:30:00', 'Available', 1),
(1043, 15, 102, '2025-08-12', '09:30:00', '09:45:00', 'Available', 1),
(1044, 15, 102, '2025-08-12', '09:45:00', '10:00:00', 'Available', 1),
(1045, 15, 102, '2025-08-12', '10:00:00', '10:15:00', 'Available', 1),
(1046, 15, 102, '2025-08-12', '10:15:00', '10:30:00', 'Available', 1),
(1047, 15, 102, '2025-08-12', '10:30:00', '10:45:00', 'Available', 1),
(1048, 15, 102, '2025-08-12', '10:45:00', '11:00:00', 'Available', 1),
(1049, 15, 102, '2025-08-12', '11:00:00', '11:15:00', 'Available', 1),
(1050, 15, 102, '2025-08-12', '11:15:00', '11:30:00', 'Available', 1),
(1051, 15, 102, '2025-08-12', '11:30:00', '11:45:00', 'Available', 1),
(1052, 15, 102, '2025-08-12', '11:45:00', '12:00:00', 'Available', 1),
(1053, 15, 103, '2025-08-12', '13:30:00', '13:45:00', 'Available', 1),
(1054, 15, 103, '2025-08-12', '13:45:00', '14:00:00', 'Available', 1),
(1055, 15, 103, '2025-08-12', '14:00:00', '14:15:00', 'Available', 1),
(1056, 15, 103, '2025-08-12', '14:15:00', '14:30:00', 'Available', 1),
(1057, 15, 103, '2025-08-12', '14:30:00', '14:45:00', 'Available', 1),
(1058, 15, 103, '2025-08-12', '14:45:00', '15:00:00', 'Available', 1),
(1059, 15, 103, '2025-08-12', '15:00:00', '15:15:00', 'Available', 1),
(1060, 15, 103, '2025-08-12', '15:15:00', '15:30:00', 'Available', 1),
(1061, 15, 103, '2025-08-12', '15:30:00', '15:45:00', 'Available', 1),
(1062, 15, 103, '2025-08-12', '15:45:00', '16:00:00', 'Available', 1),
(1063, 15, 103, '2025-08-12', '16:00:00', '16:15:00', 'Available', 1),
(1064, 15, 103, '2025-08-12', '16:15:00', '16:30:00', 'Available', 1),
(1065, 15, 103, '2025-08-12', '16:30:00', '16:45:00', 'Available', 1),
(1066, 15, 103, '2025-08-12', '16:45:00', '17:00:00', 'Available', 1),
(1067, 15, 103, '2025-08-12', '17:00:00', '17:15:00', 'Available', 1),
(1068, 15, 103, '2025-08-12', '17:15:00', '17:30:00', 'Available', 1),
(1069, 15, 104, '2025-08-13', '07:00:00', '07:15:00', 'Available', 1),
(1070, 15, 104, '2025-08-13', '07:15:00', '07:30:00', 'Available', 1),
(1071, 15, 104, '2025-08-13', '07:30:00', '07:45:00', 'Available', 1),
(1072, 15, 104, '2025-08-13', '07:45:00', '08:00:00', 'Available', 1),
(1073, 15, 104, '2025-08-13', '08:00:00', '08:15:00', 'Available', 1),
(1074, 15, 104, '2025-08-13', '08:15:00', '08:30:00', 'Available', 1),
(1075, 15, 104, '2025-08-13', '08:30:00', '08:45:00', 'Available', 1),
(1076, 15, 104, '2025-08-13', '08:45:00', '09:00:00', 'Available', 1),
(1077, 15, 104, '2025-08-13', '09:00:00', '09:15:00', 'Available', 1),
(1078, 15, 104, '2025-08-13', '09:15:00', '09:30:00', 'Available', 1),
(1079, 15, 104, '2025-08-13', '09:30:00', '09:45:00', 'Available', 1),
(1080, 15, 104, '2025-08-13', '09:45:00', '10:00:00', 'Available', 1),
(1081, 15, 104, '2025-08-13', '10:00:00', '10:15:00', 'Available', 1),
(1082, 15, 104, '2025-08-13', '10:15:00', '10:30:00', 'Available', 1),
(1083, 15, 104, '2025-08-13', '10:30:00', '10:45:00', 'Available', 1),
(1084, 15, 104, '2025-08-13', '10:45:00', '11:00:00', 'Available', 1),
(1085, 15, 104, '2025-08-13', '11:00:00', '11:15:00', 'Available', 1),
(1086, 15, 104, '2025-08-13', '11:15:00', '11:30:00', 'Available', 1),
(1087, 15, 104, '2025-08-13', '11:30:00', '11:45:00', 'Available', 1),
(1088, 15, 104, '2025-08-13', '11:45:00', '12:00:00', 'Available', 1),
(1089, 15, 105, '2025-08-13', '13:30:00', '13:45:00', 'Available', 1),
(1090, 15, 105, '2025-08-13', '13:45:00', '14:00:00', 'Available', 1),
(1091, 15, 105, '2025-08-13', '14:00:00', '14:15:00', 'Available', 1),
(1092, 15, 105, '2025-08-13', '14:15:00', '14:30:00', 'Available', 1),
(1093, 15, 105, '2025-08-13', '14:30:00', '14:45:00', 'Available', 1),
(1094, 15, 105, '2025-08-13', '14:45:00', '15:00:00', 'Available', 1),
(1095, 15, 105, '2025-08-13', '15:00:00', '15:15:00', 'Available', 1),
(1096, 15, 105, '2025-08-13', '15:15:00', '15:30:00', 'Available', 1),
(1097, 15, 105, '2025-08-13', '15:30:00', '15:45:00', 'Available', 1),
(1098, 15, 105, '2025-08-13', '15:45:00', '16:00:00', 'Available', 1),
(1099, 15, 105, '2025-08-13', '16:00:00', '16:15:00', 'Available', 1),
(1100, 15, 105, '2025-08-13', '16:15:00', '16:30:00', 'Available', 1),
(1101, 15, 105, '2025-08-13', '16:30:00', '16:45:00', 'Available', 1),
(1102, 15, 105, '2025-08-13', '16:45:00', '17:00:00', 'Available', 1),
(1103, 15, 105, '2025-08-13', '17:00:00', '17:15:00', 'Available', 1),
(1104, 15, 105, '2025-08-13', '17:15:00', '17:30:00', 'Available', 1),
(1105, 15, 106, '2025-08-18', '07:00:00', '07:30:00', 'Available', 1),
(1106, 15, 106, '2025-08-18', '07:30:00', '08:00:00', 'Available', 1),
(1107, 15, 106, '2025-08-18', '08:00:00', '08:30:00', 'Available', 1),
(1108, 15, 106, '2025-08-18', '08:30:00', '09:00:00', 'Available', 1),
(1109, 15, 106, '2025-08-18', '09:00:00', '09:30:00', 'Available', 1),
(1110, 15, 106, '2025-08-18', '09:30:00', '10:00:00', 'Available', 1),
(1111, 15, 106, '2025-08-18', '10:00:00', '10:30:00', 'Available', 1),
(1112, 15, 106, '2025-08-18', '10:30:00', '11:00:00', 'Available', 1),
(1113, 15, 106, '2025-08-18', '11:00:00', '11:30:00', 'Available', 1),
(1114, 15, 106, '2025-08-18', '11:30:00', '12:00:00', 'Available', 1),
(1115, 15, 107, '2025-08-18', '13:30:00', '14:00:00', 'Available', 1),
(1116, 15, 107, '2025-08-18', '14:00:00', '14:30:00', 'Available', 1),
(1117, 15, 107, '2025-08-18', '14:30:00', '15:00:00', 'Available', 1),
(1118, 15, 107, '2025-08-18', '15:00:00', '15:30:00', 'Available', 1),
(1119, 15, 107, '2025-08-18', '15:30:00', '16:00:00', 'Available', 1),
(1120, 15, 107, '2025-08-18', '16:00:00', '16:30:00', 'Available', 1),
(1121, 15, 107, '2025-08-18', '16:30:00', '17:00:00', 'Available', 1),
(1122, 15, 107, '2025-08-18', '17:00:00', '17:30:00', 'Available', 1),
(1123, 15, 108, '2025-08-19', '07:00:00', '07:30:00', 'Available', 1),
(1124, 15, 108, '2025-08-19', '07:30:00', '08:00:00', 'Available', 1),
(1125, 15, 108, '2025-08-19', '08:00:00', '08:30:00', 'Available', 1),
(1126, 15, 108, '2025-08-19', '08:30:00', '09:00:00', 'Available', 1),
(1127, 15, 108, '2025-08-19', '09:00:00', '09:30:00', 'Available', 1),
(1128, 15, 108, '2025-08-19', '09:30:00', '10:00:00', 'Available', 1),
(1129, 15, 108, '2025-08-19', '10:00:00', '10:30:00', 'Available', 1),
(1130, 15, 108, '2025-08-19', '10:30:00', '11:00:00', 'Available', 1),
(1131, 15, 108, '2025-08-19', '11:00:00', '11:30:00', 'Available', 1),
(1132, 15, 108, '2025-08-19', '11:30:00', '12:00:00', 'Available', 1),
(1133, 15, 109, '2025-08-19', '13:30:00', '14:00:00', 'Available', 1),
(1134, 15, 109, '2025-08-19', '14:00:00', '14:30:00', 'Available', 1),
(1135, 15, 109, '2025-08-19', '14:30:00', '15:00:00', 'Available', 1),
(1136, 15, 109, '2025-08-19', '15:00:00', '15:30:00', 'Available', 1),
(1137, 15, 109, '2025-08-19', '15:30:00', '16:00:00', 'Available', 1),
(1138, 15, 109, '2025-08-19', '16:00:00', '16:30:00', 'Available', 1),
(1139, 15, 109, '2025-08-19', '16:30:00', '17:00:00', 'Available', 1),
(1140, 15, 109, '2025-08-19', '17:00:00', '17:30:00', 'Available', 1),
(1141, 15, 110, '2025-08-16', '07:00:00', '07:30:00', 'Available', 1),
(1142, 15, 110, '2025-08-16', '07:30:00', '08:00:00', 'Available', 1),
(1143, 15, 110, '2025-08-16', '08:00:00', '08:30:00', 'Available', 1),
(1144, 15, 110, '2025-08-16', '08:30:00', '09:00:00', 'Available', 1),
(1145, 15, 110, '2025-08-16', '09:00:00', '09:30:00', 'Available', 1),
(1146, 15, 110, '2025-08-16', '09:30:00', '10:00:00', 'Available', 1),
(1147, 15, 110, '2025-08-16', '10:00:00', '10:30:00', 'Available', 1),
(1148, 15, 110, '2025-08-16', '10:30:00', '11:00:00', 'Available', 1),
(1149, 15, 110, '2025-08-16', '11:00:00', '11:30:00', 'Available', 1),
(1150, 15, 110, '2025-08-16', '11:30:00', '12:00:00', 'Available', 1),
(1151, 15, 111, '2025-08-16', '13:30:00', '14:00:00', 'Available', 1),
(1152, 15, 111, '2025-08-16', '14:00:00', '14:30:00', 'Available', 1),
(1153, 15, 111, '2025-08-16', '14:30:00', '15:00:00', 'Available', 1),
(1154, 15, 111, '2025-08-16', '15:00:00', '15:30:00', 'Available', 1),
(1155, 15, 111, '2025-08-16', '15:30:00', '16:00:00', 'Available', 1),
(1156, 15, 111, '2025-08-16', '16:00:00', '16:30:00', 'Available', 1),
(1157, 15, 111, '2025-08-16', '16:30:00', '17:00:00', 'Available', 1),
(1158, 15, 111, '2025-08-16', '17:00:00', '17:30:00', 'Available', 1),
(1159, 15, 112, '2025-08-17', '07:00:00', '07:30:00', 'Available', 1),
(1160, 15, 112, '2025-08-17', '07:30:00', '08:00:00', 'Available', 1),
(1161, 15, 112, '2025-08-17', '08:00:00', '08:30:00', 'Available', 1),
(1162, 15, 112, '2025-08-17', '08:30:00', '09:00:00', 'Available', 1),
(1163, 15, 112, '2025-08-17', '09:00:00', '09:30:00', 'Available', 1),
(1164, 15, 112, '2025-08-17', '09:30:00', '10:00:00', 'Available', 1),
(1165, 15, 112, '2025-08-17', '10:00:00', '10:30:00', 'Available', 1),
(1166, 15, 112, '2025-08-17', '10:30:00', '11:00:00', 'Available', 1),
(1167, 15, 112, '2025-08-17', '11:00:00', '11:30:00', 'Available', 1),
(1168, 15, 112, '2025-08-17', '11:30:00', '12:00:00', 'Available', 1),
(1169, 15, 113, '2025-08-17', '13:30:00', '14:00:00', 'Available', 1),
(1170, 15, 113, '2025-08-17', '14:00:00', '14:30:00', 'Available', 1),
(1171, 15, 113, '2025-08-17', '14:30:00', '15:00:00', 'Available', 1),
(1172, 15, 113, '2025-08-17', '15:00:00', '15:30:00', 'Available', 1),
(1173, 15, 113, '2025-08-17', '15:30:00', '16:00:00', 'Available', 1),
(1174, 15, 113, '2025-08-17', '16:00:00', '16:30:00', 'Available', 1),
(1175, 15, 113, '2025-08-17', '16:30:00', '17:00:00', 'Available', 1),
(1176, 15, 113, '2025-08-17', '17:00:00', '17:30:00', 'Available', 1),
(1177, 15, 114, '2025-08-20', '07:00:00', '07:30:00', 'Available', 1),
(1178, 15, 114, '2025-08-20', '07:30:00', '08:00:00', 'Available', 1),
(1179, 15, 114, '2025-08-20', '08:00:00', '08:30:00', 'Available', 1),
(1180, 15, 114, '2025-08-20', '08:30:00', '09:00:00', 'Available', 1),
(1181, 15, 114, '2025-08-20', '09:00:00', '09:30:00', 'Available', 1),
(1182, 15, 114, '2025-08-20', '09:30:00', '10:00:00', 'Available', 1),
(1183, 15, 114, '2025-08-20', '10:00:00', '10:30:00', 'Available', 1),
(1184, 15, 114, '2025-08-20', '10:30:00', '11:00:00', 'Available', 1),
(1185, 15, 114, '2025-08-20', '11:00:00', '11:30:00', 'Available', 1),
(1186, 15, 114, '2025-08-20', '11:30:00', '12:00:00', 'Available', 1),
(1187, 15, 115, '2025-08-20', '13:30:00', '14:00:00', 'Available', 1),
(1188, 15, 115, '2025-08-20', '14:00:00', '14:30:00', 'Available', 1),
(1189, 15, 115, '2025-08-20', '14:30:00', '15:00:00', 'Available', 1),
(1190, 15, 115, '2025-08-20', '15:00:00', '15:30:00', 'Available', 1),
(1191, 15, 115, '2025-08-20', '15:30:00', '16:00:00', 'Available', 1),
(1192, 15, 115, '2025-08-20', '16:00:00', '16:30:00', 'Available', 1),
(1193, 15, 115, '2025-08-20', '16:30:00', '17:00:00', 'Available', 1),
(1194, 15, 115, '2025-08-20', '17:00:00', '17:30:00', 'Available', 1),
(1195, 15, 116, '2025-08-21', '07:00:00', '07:30:00', 'Available', 1),
(1196, 15, 116, '2025-08-21', '07:30:00', '08:00:00', 'Available', 1),
(1197, 15, 116, '2025-08-21', '08:00:00', '08:30:00', 'Available', 1),
(1198, 15, 116, '2025-08-21', '08:30:00', '09:00:00', 'Available', 1),
(1199, 15, 116, '2025-08-21', '09:00:00', '09:30:00', 'Available', 1),
(1200, 15, 116, '2025-08-21', '09:30:00', '10:00:00', 'Available', 1),
(1201, 15, 116, '2025-08-21', '10:00:00', '10:30:00', 'Available', 1),
(1202, 15, 116, '2025-08-21', '10:30:00', '11:00:00', 'Available', 1),
(1203, 15, 116, '2025-08-21', '11:00:00', '11:30:00', 'Available', 1),
(1204, 15, 116, '2025-08-21', '11:30:00', '12:00:00', 'Available', 1),
(1205, 15, 117, '2025-08-21', '13:30:00', '14:00:00', 'Available', 1),
(1206, 15, 117, '2025-08-21', '14:00:00', '14:30:00', 'Available', 1),
(1207, 15, 117, '2025-08-21', '14:30:00', '15:00:00', 'Available', 1),
(1208, 15, 117, '2025-08-21', '15:00:00', '15:30:00', 'Available', 1),
(1209, 15, 117, '2025-08-21', '15:30:00', '16:00:00', 'Available', 1),
(1210, 15, 117, '2025-08-21', '16:00:00', '16:30:00', 'Available', 1),
(1211, 15, 117, '2025-08-21', '16:30:00', '17:00:00', 'Available', 1),
(1212, 15, 117, '2025-08-21', '17:00:00', '17:30:00', 'Available', 1),
(1213, 15, 118, '2025-08-22', '07:00:00', '07:30:00', 'Available', 1),
(1214, 15, 118, '2025-08-22', '07:30:00', '08:00:00', 'Available', 1),
(1215, 15, 118, '2025-08-22', '08:00:00', '08:30:00', 'Available', 1),
(1216, 15, 118, '2025-08-22', '08:30:00', '09:00:00', 'Available', 1),
(1217, 15, 118, '2025-08-22', '09:00:00', '09:30:00', 'Available', 1),
(1218, 15, 118, '2025-08-22', '09:30:00', '10:00:00', 'Available', 1),
(1219, 15, 118, '2025-08-22', '10:00:00', '10:30:00', 'Available', 1),
(1220, 15, 118, '2025-08-22', '10:30:00', '11:00:00', 'Available', 1),
(1221, 15, 118, '2025-08-22', '11:00:00', '11:30:00', 'Available', 1),
(1222, 15, 118, '2025-08-22', '11:30:00', '12:00:00', 'Available', 1),
(1223, 15, 119, '2025-08-22', '13:30:00', '14:00:00', 'Available', 1),
(1224, 15, 119, '2025-08-22', '14:00:00', '14:30:00', 'Available', 1),
(1225, 15, 119, '2025-08-22', '14:30:00', '15:00:00', 'Available', 1),
(1226, 15, 119, '2025-08-22', '15:00:00', '15:30:00', 'Available', 1),
(1227, 15, 119, '2025-08-22', '15:30:00', '16:00:00', 'Available', 1),
(1228, 15, 119, '2025-08-22', '16:00:00', '16:30:00', 'Available', 1),
(1229, 15, 119, '2025-08-22', '16:30:00', '17:00:00', 'Available', 1),
(1230, 15, 119, '2025-08-22', '17:00:00', '17:30:00', 'Available', 1),
(1231, 15, 120, '2025-08-23', '07:00:00', '07:30:00', 'Available', 1),
(1232, 15, 120, '2025-08-23', '07:30:00', '08:00:00', 'Available', 1),
(1233, 15, 120, '2025-08-23', '08:00:00', '08:30:00', 'Available', 1),
(1234, 15, 120, '2025-08-23', '08:30:00', '09:00:00', 'Available', 1),
(1235, 15, 120, '2025-08-23', '09:00:00', '09:30:00', 'Available', 1),
(1236, 15, 120, '2025-08-23', '09:30:00', '10:00:00', 'Available', 1),
(1237, 15, 120, '2025-08-23', '10:00:00', '10:30:00', 'Available', 1),
(1238, 15, 120, '2025-08-23', '10:30:00', '11:00:00', 'Available', 1),
(1239, 15, 120, '2025-08-23', '11:00:00', '11:30:00', 'Available', 1),
(1240, 15, 120, '2025-08-23', '11:30:00', '12:00:00', 'Available', 1),
(1241, 15, 121, '2025-08-23', '13:30:00', '14:00:00', 'Available', 1),
(1242, 15, 121, '2025-08-23', '14:00:00', '14:30:00', 'Available', 1),
(1243, 15, 121, '2025-08-23', '14:30:00', '15:00:00', 'Available', 1),
(1244, 15, 121, '2025-08-23', '15:00:00', '15:30:00', 'Available', 1),
(1245, 15, 121, '2025-08-23', '15:30:00', '16:00:00', 'Available', 1),
(1246, 15, 121, '2025-08-23', '16:00:00', '16:30:00', 'Available', 1),
(1247, 15, 121, '2025-08-23', '16:30:00', '17:00:00', 'Available', 1),
(1248, 15, 121, '2025-08-23', '17:00:00', '17:30:00', 'Available', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `doctor_work_shifts`
--

CREATE TABLE `doctor_work_shifts` (
  `id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `work_date` date NOT NULL,
  `shift_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Ví dụ: Ca sáng, Ca chiều',
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` enum('Active','Cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Active' COMMENT 'Trạng thái của cả ca làm việc',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `doctor_work_shifts`
--

INSERT INTO `doctor_work_shifts` (`id`, `doctor_id`, `work_date`, `shift_name`, `start_time`, `end_time`, `status`, `created_at`, `updated_at`) VALUES
(64, 15, '2025-07-16', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-07-16 02:54:04', '2025-07-16 02:54:04'),
(65, 15, '2025-07-16', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-07-16 02:54:07', '2025-07-16 02:54:07'),
(66, 19, '2025-07-16', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-07-16 04:30:29', '2025-07-16 04:30:29'),
(67, 19, '2025-07-16', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-07-16 04:30:30', '2025-07-16 04:30:30'),
(68, 19, '2025-07-19', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-07-19 14:28:22', '2025-07-19 14:28:22'),
(69, 20, '2025-07-19', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-07-19 14:41:51', '2025-07-19 14:41:51'),
(70, 20, '2025-07-19', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-07-19 14:41:52', '2025-07-19 14:41:52'),
(71, 15, '2025-07-19', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-07-19 14:45:40', '2025-07-19 14:45:40'),
(72, 15, '2025-07-19', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-07-19 14:45:42', '2025-07-19 14:45:42'),
(73, 15, '2025-07-22', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-07-22 08:38:09', '2025-07-22 08:38:09'),
(74, 15, '2025-07-23', 'Ca chiều', '13:30:00', '17:30:00', 'Cancelled', '2025-07-23 09:01:48', '2025-07-23 09:02:13'),
(75, 15, '2025-07-24', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-07-24 05:46:53', '2025-07-24 05:46:53'),
(76, 22, '2025-07-26', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-07-26 02:41:15', '2025-07-26 02:41:15'),
(77, 22, '2025-07-26', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-07-26 02:41:16', '2025-07-26 02:41:16'),
(78, 22, '2025-08-01', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-07-31 14:04:35', '2025-07-31 14:04:35'),
(79, 22, '2025-08-01', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-07-31 14:04:35', '2025-07-31 14:04:35'),
(80, 15, '2025-08-01', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-01 01:10:16', '2025-08-01 01:10:16'),
(81, 15, '2025-08-01', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-01 01:10:17', '2025-08-01 01:10:17'),
(82, 15, '2025-08-02', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-01 01:12:19', '2025-08-01 01:12:19'),
(83, 15, '2025-08-03', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-01 01:13:03', '2025-08-01 01:13:03'),
(84, 15, '2025-08-03', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-01 01:13:39', '2025-08-01 01:13:39'),
(85, 15, '2025-08-04', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-01 01:26:18', '2025-08-01 01:26:18'),
(86, 15, '2025-08-04', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-01 01:26:21', '2025-08-01 01:26:21'),
(87, 15, '2025-08-05', 'Ca sáng', '07:00:00', '12:00:00', 'Cancelled', '2025-08-05 15:03:27', '2025-08-05 16:17:36'),
(88, 15, '2025-08-05', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-05 15:03:28', '2025-08-05 15:03:28'),
(89, 15, '2025-08-06', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-05 16:17:24', '2025-08-05 16:17:24'),
(90, 15, '2025-08-06', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-05 16:17:25', '2025-08-05 16:17:25'),
(91, 15, '2025-08-05', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-05 16:17:43', '2025-08-05 16:17:43'),
(92, 15, '2025-08-07', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-06 15:11:58', '2025-08-06 15:11:58'),
(93, 15, '2025-08-07', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-06 15:11:58', '2025-08-06 15:11:58'),
(94, 15, '2025-08-08', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-06 15:12:03', '2025-08-06 15:12:03'),
(95, 15, '2025-08-08', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-06 15:12:04', '2025-08-06 15:12:04'),
(96, 15, '2025-08-09', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-06 15:12:08', '2025-08-06 15:12:08'),
(97, 15, '2025-08-09', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-06 15:12:08', '2025-08-06 15:12:08'),
(98, 15, '2025-08-10', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-06 15:12:13', '2025-08-06 15:12:13'),
(99, 15, '2025-08-10', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-06 15:12:14', '2025-08-06 15:12:14'),
(100, 15, '2025-08-11', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-09 08:41:14', '2025-08-09 08:41:14'),
(101, 15, '2025-08-11', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-09 08:41:15', '2025-08-09 08:41:15'),
(102, 15, '2025-08-12', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-09 08:41:19', '2025-08-09 08:41:19'),
(103, 15, '2025-08-12', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-09 08:41:21', '2025-08-09 08:41:21'),
(104, 15, '2025-08-13', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-09 08:41:26', '2025-08-09 08:41:26'),
(105, 15, '2025-08-13', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-09 08:41:26', '2025-08-09 08:41:26'),
(106, 15, '2025-08-18', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-15 14:29:11', '2025-08-15 14:29:11'),
(107, 15, '2025-08-18', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-15 14:29:12', '2025-08-15 14:29:12'),
(108, 15, '2025-08-19', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-15 14:29:37', '2025-08-15 14:29:37'),
(109, 15, '2025-08-19', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-15 14:29:38', '2025-08-15 14:29:38'),
(110, 15, '2025-08-16', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-16 02:42:19', '2025-08-16 02:42:19'),
(111, 15, '2025-08-16', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-16 02:42:20', '2025-08-16 02:42:20'),
(112, 15, '2025-08-17', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-16 02:42:25', '2025-08-16 02:42:25'),
(113, 15, '2025-08-17', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-16 02:42:26', '2025-08-16 02:42:26'),
(114, 15, '2025-08-20', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-16 02:42:37', '2025-08-16 02:42:37'),
(115, 15, '2025-08-20', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-16 02:42:37', '2025-08-16 02:42:37'),
(116, 15, '2025-08-21', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-16 02:42:41', '2025-08-16 02:42:41'),
(117, 15, '2025-08-21', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-16 02:42:41', '2025-08-16 02:42:41'),
(118, 15, '2025-08-22', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-16 02:42:45', '2025-08-16 02:42:45'),
(119, 15, '2025-08-22', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-16 02:42:46', '2025-08-16 02:42:46'),
(120, 15, '2025-08-23', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-19 02:43:21', '2025-08-19 02:43:21'),
(121, 15, '2025-08-23', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-19 02:43:21', '2025-08-19 02:43:21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `medical_records`
--

CREATE TABLE `medical_records` (
  `id` int NOT NULL,
  `appointment_id` int DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `temperature` decimal(4,1) DEFAULT NULL COMMENT 'Nhiệt độ (°C)',
  `blood_pressure` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Huyết áp (mmHg)',
  `heart_rate` int DEFAULT NULL COMMENT 'Nhịp tim (lần/phút)',
  `weight` decimal(5,2) DEFAULT NULL COMMENT 'Cân nặng (kg)',
  `height` decimal(5,2) DEFAULT NULL COMMENT 'Chiều cao (cm)',
  `symptoms` json DEFAULT NULL COMMENT 'Danh sách triệu chứng',
  `allergies` json DEFAULT NULL COMMENT 'Danh sách dị ứng',
  `medications` json DEFAULT NULL COMMENT 'Danh sách thuốc đang dùng',
  `diagnosis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `recommendations` text COLLATE utf8mb4_general_ci COMMENT 'Khuyến nghị và hướng dẫn',
  `follow_up_date` date DEFAULT NULL COMMENT 'Ngày tái khám',
  `status` enum('draft','completed') COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Trạng thái hồ sơ',
  `treatment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `medical_records`
--

INSERT INTO `medical_records` (`id`, `appointment_id`, `doctor_id`, `patient_id`, `temperature`, `blood_pressure`, `heart_rate`, `weight`, `height`, `symptoms`, `allergies`, `medications`, `diagnosis`, `recommendations`, `follow_up_date`, `status`, `treatment`, `notes`, `created_at`, `updated_at`) VALUES
(15, 82, 15, 15, 34.0, '112', 67, 43.00, 153.00, '[\"Sốt\"]', '[\"Không có\"]', '[\"Không có\"]', 'abc', 'xyz', NULL, 'completed', 'thuốc', 'ko sao', '2025-08-23 13:39:55', '2025-08-23 06:54:11');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_settings`
--

CREATE TABLE `payment_settings` (
  `id` int NOT NULL,
  `bank_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `account_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `account_holder` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `token_auto` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `payment_settings`
--

INSERT INTO `payment_settings` (`id`, `bank_name`, `account_number`, `account_holder`, `token_auto`, `description`, `created_at`, `updated_at`) VALUES
(1, 'ACB', '16087671', 'NGUYEN VAN CHINH', 'ce3879696bb703e2149e84f15e05a148', 'acbbank', '2025-07-26 05:59:47', '2025-07-29 05:49:55');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `prescriptions`
--

CREATE TABLE `prescriptions` (
  `id` int NOT NULL,
  `appointment_id` int DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `prescriptions`
--

INSERT INTO `prescriptions` (`id`, `appointment_id`, `doctor_id`, `customer_id`, `created_at`) VALUES
(1, 1, 1, 1, '2025-06-07 14:02:51'),
(2, 2, 2, 2, '2025-06-07 14:02:51');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `prescription_items`
--

CREATE TABLE `prescription_items` (
  `id` int NOT NULL,
  `prescription_id` int DEFAULT NULL,
  `dosage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `duration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `prescription_items`
--

INSERT INTO `prescription_items` (`id`, `prescription_id`, `dosage`, `duration`) VALUES
(1, 1, '2 viên/ngày', '5 ngày'),
(2, 2, '1 viên/ngày', '7 ngày');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ratings`
--

CREATE TABLE `ratings` (
  `id` int NOT NULL,
  `customer_id` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` datetime DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `appointment_id` int DEFAULT NULL,
  `status` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'pending' COMMENT 'Trạng thái duyệt: pending=chờ duyệt, approved=đã duyệt, rejected=từ chối'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ratings`
--

INSERT INTO `ratings` (`id`, `customer_id`, `rating`, `comment`, `created_at`, `doctor_id`, `appointment_id`, `status`) VALUES
(16, 15, 4, 'tốt', '2025-08-18 20:32:58', 15, 77, 'approved'),
(17, 15, 5, 'ok', '2025-08-23 10:07:40', 15, 81, 'approved');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `role`
--

CREATE TABLE `role` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'Admin'),
(2, 'Customer'),
(3, 'Doctor');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `specializations`
--

CREATE TABLE `specializations` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` decimal(10,0) DEFAULT '0' COMMENT 'Giá khám cho chuyên khoa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `specializations`
--

INSERT INTO `specializations` (`id`, `name`, `image`, `price`) VALUES
(1, 'Nội khoa', '/uploads/1750666911605-cÃ´ng ty tÃ i chÃ­nh.png', 10000),
(2, 'Da liễu', '/uploads/1750609299162-screenshot_1749730713.png', 100000),
(3, 'Tai mũi họng', '/uploads/1750609326029-screenshot_1749730713.png', 100000),
(4, 'Khoa tim mạch', '/uploads/1750609612105-z6609834095121_c248e82fc8056b10772f73afbfb4e383.jpg', 123000),
(5, 'Khoa thần kinh', '/uploads/1750640552483-z6584497856600_8fe061a3a4c6e0b9011a5a8abe90e204.jpg', 100000),
(6, 'Khoa xương khớp', '/uploads/1750641125578-screenshot_1749733441.png', 456000),
(7, 'Tai mũi họng', '/uploads/1750667705054-screenshot_1749733441.png', 100000),
(8, 'Mắt', '/uploads/1750667714069-cÃ´ng ty tÃ i chÃ­nh.png', 450000),
(9, 'Khoa tiêu hóa', NULL, 456000),
(10, 'Khoa hô hấp', NULL, 250000);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- Chỉ mục cho bảng `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `appointments_ibfk_time_slot` (`time_slot_id`),
  ADD KEY `fk_appointments_customers` (`customer_id`),
  ADD KEY `idx_transaction_id` (`transaction_id`),
  ADD KEY `idx_payment_date` (`payment_date`);

--
-- Chỉ mục cho bảng `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Chỉ mục cho bảng `chat_rooms`
--
ALTER TABLE `chat_rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `assigned_doctor_id` (`assigned_doctor_id`);

--
-- Chỉ mục cho bảng `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- Chỉ mục cho bảng `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `fk_doctors_specialization` (`specialization_id`);

--
-- Chỉ mục cho bảng `doctor_time_slot`
--
ALTER TABLE `doctor_time_slot`
  ADD PRIMARY KEY (`id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `fk_slot_to_shift` (`work_shift_id`);

--
-- Chỉ mục cho bảng `doctor_work_shifts`
--
ALTER TABLE `doctor_work_shifts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Chỉ mục cho bảng `medical_records`
--
ALTER TABLE `medical_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointment_id` (`appointment_id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `customer_id` (`patient_id`),
  ADD KEY `idx_appointment` (`appointment_id`),
  ADD KEY `idx_doctor` (`doctor_id`),
  ADD KEY `idx_patient` (`patient_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Chỉ mục cho bảng `payment_settings`
--
ALTER TABLE `payment_settings`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointment_id` (`appointment_id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Chỉ mục cho bảng `prescription_items`
--
ALTER TABLE `prescription_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `prescription_id` (`prescription_id`);

--
-- Chỉ mục cho bảng `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_appointment_review` (`appointment_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `fk_ratings_doctor` (`doctor_id`);

--
-- Chỉ mục cho bảng `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `specializations`
--
ALTER TABLE `specializations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT cho bảng `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `chat_rooms`
--
ALTER TABLE `chat_rooms`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT cho bảng `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT cho bảng `doctor_time_slot`
--
ALTER TABLE `doctor_time_slot`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1249;

--
-- AUTO_INCREMENT cho bảng `doctor_work_shifts`
--
ALTER TABLE `doctor_work_shifts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT cho bảng `medical_records`
--
ALTER TABLE `medical_records`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `payment_settings`
--
ALTER TABLE `payment_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `prescriptions`
--
ALTER TABLE `prescriptions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `prescription_items`
--
ALTER TABLE `prescription_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `role`
--
ALTER TABLE `role`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `specializations`
--
ALTER TABLE `specializations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

--
-- Các ràng buộc cho bảng `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`),
  ADD CONSTRAINT `appointments_ibfk_time_slot` FOREIGN KEY (`time_slot_id`) REFERENCES `doctor_time_slot` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_appointments_customers` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `chat_rooms`
--
ALTER TABLE `chat_rooms`
  ADD CONSTRAINT `chat_rooms_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `chat_rooms_ibfk_2` FOREIGN KEY (`assigned_doctor_id`) REFERENCES `doctors` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

--
-- Các ràng buộc cho bảng `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  ADD CONSTRAINT `fk_doctors_specialization` FOREIGN KEY (`specialization_id`) REFERENCES `specializations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `doctor_time_slot`
--
ALTER TABLE `doctor_time_slot`
  ADD CONSTRAINT `doctor_time_slot_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_slot_to_shift` FOREIGN KEY (`work_shift_id`) REFERENCES `doctor_work_shifts` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `doctor_work_shifts`
--
ALTER TABLE `doctor_work_shifts`
  ADD CONSTRAINT `fk_work_shifts_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
