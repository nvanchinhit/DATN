-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th8 02, 2025 lúc 02:31 AM
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

INSERT INTO `appointments` (`id`, `name`, `age`, `gender`, `email`, `phone`, `customer_id`, `doctor_id`, `reason`, `payment_status`, `payment_method`, `transaction_id`, `paid_amount`, `payment_date`, `time_slot_id`, `status`, `is_reviewed`, `address`, `doctor_confirmation`, `doctor_note`, `diagnosis`, `follow_up_date`, `is_examined`) VALUES
(1, 'Nguyễn Văn A', 32, 'Nam', 'a@gmail.com', '0123456789', NULL, 1, 'Khám tổng quát', 'Đã thanh toán', 'cash', NULL, 0.00, NULL, NULL, 'Chưa xác nhận', 0, NULL, 'Chưa xác nhận', NULL, NULL, NULL, 0),
(2, 'Trần Thị B', 28, 'Nữ', 'b@gmail.com', '0987654321', NULL, 2, 'Nổi mẩn da', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, NULL, 'Chưa xác nhận', 0, NULL, 'Chưa xác nhận', NULL, NULL, NULL, 0),
(35, 'LÊ CÔNG TUẤN', 22, 'Nam', 'tuanlcpd10779@gmail.com', '0342907002', 3, 15, 'r32w2er2', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, NULL, 'Đã xác nhận', 0, 'k47 nguyễn lương bằng', 'Chưa xác nhận', NULL, NULL, NULL, 0),
(39, 'LÊ CÔNG TUẤN', 24, 'Nam', 'tuanlcpd10779@gmail.com', '0342907002', 3, 15, 'qffedgfa nê', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, NULL, 'Chưa xác nhận', 0, 'k47 nguyễn lương bằng', 'Chưa xác nhận', NULL, NULL, NULL, 0),
(43, 'Le van a', 22, 'Nam', 'huyensoaicavip@gmail.com', '0988842674', 3, 15, 'fsdfddf', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, NULL, 'Đã xác nhận', 0, ' 04 yet keu', 'Chưa xác nhận', NULL, NULL, NULL, 0),
(61, 'LÊ CÔNG TUẤN', 22, 'Nam', 'tuanlcpd10779@gmail.com', '0342907002', 3, 15, 'stessg', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, 715, 'Đã xác nhận', 0, 'tẻt', 'Chưa xác nhận', NULL, NULL, NULL, 0),
(62, 'LÊ CÔNG TUẤN', 22, 'Nam', 'tuanlcpd10779@gmail.com', '0342907002', 3, 15, 'ykkk', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, 752, 'Từ chối', 0, 'k47 nguyễn lương bằng', 'Chưa xác nhận', NULL, NULL, NULL, 0),
(63, 'Hà Thị Dung', 21, 'Nữ', 'dunghtpd09940@gmail.com', '0987123456', 15, 15, 'mệt', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, 716, 'Đã khám xong', 0, 'Hà Tĩnh', 'Chưa xác nhận', 'nghỉ ngơi đầy đủ', NULL, NULL, 1),
(64, 'Hà Thị Trang', 22, 'Nữ', 'hathidung1502@gmail.com', '0342907002', 15, 15, 'đau đầu', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, 725, 'Đã khám xong', 0, 'Cẩm Xuyên', 'Chưa xác nhận', 'bổ sung sắt', NULL, NULL, 1);

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
(15, 'Hà Thị Dung', 'dunghtpd09940@gmail.com', '$2b$10$AyR79QL/wQ8DypS8MIi7AO02noZ2AlIy7T/DBYF95IYKReiVfem/G', '0987123456', 'Nữ', '2025-07-15', 'Thôn Hưng Thắng, Xã Cẩm Hưng, Huyện Cẩm Xuyên, Tỉnh Hà Tĩnh', '/uploads/1753173855667-1751948084832-sticker-facebook.gif', 1, NULL, 2),
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
(15, 'Đặng Tất Cường', '0342907002', 'tuanlcpd10779@gmail.com', '$2b$10$mPBcduGUFPdbQ7evOhdXvuAEwyYdneq6T1sf8VWj3iAR0U6Lz6AGK', 1, '1751992740181-small_28_02_2019_09_02_38_828416_jpeg_5ee29e2e57.jpg', 'GS. TS. Anh hùng lao động Đỗ Tất Cường có kinh nghiệm về lĩnh vực ghép tạng (ghép thận, ghép gan, ghép tim). Hiện là Phó Tổng Giám đốc phụ trách đối ngoại Hệ thống Y tế Vinmec kiêm cố vấn khoa Nội - Bệnh viện ĐKQT Vinmec Times City', '1752541544184-Screenshot 2025-06-22 210430.png', '1751992740185-Cream Bordered Appreciation Certificate.png', 'Công tác tại Khoa Hồi sức cấp cứu tại Bệnh viện 103 - Học viện Quân y a\r\nPhó Giám đốc Bệnh viện Quân y 103\r\nPhó Tổng Giám đốc phụ trách đối ngoại Hệ thống Y tế Vinmec kiêm cố vấn khoa Nội - Bệnh viện ĐKQT Vinmec Times City\r\n\r\n', 'active', 3, ' Trường Đại học Y Hà Nội', '5.0', '1972-02-27', 'TS – Tiến sĩ Y học', ' Bộ y tế', 'P101'),
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
(760, 15, 86, '2025-08-04', '16:30:00', '17:30:00', 'Available', 1);

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
(86, 15, '2025-08-04', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-01 01:26:21', '2025-08-01 01:26:21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `medical_records`
--

CREATE TABLE `medical_records` (
  `id` int NOT NULL,
  `appointment_id` int DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `diagnosis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `treatment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `medical_records`
--

INSERT INTO `medical_records` (`id`, `appointment_id`, `doctor_id`, `customer_id`, `diagnosis`, `treatment`, `notes`, `created_at`) VALUES
(9, 63, 15, 15, 'bthg', NULL, NULL, '2025-08-01 13:09:38'),
(10, 64, 15, 15, 'thiếu máu', NULL, NULL, '2025-08-01 15:26:25');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `customer_id` int DEFAULT NULL,
  `order_date` datetime DEFAULT NULL,
  `status` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `payment_status` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `customer_id`, `order_date`, `status`, `total_amount`, `payment_status`) VALUES
(1, 1, '2025-06-07 14:02:51', 'Đã giao', 40000.00, 'Đã thanh toán'),
(2, 2, '2025-06-07 14:02:51', 'Đang xử lý', 25000.00, 'Chưa thanh toán');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_details`
--

CREATE TABLE `order_details` (
  `id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_details`
--

INSERT INTO `order_details` (`id`, `order_id`, `quantity`, `price`) VALUES
(1, 1, 1, 15000.00),
(2, 1, 1, 25000.00),
(3, 2, 1, 25000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
--

CREATE TABLE `payments` (
  `id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `method` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `method`, `status`, `payment_date`) VALUES
(1, 1, 'Tiền mặt', 'Đã thanh toán', '2025-06-07 14:02:51'),
(2, 2, 'Chuyển khoản', 'Chờ thanh toán', NULL);

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
  `appointment_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ratings`
--

INSERT INTO `ratings` (`id`, `customer_id`, `rating`, `comment`, `created_at`, `doctor_id`, `appointment_id`) VALUES
(1, 1, 5, 'Rất tốt!', '2025-06-07 14:02:51', NULL, NULL),
(2, 2, 4, 'Chất lượng ổn.', '2025-06-07 14:02:51', NULL, NULL),
(5, 15, 4, 'bs nhiệt tình', '2025-07-23 23:23:48', 19, NULL),
(10, 15, 2, 'kkkkkkkk', '2025-07-23 23:40:23', 15, 44),
(11, 15, 4, 'tốt', '2025-07-24 14:00:09', 15, 50),
(12, 15, 5, 'Bs tận tâm', '2025-08-01 13:07:40', 15, 63);

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
(1, 'Nội khoa', '/uploads/1750666911605-cÃ´ng ty tÃ i chÃ­nh.png', 100000),
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
  ADD KEY `customer_id` (`customer_id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Chỉ mục cho bảng `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Chỉ mục cho bảng `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=761;

--
-- AUTO_INCREMENT cho bảng `doctor_work_shifts`
--
ALTER TABLE `doctor_work_shifts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT cho bảng `medical_records`
--
ALTER TABLE `medical_records`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
