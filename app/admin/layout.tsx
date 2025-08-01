'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Stethoscope, Building, ClipboardList, CalendarClock,
  Users, BarChart2, X, Menu, LogOut, User as UserIcon, Bell, Settings, Loader2, CreditCard, FileText
} from 'lucide-react';

// Interface User
interface User {
  id: number;
  email: string;
  name: string;
  role_id: number;
}

// Cấu trúc menu không đổi
const adminMenuGroups = [
  { group: 'Tổng quan', items: [{ label: 'Bảng điều khiển', path: '/admin', icon: LayoutDashboard }, { label: 'Doanh thu', path: '/admin/revenues', icon: BarChart2 }] },
  { group: 'Quản lý', items: [{ label: 'Lịch hẹn', path: '/admin/schedules', icon: CalendarClock }, { label: 'Bác sĩ', path: '/admin/doctors', icon: Stethoscope },  { label: 'Chuyên khoa', path: '/admin/specialties', icon: ClipboardList }, { label: 'Người dùng', path: '/admin/accounts', icon: Users }, { label: 'Thanh toán', path: '/admin/payment', icon: CreditCard }, { label: 'Hồ sơ bệnh án', path: '/admin/medical-records', icon: FileText }] },
];


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  
  // State để xác định có được phép render nội dung chính không
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Handle authentication directly
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser.role_id === 1) {
            setUser(parsedUser);
            setIsAuthorized(true);
          } else {
            // Not admin, redirect to login
            setIsAuthorized(false);
            router.replace('/admin/login');
          }
        } else {
          // No token, redirect to login
          setIsAuthorized(false);
          router.replace('/admin/login');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthorized(false);
        router.replace('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Handle logout
  const handleLogout = () => {
    setProfileMenuOpen(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthorized(false);
    router.push('/admin/login');
  };

  // 1. Kiểm tra các trang không cần layout (như trang login)
  const noLayoutRoutes = ['/admin/login'];
  if (noLayoutRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // --- CÁC HÀM VÀ COMPONENT KHÁC ---
  const isActive = (path: string) => {
    return pathname === path || (path !== '/admin' && pathname.startsWith(path));
  };

  const SidebarContent = () => (
    <>
      <div className="px-4 py-3 mb-4 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
            <img src="https://i.imgur.com/bUBPKF9.jpeg" alt="Logo" />
        </Link>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>
      <nav className="flex-1 px-2">
        {adminMenuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4">
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{group.group}</h3>
            {group.items.map((menu) => (
              <Link key={menu.path} href={menu.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive(menu.path) ? 'bg-slate-700 font-semibold text-white' : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'}`}>
                <menu.icon size={20} />
                <span>{menu.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </>
  );

  // Luôn trả về cấu trúc layout đầy đủ
  return (
    <div className="flex min-h-screen bg-gray-100">
      {isSidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-20 lg:hidden"></div>}
      <aside className={`fixed lg:relative inset-y-0 left-0 w-64 bg-slate-900 flex flex-col z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <SidebarContent />
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 bg-white shadow-sm z-10">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-800"><Menu size={24} /></button>
                <div className="flex-1"></div>
                <div className="flex items-center gap-4">
                    <button className="text-gray-500 hover:text-gray-800"><Bell size={20}/></button>
                    <div className="relative">
                        {user && ( // Chỉ hiển thị khi có user
                            <button onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-3">
                               <span className='text-sm text-gray-600 hidden sm:inline'>Chào, <span className='font-semibold'>{user.name}</span></span>
                                <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                   {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={20}/>}
                                </div>
                            </button>
                        )}
                        {isProfileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                                <Link href="/profile" onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><UserIcon size={16}/>Hồ sơ</Link>
                                <div className="border-t my-1"></div>
                                <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"><LogOut size={16}/>Đăng xuất</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {/* --- LOGIC RENDER NỘI DUNG ĐƯỢC CHUYỂN VÀO ĐÂY --- */}
            {loading || !isAuthorized ? (
                <div className="flex h-full w-full items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                </div>
            ) : (
                children // Chỉ render children khi đã xác thực và có quyền
            )}
        </main>
      </div>
    </div>
  );
}