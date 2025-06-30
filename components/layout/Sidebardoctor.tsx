// Sidebardoctor.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface Doctor {
  id: number;
  name: string;
  img?: string | null;
}

export default function Sidebardoctor() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Component này chạy sau DoctorLayout, nên localStorage đã được cập nhật
    const doctorDataString = localStorage.getItem('user');
    if (doctorDataString) {
      try {
        setDoctor(JSON.parse(doctorDataString));
      } catch (error) {
        console.error("Lỗi đọc dữ liệu user:", error);
      }
    }
  }, [pathname]); // Cập nhật lại thông tin bác sĩ khi chuyển trang

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('doctorToken');
    router.push('/doctor/login');
  };

  if (!doctor) {
    // Có thể hiển thị một sidebar dạng skeleton loading ở đây nếu muốn
    return (
        <aside className="w-64 bg-white border-r p-4 flex flex-col min-h-screen shadow-md animate-pulse">
            <div className="text-center mb-8">
                <div className="w-24 h-24 rounded-full mx-auto mb-3 bg-gray-300"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
            </div>
            <div className="flex-grow space-y-2">
                <div className="h-10 bg-gray-300 rounded"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
            </div>
        </aside>
    );
  }

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside className="w-64 bg-white border-r p-4 flex flex-col min-h-screen shadow-md">
      <div className="text-center mb-8">
        <img
          // <<< SỬA #1: HIỂN THỊ ẢNH ĐÚNG CÁCH >>>
          // Dữ liệu `img` bây giờ đã có trong `doctor` object
          src={doctor.img ? `http://localhost:5000/uploads/${doctor.img}` : "https://via.placeholder.com/150/007BFF/FFFFFF?text=Dr"}
          alt="avatar"
          className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-4 border-blue-200"
        />
        <h2 className="font-bold text-lg text-gray-800">{doctor.name}</h2>
      </div>

      <nav className="flex-grow space-y-2 text-gray-700">
        <Link href="/doctor/dashboard" className={`block p-3 rounded-lg transition-colors ${isActive('/doctor/dashboard') ? 'bg-blue-600 text-white font-semibold shadow' : 'hover:bg-gray-100'}`}>
            📊 Dashboard
        </Link>
        <Link href="/doctor/schedule" className={`block p-3 rounded-lg transition-colors ${isActive('/doctor/schedule') ? 'bg-blue-600 text-white font-semibold shadow' : 'hover:bg-gray-100'}`}>
            🗓️ Lịch khám
        </Link>
        <Link href="/doctor/patients" className={`block p-3 rounded-lg transition-colors ${isActive('/doctor/patients') ? 'bg-blue-600 text-white font-semibold shadow' : 'hover:bg-gray-100'}`}>
            📁 Hồ sơ bệnh án
        </Link>
        <Link href="/doctor/profile" className={`block p-3 rounded-lg transition-colors ${isActive('/doctor/profile') ? 'bg-blue-600 text-white font-semibold shadow' : 'hover:bg-gray-100'}`}>
            👤 Hồ sơ cá nhân
        </Link>
      </nav>

      <div className="mt-auto">
        <button 
          onClick={handleLogout}
          className="w-full text-left p-3 rounded-lg transition-colors hover:bg-red-100 text-red-600 font-medium"
        >
          🚪 Đăng xuất
        </button>
      </div>
    </aside>
  );
}