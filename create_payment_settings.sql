-- Tạo bảng payment_settings
CREATE TABLE IF NOT EXISTS `payment_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bank_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `account_number` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `account_holder` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `token_auto` text COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Thêm dữ liệu mẫu
INSERT INTO `payment_settings` (`bank_name`, `account_number`, `account_holder`, `token_auto`, `description`) VALUES
('Vietcombank', '1234567890', 'NGUYEN VAN A', 'token_example_123', 'Cấu hình thanh toán mặc định');

-- Hiển thị kết quả
SELECT * FROM payment_settings; 