-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 28, 2025 at 05:08 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `datn`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `role_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `phone`, `created_at`, `role_id`) VALUES
(1, 'Nguyễn Văn Admin', 'admin@example.com', '123456', '0909009001', '2025-06-07 14:02:51', 1);

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` enum('Nam','Nữ','Khác') COLLATE utf8mb4_general_ci DEFAULT 'Khác',
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `reason` text COLLATE utf8mb4_general_ci,
  `payment_status` enum('Chưa thanh toán','Đã thanh toán') COLLATE utf8mb4_general_ci DEFAULT 'Chưa thanh toán',
  `doctor_confirmation` enum('Chưa xác nhận','Đã xác nhận','Từ chối') COLLATE utf8mb4_general_ci DEFAULT 'Chưa xác nhận',
  `time_slot_id` int DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Chưa xác nhận',
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `name`, `age`, `gender`, `email`, `phone`, `customer_id`, `doctor_id`, `reason`, `payment_status`, `doctor_confirmation`, `time_slot_id`, `status`, `address`) VALUES
(1, 'Nguyễn Văn A', 32, 'Nam', 'a@gmail.com', '0123456789', NULL, 1, 'Khám tổng quát', 'Đã thanh toán', 'Đã xác nhận', NULL, 'Chưa xác nhận', NULL),
(2, 'Trần Thị B', 28, 'Nữ', 'b@gmail.com', '0987654321', NULL, 2, 'Nổi mẩn da', 'Chưa thanh toán', 'Chưa xác nhận', NULL, 'Chưa xác nhận', NULL),
(3, 'Nguyễn Minh Tuấn', 40, 'Nữ', 'ntmtuan205@gmail.com', '0889130129', NULL, 1, '', 'Chưa thanh toán', 'Chưa xác nhận', NULL, 'Chưa xác nhận', NULL),
(5, 'Nguyễn Văn Chính', 20, 'Nam', 'vanchinh20055@gmail.com', '0335942740', NULL, 8, 'demo code', 'Chưa thanh toán', 'Chưa xác nhận', 241, 'Chưa xác nhận', 'Thượng Sơn'),
(8, 'LÊ CÔNG TUẤN', 33, 'Khác', 'tuanlcpd10779@gmail.com', '0342907002', 3, 15, 'cvxcvxvc', 'Chưa thanh toán', 'Chưa xác nhận', 206, 'Đã xác nhận', 'vs'),
(17, 'LÊ CÔNG TUẤN', 42, 'Nam', 'tuanlcpd10779@gmail.com', '0342907002', 3, 15, 'fsdafds', 'Chưa thanh toán', 'Chưa xác nhận', 306, 'Chưa xác nhận', ''),
(18, 'LÊ CÔNG TUẤN', 43, 'Nữ', 'tuanlcpd10779@gmail.com', '0342907002', 3, 15, 'beba', 'Chưa thanh toán', 'Chưa xác nhận', 307, 'Chưa xác nhận', 'k47 nguyễn lương bằng'),
(19, 'Phan viết lực ', 43, 'Nam', 'tuanlcpd10779@gmail.com', '0342907002', 3, 15, 'áccss', 'Chưa thanh toán', 'Đã xác nhận', 308, 'Đã xác nhận', 'k47 nguyễn lương bằng'),
(20, 'LÊ CÔNG TUẤN  444', 55, 'Nam', 'tuanlcpd10779@gmail.com', '0342907002', 3, 15, 'zvvxc', 'Chưa thanh toán', 'Chưa xác nhận', 309, 'Đã xác nhận', 'fafsgsad');

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `logo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `logo`) VALUES
(1, 'Panadol', ''),
(2, 'Efferalgan', ''),
(3, 'Salonpas', ''),
(4, 'DHG', ''),
(5, 'Stada', ''),
(6, 'Vidipha\r\n', ''),
(7, 'P/H', ''),
(8, 'Vitamin C', '');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int NOT NULL,
  `customer_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `content` text COLLATE utf8mb4_general_ci,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `customer_id`, `product_id`, `content`, `created_at`) VALUES
(1, 1, 1, 'Thuốc tốt, giao nhanh.', '2025-06-07 14:02:51'),
(2, 2, 2, 'Dùng ổn, không tác dụng phụ.', '2025-06-07 14:02:51');

-- --------------------------------------------------------

--
-- Table structure for table `comment_likes`
--

CREATE TABLE `comment_likes` (
  `id` int NOT NULL,
  `comment_id` int DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comment_likes`
--

INSERT INTO `comment_likes` (`id`, `comment_id`, `customer_id`, `created_at`) VALUES
(1, 1, 2, '2025-06-07 14:02:51'),
(2, 2, 1, '2025-06-07 14:02:51');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gender` enum('Nam','Nữ','Khác') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `address` text COLLATE utf8mb4_general_ci,
  `avatar` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `role_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `email`, `password`, `phone`, `gender`, `birthday`, `address`, `avatar`, `is_verified`, `created_at`, `role_id`) VALUES
(1, 'Trần Thị Khách', 'khach1@example.com', '123456', '0909123456', NULL, NULL, '123 Lê Lợi, Q1', NULL, 0, '2025-06-07 14:02:51', 2),
(2, 'Phạm Văn Mua', 'khach2@example.com', '123456', '0909234567', NULL, NULL, '456 Nguyễn Huệ, Q1', NULL, 0, '2025-06-07 14:02:51', 2),
(3, 'LÊ CÔNG TUẤN', 'tuanlcpd10779@gmail.com', '$2b$10$YPtKLl4SwNUWh9yzJ467se6e.1WI8MBQl2Qo1ugImzJsKEK0TKfr6', '0342907002', NULL, NULL, 'k47 nguyễn lương bằng', NULL, 1, NULL, 2),
(4, '1', '1@gmail.com', '$2b$10$ismZdaLNyA799ui91w8THuSzyBoubxrb8mNC6mWzT6SJW/awONtGe', '1', NULL, NULL, '1', NULL, 0, NULL, 2),
(5, 'Nguyễn Văn Chinh', 'vanchinh@gmail.com', '$2b$10$6xSocNzDeYLYwuViP33SD.G9TWBP/mV9mWtAmQEhML.RSu3LY4Cvy', '0344757955', 'Nam', '0000-00-00', 'Hà Tĩnh', '/uploads/1750822486115-Blue Pink Modern Flat Illustrative Heart Care Logo.png', 0, NULL, 2),
(8, 'Nguyễn Văn A', 'chubedu2005@gmail.com', '$2b$10$SR76wvO5gccaCmikmOWCS.wVTdMLOalSw6PlAPee1a1wbz81eWXFK', '0909123456', NULL, NULL, NULL, NULL, 0, NULL, 2),
(9, 'Nguyễn Văn A', 'vchinh2705@gmail.com', '$2b$10$rJ/ioYSMDxpbBPgDiqQwleMnMmswjM92R.cAVF3X.7cpGJ2RIEIEy', '0909123456', NULL, NULL, NULL, NULL, 1, NULL, 2),
(13, 'Nguyễn Minh Tuấn', 'ntmtuan205@gmail.com', '$2b$10$wXrLj515PQKLdOcNfojS..nrdtCW6FjOOe5kiJQTC.cFse5ID66K.', '0889130129', NULL, NULL, NULL, NULL, 0, NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `specialization_id` int DEFAULT NULL,
  `img` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `introduction` text COLLATE utf8mb4_general_ci COMMENT 'Mô tả, giới thiệu về bác sĩ',
  `certificate_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `degree_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'URL hình ảnh bằng cấp',
  `experience` text COLLATE utf8mb4_general_ci,
  `account_status` varchar(50) COLLATE utf8mb4_general_ci DEFAULT '''active''',
  `role_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `name`, `phone`, `email`, `password`, `specialization_id`, `img`, `introduction`, `certificate_image`, `degree_image`, `experience`, `account_status`, `role_id`) VALUES
(1, 'BS. Nguyễn Bác Sĩ', '0909345678', 'bs1@example.com', '$2b$10$abc123Bs1', 1, 'nguyenbacsi.jpg', 'Giáo sư, Tiến sĩ hàng đầu trong lĩnh vực Nội khoa, với hơn 30 năm kinh nghiệm khám và điều trị.', '1751077687528-3.png', '1751077687531-1.png', '', 'active', 3),
(2, 'BS. Trần Da Liễu', '0909456789', 'bs2@example.com', '$2b$10$def456Bs2', 2, 'trandalieu.jpg', 'Chuyên gia Da liễu với nhiều năm kinh nghiệm điều trị các bệnh về da, đặc biệt là da thẩm mỹ và laser.', 'cert_bs2.jpg', 'https://i.imgur.com/T0azHTQ.jpeg', NULL, 'active', 3),
(3, 'BS. Nguyễn Văn Nam', '0909123456', 'bs3@example.com', '$2b$10$ghi789Bs3', 3, 'nguyenvannam.jpg', NULL, 'cert_bs3.jpg', NULL, NULL, 'active', 3),
(4, 'BS. Phan Văn Hào', '0909234567', 'bs4@example.com', '$2b$10$jkl012Bs4', 4, 'phanvanhao.jpg', NULL, 'cert_bs4.jpg', NULL, NULL, 'active', 3),
(5, 'BS. Hà Hồng Nhi', '0909345678', 'bs5@example.com', '$2b$10$mno345Bs5', 5, 'hahongnhi.jpg', NULL, 'cert_bs5.jpg', NULL, NULL, 'active', 3),
(6, 'BS. Lê Văn Anh', '0909456789', 'bs6@example.com', '$2b$10$pqr678Bs6', 6, 'levananh.jpg', NULL, 'cert_bs6.jpg', NULL, NULL, 'active', 3),
(7, 'BS. Hà Huy Nam', '0909456789', 'bs7@example.com', '$2b$10$stu901Bs7', 7, 'hahuynam.jpg', NULL, 'cert_bs7.jpg', NULL, NULL, 'active', 3),
(8, 'BS. Trần Văn Trường', '0909930102', 'bs8@example.com', '$2b$10$vwx234Bs8', 8, 'tranvantruong.jpg', NULL, 'cert_bs8.jpg', NULL, NULL, 'active', 3),
(9, 'BS. Trần Đình Long', '0909457892', 'bs9@example.com', '$2b$10$yzA567Bs9', 9, 'trandinhlong.jpg', NULL, 'cert_bs9.jpg', NULL, NULL, 'active', 3),
(10, 'BS. Hà Huy Nam', '0909143678', 'bs10@example.com', '$2b$10$BCD890Bs10', 10, 'hahuynam.jpg', NULL, 'cert_bs10.jpg', NULL, NULL, 'active', 3),
(12, 'VĂN CHINH', '0335942740', 'zvonimihenry7962@gmail.com', '$2b$10$F2xcC7KttOQXNaCUVTXY.uO/me9j/Ac7mBT1GDDjDyna/DvMvr12e', 1, '1751083761966-Thiáº¿t káº¿ chÆ°a cÃ³ tÃªn.png', 'tôi là chú bé đần', '1751083761968-sublikere.png', '1751083761967-2.png', '3 năm trong abcxyz', 'active', 3),
(13, 'abcd', NULL, 'nguyenvanchinh200506@gmail.com', '$2b$10$XWAeDWIQLkgPpebHuOBm0.zUT9GJLpETPkm5zIeImNZY9ks/cesea', 8, NULL, NULL, NULL, NULL, NULL, 'active', 3),
(15, 'Tun Lê', '0342907002', 'tuanlcpd10779@gmail.com', '$2b$10$mPBcduGUFPdbQ7evOhdXvuAEwyYdneq6T1sf8VWj3iAR0U6Lz6AGK', 1, '1751116345174-TDCARE.png', 'ng', '1751116345179-TDCARE.png', '1751116345179-TDCARE.png', 'gs', 'active', 3);

-- --------------------------------------------------------

--
-- Table structure for table `doctor_time_slot`
--

CREATE TABLE `doctor_time_slot` (
  `id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `slot_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctor_time_slot`
--

INSERT INTO `doctor_time_slot` (`id`, `doctor_id`, `slot_date`, `start_time`, `end_time`) VALUES
(206, 15, '2025-06-30', '08:00:00', '09:00:00'),
(207, 1, '2025-06-30', '09:15:00', '10:15:00'),
(208, 1, '2025-06-30', '10:30:00', '11:30:00'),
(209, 1, '2025-06-30', '13:30:00', '14:30:00'),
(210, 1, '2025-06-30', '14:45:00', '15:45:00'),
(211, 2, '2025-06-30', '08:00:00', '09:00:00'),
(212, 2, '2025-06-30', '09:15:00', '10:15:00'),
(213, 2, '2025-06-30', '10:30:00', '11:30:00'),
(214, 2, '2025-06-30', '13:30:00', '14:30:00'),
(215, 2, '2025-06-30', '14:45:00', '15:45:00'),
(216, 3, '2025-06-30', '08:00:00', '09:00:00'),
(217, 3, '2025-06-30', '09:15:00', '10:15:00'),
(218, 3, '2025-06-30', '10:30:00', '11:30:00'),
(219, 3, '2025-06-30', '13:30:00', '14:30:00'),
(220, 3, '2025-06-30', '14:45:00', '15:45:00'),
(221, 4, '2025-06-30', '08:00:00', '09:00:00'),
(222, 4, '2025-06-30', '09:15:00', '10:15:00'),
(223, 4, '2025-06-30', '10:30:00', '11:30:00'),
(224, 4, '2025-06-30', '13:30:00', '14:30:00'),
(225, 4, '2025-06-30', '14:45:00', '15:45:00'),
(226, 5, '2025-06-30', '08:00:00', '09:00:00'),
(227, 5, '2025-06-30', '09:15:00', '10:15:00'),
(228, 5, '2025-06-30', '10:30:00', '11:30:00'),
(229, 5, '2025-06-30', '13:30:00', '14:30:00'),
(230, 5, '2025-06-30', '14:45:00', '15:45:00'),
(231, 6, '2025-06-30', '08:00:00', '09:00:00'),
(232, 6, '2025-06-30', '09:15:00', '10:15:00'),
(233, 6, '2025-06-30', '10:30:00', '11:30:00'),
(234, 6, '2025-06-30', '13:30:00', '14:30:00'),
(235, 6, '2025-06-30', '14:45:00', '15:45:00'),
(236, 7, '2025-06-30', '08:00:00', '09:00:00'),
(237, 7, '2025-06-30', '09:15:00', '10:15:00'),
(238, 7, '2025-06-30', '10:30:00', '11:30:00'),
(239, 7, '2025-06-30', '13:30:00', '14:30:00'),
(240, 7, '2025-06-30', '14:45:00', '15:45:00'),
(241, 8, '2025-06-30', '08:00:00', '09:00:00'),
(242, 8, '2025-06-30', '09:15:00', '10:15:00'),
(243, 8, '2025-06-30', '10:30:00', '11:30:00'),
(244, 8, '2025-06-30', '13:30:00', '14:30:00'),
(245, 8, '2025-06-30', '14:45:00', '15:45:00'),
(246, 9, '2025-06-30', '08:00:00', '09:00:00'),
(247, 9, '2025-06-30', '09:15:00', '10:15:00'),
(248, 9, '2025-06-30', '10:30:00', '11:30:00'),
(249, 9, '2025-06-30', '13:30:00', '14:30:00'),
(250, 9, '2025-06-30', '14:45:00', '15:45:00'),
(251, 10, '2025-06-30', '08:00:00', '09:00:00'),
(252, 10, '2025-06-30', '09:15:00', '10:15:00'),
(253, 10, '2025-06-30', '10:30:00', '11:30:00'),
(254, 10, '2025-06-30', '13:30:00', '14:30:00'),
(255, 10, '2025-06-30', '14:45:00', '15:45:00'),
(256, 1, '2025-06-24', '08:00:00', '09:00:00'),
(257, 1, '2025-06-24', '09:15:00', '10:15:00'),
(258, 1, '2025-06-24', '10:30:00', '11:30:00'),
(259, 1, '2025-06-24', '13:30:00', '14:30:00'),
(260, 1, '2025-06-24', '14:45:00', '15:45:00'),
(261, 2, '2025-06-24', '08:00:00', '09:00:00'),
(262, 2, '2025-06-24', '09:15:00', '10:15:00'),
(263, 2, '2025-06-24', '10:30:00', '11:30:00'),
(264, 2, '2025-06-24', '13:30:00', '14:30:00'),
(265, 2, '2025-06-24', '14:45:00', '15:45:00'),
(266, 3, '2025-06-24', '08:00:00', '09:00:00'),
(267, 3, '2025-06-24', '09:15:00', '10:15:00'),
(268, 3, '2025-06-24', '10:30:00', '11:30:00'),
(269, 3, '2025-06-24', '13:30:00', '14:30:00'),
(270, 3, '2025-06-24', '14:45:00', '15:45:00'),
(271, 4, '2025-06-24', '08:00:00', '09:00:00'),
(272, 4, '2025-06-24', '09:15:00', '10:15:00'),
(273, 4, '2025-06-24', '10:30:00', '11:30:00'),
(274, 4, '2025-06-24', '13:30:00', '14:30:00'),
(275, 4, '2025-06-24', '14:45:00', '15:45:00'),
(276, 5, '2025-06-24', '08:00:00', '09:00:00'),
(277, 5, '2025-06-24', '09:15:00', '10:15:00'),
(278, 5, '2025-06-24', '10:30:00', '11:30:00'),
(279, 5, '2025-06-24', '13:30:00', '14:30:00'),
(280, 5, '2025-06-24', '14:45:00', '15:45:00'),
(281, 6, '2025-06-24', '08:00:00', '09:00:00'),
(282, 6, '2025-06-24', '09:15:00', '10:15:00'),
(283, 6, '2025-06-24', '10:30:00', '11:30:00'),
(284, 6, '2025-06-24', '13:30:00', '14:30:00'),
(285, 6, '2025-06-24', '14:45:00', '15:45:00'),
(286, 7, '2025-06-24', '08:00:00', '09:00:00'),
(287, 7, '2025-06-24', '09:15:00', '10:15:00'),
(288, 7, '2025-06-24', '10:30:00', '11:30:00'),
(289, 7, '2025-06-24', '13:30:00', '14:30:00'),
(290, 7, '2025-06-24', '14:45:00', '15:45:00'),
(291, 8, '2025-06-24', '08:00:00', '09:00:00'),
(292, 8, '2025-06-24', '09:15:00', '10:15:00'),
(293, 8, '2025-06-24', '10:30:00', '11:30:00'),
(294, 8, '2025-06-24', '13:30:00', '14:30:00'),
(295, 8, '2025-06-24', '14:45:00', '15:45:00'),
(296, 9, '2025-06-24', '08:00:00', '09:00:00'),
(297, 9, '2025-06-24', '09:15:00', '10:15:00'),
(298, 9, '2025-06-24', '10:30:00', '11:30:00'),
(299, 9, '2025-06-24', '13:30:00', '14:30:00'),
(300, 9, '2025-06-24', '14:45:00', '15:45:00'),
(301, 10, '2025-06-24', '08:00:00', '09:00:00'),
(302, 10, '2025-06-24', '09:15:00', '10:15:00'),
(303, 10, '2025-06-24', '10:30:00', '11:30:00'),
(304, 10, '2025-06-24', '13:30:00', '14:30:00'),
(305, 10, '2025-06-24', '14:45:00', '15:45:00'),
(306, 15, '2025-06-30', '09:15:00', '10:15:00'),
(307, 15, '2025-06-30', '10:30:00', '11:30:00'),
(308, 15, '2025-06-30', '13:30:00', '14:30:00'),
(309, 15, '2025-06-30', '14:45:00', '15:45:00');

-- --------------------------------------------------------

--
-- Table structure for table `medical_records`
--

CREATE TABLE `medical_records` (
  `id` int NOT NULL,
  `appointment_id` int DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `diagnosis` text COLLATE utf8mb4_general_ci,
  `treatment` text COLLATE utf8mb4_general_ci,
  `notes` text COLLATE utf8mb4_general_ci,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medical_records`
--

INSERT INTO `medical_records` (`id`, `appointment_id`, `doctor_id`, `customer_id`, `diagnosis`, `treatment`, `notes`, `created_at`) VALUES
(1, 1, 1, 1, 'Cảm cúm', 'Nghỉ ngơi và uống thuốc hạ sốt', 'Theo dõi 3 ngày', '2025-06-07 14:02:51'),
(2, 2, 2, 2, 'Viêm da nhẹ', 'Bôi thuốc và tránh tiếp xúc hóa chất', 'Tái khám sau 1 tuần', '2025-06-07 14:02:51'),
(3, 8, 15, 3, 'eff', 'fdads', 'đà', '2025-06-28 23:11:42'),
(4, 20, 15, 3, 'ry', 'xhfdh', 'vb', '2025-06-29 00:06:46');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `customer_id` int DEFAULT NULL,
  `order_date` datetime DEFAULT NULL,
  `status` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `payment_status` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_id`, `order_date`, `status`, `total_amount`, `payment_status`) VALUES
(1, 1, '2025-06-07 14:02:51', 'Đã giao', 40000.00, 'Đã thanh toán'),
(2, 2, '2025-06-07 14:02:51', 'Đang xử lý', 25000.00, 'Chưa thanh toán');

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 1, 1, 15000.00),
(2, 1, 2, 1, 25000.00),
(3, 2, 2, 1, 25000.00);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `method` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `method`, `status`, `payment_date`) VALUES
(1, 1, 'Tiền mặt', 'Đã thanh toán', '2025-06-07 14:02:51'),
(2, 2, 'Chuyển khoản', 'Chờ thanh toán', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `prescriptions`
--

CREATE TABLE `prescriptions` (
  `id` int NOT NULL,
  `appointment_id` int DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prescriptions`
--

INSERT INTO `prescriptions` (`id`, `appointment_id`, `doctor_id`, `customer_id`, `created_at`) VALUES
(1, 1, 1, 1, '2025-06-07 14:02:51'),
(2, 2, 2, 2, '2025-06-07 14:02:51');

-- --------------------------------------------------------

--
-- Table structure for table `prescription_items`
--

CREATE TABLE `prescription_items` (
  `id` int NOT NULL,
  `prescription_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `dosage` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `duration` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prescription_items`
--

INSERT INTO `prescription_items` (`id`, `prescription_id`, `product_id`, `dosage`, `duration`) VALUES
(1, 1, 1, '2 viên/ngày', '5 ngày'),
(2, 2, 2, '1 viên/ngày', '7 ngày');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `brand_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `stock`, `created_at`, `image`, `brand_id`) VALUES
(1, 'Paracetamol 500mg', 'Thuốc hạ sốt, giảm đau thông dụng.', 15000.00, 200, '2025-06-07 14:02:51', 'paracetamol.jpg', 1),
(2, 'Vitamin C 1000mg', 'Tăng cường đề kháng.', 25000.00, 300, '2025-06-07 14:02:51', 'vitaminc.jpg', 8),
(3, 'Bột sủi Efferalgan 150mg', 'Thành phần\r\nCông dụng\r\nCách dùng\r\nTác dụng phụ\r\nLưu ý\r\nBảo quản\r\nBột sủi Efferalgan 150mg là gì?\r\n\r\nKích thước chữ\r\n\r\nMặc định\r\n\r\nLớn hơn\r\n\r\nThành phần của Bột sủi Efferalgan 150mg\r\nThông tin thành phần\r\n\r\nHàm lượng\r\n\r\nParacetamol\r\n\r\n150mg\r\n\r\nCông dụng của Bột sủi Efferalgan 150mg\r\nChỉ định\r\nThuốc Efferalgal gói 150 mg được chỉ định trong các trường hợp:\r\n\r\nĐiều trị triệu chứng đau từ nhẹ đến vừa và/hoặc sốt. Dạng bào chế và hàm lượng phù hợp cho trẻ em cân nặng từ 10 - 40 kg (khoảng 2 đến 11 tuổi).\r\nDược lực học\r\nParacetamol là thuốc giảm đau và hạ sốt với hoạt tính chống viêm nhẹ. Không giống như các thuốc chống viêm không steroid (NSAID) truyền thống, paracetamol không ức chế chức năng tiểu cầu ở liều điều trị.\r\n\r\nGiảm đau\r\n\r\nCơ chế tác dụng giảm đau chưa được xác định đầy đủ. Paracetamol có thể tác dụng chủ yếu bằng cách ức chế số lượng các đường giảm đau bao gồm tổng hợp prostaglandin ở hệ thần kinh trung ương (CNS) và ở mức độ ít hơn, thông qua tác dụng ngoại biên bằng cách ngăn chặn sự tạo thành xung động đau hoặc bằng cách ức chế sự tổng hợp hoặc tác dụng của các chất khác mà thụ thể nhận cảm đau nhạy với kích thích cơ học hoặc hóa học.\r\n\r\nHạ sốt\r\n\r\nParacetamol có thể hạ sốt bằng cách tác động chủ yếu lên trung tâm điều nhiệt ở vùng dưới đồi. Tác động chủ yếu này có thể liên quan đến sự ức chế tổng hợp prostaglandin ở vùng dưới đồi.\r\n\r\nDược động học\r\nSự hấp thu\r\n\r\nParacetamol khi uống sẽ được hấp thu nhanh và hoàn toàn. Nồng độ đỉnh trong huyết tương đạt được khoảng 10 - 60 phút sau khi uống (xem Các đặc tính dược lý, Dược động học, các nhóm bệnh nhân đặc biệt).\r\n\r\nPhân bố\r\n\r\nParacetamol được phân bố nhanh vào hầu hết các mô.\r\n\r\nỞ người lớn, thể tích phân bố của paracetamol khoảng 1 - 2 lít/kg và ở trẻ em trong khoảng từ 0,7 - 1,0 lít/kg.\r\n\r\nParacetamol không gắn kết mạnh với protein huyết tương.\r\n\r\nChuyển hoá\r\n\r\nParacetamol được chuyển hoá chủ yếu ở gan theo hai con đường chính tại gan: Liên hợp với acid glucuronic và liên hợp với acid sulfuric; Liên hợp với acid sulfuric nhanh chóng bão hoà khi dùng liều cao hơn nhưng vẫn trong phạm vi liều điều trị. Sự bão hoà của quá trình glucoronid hoá chỉ xuất hiện khi dùng liều cao hơn, gây độc cho gan.\r\n\r\nMột phần nhỏ (dưới 4%) được chuyến hoá bởi cytochrom P450 tạo thành một chất trung gian có tính phản ứng cao (N-acetyl benzoquinoneimin), trong điều kiện sử dụng thông thường, chất trung gian này sẽ được giải độc bằng khử glutathion và được đào thải qua nước tiểu sau khi liên hợp với cystein và acid mercapturic. Tuy nhiên, khi ngộ độc với liều cao paracetamol, lượng chất chuyển hóa có độc tính này tăng lên.\r\n\r\nThải trừ\r\n\r\nCác chất chuyển hoá của paracetamol chủ yếu được đào thải qua nước tiểu, ở người lớn, khoảng 90% liều dùng được bài tiết trong 24 giờ, chủ yếu dưới dạng liên hợp glucuronid (khoảng 60%) và liên hợp sulfat (khoảng 30%). Dưới 5% được thải trừ ở dạng không đổi.\r\n\r\nThời gian bán thải trong huyết tương khoảng 2 giờ.\r\n\r\nCác nhóm bệnh nhân đặc biệt\r\n\r\nSuy thận\r\n\r\nKhi suy thận nặng, sự thải trừ paracetamol hơi chậm. Đối với các dạng liên hợp glucuronid và liên hợp sulfat, tốc độ đào thải chậm hơn ở người bị suy thận nặng so với người khỏe mạnh. Khoảng thời gian tối thiểu giữa mỗi lần dùng thuốc là 6 giờ hoặc 8 giờ khi dùng paracetamol cho những bệnh nhân này (xem Liều lượng và Cách dùng, Suy thận).\r\n\r\nSuy gan\r\n\r\nMột số thử nghiệm lâm sàng đã cho thấy sự suy giảm trung bình của chuyển hoá paracetamol ở bệnh nhân suy gan mạn tính, bao gồm cả xơ gan do rượu, như được thể hiện bởi sự tăng nồng độ paracetamol trong huyết tương và thời gian bán thải dài hơn.\r\n\r\nTrong những báo cáo này, thời gian bán thải của paracetamol trong huyết tương có liên quan với giảm khả năng tổng hợp của gan, nên thận trọng khi sử dụng paracetamol ở bệnh nhân suy gan và chống chỉ định khi có bệnh gan còn bù thể hoạt động, đặc biệt là viêm gan do rượu, do cảm ứng CYP2E1, dẫn đến tăng hình thành các chất chuyển hoá gây độc cho gan của paracetamol.\r\n\r\nNgười cao tuổi\r\n\r\nỞ các đối tượng cao tuổi, dược động học và chuyển hóa của paracetamol thay đổi nhẹ, hoặc không thay đổi. Không cần điều chỉnh liều ở nhóm bệnh nhân này.\r\n\r\nTrẻ sơ sinh, trẻ nhỏ và trẻ em\r\n\r\nCác thông số dược động học của paracetamol quan sát được ở trẻ nhỏ và trẻ em cũng tương tự như đã quan sát thấy ở người lớn, ngoại trừ thời gian bán thải trong huyết tương hơi ngắn hơn (khoảng 2 giờ) so với ở người lớn.\r\n\r\nỞ trẻ sơ sinh, thời gian bán thải trong huyết tương dài hơn so với ở trẻ nhỏ (khoảng 3,5 giờ).\r\n\r\nTrẻ sơ sinh, trẻ nhỏ và trẻ em đến 10 tuổi bài tiết chất liên hợp glucuronid ít hơn đáng kể và chất liên hợp sulfat nhiều hơn đáng kể so với người lớn. Tổng lượng bài tiết paracetamol và các chất chuyển hoá của nó là như nhau ở mọi lứa tuổi.\r\n\r\nCách dùng Bột sủi Efferalgan 150mg\r\nCách dùng\r\nThuốc Efferalgan 150mg được dùng đường uống.\r\n\r\nĐổ bột thuốc vào cốc và sau đó thêm một ít đồ uống lỏng (như nước, sữa, nước trái cây), uống ngay sau khi hoà tan hoàn toàn.\r\n\r\nNếu trẻ sốt trên 38,5°C hãy làm những bước sau đây đồ tăng hiệu quả của việc dùng thuốc:\r\n\r\nCởi bỏ bớt quần áo của trẻ.\r\nCho trẻ uống thêm chất lỏng.\r\nKhông để trẻ ở nơi quá nóng.\r\nNếu cần, tắm cho trẻ bằng nước ấm có nhiệt độ thấp hơn 2°C so với thân nhiệt của trẻ.\r\nLiều dùng\r\nTrẻ em\r\n\r\nDạng thuốc này dành cho trẻ em cân nặng từ 10 đến 40 kg (khoảng 2 tuổi đến 11 tuổi).\r\n\r\nLưu ý: Liều dùng phải được tính theo cân nặng của trẻ.\r\n\r\nTuổi thích hợp tương ứng với cân nặng được trình bày bên dưới chỉ để tham khảo. Để tránh nguy cơ quá liều, cần kiểm tra và xác nhận các thuốc dùng kèm (bao gồm cả thuốc kê đơn và không kê đơn) không chứa paracetamol.\r\n\r\nEfferalgan nên được dùng ở liều tư 10 - 15 mg/kg/liều, mỗi 4 đến 6 giờ, đến tổng liều tối đa mỗi ngày là 60 mg/kg/ngày. Liều tối đa mỗi ngày không được vượt quá 3 g.\r\n\r\nCân nặng (kg)	Tuổi thích hợp* (năm)	Hàm lượng Paracetamol/liều (mg)	Số gói/ liều dùng	Khoáng cách tối thiểu dùng thuốc (giờ)	Liều dùng tối đa mỗi ngày (gói)\r\n10 đến < 15	2 đến < 4	150	1	6	\r\n4\r\n\r\n(600 mg)\r\n\r\n15 đến < 20	4 đến < 6	150	1	4	\r\n6\r\n\r\n(900 mg)\r\n\r\n20 đến < 30	9 đến < 11	300	2	6	\r\n8\r\n\r\n(1200 mg)\r\n\r\n30 đến < 40	≥11	300	2	4	\r\n12\r\n\r\n(1800 mg)\r\n\r\n≥ 40	>13	Dùng một dạng thuốc uống khác thay thế\r\n(*) Khoảng tuổi thích hợp tương ứng với cân nặng chỉ để tham khảo.\r\n\r\nSuy thận\r\n\r\nỞ bệnh nhân suy thận nặng, khoảng cảch tối thiểu giữa mỗi lần dùng thuốc nên được điều chỉnh theo bảng sau:\r\n\r\nĐộ thanh thải Creatinin	Khoảng cách dùng thuốc\r\nCl ≥ 50 ml/phút	4 giờ\r\nCl 10-50 ml/phút	6 giờ\r\nCl < 10 ml/phút	8 giờ\r\nSuy gan\r\n\r\nỞ bệnh nhân suy chức năng gan, phải giảm liều hoặc kéo dài khoảng cách giữa mỗi lần dùng thuốc. Liều tối đa mỗi ngày không nên vượt quá 60 mg/kg/ngày (không quá 2 g/ngày) trong các trường hợp sau:\r\n\r\nNgười lớn cân nặng dưới 50 kg.\r\nBệnh gan mạn tính hoặc bệnh gan còn bù thể hoạt động, đặc biệt ở những bệnh nhân suy tế bào gan từ nhẹ đến vừa.\r\nHội chứng Gilbert (tăng bilirubin máu có tính gia đình).\r\nNghiện rượu mạn tính.\r\nSuy dinh dưỡng kéo dài (kém dự trữ glutathion ở gan).\r\nMất nước.\r\nLưu ý: Liều dùng trên chỉ mang tính chất tham khảo. Liều dùng cụ thể tuỳ thuộc vào thể trạng và mức độ diễn tiến của bệnh. Để có liều dùng phù hợp, bạn cần tham khảo ý kiến bác sĩ hoặc chuyên viên y tế\r\n\r\nLàm gì khi dùng quá liều?\r\nThông báo ngay cho bác sĩ và đưa ngay đến bệnh viện trường hợp dùng quá liều hoặc nhỡ bị ngộ độc.\r\n\r\nDấu hiệu và triệu chứng\r\n\r\nCó thể gặp nguy cơ ngộ độc, đặc biệt ở người bệnh gan, ở bệnh nhân suy dinh dưỡng kéo dài và người dùng thuốc cảm ứng enzym. Đặc biệt, quá liều có thể dẫn đến tử vong trong những trường hợp này.\r\n\r\nNhững triệu chứng thường xuất hiện trong 24 giờ đầu, gồm buồn nôn, nôn, chán ăn, da tái, khó chịu và đổ mồ hôi.\r\n\r\nQuá liều khi dùng một liều cao hơn 7,5 g paracetamol ở người lớn, hoặc 140 mg/kg thể trọng ở trẻ em sẽ gây viêm và huỷ tế bào gan, có thể gây hoại tử gan hoàn toàn và không hồi phục, kéo theo suy tế bào gan, nhiễm acid chuyển hoá và bệnh não dẫn tới hôn mê và tử vong.\r\n\r\nĐồng thời, có tăng nồng độ transaminase gan (AST, ALT), lactate dehydrogenase và bilirubin cùng với giảm mức prothrombin, có thể xảy ra từ 12 – 48 giờ sau khi dùng thuốc. Các triệu chứng lâm sàng của tổn thương gan thường trở nên rõ rệt lúc ban đầu sau 1 - 2 ngày và đạt tối đa sau 3 – 4 ngày.\r\n\r\nCác biện pháp cấp cứu\r\n\r\nĐưa ngay đến bệnh viện\r\n\r\nTrước khi bắt đầu điều trị, phải lấy một ống máu càng sớm càng tốt để định lượng nồng độ paracetamol trong huyết tương nhưng không được sớm hơn 4 giờ sau khi uống paracetamol.\r\n\r\nĐào thải nhanh lượng thuốc đã dùng bằng rửa dạ dày.\r\n\r\nLiệu pháp giải độc chính là dùng nhưng hợp chất sulfhydryl, có lẽ tác động một phần do bổ sung dự trữ glutathion ở gan.\r\n\r\nN-acetylcystein có tác dụng khi uống hoặc tiêm tĩnh mạch. Phải dùng thuốc giải độc ngay lập tức, càng sớm càng tốt nếu chưa đến 36 giờ kể từ khi uống paracetamol. Điều trị với N-acetylcystein có hiệu quả hơn trong thời gian dưới 10 giờ sau khi uống paracetamol.\r\n\r\nKhi cho uống, hoà loãng dung dịch N-acetylcystein với nước hoặc đồ uống không có rượu để đạt dung dịch 5% và phải uống trong vòng 1 giờ sau khi pha.\r\n\r\nCho uống N-acetylcystein với liều đầu tiên là 140 mg/kg, sau đó cho tiếp 17 liều nữa, mỗi liều 70 mg/kg cách nhau 4 giờ một lần. Chấm dứt điều trị nếu xét nghiệm paracetamol trong huyết tương cho thấy nguy cơ độc hại gan thấp.\r\n\r\nCũng có thể dùng N-acetylcystein theo đường tĩnh mạch: Liều ban đầu là 150 mg/kg, pha trong 200 ml glucose 5%, tiêm tĩnh mạch trong 15 phút; sau đó truyền tĩnh mạch liều 50 mg/kg trong 500ml glucose 5% trong 4 giờ; tiếp theo là 100 mg/kg trong 1 lít dung dịch trong vòng 16 giờ tiếp theo.\r\n\r\nNếu không có dung dịch glucose 5% thì có thể dùng dung dịch natri clorid 0,9%.\r\n\r\nTác dụng không mong muốn của N-acetylcystein gồm ban da (gồm cả mày đay, không yêu cầu phải ngưng thuốc), buồn nôn, nôn, tiêu chảy và phản ứng kiểu phản vệ.\r\n\r\nNếu không có N-acetylcystein, có thể dùng methionin. Nếu đã dùng than hoạt trước khi dùng methionin thì phải hút than hoạt và/hoặc thuốc tẩy muối do chúng có khả năng làm giảm hấp thụ paracetamol.\r\n\r\nĐiều trị triệu chứng\r\n\r\nPhải tiến hành làm xét nghiệm về gan lúc khởi đầu điều trị và nhắc lại mỗi 24 giờ.\r\n\r\nTrong hầu hết trường hợp, transaminase gan trở lại mức bình thường sau 1 - 2 tuần với sự phục hồi đầy đủ chức năng gan. Trong trường hợp quá nặng, có thể cần phải ghép gan.\r\n\r\nLàm gì khi quên 1 liều?\r\nBổ sung liều ngay khi nhớ ra. Tuy nhiên, nếu thời gian giãn cách với liều tiếp theo quá ngắn thì bỏ qua liều đã quên và tiếp tục lịch dùng thuốc. Không dùng liều gấp đôi để bù cho liều đã bị bỏ lỡ.\r\n\r\nTác dụng phụ\r\nKhi sử dụng thuốc Efferalgan 150mg, bạn có thể gặp các tác dụng không mong muốn (ADR).\r\n\r\nRối loạn hệ máu và bạch huyết: Giảm lượng tiểu cầu, giảm bạch cầu trung tính, giảm bạch cầu.\r\nRối loạn tiêu hóa: Tiêu chảy, đau bụng.\r\nRối loạn gan mật: Tăng enzym gan.\r\nRối loạn hệ miễn dịch: Phản ứng phản vệ, phù Quincke, quá mẫn.\r\nThăm khám cận lâm sàng: Giảm/tăng chỉ số INR.\r\nRối loạn da và mô dưới da: Mày đay, ban đỏ, phát ban, hội chứng ngoại ban mụn mủ toàn thân cấp tính, hội chứng hoại tử da nhiễm độc, hội chứng Stevens-Johnson.\r\nRối loạn mạch: Hạ huyết áp (triệu chứng của quá mẫn).\r\nHướng dẫn cách xử trí ADR\r\n\r\nThông báo ngay cho Bác sĩ hoặc Dược sĩ những phản ứng có hại gặp phải khi sử dụng thuốc.\r\n\r\nLưu ý\r\nTrước khi sử dụng thuốc bạn cần đọc kỹ hướng dẫn sử dụng và tham khảo thông tin bên dưới.\r\n\r\nChống chỉ định\r\nThuốc Efferalgan 150mg không được dùng trong những trường hợp sau:\r\n\r\nBiết có dị ứng với paracetamol hoặc với propacetamol hydroclorid (tiền chất của paracetamol) hoặc các thành phần khác của thuốc.\r\nBệnh gan nặng hoặc bệnh gan thể hoạt động.\r\nPhenylketonuria (một loại bệnh di truyền phát hiện lúc sinh), do có aspartam.\r\nKhông dung nạp với fructose (vì sự có mặt của sorbitol).\r\nThiếu hụt men Glucose-6-Phosphate Dehydrogenase (G6PD).\r\nThận trọng khi sử dụng\r\nTrường hợp có bệnh gan nặng hoặc bệnh thận (phải hỏi ý kiến bác sĩ trước khi dùng paracetamol).\r\n\r\nChán ăn, chứng ăn vô độ hoặc suy mòn, suy dinh dưỡng kéo dài (kém dự trữ glutathion ở gan).\r\n\r\nMất nước, giảm thể tích máu.\r\n\r\nBác sĩ cần cảnh báo bệnh nhân về các dấu hiệu của phản ứng trên da nghiêm trọng như hội chứng Stevens-Johnson (SJS), hội chứng hoại tử da nhiễm độc (TEN) hay hội chứng Lyell, hội chứng ngoại ban mụn mủ toàn thân cấp tính (AGEP).\r\n\r\nNếu triệu chứng đau dai dẳng quá 5 ngày hoặc còn sốt quá 3 ngày hoặc thuốc chưa đủ hiệu quả hoặc thấy xuất hiện các triệu chứng khác, không tiếp tục điều trị mà không hỏi ý kiến bác sĩ.\r\n\r\nDo có sorbitol nên thuốc này không được sử dụng trong trường hợp không dung nạp với fructose.\r\n\r\nỞ bệnh nhân đang thực hiện chế độ ăn kiêng muối, cần nhớ là trong mỗi gói thuốc có chứa 55,7 mg natri để tính vào khẩu phần ăn hằng ngày.\r\n\r\nKhả năng lái xe và vận hành máy móc\r\nKhông ảnh hưởng.\r\n\r\nThời kỳ mang thai\r\nParacetamol chỉ nên được dùng cho phụ nữ mang thai sau khi đã được đánh giá cẩn thận giữa lợi ích điều trị và nguy cơ ở bệnh nhân mang thai, liều khuyến cáo và thời gian dùng thuốc phải được theo dõi chặt chẽ.\r\n\r\nThời kỳ cho con bú\r\nCần thận trọng khi áp dụng.\r\n\r\nTương tác thuốc\r\nNếu bác sĩ chỉ định đo nồng độ acid uric hoặc đường huyết, bạn cần báo bác sĩ là con bạn đang dùng thuốc này.\r\n\r\nẢnh hưởng của Efferalgan lên các thuốc khác\r\n\r\nEfferalgan 150mg có thể làm tăng khả năng xảy ra các tác dụng không mong muốn khi dùng với các thuốc khác.\r\n\r\nThuốc chống đông máu: Uống dài ngày liều cao paracetamol làm tăng nhẹ tác dụng chống đông của coumarin và dẫn chất indandion.\r\n\r\nẢnh hưởng của các thuốc khác lên Efferalgan\r\n\r\nSử dụng đồng thời với phenytoin, barbiturat, carbamazepin có thể dẫn đến giảm hiệu quả của paracetamol và làm tăng nguy cơ độc tính đối với gan. Những bệnh nhân đang điều trị bằng phenytoin nên tránh dùng paracetamol liều lớn và/hoặc kéo dài. Cần theo dõi bệnh nhân về dấu hiệu độc tính đối với gan.\r\n\r\nProbenecid có thể làm giảm gần 2 lần về độ thanh thải của paracetamol bằng cách ức chế sự liên hợp của nó với acid glucuronic. Nên xem xét giảm liều paracetamol khi sử dụng đồng thời với probenecid.\r\n\r\nSalicylamid có thể kéo dài thời gian bán thải (t1/2) của paracetamol.\r\n\r\nCác chất gây cảm ứng enzym: Cần thận trọng khi sử dụng đồng thời paracetamol với các chất gây cảm ứng enzym gan như barbiturat, isoniazid, carbamazepin, rifampicin và ethanol...\r\n\r\nBảo quản\r\nĐể nơi khô mát, tránh ánh sáng, nhiệt độ dưới 30⁰C. Để xa tầm tay trẻ em.', 3360.00, 300, '2025-06-09 21:20:47', 'botsui.jpg', 2),
(4, 'Cao dán Salonpas Hisamitsu', 'Thành phần\r\nCông dụng\r\nCách dùng\r\nTác dụng phụ\r\nLưu ý\r\nBảo quản\r\nCao dán Salonpas là gì?\r\n\r\nKích thước chữ\r\n\r\nMặc định\r\n\r\nLớn hơn\r\n\r\nThành phần của Cao dán Salonpas\r\nThông tin thành phần\r\n\r\nHàm lượng\r\n\r\nTocopherol acetate\r\n\r\n2%\r\n\r\nL-menthol\r\n\r\n5.71%\r\n\r\nDL-camphor\r\n\r\n1.24%\r\n\r\nMethyl salicylate\r\n\r\n6.29%\r\n\r\nCông dụng của Cao dán Salonpas\r\nChỉ định\r\nThuốc Cao dán Salonpas được chỉ định dùng giảm đau, kháng viêm trong các cơn đau liên quan đến:\r\n\r\nĐau vai;\r\nĐau lưng;\r\nĐau cơ, mỏi cơ;\r\nĐau khớp;\r\nBầm tím, bong gân, căng cơ;\r\nĐau đầu, đau răng.\r\nDược lực học\r\nChưa có dữ liệu.\r\n\r\nDược động học\r\nChưa có dữ liệu.\r\n\r\nCách dùng Cao dán Salonpas\r\nCách dùng\r\nDán ngoài da.\r\n\r\nLiều dùng\r\nNgười lớn và trẻ em từ 12 tuổi trở lên\r\n\r\nRửa sạch, lau khô vùng da bị đau.\r\n\r\nGỡ miếng cao dán ra khỏi tấm phim.\r\n\r\nDán vào chỗ bị đau không quá 3 lần trong ngày và không quá 7 ngày.\r\n\r\nGỡ miếng cao dán ra khỏi da sau 8 giờ dán.\r\n\r\nTrẻ em dưới 12 tuổi\r\n\r\nPhải hỏi ý kiến Bác sĩ trước khi sử dụng.\r\n\r\nLưu ý: liều dùng trên chỉ mang tính chất tham khảo. Liều dùng cụ thể tùy thuộc vào thể trạng và mức độ diễn tiến của bệnh. Để có liều dùng phù hợp, bạn cần tham khảo ý kiến bác sĩ hoặc chuyên viên y tế.\r\n\r\nLàm gì khi dùng quá liều?\r\nTrong trường hợp khẩn cấp, hãy gọi ngay cho Trung tâm cấp cứu 115 hoặc đến trạm Y tế địa phương gần nhất.\r\n\r\nLàm gì khi quên 1 liều?\r\nBệnh nhân chỉ cần dùng khi có cảm giác đau mà không cần cố định thời gian sử dụng.\r\n\r\nTác dụng phụ\r\nCác phản ứng da như đỏ da, ngứa, phát ban, sưng hoặc phồng rộp có thể xảy ra. Nếu các triệu chứng xảy ra quá mức, ngừng sử dụng cao dán.\r\n\r\nLưu ý\r\nTrước khi sử dụng thuốc bạn cần đọc kỹ hướng dẫn sử dụng và tham khảo thông tin bên dưới.\r\n\r\nChống chỉ định\r\nThuốc cao dán chống chỉ định trong các trường hợp sau:\r\n\r\nKhông sử dụng trên vùng da tổn thương, vết thương hở, trên mắt, vùng da quanh mắt, niêm mạc.\r\nDị ứng với một trong các thành phần của thuốc.\r\nKhông dùng thuốc cho trẻ em dưới 30 tháng tuổi, trẻ em có tiền sử động kinh hoặc co giật do sốt cao.\r\nThận trọng khi sử dụng\r\nChỉ dùng ngoài da.\r\n\r\nKhông dùng vào mục đích khác ngoài chỉ định.\r\n\r\nKhông dùng chung với băng dán nóng.\r\n\r\nKhông băng chặt.\r\n\r\nHỏi ý kiến Bác sĩ trước khi sử dụng nếu:\r\n\r\nDị ứng với thuốc dùng ngoài da.\r\n\r\nĐang dùng thuốc khác.\r\n\r\nPhụ nữ có thai hoặc đang cho con bú.\r\n\r\nNgưng sử dụng và hỏi ý kiến bác sĩ nếu: Tình trạng xấu đi, triệu chứng kéo dài hơn 7 ngày hay hết rồi tái phát vài ngày sau đó, nổi mụn nước hoặc kích ứng da quá mức.\r\n\r\nĐể xa tầm tay trẻ em. Nếu nuốt phải hãy đến bác sĩ hay trạm y tế gần nhất.\r\n\r\nKhả năng lái xe và vận hành máy móc\r\nKhông ảnh hưởng đến khả năng lái xe và vận hành máy móc.\r\n\r\nThời kỳ mang thai\r\nThận trọng khi sử dụng.\r\n\r\nThời kỳ cho con bú\r\nThận trọng khi sử dụng.\r\n\r\nTương tác thuốc\r\nVới một lượng rất nhỏ hoạt chất được hấp thu vào cơ thể sẽ không làm tăng khả năng tương tác với các thuốc khác.\r\n\r\nVới bệnh nhân đang dùng các thuốc chống đông đường uống (warfarin), việc sử dụng quá mức sẽ làm tăng nguy cơ chảy máu.\r\n\r\nCó tương tác hỗ trợ với các thuốc giảm đau khác.\r\n\r\nBảo quản\r\nBảo quản dưới 30°C, tránh ánh sáng trực tiếp.\r\n\r\n', 3480.00, 350, '2025-06-09 21:20:47', 'caodan.jpg', 3),
(5, 'Bột Hapacol 80 DHG', 'Thành phần\r\nCông dụng\r\nCách dùng\r\nTác dụng phụ\r\nLưu ý\r\nBảo quản\r\nBột Hapacol 80 là gì?\r\n\r\nKích thước chữ\r\n\r\nMặc định\r\n\r\nLớn hơn\r\n\r\nThành phần của Bột Hapacol 80\r\nThông tin thành phần\r\n\r\nHàm lượng\r\n\r\nParacetamol\r\n\r\n80mg\r\n\r\nCông dụng của Bột Hapacol 80\r\nChỉ định\r\nThuốc Hapacol 80 được chỉ định dùng trong các trường hợp sau:\r\n\r\nHạ sốt, giảm đau cho trẻ trong các trường hợp: Cảm, cúm, sốt xuất huyết, nhiễm khuẩn, nhiễm siêu vi, mọc răng, sau khi tiêm chủng, sau phẫu thuật.\r\n\r\nDược lực học\r\nParacetamol tác động lên trung tâm điều nhiệt ở vùng dưới đồi gây hạ nhiệt, tăng tỏa nhiệt do giãn mạch và tăng lưu lượng máu ngoại biên làm giảm thân nhiệt ở người bị sốt, nhưng hiếm khi làm giảm thân nhiệt bình thường. Paracetamol làm giảm đau bằng cách nâng ngưỡng chịu đau lên.\r\n\r\nỞ liều điều trị, hiệu quả giảm đau, hạ sốt tương đương aspirin nhưng paracetamol ít tác động đến hệ tim mạch và hệ hô hấp, không làm thay đổi cân bằng acid - base, không gây kích ứng, xước hoặc chảy máu dạ dày.\r\n\r\nDược động học\r\nParacetamol hấp thu nhanh chóng và hầu như hoàn toàn qua đường tiêu hóa. Thời gian bán thải là 1,25 - 3 giờ. Thuốc chuyển hóa ở gan và thải trừ qua thận.\r\n\r\nCách dùng Bột Hapacol 80\r\nCách dùng\r\nHòa tan thuốc Hapacol 80 vào lượng nước (thích hợp cho bé) đến khi sủi hết bọt.\r\n\r\nCách mỗi 6 giờ uống một lần, không quá 5 lần/ngày.\r\n\r\nLiều dùng\r\nLiều uống: trung bình từ 10 – 15 mg/kg thể trọng/lần.\r\n\r\nTổng liều tối đa không quá 60 mg/kg thể trọng/24 giờ.\r\n\r\nHoặc theo phân liều sau:\r\n\r\nTrẻ em từ 0 đến 3 tháng tuổi: Uống 1/2 gói/lần.\r\nTrẻ em từ 4 đến 11 tháng tuổi: Uống 1 gói/lần.\r\nHoặc theo chỉ dẫn của thầy thuốc.\r\nLưu ý: Không nên kéo dài việc tự sử dụng thuốc Hapacol 80 cho trẻ mà cần có ý kiến bác sĩ khi:\r\n\r\nCó triệu chứng mới xuất hiện.\r\nSốt cao (39,5°C) và kéo dài hơn 3 ngày hoặc tái phát.\r\nĐau nhiều và kéo dài hơn 5 ngày.\r\nLiều dùng trên chỉ mang tính chất tham khảo. Liều dùng cụ thể tùy thuộc vào thể trạng và mức độ diễn tiến của bệnh. Để có liều dùng phù hợp, bạn cần tham khảo ý kiến bác sĩ hoặc chuyên viên y tế.\r\n\r\nLàm gì khi dùng quá liều?\r\nQuá liều paracetamol do dùng một liều độc duy nhất hoặc do uống lặp lại liều lớn paracetamol (7,5 - 10 g mỗi ngày, trong 1 - 2 ngày) hoặc do uống thuốc dài ngày. Hoại tử gan phụ thuộc liều là tác dụng độc cấp tính nghiêm trọng nhất do quá liều và có thể gây tử vong.\r\n\r\nBiểu hiện của quá liều paracetamol: Buồn nôn, nôn, đau bụng, triệu chứng xanh tím da, niêm mạc và móng tay.\r\n\r\nBiểu hiện của ngộ độc nặng paracetamol: Ban đầu kích thích nhẹ, kích động và mê sảng. Tiếp theo là ức chế hệ thần kinh trung ương: sững sờ, hạ thân nhiệt, mệt lả, thở nhanh và nông; mạch nhanh, yếu, không đều, huyết áp thấp và suy tuần hoàn.\r\n\r\nCách xử trí:\r\n\r\nChẩn đoán sớm rất quan trọng trong điều trị quá liều paracetamol. Khi nhiễm độc paracetamol nặng, cần điều trị hỗ trợ tích cực.\r\n\r\nCần rửa dạ dày trong mọi trường hợp, tốt nhất trong vòng 4 giờ sau khi uống. Liệu pháp giải độc chính là dùng những hợp chất sulfhydryl. N - acetylcystein có tác dụng khi uống hoặc tiêm tĩnh mạch. Ngoài ra, có thể dùng methionin, than hoạt và/ hoặc thuốc tẩy muối.\r\n\r\nLàm gì khi quên 1 liều?\r\nNếu bạn quên một liều thuốc Hapacol 80, hãy dùng càng sớm càng tốt. Tuy nhiên, nếu gần với liều kế tiếp, hãy bỏ qua liều đã quên và dùng liều kế tiếp vào thời điểm như kế hoạch. Lưu ý rằng không nên dùng gấp đôi liều đã quy định.\r\n\r\nTác dụng phụ\r\nKhi sử dụng thuốc Hapacol 80, bạn có thể gặp các tác dụng không mong muốn (ADR).\r\n\r\nThường gặp, ADR >1/100\r\n\r\nChưa có báo cáo.\r\nÍt gặp, 1/1000 < ADR < 1/100\r\n\r\nDa: Ban da.\r\nTiêu hóa: Buồn nôn, nôn.\r\nThận: Bệnh thận, độc tính thận khi lạm dụng dài ngày.\r\nMáu: Giảm bạch cầu trung tính, giảm toàn thể huyết cầu, thiếu máu.\r\nHiếm gặp, ADR < 1/1000\r\n\r\nToàn thân: Phản ứng quá mẫn.\r\nHướng dẫn cách xử trí ADR\r\n\r\nThông báo cho bác sĩ những tác dụng không mong muốn gặp phải khi sử dụng thuốc.\r\n\r\nLưu ý\r\nTrước khi sử dụng thuốc Hapacol 80 bạn cần đọc kỹ hướng dẫn sử dụng và tham khảo thông tin bên dưới.\r\n\r\nChống chỉ định\r\nThuốc Hapacol 80 chống chỉ định trong các trường hợp sau:\r\n\r\nQuá mẫn với một trong các thành phần của thuốc.\r\nNgười bệnh thiếu hụt glucose - 6 - phosphat dehydrogenase.\r\nThận trọng khi sử dụng\r\nĐối với người bị phenylceton - niệu và người phải hạn chế lượng phenylalanin đưa vào cơ thể nên tránh dùng paracetamol với thuốc hoặc thực phẩm có chứa aspartam.\r\n\r\nĐối với một số người quá mẫn (bệnh hen) nên tránh dùng paracetamol với thuốc hoặc thực phẩm có chứa sulfit.\r\n\r\nPhải dùng thận trọng ở người bệnh có thiếu máu từ trước, suy giảm chức năng gan và thận. Uống nhiều rượu có thể gây tăng độc tính với gan của paracetamol, nên tránh hoặc hạn chế uống rượu. Bác sĩ cần cảnh báo bệnh nhân về các dấu hiệu của phản ứng trên da nghiêm trọng như hội chứng Stevens-Johnson (SJS), hội chứng hoại tử da nhiễm độc (TEN) hay hội chứng Lyell, hội chứng ngoại ban mụn mủ toàn thân cấp tính (AGEP).\r\n\r\nKhả năng lái xe và vận hành máy móc\r\nThuốc không ảnh hưởng đến khả năng lái xe và vận hành máy móc.\r\n\r\nThời kỳ mang thai\r\nChưa xác định được tính an toàn của paracetamol đối với thai nhi khi dùng thuốc cho phụ nữ có thai. Do đó, chỉ nên dùng thuốc ở người mang thai khi thật cần thiết.\r\n\r\nThời kỳ cho con bú\r\nNghiên cứu ở người mẹ cho con bú, dùng paracetamol không thấy có tác dụng không mong muốn ở trẻ bú mẹ.\r\n\r\nTương tác thuốc\r\nUống dài ngày liều cao paracetamol làm tăng nhẹ tác dụng chống đông của coumarin và dẫn chất indandion. Cần chú ý đến khả năng gây hạ sốt nghiêm trọng ở người bệnh dùng đồng thời phenothiazin và liệu pháp hạ nhiệt. Các thuốc chống co giật (phenytoin, barbiturat, carbamazepin), isoniazid và các thuốc chống lao có thể làm tăng độc tính đối với gan của paracetamol. Uống rượu quá nhiều và dài ngày có thể làm tăng nguy cơ paracetamol gây độc cho gan.\r\n\r\nBảo quản\r\nNơi khô, nhiệt độ không quá 30°C, tránh ánh sáng.\r\n\r\n', 2400.00, 100, '2025-06-09 21:20:47', 'bothapacol.jpg', 4),
(6, 'Thuốc Glucosamine Stada 1500mg', 'Thành phần\r\nCông dụng\r\nCách dùng\r\nTác dụng phụ\r\nLưu ý\r\nBảo quản\r\nThuốc Glucosamine là gì?\r\n\r\nKích thước chữ\r\n\r\nMặc định\r\n\r\nLớn hơn\r\n\r\nThành phần của Thuốc Glucosamine\r\nThông tin thành phần\r\n\r\nHàm lượng\r\n\r\nGlucosamine\r\n\r\n1178mg\r\n\r\nTá dược vừa đủ\r\n\r\n1gói\r\n\r\nCông dụng của Thuốc Glucosamine\r\nChỉ định\r\nThuốc bột Glucosamine chỉ định dùng trong trường hợp giảm triệu chứng của thoái hóa khớp gối nhẹ và trung bình.\r\n\r\nDược lực học\r\nNhóm dược lý: Thuốc kháng viêm và chống thấp khớp, thuốc kháng viêm không steroid; Mã ATC; M01AX05.\r\n\r\nGlucosamine là một chất nội sinh, một thành phần cấu tạo của chuỗi polysaccharid của mô sụn và dịch khớp glucosaminoglycans.\r\n\r\nCác nghiên cứu in vitro và in vivo đã chứng minh glucosamine kích thích sự tổng hợp glycosaminoglycans và proteoglycan bởi tế bào sụn và acid hyaluronic bởi tế bào chuyên biệt bên trong khớp synoviocytes.\r\n\r\nCơ chế tác dụng của glucosamine ở người chưa được biết rõ. Thời gian khởi phát tác động của thuốc chưa được đánh giá.\r\n\r\nDược động học\r\nGlucosamine là một phân tử tương đối nhỏ (khối lượng phân tử: 179), glucosamine dễ tan trong nước và tan trong các dung môi hữu cơ thân nước.\r\n\r\nCác thông tin về dược động học của glucosamine còn hạn chế.\r\n\r\nSinh khả dụng tuyệt đối chưa được biết.\r\n\r\nThể tích phân bố là khoảng 5 lít và thời gian bán thải sau khi tiêm tĩnh mạch là khoảng 2 giờ.\r\n\r\nKhoảng 38% liều tiêm tĩnh mạch được bài tiết trong nước tiểu dưới dạng không đổi.\r\n\r\nCách dùng Thuốc Glucosamine\r\nCách dùng\r\nHòa tan thuốc bột Glucosamine với nước dùng đường uống.\r\n\r\nLiều dùng\r\nDùng cho người trên 18 tuổi: Uống 1 gói/ngày (hòa tan bột thuốc Với ít nhất 250 ml nước).\r\n\r\nCó thể dùng đơn độc glucosamine sulfate hoặc phối hợp với thuốc khác như chondroitin 1200 mg/ngày.\r\n\r\nThời gian dùng thuốc tùy theo cá nhân, ít nhất dùng liên tục trong 2 - 3 tháng để đảm bảo hiệu quả điều trị.\r\n\r\nNếu triệu chứng không giảm sau 2 - 3 tháng điều trị, cần xem xét việc điều trị tiếp tục với glucosamine.\r\n\r\nLưu ý: Liều dùng trên chỉ mang tính chất tham khảo. Liều dùng cụ thể tùy thuộc vào thể trạng và mức độ diễn tiến của bệnh. Để có liều dùng phù hợp, bạn cần tham khảo ý kiến bác sĩ hoặc chuyên viên y tế.\r\n\r\nLàm gì khi dùng quá liều?\r\nTrong trường hợp khẩn cấp, hãy gọi ngay cho Trung tâm cấp cứu 115 hoặc đến trạm Y tế địa phương gần nhất.\r\n\r\nLàm gì khi quên 1 liều?\r\nBổ sung liều ngay khi nhớ ra. Tuy nhiên, nếu thời gian giãn cách với liều tiếp theo quá ngắn thì bỏ qua liều đã quên và tiếp tục lịch dùng thuốc. Không dùng liều gấp đôi để bù cho liều đã bị bỏ lỡ.\r\n\r\nTác dụng phụ\r\nCác tác dụng không mong muốn (ADR) khi dùng Glucosamine mà bạn có thể gặp:\r\n\r\nRất hiếm khi bị rối loạn đường tiêu hóa như ợ nóng, khó chịu vùng thượng vị.\r\n\r\nKhi gặp tác dụng phụ của thuốc, bệnh nhân cần ngưng sử dụng và thông báo cho bác sĩ hoặc đến cơ sở y tế gần nhất để được xử trí kịp thời.\r\n\r\nLưu ý\r\nTrước khi sử dụng thuốc bạn cần đọc kỹ hướng dẫn sử dụng và tham khảo thông tin bên dưới.\r\n\r\nChống chỉ định\r\nThuốc bột Glucosamine chống chỉ định trong các trường hợp sau:\r\n\r\nPhụ nữ có thai, phụ nữ cho con bú.\r\nTrẻ em, trẻ vị thành niên < 18 tuổi do chưa có số liệu về độ an toàn và hiệu quả điều trị.\r\nThận trọng khi sử dụng\r\nThận trọng sử dụng thuốc ở bệnh nhân bị đái tháo đường, cần kiểm tra thường xuyên đường huyết ở những bệnh nhân này khi sử dụng glucosamine.\r\n\r\nẢnh hưởng của thuốc lên khả năng lái xe và vận hành máy móc\r\nTác dụng của thuốc không ảnh hưởng lên khả năng lái xe và vận hành máy móc.\r\n\r\nSử dụng thuốc cho phụ nữ trong thời kỳ mang thai và cho con bú\r\nChống chỉ định dùng thuốc cho phụ nữ trong thời kỳ mang thai và cho con bú.\r\n\r\nTương tác thuốc\r\nTương tác thuốc có thể ảnh hưởng đến hoạt động của thuốc hoặc gây ra các tác dụng phụ.\r\n\r\nThận trọng khi dùng đồng thời glucosamine với thuốc trị đái tháo đường, do có thể làm giảm tác dụng của thuốc trị đái tháo đường.\r\n\r\nBệnh nhân nên báo cho bác sĩ hoặc dược sĩ danh sách những thuốc và các thực phẩm chức năng bạn đang sử dụng. Không nên dùng hay tăng giảm liều lượng của thuốc mà không có sự hướng dẫn của bác sĩ.\r\n\r\nBảo quản\r\nĐể nơi mát, tránh ánh sáng, nhiệt độ dưới 30⁰C.\r\n\r\n', 2000.00, 100, '2025-06-09 21:20:47', 'Glucosamine.jpg', 5),
(7, 'Thuốc Vitamin C 500mg Vidipha', 'Thành phần\r\nCông dụng\r\nCách dùng\r\nTác dụng phụ\r\nLưu ý\r\nBảo quản\r\nThuốc Vitamin C 500mg là gì?\r\n\r\nKích thước chữ\r\n\r\nMặc định\r\n\r\nLớn hơn\r\n\r\nThành phần của Thuốc Vitamin C 500mg\r\nThông tin thành phần\r\n\r\nHàm lượng\r\n\r\nVitamin C\r\n\r\n500mg\r\n\r\nCông dụng của Thuốc Vitamin C 500mg\r\nChỉ định\r\nVitamin C 500mg Vidipha chỉ định trong các trường hợp sau:\r\n\r\nÐiều trị bệnh do thiếu vitamin C.\r\nPhối hợp với desferrioxamin để làm tăng thêm đào thải sắt trong điều trị bệnh thalassemia.\r\nDược lực học\r\nVitamin C cần cho sự tạo thành colagen, tu sửa mô trong cơ thể và tham gia trong một số phản ứng oxy hóa - khử. Vitamin C tham gia trong chuyển hóa phenylalanin, tyrosin, acid folic, norepinephrin, histamin, sắt và một số hệ thống enzym chuyển hóa thuốc, trong sử dụng carbohydrat, tổng hợp lipid và protein, chức năng miễn dịch, đề kháng với nhiễm khuẩn, giữ gìn sự toàn vẹn mạch máu và trong hô hấp tế bào.\r\n\r\nThiếu hụt vitamin C dẫn đến bệnh scorbut, trong đó có sự sai sót tổng hợp colagen với biểu hiện là không lành vết thương, khiếm khuyết về cấu tạo răng, vỡ mao mạch gây nhiều đốm xuất huyết, đám bầm máu, chảy máu dưới da và niêm mạc (thường là chảy máu lợi). Dùng vitamin C làm mất hoàn toàn các triệu chứng thiếu hụt vitamin C.\r\n\r\nDược động học\r\nHấp thu\r\n\r\nVitamin C được hấp thu dễ dàng sau khi uống; tuy vậy, hấp thu là một quá trình tích cực và có thể bị hạn chế sau những liều rất lớn.\r\n\r\nTrong nghiên cứu trên người bình thường, chỉ có 50% của một liều uống 1,5 g vitamin C được hấp thu. Hấp thu vitamin C ở dạ dày - ruột có thể giảm ở người bị tiêu chảy hoặc có bệnh về dạ dày - ruột.\r\n\r\nNồng độ vitamin C bình thường trong huyết tương ở khoảng 10 - 20 microgam/ml. Dự trữ toàn bộ viatmin C trong cơ thể ước tính khoảng 1,5 g với khoảng 30 – 45 mg được luân chuyển hàng ngày.\r\n\r\nDấu hiệu lâm sàng của bệnh scorbut thường trở nên rõ ràng sau 3 - 5 tháng thiếu hụt vitamin C.\r\n\r\nPhân bố\r\n\r\nVitamin C phân bố rộng rãi trong các mô cơ thể. Khoảng 25% vitamin C trong huyết tương kết hợp với protein. Vitamin C được tiết vào sữa mẹ.\r\n\r\nChuyển hóa\r\n\r\nVitamin C oxy - hóa thuận nghịch thành acid dehydroascorbic. Một ít vitamin C chuyển hóa thành những hợp chất không có hoạt tính gồm acid ascorbic - 2 - sulfat và acid oxalic.\r\n\r\nThải trừ\r\n\r\nVitamin C và các chất chuyển hóa được bài tiết trong nước tiểu. Lượng vitamin C vượt quá nhu cầu của cơ thể cũng được nhanh chóng đào thải ra nước tiểu dưới dạng không biến đổi. Điều này thường xảy ra khi lượng vitamin C uống vào hằng ngày vượt quá 200 mg.\r\n\r\nCách dùng Thuốc Vitamin C 500mg\r\nCách dùng\r\nVitamin C 500mg Vidipha dạng viên nang cứng dùng theo đường uống.\r\n\r\nLiều dùng\r\nLiều dùng trong trường hợp người bệnh thiếu vitamin C (scorbut):\r\n\r\nNgười lớn: Liều 1 viên/ngày, uống ít nhất trong 2 tuần.\r\n\r\nLưu ý: Liều dùng trên chỉ mang tính chất tham khảo. Liều dùng cụ thể tùy thuộc vào thể trạng và mức độ diễn tiến của bệnh. Để có liều dùng phù hợp, bạn cần tham khảo ý kiến bác sĩ hoặc chuyên viên y tế.\r\n\r\nLàm gì khi dùng quá liều?\r\nBiểu hiện: Sỏi thân, buồn nôn, viêm dạ dày và tiêu chảy.\r\n\r\nXử trí: Gây lợi tiểu bằng truyền dịch có thể có tác dụng sau khi uống liều lớn.\r\n\r\nLàm gì khi quên 1 liều?\r\nNếu quên một liều, nên uống thuốc càng sớm càng tốt. Nhưng nếu đã gần đến lúc uống liều tiếp theo, chỉ dùng liều kế tiếp. Không nên dùng liều đôi hay thêm liều để bù vào liều quên uống.\r\n\r\nTác dụng phụ\r\nCác tác dụng không mong muốn khi dùng Vitamin C 500mg mà bạn có thể gặp.\r\n\r\nThường gặp, ADR >1/100\r\n\r\nChưa có báo cáo.\r\n\r\nÍt gặp, 1/1000 < ADR < 1/100\r\n\r\nChưa có báo cáo.\r\n\r\nKhông xác định tần suất\r\n\r\nChuyển hóa: Tăng oxalat niệu.\r\n\r\nTiêu hóa: Buồn nôn, nôn, tiêu chảy, ợ nóng.\r\n\r\nCơ: Co cứng cơ bụng.\r\n\r\nThần kinh: Nhức đầu, mất ngủ, buồn ngủ.\r\n\r\nToàn thân: Mệt mỏi.\r\n\r\nMạch máu: Đỏ bừng.\r\n\r\nHướng dẫn cách xử trí ADR\r\n\r\nKhi gặp tác dụng phụ của thuốc, cần ngưng sử dụng và thông báo cho bác sĩ hoặc đến cơ sở y tế gần nhất để được xử trí kịp thời.\r\n\r\nLưu ý\r\nTrước khi sử dụng thuốc bạn cần đọc kỹ hướng dẫn sử dụng và tham khảo thông tin bên dưới.\r\n\r\nChống chỉ định\r\nVitamin C 500mg Vidipha không chỉ định dùng trong các trường hợp sau:\r\n\r\nDùng vitamin C liều cao cho người bị thiếu hụt glucose-6-phosphat dehydrogenase (G6PD) (nguy cơ thiếu máu huyết tán).\r\n\r\nNgười có tiền sử sỏi thận, tăng oxalat niệu và loạn chuyển hóa oxalat (tăng nguy cơ sỏi thận).\r\n\r\nNgười bị bệnh thalassemia (tăng nguy cơ hấp thu sắt).\r\n\r\nThận trọng khi sử dụng\r\nDùng vitamin C liều cao kéo dài có thể dẫn đến hiện tượng lờn thuốc, do đó khi giảm liều sẽ dẫn đến thiếu hụt vitamin C.\r\n\r\nUống liều lớn vitamin C trong khi mang thai sẽ dẫn đến bệnh scorbut ở trẻ sơ sinh.\r\n\r\nTăng oxalat niệu có thể xảy ra sau khi dùng liều cao vitamin C. Vitamin C có thể gây acid hóa nước tiểu, đôi khi dẫn đến kết tủa urat hoặc cystin, sỏi oxalat hoặc thuốc trong đường tiết niệu.\r\n\r\nKhả năng lái xe và vận hành máy móc\r\nCần thận trọng khi lái xe hoặc vận hành máy móc do thuốc có thể gây tác dụng không mong muốn như nhức đầu, buồn ngủ.\r\n\r\nThời kỳ mang thai\r\nVitamin C đi qua được nhau thai, nếu dùng vitamin C theo nhu cầu bình thường hàng ngày thì chưa thấy xảy ra vấn đề gì. Tuy nhiên, uống lượng lớn vitamin C trong khi mang thai có thể làm tăng nhu cầu về vitamin C và dẫn đến bệnh scorbut ở trẻ sơ sinh, vì vậy không dùng quá 1 g/ngày cho phụ nữ có thai.\r\n\r\nThời kỳ cho con bú\r\nVitamin C phân bố trong sữa mẹ. Người cho con bú dùng vitamin C theo nhu cầu bình thường chưa thấy có vấn đề gì xảy ra đối với trẻ sơ sinh.\r\n\r\nTương tác thuốc\r\nVitamin C tương tác với thuốc tránh thai đường uống, các thuốc chống acid dạ dày có chứa nhôm.\r\n\r\nDùng đồng thời theo tỷ lệ trên 200 mg vitamin C và 30 mg sắt nguyên tố làm tăng hấp thu sắt qua đường dạ dày - ruột; tuy vậy, đa số người bệnh đều có khả năng hấp thu sắt uống vào một cách đầy đủ mà không phải dùng đồng thời vitamin C.\r\n\r\nDùng đồng thời vitamin C với aspirin làm tăng bài tiết vitamin C và giảm bài tiết aspirin trong nước tiểu.\r\n\r\nDùng đồng thời vitamin C và fIuphenazin dẫn đến giảm nồng độ fluphenazin huyết tương. Sự acid - hóa nước tiểu sau khi dùng vitamin C làm thay đổi sự bài tiết của các thuốc khác.\r\n\r\nVitamin C liều cao có thể phá hủy vitamin B12, cần khuyên người bệnh tránh uống vitamin C liều cao trong vòng một giờ trước hoặc sau khi uống vitamin B12.\r\n\r\nVì vitamin C là một chất khử mạnh nên ảnh hưởng đến nhiều xét nghiệm dựa trên phản ứng oxy - hóa khử. Sự có mặt vitamin C trong nước tiểu làm tăng giả tạo lượng glucose nếu định lượng bằng thuốc thử đồng (II) sulfat và giảm giả tạo lượng glucose nếu định lượng bằng phương pháp glucose oxydase. Với các xét nghiệm khác, cần phải tham khảo tài liệu chuyên biệt về ảnh hưởng của vitamin C.\r\n\r\nBảo quản\r\nBảo quản nơi khô ráo, nhiệt độ không quá 30°C, tránh ánh sáng.', 3350.00, 150, '2025-06-09 21:20:47', 'vidipha.jpg', 6),
(8, 'Siro Bổ Tỳ P/H kích thích tiêu hóa (100ml)', 'Thành phần\r\nCông dụng\r\nCách dùng\r\nTác dụng phụ\r\nLưu ý\r\nBảo quản\r\nSiro Bổ Tỳ P/H là gì?\r\n\r\nKích thước chữ\r\n\r\nMặc định\r\n\r\nLớn hơn\r\n\r\nThành phần của Siro Bổ Tỳ P/H\r\nThông tin thành phần\r\n\r\nHàm lượng\r\n\r\nĐảng Sâm\r\n\r\n15g\r\n\r\nCát cánh\r\n\r\n12g\r\n\r\nBạch linh\r\n\r\n10g\r\n\r\nLiên Nhục\r\n\r\n4g\r\n\r\nMạch Nha\r\n\r\n10g\r\n\r\nLong nhãn\r\n\r\n6g\r\n\r\nBán hạ (Thân, Rễ)\r\n\r\n4g\r\n\r\nBạch truật\r\n\r\n15g\r\n\r\nCam thảo\r\n\r\n6g\r\n\r\nCông dụng của Siro Bổ Tỳ P/H\r\nChỉ định\r\nThuốc Bổ Tỳ P/h 100 ml được chỉ định dùng kích thích tiêu hóa cho trẻ chán ăn, còi xương, suy dinh dưỡng, rối loạn tiêu hóa, phân sống, tiêu chảy kéo dài.\r\n\r\nDược lực học\r\nChưa có báo cáo.\r\n\r\nDược động học\r\nChưa có báo cáo.\r\n\r\nCách dùng Siro Bổ Tỳ P/H\r\nCách dùng\r\nThuốc bổ tỳ P/H được dùng đường uống.\r\n\r\nUống vào trước bữa ăn.\r\n\r\nLiều dùng\r\nTrẻ dưới 6 tuổi: Mỗi lần 2 thìa cà phê (10 ml), 2 lần/ngày.\r\n\r\nTrẻ từ 6 - 14 tuổi: Mỗi lần 3 thìa cà phê (15 ml), 2 lần/ngày.\r\n\r\nTrẻ từ 14 tuổi trở lên và người lớn: Mỗi lần 4 thìa cà phê (20 ml), 2 lần/ngày.\r\n\r\nLưu ý: Liều dùng trên chỉ mang tính chất tham khảo. Liều dùng cụ thể tùy thuộc vào thể trạng và mức độ diễn tiến của bệnh. Để có liều dùng phù hợp, bạn cần tham khảo ý kiến bác sĩ hoặc chuyên viên y tế.\r\n\r\nLàm gì khi quá liều?\r\nCho đến nay, vẫn chưa có tài liệu báo cáo về trường hợp dùng thuốc bổ tỳ P/H quá liều. Tuy nhiên, bạn không nên dùng quá liều lượng được kê. Dùng thuốc nhiều hơn sẽ không cải thiện triệu chứng của bạn; thay vào đó chúng có thể gây ngộ độc hoặc những tác dụng phụ nghiêm trọng.\r\n\r\nNếu bạn nghi vấn rằng bạn hoặc ai khác có thể đã sử dụng quá liều bổ tỳ P/H 100 ml, vui lòng đến phòng cấp cứu tại bệnh viện hoặc viện chăm sóc gần nhất. Mang theo hộp, vỏ, hoặc nhãn hiệu thuốc với bạn để giúp các bác sĩ có thông tin cần thiết.\r\n\r\nKhông đưa thuốc của bạn cho người khác dù bạn biết họ có cùng bệnh chứng hoặc trông có vẻ như họ có thể có bệnh chứng tương tự. Điều này có thể dẫn tới việc dùng quá liều.\r\n\r\nVui lòng tham khảo ý kiến bác sĩ hoặc dược sĩ hoặc gói sản phẩm để có thêm thông tin.\r\n\r\nLàm gì khi quên liều?\r\nNếu bạn quên một liều thuốc, hãy uống càng sớm càng tốt. Tuy nhiên, nếu gần với liều kế tiếp, hãy bỏ qua liều đã quên và uống liều kế tiếp vào thời điểm như kế hoạch. Không uống gấp đôi liều đã quy định.\r\n\r\nTác dụng phụ\r\nCho đến nay, vẫn chưa có tài liệu nào báo cáo về tác dụng không mong muốn của thuốc bổ tỳ P/H 100 ml. Tuy nhiên, đây không phải là báo cáo đầy đủ tất cả các tác dụng phụ và có thể xảy ra những tác dụng phụ khác.\r\n\r\nNếu bạn gặp phải bất kỳ tác dụng không mong muốn nào, hãy ngưng dùng thuốc và thông báo ngay cho bác sĩ hoặc đến ngay cơ sở y tế gần nhất để được xử trí kịp thời.\r\n\r\nLưu ý\r\nTrước khi sử dụng thuốc bạn cần đọc kỹ hướng dẫn sử dụng và tham khảo thông tin bên dưới.\r\n\r\nChống chỉ định\r\nThuốc bổ tỳ P/H chống chỉ định với trẻ em dưới 30 tháng tuổi, trẻ em có tiền sử động kinh hoặc co giật sốt cao.\r\n\r\nThận trọng khi dùng thuốc\r\nTrước khi dùng thuốc bổ tỳ P/H 100 ml, bạn nên lưu ý một số điều sau:\r\n\r\nThông báo cho bác sĩ và dược sĩ nếu bạn bị dị ứng với bổ tỳ P/H 100 ml, bất kỳ loại thuốc nào khác hoặc bất kỳ thành phần trong thuốc. Bạn cũng có thể hỏi dược sĩ để biết danh sách các thành phần.\r\nThận trọng khi dùng thuốc bổ tỳ P/H 100 ml cho bệnh nhân tiểu đường.\r\nTác động của thuốc khi lái xe và vận hành máy móc\r\nHiện vẫn chưa có bằng chứng về tác động của thuốc bổ tỳ P/H 100 ml lên khả năng lái xe và vận hành máy móc.\r\n\r\nThời kỳ mang thai và cho con bú\r\nThời kỳ mang thai:\r\n\r\nVẫn chưa rõ thuốc có tác động lên thai nhi hay không. Nếu cần thiết sử dụng hãy tham khảo ý kiến bác sĩ hoặc chuyên gia y tế để cân nhắc lợi ích nguy cơ từ việc dùng thuốc cho phụ nữ đang trong thai kỳ.\r\n\r\nThời kỳ cho con bú:\r\n\r\nThuốc chống chỉ định cho trẻ em dưới 30 tháng tuổi nên cần thận trọng khi dùng thuốc bổ tỳ P/H 100 ml. Nếu cần thiết sử dụng nên hỏi ý kiến bác sĩ, dược sĩ để cân nhắc lợi ích cho mẹ và nguy cơ cho trẻ.\r\n\r\nCác đối tượng đặc biệt khác\r\nThuốc bổ tỳ P/H không được dùng cho trẻ dưới 30 tháng tuổi.\r\n\r\nTương tác thuốc\r\nTương tác thuốc có thể làm thay đổi khả năng hoạt động của thuốc hoặc gia tăng ảnh hưởng của các tác dụng phụ. Tốt nhất là bạn viết một danh sách những thuốc bạn đang dùng (bao gồm thuốc được kê toa, không kê toa và thực phẩm chức năng) và cho bác sĩ hoặc dược sĩ xem. Không được tự ý dùng thuốc, ngưng hoặc thay đổi liều lượng của thuốc mà không có sự cho phép của bác sĩ.\r\n\r\nChưa có tài liệu, báo cáo nào của thuốc được ghi nhận thuốc bổ tỳ P/H 100 ml tương tác với thuốc khác. Tuy nhiên, bạn nên dùng thuốc khác trước hoặc sau khi dùng thuốc bổ tỳ P/H ít nhất 2 tiếng để đảm bảo tác dụng của thuốc.\r\n\r\nBảo quản\r\nBạn nên bảo quản ở nhiệt độ phòng, tránh ẩm và tránh ánh sáng. Không bảo quản trong phòng tắm hoặc trong ngăn đá. Bạn nên nhớ rằng mỗi loại thuốc có thể có các phương pháp bảo quản khác nhau. Vì vậy, bạn nên đọc kỹ hướng dẫn bảo quản trên bao bì hoặc hỏi dược sĩ. Giữ thuốc tránh xa tầm tay trẻ em và thú nuôi.\r\n\r\nHạn sử dụng: 24 tháng kể từ ngày sản xuất.\r\n\r\nNếu thuốc bị mốc, biến màu hoặc thấy có hiện tượng lạ thì phải báo cho nhà sản xuất. Sau khi mở nắp lọ thuốc, nên sử dụng trong vòng không quá 1 tháng kể từ ngày mở nắp.\r\n\r\n', 3900.00, 300, '2025-06-09 21:20:47', 'siro.jpg', 7);

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` int NOT NULL,
  `customer_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `comment` text COLLATE utf8mb4_general_ci,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`id`, `customer_id`, `product_id`, `rating`, `comment`, `created_at`) VALUES
(1, 1, 1, 5, 'Rất tốt!', '2025-06-07 14:02:51'),
(2, 2, 2, 4, 'Chất lượng ổn.', '2025-06-07 14:02:51');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'Admin'),
(2, 'Customer'),
(3, 'Doctor');

-- --------------------------------------------------------

--
-- Table structure for table `specializations`
--

CREATE TABLE `specializations` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `specializations`
--

INSERT INTO `specializations` (`id`, `name`, `image`) VALUES
(1, 'Nội khoa', '/uploads/1750666911605-cÃ´ng ty tÃ i chÃ­nh.png'),
(2, 'Da liễu', '/uploads/1750609299162-screenshot_1749730713.png'),
(3, 'Tai mũi họng', '/uploads/1750609326029-screenshot_1749730713.png'),
(4, 'Khoa tim mạch', '/uploads/1750609612105-z6609834095121_c248e82fc8056b10772f73afbfb4e383.jpg'),
(5, 'Khoa thần kinh', '/uploads/1750640552483-z6584497856600_8fe061a3a4c6e0b9011a5a8abe90e204.jpg'),
(6, 'Khoa xương khớp', '/uploads/1750641125578-screenshot_1749733441.png'),
(7, 'Tai mũi họng', '/uploads/1750667705054-screenshot_1749733441.png'),
(8, 'Mắt', '/uploads/1750667714069-cÃ´ng ty tÃ i chÃ­nh.png'),
(9, 'Khoa tiêu hóa', NULL),
(10, 'Khoa hô hấp', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `appointments_ibfk_time_slot` (`time_slot_id`),
  ADD KEY `fk_appointments_customers` (`customer_id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `comment_likes`
--
ALTER TABLE `comment_likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comment_id` (`comment_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `fk_doctors_specialization` (`specialization_id`);

--
-- Indexes for table `doctor_time_slot`
--
ALTER TABLE `doctor_time_slot`
  ADD PRIMARY KEY (`id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indexes for table `medical_records`
--
ALTER TABLE `medical_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointment_id` (`appointment_id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointment_id` (`appointment_id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `prescription_items`
--
ALTER TABLE `prescription_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `prescription_id` (`prescription_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_ibfk_brand` (`brand_id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `specializations`
--
ALTER TABLE `specializations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `comment_likes`
--
ALTER TABLE `comment_likes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `doctor_time_slot`
--
ALTER TABLE `doctor_time_slot`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=310;

--
-- AUTO_INCREMENT for table `medical_records`
--
ALTER TABLE `medical_records`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `prescriptions`
--
ALTER TABLE `prescriptions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `prescription_items`
--
ALTER TABLE `prescription_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `specializations`
--
ALTER TABLE `specializations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`),
  ADD CONSTRAINT `appointments_ibfk_time_slot` FOREIGN KEY (`time_slot_id`) REFERENCES `doctor_time_slot` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_appointments_customers` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `comment_likes`
--
ALTER TABLE `comment_likes`
  ADD CONSTRAINT `comment_likes_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`),
  ADD CONSTRAINT `comment_likes_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

--
-- Constraints for table `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  ADD CONSTRAINT `fk_doctors_specialization` FOREIGN KEY (`specialization_id`) REFERENCES `specializations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `doctor_time_slot`
--
ALTER TABLE `doctor_time_slot`
  ADD CONSTRAINT `doctor_time_slot_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `medical_records`
--
ALTER TABLE `medical_records`
  ADD CONSTRAINT `medical_records_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`),
  ADD CONSTRAINT `medical_records_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`),
  ADD CONSTRAINT `medical_records_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD CONSTRAINT `prescriptions_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`),
  ADD CONSTRAINT `prescriptions_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`),
  ADD CONSTRAINT `prescriptions_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

--
-- Constraints for table `prescription_items`
--
ALTER TABLE `prescription_items`
  ADD CONSTRAINT `prescription_items_ibfk_1` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`id`),
  ADD CONSTRAINT `prescription_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`);

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
