// backend/createAdmin.js

const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// --- Cấu hình ---
const ADMIN_EMAIL = 'le6838773@gmail.comcom';
const ADMIN_NAME = 'Admin';
const ADMIN_PHONE = '0342907002';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'datn'
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const createOrUpdateAdmin = async (password) => {
  if (!password || password.length < 6) {
    console.error('❌ Mật khẩu phải có ít nhất 6 ký tự.');
    db.end();
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('SELECT id FROM admins WHERE email = ?', [ADMIN_EMAIL], (err, results) => {
      if (err) {
        console.error('Lỗi truy vấn:', err);
        db.end();
        return;
      }

      if (results.length > 0) {
        // Cập nhật mật khẩu nếu admin đã tồn tại
        db.query('UPDATE admins SET password = ? WHERE email = ?', [hashedPassword, ADMIN_EMAIL], (updateErr) => {
          if (updateErr) console.error('❌ Lỗi khi cập nhật admin:', updateErr);
          else console.log(`✅ Đã cập nhật mật khẩu thành công cho admin: ${ADMIN_EMAIL}`);
          db.end();
        });
      } else {
        // Tạo mới admin nếu chưa tồn tại
        const adminData = {
          name: ADMIN_NAME,
          email: ADMIN_EMAIL,
          password: hashedPassword,
          phone: ADMIN_PHONE,
          role_id: 1, // Luôn là 1 cho admin
          created_at: new Date()
        };
        db.query('INSERT INTO admins SET ?', adminData, (insertErr) => {
          if (insertErr) console.error('❌ Lỗi khi tạo admin:', insertErr);
          else console.log(`✅ Đã tạo tài khoản admin thành công: ${ADMIN_EMAIL}`);
          db.end();
        });
      }
    });
  } catch (hashError) {
    console.error('Lỗi mã hóa mật khẩu:', hashError);
    db.end();
  }
};

console.log(`Script sẽ tạo hoặc cập nhật tài khoản trong bảng 'admins' với email: ${ADMIN_EMAIL}`);
rl.question('Vui lòng nhập mật khẩu mới cho admin: ', (password) => {
  createOrUpdateAdmin(password);
  rl.close();
});