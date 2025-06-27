// backend/config/db.config.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'datn'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Không kết nối được DB:', err.message);
    return;
  }
  console.log('✅ Kết nối thành công tới MySQL!');
});

module.exports = db;
