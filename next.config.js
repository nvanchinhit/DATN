/** @type {import('next').NextConfig} */
const nextConfig = {
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },

 
  async rewrites() {
    return [
      {
        // Khi frontend gọi một URL bắt đầu bằng /api/...
        source: '/api/:path*',
        // Next.js sẽ tự động chuyển tiếp yêu cầu đó đến backend
        // mà không làm thay đổi URL trên trình duyệt.
        destination: 'http://localhost:5000/api/:path*',
      },
      {
        // Tương tự, dùng để hiển thị ảnh từ thư mục /uploads của backend
        source: '/uploads/:path*',
        destination: 'http://localhost:5000/uploads/:path*',
      },
    ];
  },
};

module.exports = nextConfig;