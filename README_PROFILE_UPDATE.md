# 🎉 Cập Nhật Profile System - Hỗ Trợ Đa Vai Trò

## 📋 Tổng Quan

Đã cập nhật hệ thống profile để hỗ trợ đa vai trò với UI/UX hiện đại và chức năng đầy đủ cho:
- 👤 **Khách hàng** (role_id: 2)
- 🩺 **Bác sĩ** (role_id: 3) 
- 👑 **Quản trị viên** (role_id: 1)

## 🚀 Tính Năng Mới

### 1. **Hỗ Trợ Đa Vai Trò**
- **Role-based API**: Tự động chọn API phù hợp dựa trên vai trò
- **Dynamic Menu**: Menu sidebar thay đổi theo vai trò người dùng
- **Role Display**: Hiển thị badge vai trò với màu sắc và icon tương ứng

### 2. **API Endpoints Mới**

#### Cho Bác Sĩ:
```
GET  /api/doctors/profile          # Lấy thông tin profile bác sĩ
PUT  /api/doctors/profile          # Cập nhật profile bác sĩ
PUT  /api/doctors/change-password  # Đổi mật khẩu bác sĩ
```

#### Cho Khách Hàng/Admin:
```
GET  /api/users/profile            # Lấy thông tin profile user
PUT  /api/users/profile            # Cập nhật profile user
PUT  /api/users/change-password    # Đổi mật khẩu user
```

### 3. **UI/UX Hiện Đại**
- **Gradient Background**: Thiết kế gradient đẹp mắt
- **Card-based Layout**: Layout card với shadow và border radius
- **Responsive Design**: Tối ưu cho mobile và desktop
- **Loading States**: Spinner đẹp mắt khi tải
- **Error Handling**: Icons và styling cho error states

### 4. **Chức Năng Profile**

#### Cho Khách Hàng:
- ✅ Họ và tên
- ✅ Email (đã xác thực)
- ✅ Số điện thoại
- ✅ Giới tính
- ✅ Ngày sinh
- ✅ Avatar

#### Cho Bác Sĩ:
- ✅ Họ và tên
- ✅ Email (đã xác thực)
- ✅ Số điện thoại
- ✅ Giới thiệu
- ✅ Kinh nghiệm
- ✅ GPA
- ✅ Trường đại học
- ✅ Ngày tốt nghiệp
- ✅ Loại bằng cấp
- ✅ Avatar
- ✅ Chuyên khoa

### 5. **Menu Navigation**

#### Khách Hàng:
- 🗓️ Đặt lịch khám
- 📄 Hồ sơ bệnh án
- 👤 Hồ sơ cá nhân
- 📍 Địa chỉ
- 🔒 Đổi mật khẩu
- 🏠 Về trang chủ
- 💊 Mua thuốc

#### Bác Sĩ:
- 🗓️ Lịch khám
- 📄 Hồ sơ bệnh nhân
- 👤 Hồ sơ cá nhân
- 📍 Địa chỉ
- 🔒 Đổi mật khẩu
- 🏠 Về trang chủ
- 💊 Mua thuốc

#### Admin:
- 👑 Dashboard
- 👤 Quản lý tài khoản
- 👤 Hồ sơ cá nhân
- 📍 Địa chỉ
- 🔒 Đổi mật khẩu
- 🏠 Về trang chủ
- 💊 Mua thuốc

## 🛠️ Cài Đặt & Chạy

### 1. **Backend (Node.js)**
```bash
cd backend
npm install
npm start
```

### 2. **Frontend (Next.js)**
```bash
npm install
npm run dev
```

### 3. **Database**
- Đảm bảo database có bảng `customers`, `doctors`, `role`
- Role mapping: 1=Admin, 2=Customer, 3=Doctor

## 📁 Cấu Trúc Files

```
app/profile/
├── layout.tsx          # Layout chính với sidebar
├── page.tsx           # Trang profile chính
├── password/
│   └── page.tsx       # Trang đổi mật khẩu
└── ...

backend/
├── controllers/
│   ├── user.controller.js    # API cho customer/admin
│   └── doctorController.js   # API cho doctor
├── routes/
│   ├── user.routes.js        # Routes cho customer/admin
│   └── doctor.routes.js      # Routes cho doctor
└── ...
```

## 🎨 Thiết Kế

### Color Scheme:
- **Admin**: Purple (#8B5CF6)
- **Customer**: Blue (#3B82F6)
- **Doctor**: Green (#10B981)

### Components:
- **ProfileField**: Component tái sử dụng cho các field
- **Role Badge**: Badge hiển thị vai trò
- **Loading Spinner**: Spinner đẹp mắt
- **Error States**: Icons và styling cho lỗi

## 🔧 Cấu Hình

### Environment Variables:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
JWT_SECRET=your_jwt_secret
```

### Database Schema:
```sql
-- Role table
CREATE TABLE role (
  id INT PRIMARY KEY,
  name VARCHAR(255)
);

-- Customers table
CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  gender ENUM('Nam', 'Nữ', 'Khác'),
  birthday DATE,
  avatar VARCHAR(255),
  role_id INT DEFAULT 2
);

-- Doctors table
CREATE TABLE doctors (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  introduction TEXT,
  experience VARCHAR(255),
  gpa VARCHAR(10),
  university VARCHAR(255),
  graduation_date DATE,
  degree_type VARCHAR(255),
  img VARCHAR(255),
  role_id INT DEFAULT 3
);
```

## 🚀 Tính Năng Nâng Cao

### 1. **File Upload**
- Hỗ trợ upload avatar cho cả customer và doctor
- Validation file size và type
- Preview image trước khi upload

### 2. **Form Validation**
- Real-time validation
- Error messages rõ ràng
- Loading states khi submit

### 3. **Security**
- JWT authentication
- Role-based access control
- Password hashing với bcrypt

## 🐛 Troubleshooting

### Lỗi Thường Gặp:

1. **"Không thể tải dữ liệu hồ sơ"**
   - Kiểm tra API endpoint
   - Kiểm tra JWT token
   - Kiểm tra database connection

2. **"Phiên đăng nhập đã hết hạn"**
   - Token expired, cần đăng nhập lại
   - Kiểm tra JWT_SECRET

3. **"Không tìm thấy người dùng"**
   - Kiểm tra user ID trong database
   - Kiểm tra role_id mapping

## 📞 Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console logs
2. Kiểm tra network requests
3. Kiểm tra database connection
4. Liên hệ team development

---

**🎉 Chúc bạn sử dụng hệ thống profile mới vui vẻ!** 