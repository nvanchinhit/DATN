-- Tạo bảng lưu trữ dữ liệu khám bệnh
CREATE TABLE IF NOT EXISTS examination_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  appointment_id INT NOT NULL,
  doctor_id INT NOT NULL,
  patient_id INT NOT NULL,
  
  -- Dấu hiệu sinh tồn
  temperature DECIMAL(4,1),
  blood_pressure VARCHAR(20),
  heart_rate INT,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  
  -- Triệu chứng và ghi chú
  symptoms JSON,
  notes TEXT,
  
  -- Dị ứng và thuốc
  allergies JSON,
  medications JSON,
  
  -- Chẩn đoán và điều trị
  diagnosis TEXT,
  recommendations TEXT,
  follow_up_date DATE,
  
  -- Trạng thái và thời gian
  status ENUM('draft', 'completed') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Khóa ngoại - Sửa để phù hợp với cấu trúc database hiện tại
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES customers(id) ON DELETE CASCADE,
  
  -- Index để tối ưu truy vấn
  INDEX idx_appointment (appointment_id),
  INDEX idx_doctor (doctor_id),
  INDEX idx_patient (patient_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Thêm comment cho bảng
ALTER TABLE examination_records COMMENT = 'Bảng lưu trữ dữ liệu khám bệnh chi tiết';

-- Thêm comment cho các cột
ALTER TABLE examination_records 
MODIFY COLUMN temperature DECIMAL(4,1) COMMENT 'Nhiệt độ (°C)',
MODIFY COLUMN blood_pressure VARCHAR(20) COMMENT 'Huyết áp (mmHg)',
MODIFY COLUMN heart_rate INT COMMENT 'Nhịp tim (lần/phút)',
MODIFY COLUMN weight DECIMAL(5,2) COMMENT 'Cân nặng (kg)',
MODIFY COLUMN height DECIMAL(5,2) COMMENT 'Chiều cao (cm)',
MODIFY COLUMN symptoms JSON COMMENT 'Danh sách triệu chứng',
MODIFY COLUMN allergies JSON COMMENT 'Danh sách dị ứng',
MODIFY COLUMN medications JSON COMMENT 'Danh sách thuốc đang dùng',
MODIFY COLUMN diagnosis TEXT COMMENT 'Chẩn đoán',
MODIFY COLUMN recommendations TEXT COMMENT 'Khuyến nghị và hướng dẫn',
MODIFY COLUMN follow_up_date DATE COMMENT 'Ngày tái khám',
MODIFY COLUMN status ENUM('draft', 'completed') COMMENT 'Trạng thái: draft=nháp, completed=hoàn thành';
