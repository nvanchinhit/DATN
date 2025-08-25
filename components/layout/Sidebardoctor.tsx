  // Sidebardoctor.tsx
  'use client';

  import { useState, useEffect } from 'react';
  import Link from 'next/link';
  import { usePathname, useRouter } from 'next/navigation';
  import { API_URL } from '@/lib/config';

  interface Doctor {
    id: number;
    name: string;
    img?: string | null;
  }

  export default function Sidebardoctor() {
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      const doctorDataString = localStorage.getItem('user');
      if (doctorDataString) {
        try {
          setDoctor(JSON.parse(doctorDataString));
        } catch (error) {
          console.error("Lỗi đọc dữ liệu user:", error);
        }
      }
      setIsLoading(false);
    }, [pathname]);

    const handleLogout = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('doctorToken');
      router.push('/doctor/login');
    };

    if (isLoading) {
      return (
        <aside className="w-72 bg-gradient-to-b from-blue-50 to-white border-r border-blue-100 p-6 flex flex-col min-h-screen shadow-xl">
          <div className="text-center mb-10">
            <div className="w-28 h-28 rounded-full mx-auto mb-4 bg-gradient-to-r from-blue-200 to-blue-300 animate-pulse shadow-lg"></div>
            <div className="h-6 bg-blue-200 rounded-lg w-3/4 mx-auto animate-pulse"></div>
            <div className="h-4 bg-blue-100 rounded-lg w-1/2 mx-auto mt-2 animate-pulse"></div>
          </div>
          <div className="flex-grow space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-blue-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </aside>
      );
    }

    if (!doctor) {
      return (
        <aside className="w-72 bg-gradient-to-b from-blue-50 to-white border-r border-blue-100 p-6 flex flex-col min-h-screen shadow-xl">
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <p>Không tìm thấy thông tin bác sĩ</p>
            </div>
          </div>
        </aside>
      );
    }

    const isActive = (href: string) => {
      // Sử dụng exact match để tránh trùng lặp giữa /schedules và /schedule
      if (href === '/doctor/schedules' && pathname === '/doctor/schedule') {
        return false;
      }
      if (href === '/doctor/schedule' && pathname === '/doctor/schedules') {
        return false;
      }
      return pathname.startsWith(href);
    };

    const menuItems = [
      { href: '/doctor/dashboard', icon: '📊', label: 'Dashboard', color: 'from-blue-500 to-blue-600' },
      { href: '/doctor/schedules', icon: '📁', label: 'Ca khám', color: 'from-indigo-500 to-indigo-600' },
      { href: '/doctor/schedule', icon: '🗓️', label: 'Lịch khám', color: 'from-green-500 to-green-600' },
      { href: '/doctor/patients', icon: '📁', label: 'Hồ sơ bệnh án', color: 'from-purple-500 to-purple-600' },
      { href: '/doctor/profile', icon: '👤', label: 'Hồ sơ cá nhân', color: 'from-orange-500 to-orange-600' },
      { href: '/doctor/chat', icon: '💬', label: 'Tin nhắn', color: 'from-pink-500 to-pink-600' },
    ];

    return (
      <aside className="w-72 bg-gradient-to-b from-blue-50 via-white to-blue-50 border-r border-blue-100 p-6 flex flex-col min-h-screen shadow-xl relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full translate-y-20 -translate-x-20"></div>
        
        {/* Doctor Profile Section */}
        <div className="text-center mb-10 relative z-10">
          <div className="relative mb-4">
            <img
              src={doctor.img ? `${API_URL}/uploads/${doctor.img}` : "https://via.placeholder.com/150/007BFF/FFFFFF?text=Dr"}
              alt="avatar"
              className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-white shadow-lg ring-4 ring-blue-100 transition-transform hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/150/007BFF/FFFFFF?text=Dr";
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="font-bold text-xl text-gray-800 mb-1">{doctor.name}</h2>
          <p className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full inline-block">
            Bác sĩ chuyên khoa
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow space-y-3 text-gray-700 relative z-10">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative block p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                isActive(item.href)
                  ? `bg-gradient-to-r ${item.color} text-white font-semibold shadow-lg shadow-blue-200/50`
                  : 'hover:bg-white hover:shadow-lg hover:shadow-blue-100/50 bg-white/50 backdrop-blur-sm'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`text-xl transition-transform group-hover:scale-110 ${
                  isActive(item.href) ? 'drop-shadow-sm' : ''
                }`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive(item.href) && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="mt-8 relative z-10">
          <button
            onClick={handleLogout}
            className="group w-full text-left p-4 rounded-xl transition-all duration-300 hover:bg-red-50 text-red-600 font-medium border-2 border-red-100 hover:border-red-200 hover:shadow-lg hover:shadow-red-100/50 transform hover:scale-[1.02]"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl transition-transform group-hover:scale-110">🚪</span>
              <span>Đăng xuất</span>
            </div>
          </button>
        </div>

        {/* Decorative bottom element */}
        <div className="mt-6 pt-4 border-t border-blue-100 relative z-10">
          <div className="text-center text-xs text-gray-400">
            <p>Hệ thống quản lý y tế</p>
            <div className="flex justify-center space-x-1 mt-2">
              <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      </aside>
    );
  }