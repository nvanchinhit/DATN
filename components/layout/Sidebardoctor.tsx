'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// Định nghĩa kiểu dữ liệu cho Doctor để code an toàn hơn
interface Doctor {
  id: number;
  name: string;
  img?: string | null; // img có thể không tồn tại hoặc là null
}

export default function Sidebardoctor() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const router = useRouter();
  const pathname = usePathname(); // Hook để biết trang hiện tại

  useEffect(() => {
    // Component này chỉ chạy ở client, nên có thể truy cập localStorage
    const doctorDataString = localStorage.getItem('user');
    if (doctorDataString) {
      try {
        setDoctor(JSON.parse(doctorDataString));
      } catch (error) {
        console.error("Lỗi khi đọc dữ liệu bác sĩ:", error);
        // Nếu dữ liệu hỏng, xóa nó đi
        localStorage.removeItem('user');
        localStorage.removeItem('doctorToken');
      }
    }
  }, []);

  const handleLogout = () => {
    // Xóa thông tin đăng nhập
    localStorage.removeItem('user');
    localStorage.removeItem('doctorToken');
    
    // Chuyển hướng về trang đăng nhập
    router.push('/doctor/login');
  };

  // Nếu chưa có thông tin bác sĩ (chưa đăng nhập hoặc đang tải), không render gì cả
  if (!doctor) {
    return null; 
  }

  // Hàm kiểm tra link có active hay không
  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 bg-white border-r p-4 flex flex-col min-h-screen shadow-md">
      {/* Avatar & Name - Dữ liệu động */}
      <div className="text-center mb-8">
        <img
          // Sử dụng ảnh của bác sĩ, nếu không có thì dùng ảnh mặc định
          src={doctor.img ? `http://localhost:5000${doctor.img}` : "https://via.placeholder.com/150/007BFF/FFFFFF?text=Dr"}
          alt="avatar"
          className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-4 border-blue-200"
        />
        <h2 className="font-bold text-lg text-gray-800">{doctor.name}</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-grow space-y-2 text-gray-700">
        <Link href="/doctor/dashboard" className="block no-underline">
          <div className={`p-3 rounded-lg cursor-pointer transition-colors ${isActive('/doctor/dashboard') ? 'bg-blue-600 text-white font-semibold shadow' : 'hover:bg-gray-100'}`}>
            📊 Dashboard
          </div>
        </Link>

        <Link href="/doctor/schedule" className="block no-underline">
          <div className={`p-3 rounded-lg cursor-pointer transition-colors ${isActive('/doctor/schedule') ? 'bg-blue-600 text-white font-semibold shadow' : 'hover:bg-gray-100'}`}>
            🗓️ Lịch khám
          </div>
        </Link>

        <Link href="/doctor/patients" className="block no-underline">
          <div className={`p-3 rounded-lg cursor-pointer transition-colors ${isActive('/doctor/patients') ? 'bg-blue-600 text-white font-semibold shadow' : 'hover:bg-gray-100'}`}>
            📁 Hồ sơ bệnh án
          </div>
        </Link>

        <Link href="/doctor/messages" className="block no-underline">
          <div className={`p-3 rounded-lg cursor-pointer transition-colors ${isActive('/doctor/messages') ? 'bg-blue-600 text-white font-semibold shadow' : 'hover:bg-gray-100'}`}>
            💬 Tin nhắn
          </div>
        </Link>

        <Link href="/doctor/profile" className="block no-underline">
          <div className={`p-3 rounded-lg cursor-pointer transition-colors ${isActive('/doctor/profile') ? 'bg-blue-600 text-white font-semibold shadow' : 'hover:bg-gray-100'}`}>
            👤 Hồ sơ cá nhân
          </div>
        </Link>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <button 
          onClick={handleLogout}
          className="w-full text-left p-3 rounded-lg cursor-pointer transition-colors hover:bg-red-100 text-red-600 font-medium"
        >
          🚪 Đăng xuất
        </button>
      </div>
    </aside>
  );
}