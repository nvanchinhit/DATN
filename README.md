GIT CODE VỀ THÌ CHẠY THEO THỨ TỰ
npm i
npm install react-intersection-observer
npm run dev
TRONG FOLDER BACKEND TẠO THÊM FILE.ENV VÀ ĐIỀN THAM SỐ
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Database Configuration (chuẩn MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=datn
DB_USER=root
DB_PASSWORD=

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
VÀ CHẠY NODE SERVER NỮA LÀ OKE
