/** @type {import('next').NextConfig} */
const nextConfig = {
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },

 
  async rewrites() {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://nvanchinhit.click`;
    
    return [
      {
        // Khi frontend gọi một URL bắt đầu bằng /api/...
        source: '/api/:path*',
        // Next.js sẽ tự động chuyển tiếp yêu cầu đó đến backend
        // mà không làm thay đổi URL trên trình duyệt.
        destination: `${baseUrl}/api/:path*`,
      },
      {
        // Tương tự, dùng để hiển thị ảnh từ thư mục /uploads của backend
        source: '/uploads/:path*',
        destination: `${baseUrl}/uploads/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;