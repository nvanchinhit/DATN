require('dotenv').config(); // <--- Bổ sung dòng này

const express = require('express');
const cors = require('cors');
const router = require('./routes'); // <-- thêm

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', router); // <-- sử dụng router

// Gắn static nếu dùng ảnh
app.use('/images', express.static(__dirname + '/public/images'));

app.listen(5000, () => {
  console.log('✅ Backend chạy tại http://localhost:5000');
});
