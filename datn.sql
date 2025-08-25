-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th8 25, 2025 lúc 05:49 AM
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
  `is_examined` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `appointments`
--

INSERT INTO `appointments` (`id`, `name`, `age`, `gender`, `email`, `phone`, `customer_id`, `doctor_id`, `reason`, `payment_status`, `payment_method`, `transaction_id`, `paid_amount`, `payment_date`, `time_slot_id`, `status`, `reject_reason`, `is_reviewed`, `address`, `doctor_confirmation`, `is_examined`) VALUES
(83, 'Hà Thị Dung', 21, 'Nữ', 'dunghtpd09940@gmail.com', '0987123456', 15, 15, 'Đau đầu', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, 1258, 'Đã khám xong', NULL, 0, 'Thôn Hưng Thắng, Xã Cẩm Hưng, Huyện Cẩm Xuyên, Tỉnh Hà Tĩnh', 'Chưa xác nhận', 0),
(84, 'Hà Thị Dung', 19, 'Nữ', 'dunghtpd09940@gmail.com', '0987123456', 15, 28, 'Đau chân', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, 1367, 'Đang khám', NULL, 0, 'Cẩm Thịnh', 'Chưa xác nhận', 0),
(85, 'Hà Thị Trang', 42, 'Nữ', 'dunghtpd09940@gmail.com', '0987123456', 15, 23, 'Ngứa ngoài da', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, 1690, 'Chưa xác nhận', NULL, 0, 'Cẩm Xuyên', 'Chưa xác nhận', 0),
(86, 'Trần Đình Long', 21, 'Nam', 'dunghtpd09940@gmail.com', '0989745832', 15, 15, '', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, 1265, 'Đã hủy', NULL, 0, 'Hà Tĩnh', 'Chưa xác nhận', 0),
(87, 'Trần Văn Đạt', 25, 'Nam', 'dunghtpd09940@gmail.com', '0987123489', 15, 26, 'Đau tai', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, 1585, 'Đã xác nhận', NULL, 0, 'Kì Anh', 'Chưa xác nhận', 0),
(88, 'LÊ CÔNG TUẤN', 21, 'Nam', 'tuanlcpd10779@gmail.com', '0342907002', 3, 15, '', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, 1262, 'Đã khám xong', NULL, 0, 'Hà Tĩnh', 'Chưa xác nhận', 0),
(89, 'LÊ CÔNG TUẤN', 19, 'Nam', 'tuanlcpd10779@gmail.com', '0342907002', 3, 23, 'Ngứa ngoài da', 'Chưa thanh toán', 'cash', NULL, 0.00, NULL, 1695, 'Chưa xác nhận', NULL, 0, 'Cẩm Xuyên', 'Chưa xác nhận', 0);

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
(8, 31, 15, 'customer', 'Xin chào bác sĩ', '2025-08-25 11:18:59'),
(9, 31, 15, 'doctor', 'Qúy khách cần hỗ trợ về vấn đề gì ạ', '2025-08-25 11:22:51');

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
(31, 15, 15, '2025-08-25 08:54:33', '2025-08-25 11:22:51'),
(48, 3, NULL, '2025-08-25 10:34:57', '2025-08-25 10:34:57');

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
(3, 'LÊ CÔNG TUẤN', 'tuanlcpd10779@gmail.com', '$2b$10$YPtKLl4SwNUWh9yzJ467se6e.1WI8MBQl2Qo1ugImzJsKEK0TKfr6', '0342907002', 'Nam', '2025-08-14', 'k47 nguyễn lương bằng', NULL, 1, NULL, 2),
(15, 'Hà Thị Dung', 'dunghtpd09940@gmail.com', '$2b$10$sc/qnOX0gEWm/oWb2PxlOem1by/AWvx9DQSs0N0WxE6Jxy4.YVLkS', '0987123456', 'Nữ', '2024-02-15', 'Thôn Hưng Thắng, Xã Cẩm Hưng, Huyện Cẩm Xuyên, Tỉnh Hà Tĩnh', '/uploads/1753173855667-1751948084832-sticker-facebook.gif', 1, NULL, 2),
(16, 'Nguyễn Văn Chính', 'vanchinh20055@gmail.com', '$2b$10$l77j3QTiFw/6PG8rZtrrn.a3JUV7IMXaxi5ohre55oXyM3PcAMcca', '0335942740', 'Nam', '2005-12-27', NULL, NULL, 1, NULL, 2),
(22, 'Hà  Huyền Trang', 'hadung150205@gmail.com', '$2b$10$8PjflRC.d5iCgWKI7av3Z..J8BDYOUkOiIvUwfKJLkW/RfVAdIN3S', '0987123456', NULL, NULL, NULL, NULL, 0, NULL, 2);

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
(15, 'Đặng Tất Cường', '0342907002', 'tuanlcpd10779@gmail.com', '$2b$10$XK4ydmUKNB1KHvLkJBRI2eHwaeJHddBdXTIDw71eFn01yOmYFvPkS', 1, '1756093167249-trÆ°á»ng.jpg', 'GS. TS. Anh hùng lao động Đỗ Tất Cường có kinh nghiệm về lĩnh vực ghép tạng (ghép thận, ghép gan, ghép tim). Hiện là Phó Tổng Giám đốc phụ trách đối ngoại Hệ thống Y tế Vinmec kiêm cố vấn khoa Nội - Bệnh viện ĐKQT Vinmec Times City', '1756098836349-dáº·ng táº¥t cÆ°á»ng.png', '1756093167251-1751994164323-Cream Bordered Appreciation Certificate.png', 'Công tác tại Khoa Hồi sức cấp cứu tại Bệnh viện 103 - Học viện Quân y a\r\nPhó Giám đốc Bệnh viện Quân y 103\r\nPhó Tổng Giám đốc phụ trách đối ngoại Hệ thống Y tế Vinmec kiêm cố vấn khoa Nội - Bệnh viện ĐKQT Vinmec Times City\r\n\r\n', 'active', 3, ' Trường Đại học Y Hà Nội', '5.0', '1972-02-25', 'TS – Tiến sĩ Y học', 'Bộ Y Tế', 'P105'),
(23, 'Nguyễn Văn Nam', '0901234567', 'dunghtpd09940@gmail.com', '$2b$10$aWBzDKqSa93.wr4lh6tRseOxcKq9MsjjwMoNOw4.XgSNDhASqCENS', 2, '1756090163416-bs nam.jpg', 'Tôi là Nguyễn Văn Nam, hiện đang công tác trong chuyên khoa Da liễu. Với niềm đam mê và sự tận tâm đối với nghề y, tôi luôn nỗ lực mang đến cho bệnh nhân những phương pháp điều trị an toàn, hiệu quả và phù hợp nhất. Tôi đặc biệt quan tâm đến việc kết hợp giữa chuyên môn và sự thấu hiểu tâm lý, giúp bệnh nhân cảm thấy yên tâm và tin tưởng trong suốt quá trình điều trị.\r\n\r\nTrong công việc, tôi chú trọng tính kỷ luật, chính xác và tinh thần trách nhiệm cao. Bên cạnh đó, tôi không ngừng học hỏi, cập nhật kiến thức mới về y học da liễu, các công nghệ điều trị hiện đại để nâng cao chất lượng khám chữa bệnh. Tôi tin rằng thái độ tận tâm, cùng sự chuyên nghiệp sẽ là nền tảng vững chắc để đem lại kết quả điều trị tốt nhất cho bệnh nhân.', '1756090163416-cc hÃ nh nghá».png', '1756090163416-áº£nh báº±ng.jpg', 'Khám và điều trị: Có kinh nghiệm trong việc chẩn đoán và điều trị các bệnh da liễu phổ biến như viêm da cơ địa, viêm da dị ứng, mụn trứng cá, nám da, nấm da, sùi mào gà, zona, vảy nến…\r\n\r\nThủ thuật da liễu: Thành thạo các thủ thuật chuyên khoa như laser điều trị sẹo, tẩy nốt ruồi, đốt điện, tiêm filler, peel da, điều trị sẹo rỗ, lăn kim, PRP…\r\n\r\nChăm sóc và thẩm mỹ da: Có kinh nghiệm tư vấn, xây dựng liệu trình chăm sóc da phù hợp cho từng loại da và từng đối tượng bệnh nhân.\r\n\r\nThiết bị y tế: Am hiểu và sử dụng thành thạo các thiết bị công nghệ cao trong chuyên ngành da liễu như laser CO2 fractional, IPL, RF, Hifu…\r\n\r\nKỹ năng mềm: Khả năng giao tiếp tốt, lắng nghe bệnh nhân, làm việc nhóm hiệu quả, phối hợp với các khoa khác để đưa ra phác đồ toàn diện.\r\n\r\nNghiên cứu & đào tạo: Tham gia các hội thảo, khóa đào tạo chuyên ngành da liễu, thường xuyên cập nhật kiến thức y khoa mới và hướng dẫn thực tập sinh, đồng nghiệp trẻ.', 'active', 3, 'Đại Học FPT', '3.7', '2020-02-25', 'Xuất Sắc', 'Bộ Y Tế', NULL),
(24, 'Trần Văn Trường', NULL, 'chinhnvpd10204@gmail.com', '$2b$10$KgwzH4Y4dVB5aOGLiV55MuhvAdYdezRSTDfC64yNA2pnvtA96Ovfm', 5, NULL, NULL, NULL, NULL, NULL, 'inactive', 3, NULL, NULL, NULL, NULL, NULL, NULL),
(25, 'Trần Đình Long', '0823162638', 'hadung150205@gmail.com', '$2b$10$LKVLgptLLpouoVRiJ7Kg8OfusCbX5ZRwQYF1JZ8ElRJKqVv9Bi9ui', 7, '1756089099317-long.jpg', 'Tôi là Trần Đình Long, một kỹ thuật viên xét nghiệm y học với niềm đam mê trong lĩnh vực chăm sóc sức khỏe và nghiên cứu y khoa. Trong quá trình học tập và làm việc, tôi luôn đặt yếu tố chính xác – nhanh chóng – an toàn làm tiêu chí hàng đầu, bởi tôi hiểu rằng kết quả xét nghiệm là cơ sở quan trọng để bác sĩ chẩn đoán và đưa ra phác đồ điều trị hiệu quả cho bệnh nhân.\r\n\r\nTôi có tinh thần trách nhiệm cao, tính kỷ luật trong công việc và khả năng làm việc nhóm tốt. Bên cạnh đó, tôi cũng luôn chủ động trau dồi kiến thức, cập nhật những kỹ thuật mới trong lĩnh vực xét nghiệm để phục vụ cho công tác chuyên môn. Tôi tin rằng sự tận tâm và thái độ nghiêm túc trong nghề sẽ góp phần mang lại niềm tin cho bệnh nhân và uy tín cho cơ sở y tế.', '1756089099318-chá»©ng chá».png', '1756089099318-báº±ng.jpg', 'Thực hiện xét nghiệm: Có kinh nghiệm nhiều năm trong việc thực hiện các xét nghiệm huyết học, sinh hóa, miễn dịch, vi sinh và ký sinh trùng. Am hiểu quy trình lấy mẫu, xử lý, phân tích và trả kết quả, đảm bảo độ chính xác và tuân thủ quy định an toàn sinh học.\r\n\r\nSử dụng thiết bị y tế: Thành thạo vận hành các máy xét nghiệm hiện đại (máy huyết học tự động, máy sinh hóa, máy miễn dịch…), có khả năng bảo dưỡng cơ bản và phối hợp với kỹ thuật viên bảo trì khi phát sinh sự cố.\r\n\r\nQuản lý hồ sơ & dữ liệu: Kinh nghiệm trong việc nhập, lưu trữ và quản lý kết quả xét nghiệm trên hệ thống bệnh án điện tử; phối hợp chặt chẽ với bác sĩ để hỗ trợ chẩn đoán lâm sàng.\r\n\r\nHỗ trợ chuyên môn: Tham gia đào tạo, hướng dẫn thực tập sinh, kỹ thuật viên mới về quy trình và kỹ năng thao tác phòng xét nghiệm.\r\n\r\nKỹ năng mềm: Có khả năng làm việc độc lập cũng như làm việc nhóm, chịu được áp lực công việc cao; giao tiếp tốt và sẵn sàng phối hợp với các khoa phòng khác trong bệnh viện.', 'active', 3, 'Đại Học Bách Khoa', '3.8', '2019-02-15', 'Xuất Sắc', 'Bộ Y Tế', NULL),
(26, 'Nguyễn Quỳnh Trang', '0823162667', 'huyentrangha131@gmail.com', '$2b$10$EiQHNXkZdeRlzgopXJ4aneoyNc4KEH.tssKQV9Y29TeJt8GaWkgvW', 3, '1756089578880-trang.jpg', 'Tôi là Nguyễn Quỳnh Trang, hiện đang công tác trong chuyên khoa Tai Mũi Họng với mong muốn mang lại dịch vụ y tế chất lượng, tận tâm và an toàn cho người bệnh. Với tinh thần trách nhiệm cao, tôi luôn chú trọng đến việc lắng nghe, thấu hiểu và đồng hành cùng bệnh nhân trong suốt quá trình khám và điều trị.\r\n\r\nTôi có khả năng giao tiếp tốt, kiên nhẫn và cẩn thận trong từng ca bệnh. Ngoài chuyên môn, tôi thường xuyên tham gia các khóa học, hội thảo để nâng cao kiến thức và cập nhật những kỹ thuật mới trong lĩnh vực Tai Mũi Họng. Tôi tin rằng sự tận tâm và thái độ chuyên nghiệp chính là yếu tố quan trọng giúp tôi xây dựng niềm tin với bệnh nhân và đồng nghiệp.', '1756089578881-cc hÃ nh nghá».png', '1756089578881-áº£nh báº±ng.jpg', 'Có kinh nghiệm trong việc thăm khám, chẩn đoán và điều trị các bệnh lý thường gặp như viêm xoang, viêm amidan, viêm tai giữa, viêm họng, ù tai, điếc đột ngột...\r\n\r\nThực hiện thành thạo các thủ thuật cơ bản như nội soi tai mũi họng, lấy dị vật đường thở – đường ăn, cắt amidan, rửa xoang…\r\n\r\nAm hiểu và sử dụng thành thạo các thiết bị chuyên dụng: máy nội soi, máy đo thính lực, máy rửa tai…\r\n\r\nKinh nghiệm phối hợp với các chuyên khoa khác (nhi khoa, hô hấp, nội khoa) để đưa ra phác đồ điều trị tối ưu cho từng bệnh nhân.\r\n\r\nTham gia tư vấn sức khỏe cộng đồng, hướng dẫn bệnh nhân cách phòng ngừa các bệnh lý về tai, mũi, họng, đặc biệt trong môi trường ô nhiễm và thay đổi khí hậu.\r\n\r\nCó kỹ năng quản lý hồ sơ bệnh án, làm việc nhóm và chịu được áp lực công việc trong môi trường bệnh viện.', 'active', 3, 'Đại Học Bách Khoa', '3.5', '2015-01-15', 'Xuất Sắc', 'Bộ Y Tế', NULL),
(27, 'Trần Văn Đạt', '0123456780', 'hadung250281@gmail.com', '$2b$10$700Sq0y.TJ4J7kp/8ybZs.jhwEV7c9DwCO2LCIHoz7B2Oy4RjftGK', 9, '1756090932558-Äáº¡t.jpg', 'Tôi là Trần Văn Đạt, hiện đang công tác tại Khoa Tiêu hóa với mong muốn đóng góp vào việc chăm sóc và nâng cao sức khỏe đường tiêu hóa cho cộng đồng. Trong công việc, tôi luôn đặt tận tâm – chính xác – trách nhiệm làm kim chỉ nam, nhằm mang lại sự an tâm và kết quả điều trị tốt nhất cho bệnh nhân.\r\n\r\nTôi có khả năng giao tiếp tốt, luôn lắng nghe và đồng hành cùng bệnh nhân trong suốt quá trình điều trị. Đồng thời, tôi không ngừng trau dồi kiến thức, cập nhật các kỹ thuật, phương pháp mới trong lĩnh vực tiêu hóa để nâng cao hiệu quả khám chữa bệnh. Tôi tin rằng sự tận tâm cùng thái độ chuyên nghiệp chính là nền tảng vững chắc để tạo dựng niềm tin nơi bệnh nhân và đồng nghiệp.', '1756090932558-cc hÃ nh nghá».png', '1756090932558-áº£nh báº±ng.jpg', 'Chẩn đoán và điều trị: Có kinh nghiệm trong việc thăm khám, chẩn đoán và điều trị các bệnh lý thường gặp về đường tiêu hóa như viêm loét dạ dày – tá tràng, trào ngược dạ dày thực quản, hội chứng ruột kích thích, viêm đại tràng, bệnh gan mật – tụy…\r\n\r\nNội soi tiêu hóa: Thành thạo các kỹ thuật nội soi dạ dày, nội soi đại tràng, phát hiện và xử lý sớm các tổn thương bất thường như polyp, viêm loét, xuất huyết tiêu hóa.\r\n\r\nĐiều trị chuyên sâu: Tham gia điều trị các bệnh lý phức tạp về tiêu hóa và gan mật, phối hợp với các chuyên khoa khác để đưa ra phác đồ tối ưu cho bệnh nhân.\r\n\r\nTư vấn & chăm sóc sức khỏe: Kinh nghiệm trong việc tư vấn chế độ dinh dưỡng, lối sống lành mạnh giúp hỗ trợ phòng ngừa và điều trị bệnh đường tiêu hóa.\r\n\r\nNghiên cứu & đào tạo: Tham gia hội thảo, khóa đào tạo chuyên ngành để cập nhật kiến thức mới; đồng thời hỗ trợ đào tạo thực tập sinh, bác sĩ trẻ trong lĩnh vực tiêu hóa.\r\n\r\nKỹ năng mềm: Làm việc nhóm hiệu quả, chịu được áp lực công việc cao, khả năng quản lý hồ sơ bệnh án chính xác và khoa học.', 'active', 3, 'Đại Học FPT', '3.7', '2019-03-25', 'Xuất Sắc', 'Bộ Y Tế', NULL),
(28, 'Nguyễn Thị Huyền', '0878989754', 'huyensoaicavip@gmail.com', '$2b$10$6uey1P3FkEYp/12oiKTUtuxAj1sqyX67aoKOHgZk7aIKVFPUPfxp2', 1, '1756094634348-Huyá»n.jpg', 'Tôi là Nguyễn Thị Huyền, bác sĩ chuyên khoa Nội với định hướng nghề nghiệp tập trung vào việc khám, chẩn đoán và điều trị các bệnh lý nội khoa phổ biến, góp phần nâng cao sức khỏe cộng đồng. Trong công việc, tôi luôn đặt sự tận tâm, chính xác và trách nhiệm lên hàng đầu, đồng thời chú trọng đến việc lắng nghe, thấu hiểu để mang đến phác đồ điều trị phù hợp nhất cho từng bệnh nhân.\r\n\r\nTôi thường xuyên cập nhật kiến thức chuyên môn qua các khóa đào tạo, hội thảo y khoa và tài liệu chuyên ngành. Với tinh thần cầu thị và trách nhiệm, tôi tin rằng sự kết hợp giữa chuyên môn vững vàng và thái độ tận tâm sẽ mang lại hiệu quả điều trị tốt nhất, giúp bệnh nhân an tâm trong quá trình thăm khám.', '1756094634351-1756090163416-cc hÃÂ nh nghÃ¡Â»Â.png', '1756094634350-áº£nh báº±ng.jpg', 'Chẩn đoán và điều trị nội khoa: Có kinh nghiệm thăm khám và điều trị các bệnh lý thường gặp như: tăng huyết áp, tiểu đường, rối loạn lipid máu, bệnh tim mạch, hô hấp, tiêu hóa và các bệnh lý chuyển hóa.\r\n\r\nKhám và quản lý bệnh mạn tính: Tư vấn, theo dõi và đưa ra phác đồ điều trị dài hạn cho các bệnh nhân mắc bệnh mạn tính, nhằm giảm thiểu biến chứng và cải thiện chất lượng cuộc sống.\r\n\r\nĐiều trị cấp cứu nội khoa: Tham gia xử trí các ca cấp cứu nội khoa như hen phế quản, suy tim, đột quỵ, hạ đường huyết, xuất huyết tiêu hóa…\r\n\r\nTư vấn & dự phòng: Có kinh nghiệm tư vấn về chế độ dinh dưỡng, luyện tập và lối sống lành mạnh để phòng ngừa, kiểm soát bệnh tật hiệu quả.\r\n\r\nNghiên cứu & đào tạo: Tham gia các hội nghị khoa học, nghiên cứu và cập nhật phác đồ điều trị mới trong lĩnh vực nội khoa.\r\n\r\nKỹ năng mềm: Giao tiếp tốt, làm việc nhóm hiệu quả, có khả năng đồng hành và tạo sự tin tưởng cho bệnh nhân trong quá trình điều trị.', 'active', 3, 'Đại Học FPT', '3.8', '2020-02-24', 'Giỏi', 'Bộ Y Tế', NULL),
(30, 'Nguyễn Thị Minh Hiền', '0123456765', 'quangsoaicavip@gmail.com', '$2b$10$n6l92lUEVH/dgrLItwV7suHEtnpS7vCYxBxl39GXdDF/iCQG0mR6.', 1, '1756098697249-Minh hiá»n.jpg', 'Tôi là Nguyễn Thị Minh Hiền, bác sĩ chuyên khoa Nội với nhiều năm kinh nghiệm trong thăm khám, chẩn đoán và điều trị các bệnh lý nội khoa. Tôi luôn đặt sự tận tâm, chính xác và trách nhiệm lên hàng đầu trong quá trình khám chữa bệnh. Với thái độ thân thiện và khả năng lắng nghe, tôi mong muốn mang lại cho bệnh nhân cảm giác an tâm, tin tưởng cũng như hiệu quả điều trị tối ưu.\r\n\r\nTôi thường xuyên tham gia các hội thảo, khóa đào tạo y khoa để cập nhật kiến thức mới, đồng thời chú trọng đến việc tư vấn dự phòng và nâng cao sức khỏe cộng đồng.', '1756098697274-nguyen thi minh hien.png', '1756098697273-1756090932558-Ã¡ÂºÂ£nh bÃ¡ÂºÂ±ng.jpg', 'Khám và điều trị nội khoa tổng quát: Tăng huyết áp, đái tháo đường, rối loạn chuyển hóa, bệnh tim mạch, hô hấp, tiêu hóa.\r\n\r\nQuản lý bệnh mạn tính: Xây dựng phác đồ theo dõi và điều trị lâu dài, giúp bệnh nhân kiểm soát bệnh hiệu quả và hạn chế biến chứng.\r\n\r\nXử trí cấp cứu nội khoa: Có kinh nghiệm trong xử trí các ca cấp cứu như suy hô hấp, cơn tăng huyết áp kịch phát, hạ đường huyết, xuất huyết tiêu hóa.\r\n\r\nTư vấn dự phòng và chăm sóc sức khỏe: Hướng dẫn bệnh nhân xây dựng lối sống khoa học, chế độ ăn uống hợp lý và kế hoạch theo dõi định kỳ.\r\n\r\nNghiên cứu & đào tạo: Tham gia hội nghị khoa học, nghiên cứu và chia sẻ kinh nghiệm chuyên môn trong lĩnh vực nội khoa.', 'active', 3, 'Đại Học Bách Khóa', '3.9', '2020-07-25', 'Xuất Sắc', 'Bộ Y Tế', NULL),
(31, 'Trần Văn Thành', '0123456789', 'phucsoaicavip@gmail.com', '$2b$10$G6HIpZ5N.v7LruaFBCJj8OIxOOfNC6/qHtvTcBqBLEziYsQjGObUK', 4, '1756100172891-ThÃ nh.png', 'Tôi là bác sĩ Trần Văn Thành, chuyên khoa Tim mạch, với niềm đam mê và tâm huyết trong việc chăm sóc sức khỏe tim mạch cho người bệnh. Tôi luôn đặt bệnh nhân làm trung tâm, chú trọng thăm khám kỹ lưỡng, chẩn đoán chính xác và đưa ra phác đồ điều trị tối ưu. Bên cạnh đó, tôi cũng quan tâm đến việc tư vấn chế độ dinh dưỡng, luyện tập và phòng ngừa bệnh lý tim mạch nhằm nâng cao chất lượng cuộc sống cho bệnh nhân.', '1756100172893-1756093167257-cc hÃÂ nh nghÃ¡Â»Â.png', '1756100172893-1756090932558-Ã¡ÂºÂ£nh bÃ¡ÂºÂ±ng.jpg', 'Khám, chẩn đoán và điều trị các bệnh lý tim mạch: tăng huyết áp, bệnh mạch vành, suy tim, rối loạn nhịp tim, bệnh van tim.\r\n\r\nThực hiện và đọc kết quả các cận lâm sàng tim mạch: điện tâm đồ, siêu âm tim, Holter ECG, Holter huyết áp.\r\n\r\nTheo dõi, quản lý bệnh nhân sau can thiệp mạch vành, đặt stent và phẫu thuật tim.\r\n\r\nTư vấn dự phòng bệnh tim mạch, hướng dẫn lối sống lành mạnh nhằm giảm nguy cơ biến chứng.\r\n\r\nTham gia các khóa đào tạo, hội thảo chuyên khoa để cập nhật kiến thức và phương pháp điều trị mới.', 'active', 3, 'Đại Học FPT', '3.7', '2017-07-21', 'Giỏi', 'Bộ Y Tế', NULL),
(32, 'Hà My', '0123456789', 'le6838773@gmail.com', '$2b$10$8hq2kM3YnJpCT9m0WFYGn.OCfzHpPpIDYVMOmDowLL8Cky/31DJ3a', 6, '1756100017124-My.jpg', 'Tôi là Hà My, bác sĩ chuyên khoa Xương khớp, với sự tận tâm trong việc chăm sóc và điều trị các bệnh lý cơ xương khớp. Tôi luôn đặt lợi ích và sức khỏe lâu dài của người bệnh lên hàng đầu, kết hợp kiến thức chuyên môn với các phương pháp điều trị hiện đại nhằm mang lại hiệu quả tối ưu.\r\n\r\nNgoài công tác khám chữa bệnh, tôi cũng thường xuyên tư vấn cho bệnh nhân về chế độ sinh hoạt, dinh dưỡng và luyện tập để cải thiện chức năng vận động, phòng ngừa chấn thương và hạn chế tái phát bệnh lý xương khớp.', '1756100017125-1756093167257-cc hÃÂ nh nghÃ¡Â»Â.png', '1756100017124-1756090932558-Ã¡ÂºÂ£nh bÃ¡ÂºÂ±ng.jpg', 'Khám & điều trị bệnh lý cơ xương khớp: Thoái hóa khớp, viêm khớp dạng thấp, gout, loãng xương, đau lưng, thoát vị đĩa đệm.\r\n\r\nChấn thương chỉnh hình: Điều trị và phục hồi chức năng sau gãy xương, bong gân, trật khớp, chấn thương thể thao.\r\n\r\nĐiều trị bảo tồn & phục hồi chức năng: Vật lý trị liệu, phục hồi vận động sau phẫu thuật hoặc chấn thương.\r\n\r\nTư vấn phòng ngừa bệnh xương khớp: Hướng dẫn chế độ tập luyện, chế độ ăn uống và các biện pháp chăm sóc sức khỏe cơ xương khớp.\r\n\r\nNghiên cứu & đào tạo: Tham gia các khóa học, hội thảo chuyên môn nhằm cập nhật kiến thức mới trong lĩnh vực cơ xương khớp.', 'active', 3, 'Đại Học FPT', '3.8', '2018-07-25', 'Xuất Sắc', 'Bộ Y Tế', NULL),
(33, 'Trần Đình Phước', '0123456765', 'kysoaicavip@gmail.com', '$2b$10$WA1oYUYusIrVr2XH1ex1x.x5RoVniNXg8c8MWjUvAhjpbltljHkMq', 10, '1756099827422-phÆ°á»c.jpg', 'Tôi là Trần Đình Phước, bác sĩ chuyên khoa Hô hấp với nhiều năm kinh nghiệm trong chẩn đoán và điều trị các bệnh lý về đường hô hấp. Tôi luôn đặt sức khỏe và sự an toàn của bệnh nhân lên hàng đầu, kết hợp kiến thức chuyên môn với sự tận tâm để mang lại kết quả điều trị hiệu quả và lâu dài.\r\n\r\nBên cạnh việc điều trị, tôi đặc biệt chú trọng đến việc tư vấn, hướng dẫn người bệnh thay đổi lối sống, chế độ dinh dưỡng và luyện tập để nâng cao sức khỏe hô hấp, phòng ngừa tái phát và cải thiện chất lượng cuộc sống.', '1756099827423-1756093167257-cc hÃÂ nh nghÃ¡Â»Â.png', '1756099827423-1756090932558-Ã¡ÂºÂ£nh bÃ¡ÂºÂ±ng.jpg', 'Chẩn đoán & điều trị bệnh lý hô hấp: Viêm phổi, viêm phế quản, hen phế quản, bệnh phổi tắc nghẽn mạn tính (COPD), lao phổi, ung thư phổi.\r\n\r\nĐiều trị bệnh hô hấp mạn tính: Quản lý lâu dài cho bệnh nhân hen suyễn, viêm mũi dị ứng và bệnh phổi nghề nghiệp.\r\n\r\nKinh nghiệm cấp cứu hô hấp: Xử trí suy hô hấp cấp, khó thở, tràn dịch màng phổi, viêm phổi nặng.\r\n\r\nTư vấn & phục hồi chức năng hô hấp: Hướng dẫn tập thở, vật lý trị liệu hô hấp và các biện pháp hỗ trợ bệnh nhân sau điều trị.\r\n\r\nNghiên cứu & đào tạo: Tham gia nhiều hội thảo, khóa đào tạo y khoa liên quan đến lĩnh vực hô hấp nhằm cập nhật kiến thức và áp dụng vào thực hành lâm sàng.', 'active', 3, 'Đại Học Bách Khóa', '3.7', '2023-03-10', 'Xuất Sắc', 'Bộ Y Tế', NULL),
(34, 'Hà Thị Trang', '0123456780', 'huyd14967@gmail.com', '$2b$10$V4hvTNDEYbSrFUbbpcM4dO9Tmg5v/DFYzOfnDfSxzv.IBJCHptHCW', 5, '1756099573337-Huyá»n.jpg', 'Giới thiệu bản thân\r\n\r\nTôi là Hà Thị Trang, bác sĩ chuyên khoa Thần kinh với nhiều năm kinh nghiệm trong thăm khám, chẩn đoán và điều trị các bệnh lý liên quan đến hệ thần kinh. Tôi luôn nỗ lực kết hợp giữa kiến thức chuyên môn và sự tận tâm để mang lại hiệu quả điều trị tối ưu, giúp bệnh nhân cải thiện sức khỏe và nâng cao chất lượng cuộc sống.\r\n\r\nVới tinh thần trách nhiệm cao và khả năng lắng nghe, tôi mong muốn đồng hành cùng bệnh nhân trong việc phòng ngừa, phát hiện sớm và kiểm soát các bệnh lý thần kinh, từ đó giúp họ có được sự an tâm và tin tưởng trong quá trình điều trị.', '1756099573338-cc hÃ nh nghá».png', '1756099573338-1756098697273-1756090932558-ÃÂ¡ÃÂºÃÂ£nh bÃÂ¡ÃÂºÃÂ±ng.jpg', 'Chẩn đoán & điều trị bệnh lý thần kinh: Đau đầu, mất ngủ, động kinh, tai biến mạch máu não, rối loạn thần kinh thực vật, bệnh lý thần kinh ngoại biên.\r\n\r\nKhám & theo dõi bệnh mạn tính thần kinh: Hỗ trợ điều trị bệnh Parkinson, Alzheimer và các rối loạn trí nhớ.\r\n\r\nKinh nghiệm cấp cứu thần kinh: Xử trí đột quỵ não, chấn thương sọ não, hôn mê và các tình huống khẩn cấp khác.\r\n\r\nTư vấn & phục hồi chức năng: Hướng dẫn người bệnh chế độ sinh hoạt, dinh dưỡng, vật lý trị liệu và theo dõi lâu dài.\r\n\r\nNghiên cứu & đào tạo: Tham gia các khóa đào tạo, hội thảo y khoa nhằm cập nhật kiến thức và nâng cao kỹ năng chuyên môn trong lĩnh vực thần kinh.', 'active', 3, 'Đại Học FPT', '3.9', '2019-02-28', 'Giỏi', 'Bộ Y Tế', NULL);

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
(1248, 15, 121, '2025-08-23', '17:00:00', '17:30:00', 'Available', 1),
(1249, 15, 122, '2025-08-25', '07:00:00', '07:30:00', 'Available', 1),
(1250, 15, 122, '2025-08-25', '07:30:00', '08:00:00', 'Available', 1),
(1251, 15, 122, '2025-08-25', '08:00:00', '08:30:00', 'Available', 1),
(1252, 15, 122, '2025-08-25', '08:30:00', '09:00:00', 'Available', 1),
(1253, 15, 122, '2025-08-25', '09:00:00', '09:30:00', 'Available', 1),
(1254, 15, 122, '2025-08-25', '09:30:00', '10:00:00', 'Available', 1),
(1255, 15, 122, '2025-08-25', '10:00:00', '10:30:00', 'Available', 1),
(1256, 15, 122, '2025-08-25', '10:30:00', '11:00:00', 'Available', 1),
(1257, 15, 122, '2025-08-25', '11:00:00', '11:30:00', 'Available', 1),
(1258, 15, 122, '2025-08-25', '11:30:00', '12:00:00', 'Available', 1),
(1259, 15, 123, '2025-08-25', '13:30:00', '14:00:00', 'Available', 1),
(1260, 15, 123, '2025-08-25', '14:00:00', '14:30:00', 'Available', 1),
(1261, 15, 123, '2025-08-25', '14:30:00', '15:00:00', 'Available', 1),
(1262, 15, 123, '2025-08-25', '15:00:00', '15:30:00', 'Available', 1),
(1263, 15, 123, '2025-08-25', '15:30:00', '16:00:00', 'Available', 1),
(1264, 15, 123, '2025-08-25', '16:00:00', '16:30:00', 'Available', 1),
(1265, 15, 123, '2025-08-25', '16:30:00', '17:00:00', 'Available', 1),
(1266, 15, 123, '2025-08-25', '17:00:00', '17:30:00', 'Available', 1),
(1267, 15, 124, '2025-08-26', '07:00:00', '07:30:00', 'Available', 1),
(1268, 15, 124, '2025-08-26', '07:30:00', '08:00:00', 'Available', 1),
(1269, 15, 124, '2025-08-26', '08:00:00', '08:30:00', 'Available', 1),
(1270, 15, 124, '2025-08-26', '08:30:00', '09:00:00', 'Available', 1),
(1271, 15, 124, '2025-08-26', '09:00:00', '09:30:00', 'Available', 1),
(1272, 15, 124, '2025-08-26', '09:30:00', '10:00:00', 'Available', 1),
(1273, 15, 124, '2025-08-26', '10:00:00', '10:30:00', 'Available', 1),
(1274, 15, 124, '2025-08-26', '10:30:00', '11:00:00', 'Available', 1),
(1275, 15, 124, '2025-08-26', '11:00:00', '11:30:00', 'Available', 1),
(1276, 15, 124, '2025-08-26', '11:30:00', '12:00:00', 'Available', 1),
(1277, 15, 125, '2025-08-26', '13:30:00', '14:00:00', 'Available', 1),
(1278, 15, 125, '2025-08-26', '14:00:00', '14:30:00', 'Available', 1),
(1279, 15, 125, '2025-08-26', '14:30:00', '15:00:00', 'Available', 1),
(1280, 15, 125, '2025-08-26', '15:00:00', '15:30:00', 'Available', 1),
(1281, 15, 125, '2025-08-26', '15:30:00', '16:00:00', 'Available', 1),
(1282, 15, 125, '2025-08-26', '16:00:00', '16:30:00', 'Available', 1),
(1283, 15, 125, '2025-08-26', '16:30:00', '17:00:00', 'Available', 1),
(1284, 15, 125, '2025-08-26', '17:00:00', '17:30:00', 'Available', 1),
(1285, 15, 126, '2025-08-27', '07:00:00', '07:30:00', 'Available', 1),
(1286, 15, 126, '2025-08-27', '07:30:00', '08:00:00', 'Available', 1),
(1287, 15, 126, '2025-08-27', '08:00:00', '08:30:00', 'Available', 1),
(1288, 15, 126, '2025-08-27', '08:30:00', '09:00:00', 'Available', 1),
(1289, 15, 126, '2025-08-27', '09:00:00', '09:30:00', 'Available', 1),
(1290, 15, 126, '2025-08-27', '09:30:00', '10:00:00', 'Available', 1),
(1291, 15, 126, '2025-08-27', '10:00:00', '10:30:00', 'Available', 1),
(1292, 15, 126, '2025-08-27', '10:30:00', '11:00:00', 'Available', 1),
(1293, 15, 126, '2025-08-27', '11:00:00', '11:30:00', 'Available', 1),
(1294, 15, 126, '2025-08-27', '11:30:00', '12:00:00', 'Available', 1),
(1295, 15, 127, '2025-08-27', '13:30:00', '14:00:00', 'Available', 1),
(1296, 15, 127, '2025-08-27', '14:00:00', '14:30:00', 'Available', 1),
(1297, 15, 127, '2025-08-27', '14:30:00', '15:00:00', 'Available', 1),
(1298, 15, 127, '2025-08-27', '15:00:00', '15:30:00', 'Available', 1),
(1299, 15, 127, '2025-08-27', '15:30:00', '16:00:00', 'Available', 1),
(1300, 15, 127, '2025-08-27', '16:00:00', '16:30:00', 'Available', 1),
(1301, 15, 127, '2025-08-27', '16:30:00', '17:00:00', 'Available', 1),
(1302, 15, 127, '2025-08-27', '17:00:00', '17:30:00', 'Available', 1),
(1303, 15, 128, '2025-08-28', '07:00:00', '07:30:00', 'Available', 1),
(1304, 15, 128, '2025-08-28', '07:30:00', '08:00:00', 'Available', 1),
(1305, 15, 128, '2025-08-28', '08:00:00', '08:30:00', 'Available', 1),
(1306, 15, 128, '2025-08-28', '08:30:00', '09:00:00', 'Available', 1),
(1307, 15, 128, '2025-08-28', '09:00:00', '09:30:00', 'Available', 1),
(1308, 15, 128, '2025-08-28', '09:30:00', '10:00:00', 'Available', 1),
(1309, 15, 128, '2025-08-28', '10:00:00', '10:30:00', 'Available', 1),
(1310, 15, 128, '2025-08-28', '10:30:00', '11:00:00', 'Available', 1),
(1311, 15, 128, '2025-08-28', '11:00:00', '11:30:00', 'Available', 1),
(1312, 15, 128, '2025-08-28', '11:30:00', '12:00:00', 'Available', 1),
(1313, 15, 129, '2025-08-28', '13:30:00', '14:00:00', 'Available', 1),
(1314, 15, 129, '2025-08-28', '14:00:00', '14:30:00', 'Available', 1),
(1315, 15, 129, '2025-08-28', '14:30:00', '15:00:00', 'Available', 1),
(1316, 15, 129, '2025-08-28', '15:00:00', '15:30:00', 'Available', 1),
(1317, 15, 129, '2025-08-28', '15:30:00', '16:00:00', 'Available', 1),
(1318, 15, 129, '2025-08-28', '16:00:00', '16:30:00', 'Available', 1),
(1319, 15, 129, '2025-08-28', '16:30:00', '17:00:00', 'Available', 1),
(1320, 15, 129, '2025-08-28', '17:00:00', '17:30:00', 'Available', 1),
(1321, 15, 130, '2025-08-29', '07:00:00', '07:30:00', 'Available', 1),
(1322, 15, 130, '2025-08-29', '07:30:00', '08:00:00', 'Available', 1),
(1323, 15, 130, '2025-08-29', '08:00:00', '08:30:00', 'Available', 1),
(1324, 15, 130, '2025-08-29', '08:30:00', '09:00:00', 'Available', 1),
(1325, 15, 130, '2025-08-29', '09:00:00', '09:30:00', 'Available', 1),
(1326, 15, 130, '2025-08-29', '09:30:00', '10:00:00', 'Available', 1),
(1327, 15, 130, '2025-08-29', '10:00:00', '10:30:00', 'Available', 1),
(1328, 15, 130, '2025-08-29', '10:30:00', '11:00:00', 'Available', 1),
(1329, 15, 130, '2025-08-29', '11:00:00', '11:30:00', 'Available', 1),
(1330, 15, 130, '2025-08-29', '11:30:00', '12:00:00', 'Available', 1),
(1331, 15, 131, '2025-08-29', '13:30:00', '14:00:00', 'Available', 1),
(1332, 15, 131, '2025-08-29', '14:00:00', '14:30:00', 'Available', 1),
(1333, 15, 131, '2025-08-29', '14:30:00', '15:00:00', 'Available', 1),
(1334, 15, 131, '2025-08-29', '15:00:00', '15:30:00', 'Available', 1),
(1335, 15, 131, '2025-08-29', '15:30:00', '16:00:00', 'Available', 1),
(1336, 15, 131, '2025-08-29', '16:00:00', '16:30:00', 'Available', 1),
(1337, 15, 131, '2025-08-29', '16:30:00', '17:00:00', 'Available', 1),
(1338, 15, 131, '2025-08-29', '17:00:00', '17:30:00', 'Available', 1),
(1339, 15, 132, '2025-08-30', '07:00:00', '07:30:00', 'Available', 1),
(1340, 15, 132, '2025-08-30', '07:30:00', '08:00:00', 'Available', 1),
(1341, 15, 132, '2025-08-30', '08:00:00', '08:30:00', 'Available', 1),
(1342, 15, 132, '2025-08-30', '08:30:00', '09:00:00', 'Available', 1),
(1343, 15, 132, '2025-08-30', '09:00:00', '09:30:00', 'Available', 1),
(1344, 15, 132, '2025-08-30', '09:30:00', '10:00:00', 'Available', 1),
(1345, 15, 132, '2025-08-30', '10:00:00', '10:30:00', 'Available', 1),
(1346, 15, 132, '2025-08-30', '10:30:00', '11:00:00', 'Available', 1),
(1347, 15, 132, '2025-08-30', '11:00:00', '11:30:00', 'Available', 1),
(1348, 15, 132, '2025-08-30', '11:30:00', '12:00:00', 'Available', 1),
(1349, 15, 133, '2025-08-30', '13:30:00', '14:00:00', 'Available', 1),
(1350, 15, 133, '2025-08-30', '14:00:00', '14:30:00', 'Available', 1),
(1351, 15, 133, '2025-08-30', '14:30:00', '15:00:00', 'Available', 1),
(1352, 15, 133, '2025-08-30', '15:00:00', '15:30:00', 'Available', 1),
(1353, 15, 133, '2025-08-30', '15:30:00', '16:00:00', 'Available', 1),
(1354, 15, 133, '2025-08-30', '16:00:00', '16:30:00', 'Available', 1),
(1355, 15, 133, '2025-08-30', '16:30:00', '17:00:00', 'Available', 1),
(1356, 15, 133, '2025-08-30', '17:00:00', '17:30:00', 'Available', 1),
(1357, 28, 134, '2025-08-25', '07:00:00', '07:30:00', 'Available', 1),
(1358, 28, 134, '2025-08-25', '07:30:00', '08:00:00', 'Available', 1),
(1359, 28, 134, '2025-08-25', '08:00:00', '08:30:00', 'Available', 1),
(1360, 28, 134, '2025-08-25', '08:30:00', '09:00:00', 'Available', 1),
(1361, 28, 134, '2025-08-25', '09:00:00', '09:30:00', 'Available', 1),
(1362, 28, 134, '2025-08-25', '09:30:00', '10:00:00', 'Available', 1),
(1363, 28, 134, '2025-08-25', '10:00:00', '10:30:00', 'Available', 1),
(1364, 28, 134, '2025-08-25', '10:30:00', '11:00:00', 'Available', 1),
(1365, 28, 134, '2025-08-25', '11:00:00', '11:30:00', 'Available', 1),
(1366, 28, 134, '2025-08-25', '11:30:00', '12:00:00', 'Available', 1),
(1367, 28, 135, '2025-08-25', '13:30:00', '14:00:00', 'Available', 1),
(1368, 28, 135, '2025-08-25', '14:00:00', '14:30:00', 'Available', 1),
(1369, 28, 135, '2025-08-25', '14:30:00', '15:00:00', 'Available', 1),
(1370, 28, 135, '2025-08-25', '15:00:00', '15:30:00', 'Available', 1),
(1371, 28, 135, '2025-08-25', '15:30:00', '16:00:00', 'Available', 1),
(1372, 28, 135, '2025-08-25', '16:00:00', '16:30:00', 'Available', 1),
(1373, 28, 135, '2025-08-25', '16:30:00', '17:00:00', 'Available', 1),
(1374, 28, 135, '2025-08-25', '17:00:00', '17:30:00', 'Available', 1),
(1375, 28, 136, '2025-08-26', '07:00:00', '07:30:00', 'Available', 1),
(1376, 28, 136, '2025-08-26', '07:30:00', '08:00:00', 'Available', 1),
(1377, 28, 136, '2025-08-26', '08:00:00', '08:30:00', 'Available', 1),
(1378, 28, 136, '2025-08-26', '08:30:00', '09:00:00', 'Available', 1),
(1379, 28, 136, '2025-08-26', '09:00:00', '09:30:00', 'Available', 1),
(1380, 28, 136, '2025-08-26', '09:30:00', '10:00:00', 'Available', 1),
(1381, 28, 136, '2025-08-26', '10:00:00', '10:30:00', 'Available', 1),
(1382, 28, 136, '2025-08-26', '10:30:00', '11:00:00', 'Available', 1),
(1383, 28, 136, '2025-08-26', '11:00:00', '11:30:00', 'Available', 1),
(1384, 28, 136, '2025-08-26', '11:30:00', '12:00:00', 'Available', 1),
(1385, 28, 137, '2025-08-26', '13:30:00', '14:00:00', 'Available', 1),
(1386, 28, 137, '2025-08-26', '14:00:00', '14:30:00', 'Available', 1),
(1387, 28, 137, '2025-08-26', '14:30:00', '15:00:00', 'Available', 1),
(1388, 28, 137, '2025-08-26', '15:00:00', '15:30:00', 'Available', 1),
(1389, 28, 137, '2025-08-26', '15:30:00', '16:00:00', 'Available', 1),
(1390, 28, 137, '2025-08-26', '16:00:00', '16:30:00', 'Available', 1),
(1391, 28, 137, '2025-08-26', '16:30:00', '17:00:00', 'Available', 1),
(1392, 28, 137, '2025-08-26', '17:00:00', '17:30:00', 'Available', 1),
(1393, 28, 138, '2025-08-27', '07:00:00', '07:30:00', 'Available', 1),
(1394, 28, 138, '2025-08-27', '07:30:00', '08:00:00', 'Available', 1),
(1395, 28, 138, '2025-08-27', '08:00:00', '08:30:00', 'Available', 1),
(1396, 28, 138, '2025-08-27', '08:30:00', '09:00:00', 'Available', 1),
(1397, 28, 138, '2025-08-27', '09:00:00', '09:30:00', 'Available', 1),
(1398, 28, 138, '2025-08-27', '09:30:00', '10:00:00', 'Available', 1),
(1399, 28, 138, '2025-08-27', '10:00:00', '10:30:00', 'Available', 1),
(1400, 28, 138, '2025-08-27', '10:30:00', '11:00:00', 'Available', 1),
(1401, 28, 138, '2025-08-27', '11:00:00', '11:30:00', 'Available', 1),
(1402, 28, 138, '2025-08-27', '11:30:00', '12:00:00', 'Available', 1),
(1403, 28, 139, '2025-08-27', '13:30:00', '14:00:00', 'Available', 1),
(1404, 28, 139, '2025-08-27', '14:00:00', '14:30:00', 'Available', 1),
(1405, 28, 139, '2025-08-27', '14:30:00', '15:00:00', 'Available', 1),
(1406, 28, 139, '2025-08-27', '15:00:00', '15:30:00', 'Available', 1),
(1407, 28, 139, '2025-08-27', '15:30:00', '16:00:00', 'Available', 1);
INSERT INTO `doctor_time_slot` (`id`, `doctor_id`, `work_shift_id`, `slot_date`, `start_time`, `end_time`, `status`, `is_active`) VALUES
(1408, 28, 139, '2025-08-27', '16:00:00', '16:30:00', 'Available', 1),
(1409, 28, 139, '2025-08-27', '16:30:00', '17:00:00', 'Available', 1),
(1410, 28, 139, '2025-08-27', '17:00:00', '17:30:00', 'Available', 1),
(1411, 28, 140, '2025-08-28', '07:00:00', '07:30:00', 'Available', 1),
(1412, 28, 140, '2025-08-28', '07:30:00', '08:00:00', 'Available', 1),
(1413, 28, 140, '2025-08-28', '08:00:00', '08:30:00', 'Available', 1),
(1414, 28, 140, '2025-08-28', '08:30:00', '09:00:00', 'Available', 1),
(1415, 28, 140, '2025-08-28', '09:00:00', '09:30:00', 'Available', 1),
(1416, 28, 140, '2025-08-28', '09:30:00', '10:00:00', 'Available', 1),
(1417, 28, 140, '2025-08-28', '10:00:00', '10:30:00', 'Available', 1),
(1418, 28, 140, '2025-08-28', '10:30:00', '11:00:00', 'Available', 1),
(1419, 28, 140, '2025-08-28', '11:00:00', '11:30:00', 'Available', 1),
(1420, 28, 140, '2025-08-28', '11:30:00', '12:00:00', 'Available', 1),
(1421, 28, 141, '2025-08-28', '13:30:00', '14:00:00', 'Available', 1),
(1422, 28, 141, '2025-08-28', '14:00:00', '14:30:00', 'Available', 1),
(1423, 28, 141, '2025-08-28', '14:30:00', '15:00:00', 'Available', 1),
(1424, 28, 141, '2025-08-28', '15:00:00', '15:30:00', 'Available', 1),
(1425, 28, 141, '2025-08-28', '15:30:00', '16:00:00', 'Available', 1),
(1426, 28, 141, '2025-08-28', '16:00:00', '16:30:00', 'Available', 1),
(1427, 28, 141, '2025-08-28', '16:30:00', '17:00:00', 'Available', 1),
(1428, 28, 141, '2025-08-28', '17:00:00', '17:30:00', 'Available', 1),
(1429, 28, 142, '2025-08-29', '07:00:00', '07:30:00', 'Available', 1),
(1430, 28, 142, '2025-08-29', '07:30:00', '08:00:00', 'Available', 1),
(1431, 28, 142, '2025-08-29', '08:00:00', '08:30:00', 'Available', 1),
(1432, 28, 142, '2025-08-29', '08:30:00', '09:00:00', 'Available', 1),
(1433, 28, 142, '2025-08-29', '09:00:00', '09:30:00', 'Available', 1),
(1434, 28, 142, '2025-08-29', '09:30:00', '10:00:00', 'Available', 1),
(1435, 28, 142, '2025-08-29', '10:00:00', '10:30:00', 'Available', 1),
(1436, 28, 142, '2025-08-29', '10:30:00', '11:00:00', 'Available', 1),
(1437, 28, 142, '2025-08-29', '11:00:00', '11:30:00', 'Available', 1),
(1438, 28, 142, '2025-08-29', '11:30:00', '12:00:00', 'Available', 1),
(1439, 28, 143, '2025-08-29', '13:30:00', '14:00:00', 'Available', 1),
(1440, 28, 143, '2025-08-29', '14:00:00', '14:30:00', 'Available', 1),
(1441, 28, 143, '2025-08-29', '14:30:00', '15:00:00', 'Available', 1),
(1442, 28, 143, '2025-08-29', '15:00:00', '15:30:00', 'Available', 1),
(1443, 28, 143, '2025-08-29', '15:30:00', '16:00:00', 'Available', 1),
(1444, 28, 143, '2025-08-29', '16:00:00', '16:30:00', 'Available', 1),
(1445, 28, 143, '2025-08-29', '16:30:00', '17:00:00', 'Available', 1),
(1446, 28, 143, '2025-08-29', '17:00:00', '17:30:00', 'Available', 1),
(1447, 28, 144, '2025-08-30', '07:00:00', '07:30:00', 'Available', 1),
(1448, 28, 144, '2025-08-30', '07:30:00', '08:00:00', 'Available', 1),
(1449, 28, 144, '2025-08-30', '08:00:00', '08:30:00', 'Available', 1),
(1450, 28, 144, '2025-08-30', '08:30:00', '09:00:00', 'Available', 1),
(1451, 28, 144, '2025-08-30', '09:00:00', '09:30:00', 'Available', 1),
(1452, 28, 144, '2025-08-30', '09:30:00', '10:00:00', 'Available', 1),
(1453, 28, 144, '2025-08-30', '10:00:00', '10:30:00', 'Available', 1),
(1454, 28, 144, '2025-08-30', '10:30:00', '11:00:00', 'Available', 1),
(1455, 28, 144, '2025-08-30', '11:00:00', '11:30:00', 'Available', 1),
(1456, 28, 144, '2025-08-30', '11:30:00', '12:00:00', 'Available', 1),
(1457, 28, 145, '2025-08-30', '13:30:00', '14:00:00', 'Available', 1),
(1458, 28, 145, '2025-08-30', '14:00:00', '14:30:00', 'Available', 1),
(1459, 28, 145, '2025-08-30', '14:30:00', '15:00:00', 'Available', 1),
(1460, 28, 145, '2025-08-30', '15:00:00', '15:30:00', 'Available', 1),
(1461, 28, 145, '2025-08-30', '15:30:00', '16:00:00', 'Available', 1),
(1462, 28, 145, '2025-08-30', '16:00:00', '16:30:00', 'Available', 1),
(1463, 28, 145, '2025-08-30', '16:30:00', '17:00:00', 'Available', 1),
(1464, 28, 145, '2025-08-30', '17:00:00', '17:30:00', 'Available', 1),
(1465, 27, 146, '2025-08-25', '07:00:00', '07:30:00', 'Available', 1),
(1466, 27, 146, '2025-08-25', '07:30:00', '08:00:00', 'Available', 1),
(1467, 27, 146, '2025-08-25', '08:00:00', '08:30:00', 'Available', 1),
(1468, 27, 146, '2025-08-25', '08:30:00', '09:00:00', 'Available', 1),
(1469, 27, 146, '2025-08-25', '09:00:00', '09:30:00', 'Available', 1),
(1470, 27, 146, '2025-08-25', '09:30:00', '10:00:00', 'Available', 1),
(1471, 27, 146, '2025-08-25', '10:00:00', '10:30:00', 'Available', 1),
(1472, 27, 146, '2025-08-25', '10:30:00', '11:00:00', 'Available', 1),
(1473, 27, 146, '2025-08-25', '11:00:00', '11:30:00', 'Available', 1),
(1474, 27, 146, '2025-08-25', '11:30:00', '12:00:00', 'Available', 1),
(1475, 27, 147, '2025-08-25', '13:30:00', '14:00:00', 'Available', 1),
(1476, 27, 147, '2025-08-25', '14:00:00', '14:30:00', 'Available', 1),
(1477, 27, 147, '2025-08-25', '14:30:00', '15:00:00', 'Available', 1),
(1478, 27, 147, '2025-08-25', '15:00:00', '15:30:00', 'Available', 1),
(1479, 27, 147, '2025-08-25', '15:30:00', '16:00:00', 'Available', 1),
(1480, 27, 147, '2025-08-25', '16:00:00', '16:30:00', 'Available', 1),
(1481, 27, 147, '2025-08-25', '16:30:00', '17:00:00', 'Available', 1),
(1482, 27, 147, '2025-08-25', '17:00:00', '17:30:00', 'Available', 1),
(1483, 27, 148, '2025-08-26', '07:00:00', '07:30:00', 'Available', 1),
(1484, 27, 148, '2025-08-26', '07:30:00', '08:00:00', 'Available', 1),
(1485, 27, 148, '2025-08-26', '08:00:00', '08:30:00', 'Available', 1),
(1486, 27, 148, '2025-08-26', '08:30:00', '09:00:00', 'Available', 1),
(1487, 27, 148, '2025-08-26', '09:00:00', '09:30:00', 'Available', 1),
(1488, 27, 148, '2025-08-26', '09:30:00', '10:00:00', 'Available', 1),
(1489, 27, 148, '2025-08-26', '10:00:00', '10:30:00', 'Available', 1),
(1490, 27, 148, '2025-08-26', '10:30:00', '11:00:00', 'Available', 1),
(1491, 27, 148, '2025-08-26', '11:00:00', '11:30:00', 'Available', 1),
(1492, 27, 148, '2025-08-26', '11:30:00', '12:00:00', 'Available', 1),
(1493, 27, 149, '2025-08-26', '13:30:00', '14:00:00', 'Available', 1),
(1494, 27, 149, '2025-08-26', '14:00:00', '14:30:00', 'Available', 1),
(1495, 27, 149, '2025-08-26', '14:30:00', '15:00:00', 'Available', 1),
(1496, 27, 149, '2025-08-26', '15:00:00', '15:30:00', 'Available', 1),
(1497, 27, 149, '2025-08-26', '15:30:00', '16:00:00', 'Available', 1),
(1498, 27, 149, '2025-08-26', '16:00:00', '16:30:00', 'Available', 1),
(1499, 27, 149, '2025-08-26', '16:30:00', '17:00:00', 'Available', 1),
(1500, 27, 149, '2025-08-26', '17:00:00', '17:30:00', 'Available', 1),
(1501, 27, 150, '2025-08-27', '07:00:00', '07:30:00', 'Available', 1),
(1502, 27, 150, '2025-08-27', '07:30:00', '08:00:00', 'Available', 1),
(1503, 27, 150, '2025-08-27', '08:00:00', '08:30:00', 'Available', 1),
(1504, 27, 150, '2025-08-27', '08:30:00', '09:00:00', 'Available', 1),
(1505, 27, 150, '2025-08-27', '09:00:00', '09:30:00', 'Available', 1),
(1506, 27, 150, '2025-08-27', '09:30:00', '10:00:00', 'Available', 1),
(1507, 27, 150, '2025-08-27', '10:00:00', '10:30:00', 'Available', 1),
(1508, 27, 150, '2025-08-27', '10:30:00', '11:00:00', 'Available', 1),
(1509, 27, 150, '2025-08-27', '11:00:00', '11:30:00', 'Available', 1),
(1510, 27, 150, '2025-08-27', '11:30:00', '12:00:00', 'Available', 1),
(1511, 27, 151, '2025-08-27', '13:30:00', '14:00:00', 'Available', 1),
(1512, 27, 151, '2025-08-27', '14:00:00', '14:30:00', 'Available', 1),
(1513, 27, 151, '2025-08-27', '14:30:00', '15:00:00', 'Available', 1),
(1514, 27, 151, '2025-08-27', '15:00:00', '15:30:00', 'Available', 1),
(1515, 27, 151, '2025-08-27', '15:30:00', '16:00:00', 'Available', 1),
(1516, 27, 151, '2025-08-27', '16:00:00', '16:30:00', 'Available', 1),
(1517, 27, 151, '2025-08-27', '16:30:00', '17:00:00', 'Available', 1),
(1518, 27, 151, '2025-08-27', '17:00:00', '17:30:00', 'Available', 1),
(1519, 27, 152, '2025-08-28', '07:00:00', '07:30:00', 'Available', 1),
(1520, 27, 152, '2025-08-28', '07:30:00', '08:00:00', 'Available', 1),
(1521, 27, 152, '2025-08-28', '08:00:00', '08:30:00', 'Available', 1),
(1522, 27, 152, '2025-08-28', '08:30:00', '09:00:00', 'Available', 1),
(1523, 27, 152, '2025-08-28', '09:00:00', '09:30:00', 'Available', 1),
(1524, 27, 152, '2025-08-28', '09:30:00', '10:00:00', 'Available', 1),
(1525, 27, 152, '2025-08-28', '10:00:00', '10:30:00', 'Available', 1),
(1526, 27, 152, '2025-08-28', '10:30:00', '11:00:00', 'Available', 1),
(1527, 27, 152, '2025-08-28', '11:00:00', '11:30:00', 'Available', 1),
(1528, 27, 152, '2025-08-28', '11:30:00', '12:00:00', 'Available', 1),
(1529, 27, 153, '2025-08-28', '13:30:00', '14:00:00', 'Available', 1),
(1530, 27, 153, '2025-08-28', '14:00:00', '14:30:00', 'Available', 1),
(1531, 27, 153, '2025-08-28', '14:30:00', '15:00:00', 'Available', 1),
(1532, 27, 153, '2025-08-28', '15:00:00', '15:30:00', 'Available', 1),
(1533, 27, 153, '2025-08-28', '15:30:00', '16:00:00', 'Available', 1),
(1534, 27, 153, '2025-08-28', '16:00:00', '16:30:00', 'Available', 1),
(1535, 27, 153, '2025-08-28', '16:30:00', '17:00:00', 'Available', 1),
(1536, 27, 153, '2025-08-28', '17:00:00', '17:30:00', 'Available', 1),
(1537, 27, 154, '2025-08-29', '07:00:00', '07:30:00', 'Available', 1),
(1538, 27, 154, '2025-08-29', '07:30:00', '08:00:00', 'Available', 1),
(1539, 27, 154, '2025-08-29', '08:00:00', '08:30:00', 'Available', 1),
(1540, 27, 154, '2025-08-29', '08:30:00', '09:00:00', 'Available', 1),
(1541, 27, 154, '2025-08-29', '09:00:00', '09:30:00', 'Available', 1),
(1542, 27, 154, '2025-08-29', '09:30:00', '10:00:00', 'Available', 1),
(1543, 27, 154, '2025-08-29', '10:00:00', '10:30:00', 'Available', 1),
(1544, 27, 154, '2025-08-29', '10:30:00', '11:00:00', 'Available', 1),
(1545, 27, 154, '2025-08-29', '11:00:00', '11:30:00', 'Available', 1),
(1546, 27, 154, '2025-08-29', '11:30:00', '12:00:00', 'Available', 1),
(1547, 27, 155, '2025-08-29', '13:30:00', '14:00:00', 'Available', 1),
(1548, 27, 155, '2025-08-29', '14:00:00', '14:30:00', 'Available', 1),
(1549, 27, 155, '2025-08-29', '14:30:00', '15:00:00', 'Available', 1),
(1550, 27, 155, '2025-08-29', '15:00:00', '15:30:00', 'Available', 1),
(1551, 27, 155, '2025-08-29', '15:30:00', '16:00:00', 'Available', 1),
(1552, 27, 155, '2025-08-29', '16:00:00', '16:30:00', 'Available', 1),
(1553, 27, 155, '2025-08-29', '16:30:00', '17:00:00', 'Available', 1),
(1554, 27, 155, '2025-08-29', '17:00:00', '17:30:00', 'Available', 1),
(1555, 27, 156, '2025-08-30', '07:00:00', '07:30:00', 'Available', 1),
(1556, 27, 156, '2025-08-30', '07:30:00', '08:00:00', 'Available', 1),
(1557, 27, 156, '2025-08-30', '08:00:00', '08:30:00', 'Available', 1),
(1558, 27, 156, '2025-08-30', '08:30:00', '09:00:00', 'Available', 1),
(1559, 27, 156, '2025-08-30', '09:00:00', '09:30:00', 'Available', 1),
(1560, 27, 156, '2025-08-30', '09:30:00', '10:00:00', 'Available', 1),
(1561, 27, 156, '2025-08-30', '10:00:00', '10:30:00', 'Available', 1),
(1562, 27, 156, '2025-08-30', '10:30:00', '11:00:00', 'Available', 1),
(1563, 27, 156, '2025-08-30', '11:00:00', '11:30:00', 'Available', 1),
(1564, 27, 156, '2025-08-30', '11:30:00', '12:00:00', 'Available', 1),
(1565, 27, 157, '2025-08-30', '13:30:00', '14:00:00', 'Available', 1),
(1566, 27, 157, '2025-08-30', '14:00:00', '14:30:00', 'Available', 1),
(1567, 27, 157, '2025-08-30', '14:30:00', '15:00:00', 'Available', 1),
(1568, 27, 157, '2025-08-30', '15:00:00', '15:30:00', 'Available', 1),
(1569, 27, 157, '2025-08-30', '15:30:00', '16:00:00', 'Available', 1),
(1570, 27, 157, '2025-08-30', '16:00:00', '16:30:00', 'Available', 1),
(1571, 27, 157, '2025-08-30', '16:30:00', '17:00:00', 'Available', 1),
(1572, 27, 157, '2025-08-30', '17:00:00', '17:30:00', 'Available', 1),
(1573, 26, 158, '2025-08-25', '07:00:00', '07:30:00', 'Available', 1),
(1574, 26, 158, '2025-08-25', '07:30:00', '08:00:00', 'Available', 1),
(1575, 26, 158, '2025-08-25', '08:00:00', '08:30:00', 'Available', 1),
(1576, 26, 158, '2025-08-25', '08:30:00', '09:00:00', 'Available', 1),
(1577, 26, 158, '2025-08-25', '09:00:00', '09:30:00', 'Available', 1),
(1578, 26, 158, '2025-08-25', '09:30:00', '10:00:00', 'Available', 1),
(1579, 26, 158, '2025-08-25', '10:00:00', '10:30:00', 'Available', 1),
(1580, 26, 158, '2025-08-25', '10:30:00', '11:00:00', 'Available', 1),
(1581, 26, 158, '2025-08-25', '11:00:00', '11:30:00', 'Available', 1),
(1582, 26, 158, '2025-08-25', '11:30:00', '12:00:00', 'Available', 1),
(1583, 26, 159, '2025-08-25', '13:30:00', '14:00:00', 'Available', 1),
(1584, 26, 159, '2025-08-25', '14:00:00', '14:30:00', 'Available', 1),
(1585, 26, 159, '2025-08-25', '14:30:00', '15:00:00', 'Available', 1),
(1586, 26, 159, '2025-08-25', '15:00:00', '15:30:00', 'Available', 1),
(1587, 26, 159, '2025-08-25', '15:30:00', '16:00:00', 'Available', 1),
(1588, 26, 159, '2025-08-25', '16:00:00', '16:30:00', 'Available', 1),
(1589, 26, 159, '2025-08-25', '16:30:00', '17:00:00', 'Available', 1),
(1590, 26, 159, '2025-08-25', '17:00:00', '17:30:00', 'Available', 1),
(1591, 26, 160, '2025-08-26', '07:00:00', '07:30:00', 'Available', 1),
(1592, 26, 160, '2025-08-26', '07:30:00', '08:00:00', 'Available', 1),
(1593, 26, 160, '2025-08-26', '08:00:00', '08:30:00', 'Available', 1),
(1594, 26, 160, '2025-08-26', '08:30:00', '09:00:00', 'Available', 1),
(1595, 26, 160, '2025-08-26', '09:00:00', '09:30:00', 'Available', 1),
(1596, 26, 160, '2025-08-26', '09:30:00', '10:00:00', 'Available', 1),
(1597, 26, 160, '2025-08-26', '10:00:00', '10:30:00', 'Available', 1),
(1598, 26, 160, '2025-08-26', '10:30:00', '11:00:00', 'Available', 1),
(1599, 26, 160, '2025-08-26', '11:00:00', '11:30:00', 'Available', 1),
(1600, 26, 160, '2025-08-26', '11:30:00', '12:00:00', 'Available', 1),
(1601, 26, 161, '2025-08-26', '13:30:00', '14:00:00', 'Available', 1),
(1602, 26, 161, '2025-08-26', '14:00:00', '14:30:00', 'Available', 1),
(1603, 26, 161, '2025-08-26', '14:30:00', '15:00:00', 'Available', 1),
(1604, 26, 161, '2025-08-26', '15:00:00', '15:30:00', 'Available', 1),
(1605, 26, 161, '2025-08-26', '15:30:00', '16:00:00', 'Available', 1),
(1606, 26, 161, '2025-08-26', '16:00:00', '16:30:00', 'Available', 1),
(1607, 26, 161, '2025-08-26', '16:30:00', '17:00:00', 'Available', 1),
(1608, 26, 161, '2025-08-26', '17:00:00', '17:30:00', 'Available', 1),
(1609, 26, 162, '2025-08-27', '07:00:00', '07:30:00', 'Available', 1),
(1610, 26, 162, '2025-08-27', '07:30:00', '08:00:00', 'Available', 1),
(1611, 26, 162, '2025-08-27', '08:00:00', '08:30:00', 'Available', 1),
(1612, 26, 162, '2025-08-27', '08:30:00', '09:00:00', 'Available', 1),
(1613, 26, 162, '2025-08-27', '09:00:00', '09:30:00', 'Available', 1),
(1614, 26, 162, '2025-08-27', '09:30:00', '10:00:00', 'Available', 1),
(1615, 26, 162, '2025-08-27', '10:00:00', '10:30:00', 'Available', 1),
(1616, 26, 162, '2025-08-27', '10:30:00', '11:00:00', 'Available', 1),
(1617, 26, 162, '2025-08-27', '11:00:00', '11:30:00', 'Available', 1),
(1618, 26, 162, '2025-08-27', '11:30:00', '12:00:00', 'Available', 1),
(1619, 26, 163, '2025-08-27', '13:30:00', '14:00:00', 'Available', 1),
(1620, 26, 163, '2025-08-27', '14:00:00', '14:30:00', 'Available', 1),
(1621, 26, 163, '2025-08-27', '14:30:00', '15:00:00', 'Available', 1),
(1622, 26, 163, '2025-08-27', '15:00:00', '15:30:00', 'Available', 1),
(1623, 26, 163, '2025-08-27', '15:30:00', '16:00:00', 'Available', 1),
(1624, 26, 163, '2025-08-27', '16:00:00', '16:30:00', 'Available', 1),
(1625, 26, 163, '2025-08-27', '16:30:00', '17:00:00', 'Available', 1),
(1626, 26, 163, '2025-08-27', '17:00:00', '17:30:00', 'Available', 1),
(1627, 26, 164, '2025-08-28', '07:00:00', '07:30:00', 'Available', 1),
(1628, 26, 164, '2025-08-28', '07:30:00', '08:00:00', 'Available', 1),
(1629, 26, 164, '2025-08-28', '08:00:00', '08:30:00', 'Available', 1),
(1630, 26, 164, '2025-08-28', '08:30:00', '09:00:00', 'Available', 1),
(1631, 26, 164, '2025-08-28', '09:00:00', '09:30:00', 'Available', 1),
(1632, 26, 164, '2025-08-28', '09:30:00', '10:00:00', 'Available', 1),
(1633, 26, 164, '2025-08-28', '10:00:00', '10:30:00', 'Available', 1),
(1634, 26, 164, '2025-08-28', '10:30:00', '11:00:00', 'Available', 1),
(1635, 26, 164, '2025-08-28', '11:00:00', '11:30:00', 'Available', 1),
(1636, 26, 164, '2025-08-28', '11:30:00', '12:00:00', 'Available', 1),
(1637, 26, 165, '2025-08-28', '13:30:00', '14:00:00', 'Available', 1),
(1638, 26, 165, '2025-08-28', '14:00:00', '14:30:00', 'Available', 1),
(1639, 26, 165, '2025-08-28', '14:30:00', '15:00:00', 'Available', 1),
(1640, 26, 165, '2025-08-28', '15:00:00', '15:30:00', 'Available', 1),
(1641, 26, 165, '2025-08-28', '15:30:00', '16:00:00', 'Available', 1),
(1642, 26, 165, '2025-08-28', '16:00:00', '16:30:00', 'Available', 1),
(1643, 26, 165, '2025-08-28', '16:30:00', '17:00:00', 'Available', 1),
(1644, 26, 165, '2025-08-28', '17:00:00', '17:30:00', 'Available', 1),
(1645, 26, 166, '2025-08-29', '07:00:00', '07:30:00', 'Available', 1),
(1646, 26, 166, '2025-08-29', '07:30:00', '08:00:00', 'Available', 1),
(1647, 26, 166, '2025-08-29', '08:00:00', '08:30:00', 'Available', 1),
(1648, 26, 166, '2025-08-29', '08:30:00', '09:00:00', 'Available', 1),
(1649, 26, 166, '2025-08-29', '09:00:00', '09:30:00', 'Available', 1),
(1650, 26, 166, '2025-08-29', '09:30:00', '10:00:00', 'Available', 1),
(1651, 26, 166, '2025-08-29', '10:00:00', '10:30:00', 'Available', 1),
(1652, 26, 166, '2025-08-29', '10:30:00', '11:00:00', 'Available', 1),
(1653, 26, 166, '2025-08-29', '11:00:00', '11:30:00', 'Available', 1),
(1654, 26, 166, '2025-08-29', '11:30:00', '12:00:00', 'Available', 1),
(1655, 26, 167, '2025-08-29', '13:30:00', '14:00:00', 'Available', 1),
(1656, 26, 167, '2025-08-29', '14:00:00', '14:30:00', 'Available', 1),
(1657, 26, 167, '2025-08-29', '14:30:00', '15:00:00', 'Available', 1),
(1658, 26, 167, '2025-08-29', '15:00:00', '15:30:00', 'Available', 1),
(1659, 26, 167, '2025-08-29', '15:30:00', '16:00:00', 'Available', 1),
(1660, 26, 167, '2025-08-29', '16:00:00', '16:30:00', 'Available', 1),
(1661, 26, 167, '2025-08-29', '16:30:00', '17:00:00', 'Available', 1),
(1662, 26, 167, '2025-08-29', '17:00:00', '17:30:00', 'Available', 1),
(1663, 26, 168, '2025-08-30', '07:00:00', '07:30:00', 'Available', 1),
(1664, 26, 168, '2025-08-30', '07:30:00', '08:00:00', 'Available', 1),
(1665, 26, 168, '2025-08-30', '08:00:00', '08:30:00', 'Available', 1),
(1666, 26, 168, '2025-08-30', '08:30:00', '09:00:00', 'Available', 1),
(1667, 26, 168, '2025-08-30', '09:00:00', '09:30:00', 'Available', 1),
(1668, 26, 168, '2025-08-30', '09:30:00', '10:00:00', 'Available', 1),
(1669, 26, 168, '2025-08-30', '10:00:00', '10:30:00', 'Available', 1),
(1670, 26, 168, '2025-08-30', '10:30:00', '11:00:00', 'Available', 1),
(1671, 26, 168, '2025-08-30', '11:00:00', '11:30:00', 'Available', 1),
(1672, 26, 168, '2025-08-30', '11:30:00', '12:00:00', 'Available', 1),
(1673, 26, 169, '2025-08-30', '13:30:00', '14:00:00', 'Available', 1),
(1674, 26, 169, '2025-08-30', '14:00:00', '14:30:00', 'Available', 1),
(1675, 26, 169, '2025-08-30', '14:30:00', '15:00:00', 'Available', 1),
(1676, 26, 169, '2025-08-30', '15:00:00', '15:30:00', 'Available', 1),
(1677, 26, 169, '2025-08-30', '15:30:00', '16:00:00', 'Available', 1),
(1678, 26, 169, '2025-08-30', '16:00:00', '16:30:00', 'Available', 1),
(1679, 26, 169, '2025-08-30', '16:30:00', '17:00:00', 'Available', 1),
(1680, 26, 169, '2025-08-30', '17:00:00', '17:30:00', 'Available', 1),
(1681, 23, 170, '2025-08-25', '07:00:00', '07:30:00', 'Available', 1),
(1682, 23, 170, '2025-08-25', '07:30:00', '08:00:00', 'Available', 1),
(1683, 23, 170, '2025-08-25', '08:00:00', '08:30:00', 'Available', 1),
(1684, 23, 170, '2025-08-25', '08:30:00', '09:00:00', 'Available', 1),
(1685, 23, 170, '2025-08-25', '09:00:00', '09:30:00', 'Available', 1),
(1686, 23, 170, '2025-08-25', '09:30:00', '10:00:00', 'Available', 1),
(1687, 23, 170, '2025-08-25', '10:00:00', '10:30:00', 'Available', 1),
(1688, 23, 170, '2025-08-25', '10:30:00', '11:00:00', 'Available', 1),
(1689, 23, 170, '2025-08-25', '11:00:00', '11:30:00', 'Available', 1),
(1690, 23, 170, '2025-08-25', '11:30:00', '12:00:00', 'Available', 1),
(1691, 23, 171, '2025-08-25', '13:30:00', '14:00:00', 'Available', 1),
(1692, 23, 171, '2025-08-25', '14:00:00', '14:30:00', 'Available', 1),
(1693, 23, 171, '2025-08-25', '14:30:00', '15:00:00', 'Available', 1),
(1694, 23, 171, '2025-08-25', '15:00:00', '15:30:00', 'Available', 1),
(1695, 23, 171, '2025-08-25', '15:30:00', '16:00:00', 'Available', 1),
(1696, 23, 171, '2025-08-25', '16:00:00', '16:30:00', 'Available', 1),
(1697, 23, 171, '2025-08-25', '16:30:00', '17:00:00', 'Available', 1),
(1698, 23, 171, '2025-08-25', '17:00:00', '17:30:00', 'Available', 1),
(1699, 23, 172, '2025-08-26', '07:00:00', '07:30:00', 'Available', 1),
(1700, 23, 172, '2025-08-26', '07:30:00', '08:00:00', 'Available', 1),
(1701, 23, 172, '2025-08-26', '08:00:00', '08:30:00', 'Available', 1),
(1702, 23, 172, '2025-08-26', '08:30:00', '09:00:00', 'Available', 1),
(1703, 23, 172, '2025-08-26', '09:00:00', '09:30:00', 'Available', 1),
(1704, 23, 172, '2025-08-26', '09:30:00', '10:00:00', 'Available', 1),
(1705, 23, 172, '2025-08-26', '10:00:00', '10:30:00', 'Available', 1),
(1706, 23, 172, '2025-08-26', '10:30:00', '11:00:00', 'Available', 1),
(1707, 23, 172, '2025-08-26', '11:00:00', '11:30:00', 'Available', 1),
(1708, 23, 172, '2025-08-26', '11:30:00', '12:00:00', 'Available', 1),
(1709, 23, 173, '2025-08-26', '13:30:00', '14:00:00', 'Available', 1),
(1710, 23, 173, '2025-08-26', '14:00:00', '14:30:00', 'Available', 1),
(1711, 23, 173, '2025-08-26', '14:30:00', '15:00:00', 'Available', 1),
(1712, 23, 173, '2025-08-26', '15:00:00', '15:30:00', 'Available', 1),
(1713, 23, 173, '2025-08-26', '15:30:00', '16:00:00', 'Available', 1),
(1714, 23, 173, '2025-08-26', '16:00:00', '16:30:00', 'Available', 1),
(1715, 23, 173, '2025-08-26', '16:30:00', '17:00:00', 'Available', 1),
(1716, 23, 173, '2025-08-26', '17:00:00', '17:30:00', 'Available', 1),
(1717, 23, 174, '2025-08-27', '07:00:00', '07:30:00', 'Available', 1),
(1718, 23, 174, '2025-08-27', '07:30:00', '08:00:00', 'Available', 1),
(1719, 23, 174, '2025-08-27', '08:00:00', '08:30:00', 'Available', 1),
(1720, 23, 174, '2025-08-27', '08:30:00', '09:00:00', 'Available', 1),
(1721, 23, 174, '2025-08-27', '09:00:00', '09:30:00', 'Available', 1),
(1722, 23, 174, '2025-08-27', '09:30:00', '10:00:00', 'Available', 1),
(1723, 23, 174, '2025-08-27', '10:00:00', '10:30:00', 'Available', 1),
(1724, 23, 174, '2025-08-27', '10:30:00', '11:00:00', 'Available', 1),
(1725, 23, 174, '2025-08-27', '11:00:00', '11:30:00', 'Available', 1),
(1726, 23, 174, '2025-08-27', '11:30:00', '12:00:00', 'Available', 1),
(1727, 23, 175, '2025-08-27', '13:30:00', '14:00:00', 'Available', 1),
(1728, 23, 175, '2025-08-27', '14:00:00', '14:30:00', 'Available', 1),
(1729, 23, 175, '2025-08-27', '14:30:00', '15:00:00', 'Available', 1),
(1730, 23, 175, '2025-08-27', '15:00:00', '15:30:00', 'Available', 1),
(1731, 23, 175, '2025-08-27', '15:30:00', '16:00:00', 'Available', 1),
(1732, 23, 175, '2025-08-27', '16:00:00', '16:30:00', 'Available', 1),
(1733, 23, 175, '2025-08-27', '16:30:00', '17:00:00', 'Available', 1),
(1734, 23, 175, '2025-08-27', '17:00:00', '17:30:00', 'Available', 1),
(1735, 23, 176, '2025-08-28', '07:00:00', '07:30:00', 'Available', 1),
(1736, 23, 176, '2025-08-28', '07:30:00', '08:00:00', 'Available', 1),
(1737, 23, 176, '2025-08-28', '08:00:00', '08:30:00', 'Available', 1),
(1738, 23, 176, '2025-08-28', '08:30:00', '09:00:00', 'Available', 1),
(1739, 23, 176, '2025-08-28', '09:00:00', '09:30:00', 'Available', 1),
(1740, 23, 176, '2025-08-28', '09:30:00', '10:00:00', 'Available', 1),
(1741, 23, 176, '2025-08-28', '10:00:00', '10:30:00', 'Available', 1),
(1742, 23, 176, '2025-08-28', '10:30:00', '11:00:00', 'Available', 1),
(1743, 23, 176, '2025-08-28', '11:00:00', '11:30:00', 'Available', 1),
(1744, 23, 176, '2025-08-28', '11:30:00', '12:00:00', 'Available', 1),
(1745, 23, 177, '2025-08-28', '13:30:00', '14:00:00', 'Available', 1),
(1746, 23, 177, '2025-08-28', '14:00:00', '14:30:00', 'Available', 1),
(1747, 23, 177, '2025-08-28', '14:30:00', '15:00:00', 'Available', 1),
(1748, 23, 177, '2025-08-28', '15:00:00', '15:30:00', 'Available', 1),
(1749, 23, 177, '2025-08-28', '15:30:00', '16:00:00', 'Available', 1),
(1750, 23, 177, '2025-08-28', '16:00:00', '16:30:00', 'Available', 1),
(1751, 23, 177, '2025-08-28', '16:30:00', '17:00:00', 'Available', 1),
(1752, 23, 177, '2025-08-28', '17:00:00', '17:30:00', 'Available', 1),
(1753, 23, 178, '2025-08-29', '07:00:00', '07:30:00', 'Available', 1),
(1754, 23, 178, '2025-08-29', '07:30:00', '08:00:00', 'Available', 1),
(1755, 23, 178, '2025-08-29', '08:00:00', '08:30:00', 'Available', 1),
(1756, 23, 178, '2025-08-29', '08:30:00', '09:00:00', 'Available', 1),
(1757, 23, 178, '2025-08-29', '09:00:00', '09:30:00', 'Available', 1),
(1758, 23, 178, '2025-08-29', '09:30:00', '10:00:00', 'Available', 1),
(1759, 23, 178, '2025-08-29', '10:00:00', '10:30:00', 'Available', 1),
(1760, 23, 178, '2025-08-29', '10:30:00', '11:00:00', 'Available', 1),
(1761, 23, 178, '2025-08-29', '11:00:00', '11:30:00', 'Available', 1),
(1762, 23, 178, '2025-08-29', '11:30:00', '12:00:00', 'Available', 1),
(1763, 23, 179, '2025-08-29', '13:30:00', '14:00:00', 'Available', 1),
(1764, 23, 179, '2025-08-29', '14:00:00', '14:30:00', 'Available', 1),
(1765, 23, 179, '2025-08-29', '14:30:00', '15:00:00', 'Available', 1),
(1766, 23, 179, '2025-08-29', '15:00:00', '15:30:00', 'Available', 1),
(1767, 23, 179, '2025-08-29', '15:30:00', '16:00:00', 'Available', 1),
(1768, 23, 179, '2025-08-29', '16:00:00', '16:30:00', 'Available', 1),
(1769, 23, 179, '2025-08-29', '16:30:00', '17:00:00', 'Available', 1),
(1770, 23, 179, '2025-08-29', '17:00:00', '17:30:00', 'Available', 1),
(1771, 23, 180, '2025-08-30', '07:00:00', '07:30:00', 'Available', 1),
(1772, 23, 180, '2025-08-30', '07:30:00', '08:00:00', 'Available', 1),
(1773, 23, 180, '2025-08-30', '08:00:00', '08:30:00', 'Available', 1),
(1774, 23, 180, '2025-08-30', '08:30:00', '09:00:00', 'Available', 1),
(1775, 23, 180, '2025-08-30', '09:00:00', '09:30:00', 'Available', 1),
(1776, 23, 180, '2025-08-30', '09:30:00', '10:00:00', 'Available', 1),
(1777, 23, 180, '2025-08-30', '10:00:00', '10:30:00', 'Available', 1),
(1778, 23, 180, '2025-08-30', '10:30:00', '11:00:00', 'Available', 1),
(1779, 23, 180, '2025-08-30', '11:00:00', '11:30:00', 'Available', 1),
(1780, 23, 180, '2025-08-30', '11:30:00', '12:00:00', 'Available', 1),
(1781, 23, 181, '2025-08-30', '13:30:00', '14:00:00', 'Available', 1),
(1782, 23, 181, '2025-08-30', '14:00:00', '14:30:00', 'Available', 1),
(1783, 23, 181, '2025-08-30', '14:30:00', '15:00:00', 'Available', 1),
(1784, 23, 181, '2025-08-30', '15:00:00', '15:30:00', 'Available', 1),
(1785, 23, 181, '2025-08-30', '15:30:00', '16:00:00', 'Available', 1),
(1786, 23, 181, '2025-08-30', '16:00:00', '16:30:00', 'Available', 1),
(1787, 23, 181, '2025-08-30', '16:30:00', '17:00:00', 'Available', 1),
(1788, 23, 181, '2025-08-30', '17:00:00', '17:30:00', 'Available', 1),
(1789, 25, 182, '2025-08-25', '07:00:00', '07:30:00', 'Available', 1),
(1790, 25, 182, '2025-08-25', '07:30:00', '08:00:00', 'Available', 1),
(1791, 25, 182, '2025-08-25', '08:00:00', '08:30:00', 'Available', 1),
(1792, 25, 182, '2025-08-25', '08:30:00', '09:00:00', 'Available', 1),
(1793, 25, 182, '2025-08-25', '09:00:00', '09:30:00', 'Available', 1),
(1794, 25, 182, '2025-08-25', '09:30:00', '10:00:00', 'Available', 1),
(1795, 25, 182, '2025-08-25', '10:00:00', '10:30:00', 'Available', 1),
(1796, 25, 182, '2025-08-25', '10:30:00', '11:00:00', 'Available', 1),
(1797, 25, 182, '2025-08-25', '11:00:00', '11:30:00', 'Available', 1),
(1798, 25, 182, '2025-08-25', '11:30:00', '12:00:00', 'Available', 1),
(1799, 25, 183, '2025-08-25', '13:30:00', '14:00:00', 'Available', 1),
(1800, 25, 183, '2025-08-25', '14:00:00', '14:30:00', 'Available', 1),
(1801, 25, 183, '2025-08-25', '14:30:00', '15:00:00', 'Available', 1),
(1802, 25, 183, '2025-08-25', '15:00:00', '15:30:00', 'Available', 1),
(1803, 25, 183, '2025-08-25', '15:30:00', '16:00:00', 'Available', 1),
(1804, 25, 183, '2025-08-25', '16:00:00', '16:30:00', 'Available', 1),
(1805, 25, 183, '2025-08-25', '16:30:00', '17:00:00', 'Available', 1),
(1806, 25, 183, '2025-08-25', '17:00:00', '17:30:00', 'Available', 1),
(1807, 25, 184, '2025-08-26', '07:00:00', '07:30:00', 'Available', 1),
(1808, 25, 184, '2025-08-26', '07:30:00', '08:00:00', 'Available', 1),
(1809, 25, 184, '2025-08-26', '08:00:00', '08:30:00', 'Available', 1),
(1810, 25, 184, '2025-08-26', '08:30:00', '09:00:00', 'Available', 1),
(1811, 25, 184, '2025-08-26', '09:00:00', '09:30:00', 'Available', 1),
(1812, 25, 184, '2025-08-26', '09:30:00', '10:00:00', 'Available', 1),
(1813, 25, 184, '2025-08-26', '10:00:00', '10:30:00', 'Available', 1),
(1814, 25, 184, '2025-08-26', '10:30:00', '11:00:00', 'Available', 1),
(1815, 25, 184, '2025-08-26', '11:00:00', '11:30:00', 'Available', 1),
(1816, 25, 184, '2025-08-26', '11:30:00', '12:00:00', 'Available', 1),
(1817, 25, 185, '2025-08-26', '13:30:00', '14:00:00', 'Available', 1),
(1818, 25, 185, '2025-08-26', '14:00:00', '14:30:00', 'Available', 1),
(1819, 25, 185, '2025-08-26', '14:30:00', '15:00:00', 'Available', 1),
(1820, 25, 185, '2025-08-26', '15:00:00', '15:30:00', 'Available', 1),
(1821, 25, 185, '2025-08-26', '15:30:00', '16:00:00', 'Available', 1),
(1822, 25, 185, '2025-08-26', '16:00:00', '16:30:00', 'Available', 1),
(1823, 25, 185, '2025-08-26', '16:30:00', '17:00:00', 'Available', 1),
(1824, 25, 185, '2025-08-26', '17:00:00', '17:30:00', 'Available', 1),
(1825, 25, 186, '2025-08-27', '07:00:00', '07:30:00', 'Available', 1),
(1826, 25, 186, '2025-08-27', '07:30:00', '08:00:00', 'Available', 1),
(1827, 25, 186, '2025-08-27', '08:00:00', '08:30:00', 'Available', 1),
(1828, 25, 186, '2025-08-27', '08:30:00', '09:00:00', 'Available', 1),
(1829, 25, 186, '2025-08-27', '09:00:00', '09:30:00', 'Available', 1),
(1830, 25, 186, '2025-08-27', '09:30:00', '10:00:00', 'Available', 1),
(1831, 25, 186, '2025-08-27', '10:00:00', '10:30:00', 'Available', 1),
(1832, 25, 186, '2025-08-27', '10:30:00', '11:00:00', 'Available', 1),
(1833, 25, 186, '2025-08-27', '11:00:00', '11:30:00', 'Available', 1),
(1834, 25, 186, '2025-08-27', '11:30:00', '12:00:00', 'Available', 1),
(1835, 25, 187, '2025-08-27', '13:30:00', '14:00:00', 'Available', 1),
(1836, 25, 187, '2025-08-27', '14:00:00', '14:30:00', 'Available', 1),
(1837, 25, 187, '2025-08-27', '14:30:00', '15:00:00', 'Available', 1),
(1838, 25, 187, '2025-08-27', '15:00:00', '15:30:00', 'Available', 1),
(1839, 25, 187, '2025-08-27', '15:30:00', '16:00:00', 'Available', 1),
(1840, 25, 187, '2025-08-27', '16:00:00', '16:30:00', 'Available', 1),
(1841, 25, 187, '2025-08-27', '16:30:00', '17:00:00', 'Available', 1),
(1842, 25, 187, '2025-08-27', '17:00:00', '17:30:00', 'Available', 1),
(1843, 25, 188, '2025-08-28', '07:00:00', '07:30:00', 'Available', 1),
(1844, 25, 188, '2025-08-28', '07:30:00', '08:00:00', 'Available', 1),
(1845, 25, 188, '2025-08-28', '08:00:00', '08:30:00', 'Available', 1),
(1846, 25, 188, '2025-08-28', '08:30:00', '09:00:00', 'Available', 1),
(1847, 25, 188, '2025-08-28', '09:00:00', '09:30:00', 'Available', 1),
(1848, 25, 188, '2025-08-28', '09:30:00', '10:00:00', 'Available', 1),
(1849, 25, 188, '2025-08-28', '10:00:00', '10:30:00', 'Available', 1),
(1850, 25, 188, '2025-08-28', '10:30:00', '11:00:00', 'Available', 1),
(1851, 25, 188, '2025-08-28', '11:00:00', '11:30:00', 'Available', 1),
(1852, 25, 188, '2025-08-28', '11:30:00', '12:00:00', 'Available', 1),
(1853, 25, 189, '2025-08-28', '13:30:00', '14:00:00', 'Available', 1),
(1854, 25, 189, '2025-08-28', '14:00:00', '14:30:00', 'Available', 1),
(1855, 25, 189, '2025-08-28', '14:30:00', '15:00:00', 'Available', 1),
(1856, 25, 189, '2025-08-28', '15:00:00', '15:30:00', 'Available', 1),
(1857, 25, 189, '2025-08-28', '15:30:00', '16:00:00', 'Available', 1),
(1858, 25, 189, '2025-08-28', '16:00:00', '16:30:00', 'Available', 1),
(1859, 25, 189, '2025-08-28', '16:30:00', '17:00:00', 'Available', 1),
(1860, 25, 189, '2025-08-28', '17:00:00', '17:30:00', 'Available', 1),
(1861, 25, 190, '2025-08-29', '07:00:00', '07:30:00', 'Available', 1),
(1862, 25, 190, '2025-08-29', '07:30:00', '08:00:00', 'Available', 1),
(1863, 25, 190, '2025-08-29', '08:00:00', '08:30:00', 'Available', 1),
(1864, 25, 190, '2025-08-29', '08:30:00', '09:00:00', 'Available', 1),
(1865, 25, 190, '2025-08-29', '09:00:00', '09:30:00', 'Available', 1),
(1866, 25, 190, '2025-08-29', '09:30:00', '10:00:00', 'Available', 1),
(1867, 25, 190, '2025-08-29', '10:00:00', '10:30:00', 'Available', 1),
(1868, 25, 190, '2025-08-29', '10:30:00', '11:00:00', 'Available', 1),
(1869, 25, 190, '2025-08-29', '11:00:00', '11:30:00', 'Available', 1),
(1870, 25, 190, '2025-08-29', '11:30:00', '12:00:00', 'Available', 1),
(1871, 25, 191, '2025-08-29', '13:30:00', '14:00:00', 'Available', 1),
(1872, 25, 191, '2025-08-29', '14:00:00', '14:30:00', 'Available', 1),
(1873, 25, 191, '2025-08-29', '14:30:00', '15:00:00', 'Available', 1),
(1874, 25, 191, '2025-08-29', '15:00:00', '15:30:00', 'Available', 1),
(1875, 25, 191, '2025-08-29', '15:30:00', '16:00:00', 'Available', 1),
(1876, 25, 191, '2025-08-29', '16:00:00', '16:30:00', 'Available', 1),
(1877, 25, 191, '2025-08-29', '16:30:00', '17:00:00', 'Available', 1),
(1878, 25, 191, '2025-08-29', '17:00:00', '17:30:00', 'Available', 1),
(1879, 25, 192, '2025-08-30', '07:00:00', '07:30:00', 'Available', 1),
(1880, 25, 192, '2025-08-30', '07:30:00', '08:00:00', 'Available', 1),
(1881, 25, 192, '2025-08-30', '08:00:00', '08:30:00', 'Available', 1),
(1882, 25, 192, '2025-08-30', '08:30:00', '09:00:00', 'Available', 1),
(1883, 25, 192, '2025-08-30', '09:00:00', '09:30:00', 'Available', 1),
(1884, 25, 192, '2025-08-30', '09:30:00', '10:00:00', 'Available', 1),
(1885, 25, 192, '2025-08-30', '10:00:00', '10:30:00', 'Available', 1),
(1886, 25, 192, '2025-08-30', '10:30:00', '11:00:00', 'Available', 1),
(1887, 25, 192, '2025-08-30', '11:00:00', '11:30:00', 'Available', 1),
(1888, 25, 192, '2025-08-30', '11:30:00', '12:00:00', 'Available', 1),
(1889, 25, 193, '2025-08-30', '13:30:00', '14:00:00', 'Available', 1),
(1890, 25, 193, '2025-08-30', '14:00:00', '14:30:00', 'Available', 1),
(1891, 25, 193, '2025-08-30', '14:30:00', '15:00:00', 'Available', 1),
(1892, 25, 193, '2025-08-30', '15:00:00', '15:30:00', 'Available', 1),
(1893, 25, 193, '2025-08-30', '15:30:00', '16:00:00', 'Available', 1),
(1894, 25, 193, '2025-08-30', '16:00:00', '16:30:00', 'Available', 1),
(1895, 25, 193, '2025-08-30', '16:30:00', '17:00:00', 'Available', 1),
(1896, 25, 193, '2025-08-30', '17:00:00', '17:30:00', 'Available', 1);

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
(71, 15, '2025-07-19', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-07-19 14:45:40', '2025-07-19 14:45:40'),
(72, 15, '2025-07-19', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-07-19 14:45:42', '2025-07-19 14:45:42'),
(73, 15, '2025-07-22', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-07-22 08:38:09', '2025-07-22 08:38:09'),
(74, 15, '2025-07-23', 'Ca chiều', '13:30:00', '17:30:00', 'Cancelled', '2025-07-23 09:01:48', '2025-07-23 09:02:13'),
(75, 15, '2025-07-24', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-07-24 05:46:53', '2025-07-24 05:46:53'),
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
(121, 15, '2025-08-23', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-19 02:43:21', '2025-08-19 02:43:21'),
(122, 15, '2025-08-25', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 03:37:31', '2025-08-25 03:37:31'),
(123, 15, '2025-08-25', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 03:37:32', '2025-08-25 03:37:32'),
(124, 15, '2025-08-26', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 03:37:37', '2025-08-25 03:37:37'),
(125, 15, '2025-08-26', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 03:37:37', '2025-08-25 03:37:37'),
(126, 15, '2025-08-27', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 03:37:41', '2025-08-25 03:37:41'),
(127, 15, '2025-08-27', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 03:37:42', '2025-08-25 03:37:42'),
(128, 15, '2025-08-28', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 03:37:45', '2025-08-25 03:37:45'),
(129, 15, '2025-08-28', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 03:37:45', '2025-08-25 03:37:45'),
(130, 15, '2025-08-29', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 03:37:49', '2025-08-25 03:37:49'),
(131, 15, '2025-08-29', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 03:37:49', '2025-08-25 03:37:49'),
(132, 15, '2025-08-30', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 03:37:57', '2025-08-25 03:37:57'),
(133, 15, '2025-08-30', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 03:37:57', '2025-08-25 03:37:57'),
(134, 28, '2025-08-25', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:11:55', '2025-08-25 04:11:55'),
(135, 28, '2025-08-25', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:11:56', '2025-08-25 04:11:56'),
(136, 28, '2025-08-26', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:11:59', '2025-08-25 04:11:59'),
(137, 28, '2025-08-26', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:11:59', '2025-08-25 04:11:59'),
(138, 28, '2025-08-27', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:12:02', '2025-08-25 04:12:02'),
(139, 28, '2025-08-27', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:12:03', '2025-08-25 04:12:03'),
(140, 28, '2025-08-28', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:12:05', '2025-08-25 04:12:05'),
(141, 28, '2025-08-28', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:12:06', '2025-08-25 04:12:06'),
(142, 28, '2025-08-29', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:12:11', '2025-08-25 04:12:11'),
(143, 28, '2025-08-29', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:12:11', '2025-08-25 04:12:11'),
(144, 28, '2025-08-30', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:12:15', '2025-08-25 04:12:15'),
(145, 28, '2025-08-30', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:12:15', '2025-08-25 04:12:15'),
(146, 27, '2025-08-25', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:13:05', '2025-08-25 04:13:05'),
(147, 27, '2025-08-25', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:13:06', '2025-08-25 04:13:06'),
(148, 27, '2025-08-26', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:13:09', '2025-08-25 04:13:09'),
(149, 27, '2025-08-26', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:13:09', '2025-08-25 04:13:09'),
(150, 27, '2025-08-27', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:13:12', '2025-08-25 04:13:12'),
(151, 27, '2025-08-27', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:13:12', '2025-08-25 04:13:12'),
(152, 27, '2025-08-28', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:13:15', '2025-08-25 04:13:15'),
(153, 27, '2025-08-28', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:13:16', '2025-08-25 04:13:16'),
(154, 27, '2025-08-29', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:13:19', '2025-08-25 04:13:19'),
(155, 27, '2025-08-29', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:13:20', '2025-08-25 04:13:20'),
(156, 27, '2025-08-30', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:13:23', '2025-08-25 04:13:23'),
(157, 27, '2025-08-30', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:13:23', '2025-08-25 04:13:23'),
(158, 26, '2025-08-25', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:13:54', '2025-08-25 04:13:54'),
(159, 26, '2025-08-25', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:13:54', '2025-08-25 04:13:54'),
(160, 26, '2025-08-26', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:13:57', '2025-08-25 04:13:57'),
(161, 26, '2025-08-26', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:13:58', '2025-08-25 04:13:58'),
(162, 26, '2025-08-27', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:14:01', '2025-08-25 04:14:01'),
(163, 26, '2025-08-27', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:14:02', '2025-08-25 04:14:02'),
(164, 26, '2025-08-28', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:14:05', '2025-08-25 04:14:05'),
(165, 26, '2025-08-28', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:14:05', '2025-08-25 04:14:05'),
(166, 26, '2025-08-29', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:14:09', '2025-08-25 04:14:09'),
(167, 26, '2025-08-29', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:14:10', '2025-08-25 04:14:10'),
(168, 26, '2025-08-30', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:14:13', '2025-08-25 04:14:13'),
(169, 26, '2025-08-30', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:14:13', '2025-08-25 04:14:13'),
(170, 23, '2025-08-25', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:14:37', '2025-08-25 04:14:37'),
(171, 23, '2025-08-25', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:14:38', '2025-08-25 04:14:38'),
(172, 23, '2025-08-26', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:14:43', '2025-08-25 04:14:43'),
(173, 23, '2025-08-26', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:14:43', '2025-08-25 04:14:43'),
(174, 23, '2025-08-27', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:14:46', '2025-08-25 04:14:46'),
(175, 23, '2025-08-27', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:14:46', '2025-08-25 04:14:46'),
(176, 23, '2025-08-28', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:14:49', '2025-08-25 04:14:49'),
(177, 23, '2025-08-28', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:14:49', '2025-08-25 04:14:49'),
(178, 23, '2025-08-29', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:14:52', '2025-08-25 04:14:52'),
(179, 23, '2025-08-29', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:14:52', '2025-08-25 04:14:52'),
(180, 23, '2025-08-30', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:14:55', '2025-08-25 04:14:55'),
(181, 23, '2025-08-30', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:14:55', '2025-08-25 04:14:55'),
(182, 25, '2025-08-25', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:15:22', '2025-08-25 04:15:22'),
(183, 25, '2025-08-25', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:15:22', '2025-08-25 04:15:22'),
(184, 25, '2025-08-26', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:15:25', '2025-08-25 04:15:25'),
(185, 25, '2025-08-26', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:15:26', '2025-08-25 04:15:26'),
(186, 25, '2025-08-27', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:15:30', '2025-08-25 04:15:30'),
(187, 25, '2025-08-27', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:15:30', '2025-08-25 04:15:30'),
(188, 25, '2025-08-28', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:15:33', '2025-08-25 04:15:33'),
(189, 25, '2025-08-28', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:15:34', '2025-08-25 04:15:34'),
(190, 25, '2025-08-29', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:15:37', '2025-08-25 04:15:37'),
(191, 25, '2025-08-29', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:15:38', '2025-08-25 04:15:38'),
(192, 25, '2025-08-30', 'Ca sáng', '07:00:00', '12:00:00', 'Active', '2025-08-25 04:15:41', '2025-08-25 04:15:41'),
(193, 25, '2025-08-30', 'Ca chiều', '13:30:00', '17:30:00', 'Active', '2025-08-25 04:15:41', '2025-08-25 04:15:41');

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
  `blood_pressure` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Huyết áp (mmHg)',
  `heart_rate` int DEFAULT NULL COMMENT 'Nhịp tim (lần/phút)',
  `weight` decimal(5,2) DEFAULT NULL COMMENT 'Cân nặng (kg)',
  `height` decimal(5,2) DEFAULT NULL COMMENT 'Chiều cao (cm)',
  `symptoms` json DEFAULT NULL COMMENT 'Danh sách triệu chứng',
  `allergies` json DEFAULT NULL COMMENT 'Danh sách dị ứng',
  `medications` json DEFAULT NULL COMMENT 'Danh sách thuốc đang dùng',
  `diagnosis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `recommendations` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT 'Khuyến nghị và hướng dẫn',
  `follow_up_date` date DEFAULT NULL COMMENT 'Ngày tái khám',
  `status` enum('draft','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Trạng thái hồ sơ',
  `treatment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `medical_records`
--

INSERT INTO `medical_records` (`id`, `appointment_id`, `doctor_id`, `patient_id`, `temperature`, `blood_pressure`, `heart_rate`, `weight`, `height`, `symptoms`, `allergies`, `medications`, `diagnosis`, `recommendations`, `follow_up_date`, `status`, `treatment`, `notes`, `created_at`, `updated_at`) VALUES
(16, 83, 15, 15, 35.0, '115', 78, 45.00, 160.00, '[\"Sốt\"]', '[\"Lông thú\"]', '[\"Vitamin\"]', 'Thiếu máu', 'Ăn uống nghỉ ngơi đầy đủ', '2025-08-29', 'completed', NULL, 'Đau đầu ', '2025-08-25 11:22:18', '2025-08-25 04:22:18'),
(17, 84, 28, 15, 35.0, '122', 78, 46.00, 167.00, '[\"Đau đầu\"]', '[\"Phấn hoa\"]', '[\"Thực phẩm chức năng\"]', 'Thiếu ngủ máu lên não ít', 'Nghỉ ngơi đầy đủ', NULL, 'draft', NULL, 'Chóng mặt', '2025-08-25 11:32:56', '2025-08-25 04:32:56'),
(18, 88, 15, 3, 35.0, '112', 75, 65.00, 171.00, '[\"Chán ăn\", \"Đau đầu\"]', '[\"Aspirin\"]', '[\"Không có\"]', 'Thiếu máu não', 'Bổ sung sắt', NULL, 'completed', NULL, 'mệt mỏi', '2025-08-25 11:50:29', '2025-08-25 04:50:29');

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
(18, 15, 5, 'bác sĩ tận tâm', '2025-08-25 11:27:32', 15, 83, 'approved'),
(19, 3, 4, 'Bác sĩ tận tình', '2025-08-25 11:51:15', 15, 88, 'approved');

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
(1, 'Nội khoa', '/uploads/1756087790355-ná»i khoa.jpg', 100000),
(2, 'Da liễu', '/uploads/1756087803565-da liá»u.jpg', 100000),
(3, 'Tai mũi họng', '/uploads/1756087814764-tai mÅ©i há»ng.jpg', 100000),
(4, 'Khoa tim mạch', '/uploads/1756087825289-tim máº¡ch.jpg', 123000),
(5, 'Khoa thần kinh', '/uploads/1756087837275-tháº§n kinh.jpg', 100000),
(6, 'Khoa xương khớp', '/uploads/1756087849695-xÆ°Æ¡ng khá»p.jpg', 456000),
(7, 'Khoa xét nghiệm', '/uploads/1756087863679-Khoa xÃ©t nghiá»m.jpg', 100000),
(8, 'Mắt', '/uploads/1756087873648-máº¯t.jpg', 450000),
(9, 'Khoa tiêu hóa', '/uploads/1756087885214-tiÃªu hÃ³a.jpg', 456000),
(10, 'Khoa hô hấp', '/uploads/1756087896185-hÃ´ háº¥p.jpg', 250000);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT cho bảng `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `chat_rooms`
--
ALTER TABLE `chat_rooms`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT cho bảng `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT cho bảng `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT cho bảng `doctor_time_slot`
--
ALTER TABLE `doctor_time_slot`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1897;

--
-- AUTO_INCREMENT cho bảng `doctor_work_shifts`
--
ALTER TABLE `doctor_work_shifts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=194;

--
-- AUTO_INCREMENT cho bảng `medical_records`
--
ALTER TABLE `medical_records`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

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
