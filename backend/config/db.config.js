// backend/config/db.config.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'datn'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Không kết nối được DB:', err.message);
    return;
  }
  console.log('✅ Kết nối thành công tới MySQL!');
});

// Cung cấp wrapper Promise để dùng kiểu await/async: const { promiseDb } = require('...')
const promiseDb = db.promise();

// Giữ export mặc định là connection để tương thích mã cũ
module.exports = db;
// Đồng thời thêm named export để các nơi có thể destructure { promiseDb }
module.exports.promiseDb = promiseDb;