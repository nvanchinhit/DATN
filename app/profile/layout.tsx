// app/profile/layout.tsx
'use client';

import { useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/page';
import Link from 'next/link';
import { 
  User, 
  Calendar, 
  FileText, 
  MapPin, 
  Lock, 
  LogOut,
  Home,
  Heart,
  CreditCard
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UserInfo {
  name: string;
  avatar: string | null;
  role_id: number;
}

const getRoleInfo = (roleId: number) => {
  switch (roleId) {
    case 1:
      return { name: 'Quản trị viên', color: 'text-purple-600', bgColor: 'bg-purple-50' };
    case 2:
      return { name: 'Khách hàng', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    case 3:
      return { name: 'Bác sĩ', color: 'text-green-600', bgColor: 'bg-green-50' };
    default:
      return { name: 'Người dùng', color: 'text-gray-600', bgColor: 'bg-gray-50' };
  }
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const { user, token, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!token || !user) {
      router.replace('/login');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        
        if (user.role_id === 1) { // Admin role
          setUserInfo({
            name: user.name,
            avatar: user.avatar || null, // Admin có thể không có avatar trong local storage
            role_id: user.role_id
          });
        } else { // Customer or Doctor role
          const res = await fetch(`${API_URL}/api/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!res.ok) {
             if (res.status === 401 || res.status === 403) { alert("Phiên đăng nhập đã hết hạn."); logout(); }
             throw new Error('Không thể tải dữ liệu người dùng.');
          }
          const result = await res.json();
          setUserInfo({ 
            name: result.data.name, 
            avatar: result.data.avatar,
            role_id: result.data.role_id || user.role_id
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [authLoading, user, token, router, logout]);

  const isActive = (path: string) => pathname === path;
  const roleInfo = userInfo ? getRoleInfo(userInfo.role_id) : getRoleInfo(2);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải trang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* === Sidebar Navigation === */}
          <aside className="lg:w-64">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* Menu Header */}
              <div className="mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Tài khoản</h3>
                <p className="text-sm text-gray-500">Quản lý thông tin cá nhân</p>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1">
                {/* Main Services */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                    Dịch vụ
                  </h4>
                  <div className="space-y-1">
                    <Link 
                      href="/profile/appointment" 
                      className={`flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 ${
                        isActive('/profile/appointment') ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                      }`}
                    >
                      <Calendar size={18} />
                      <span>Đặt lịch khám</span>
                    </Link>
                    
                    <Link 
                      href="/profile/medical-record" 
                      className={`flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 ${
                        isActive('/profile/medical-record') ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                      }`}
                    >
                      <FileText size={18} />
                      <span>Hồ sơ bệnh án</span>
                    </Link>
                  </div>
                </div>

                {/* Account Management */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                    Quản lý tài khoản
                  </h4>
                  <div className="space-y-1">
                    <Link 
                      href="/profile" 
                      className={`flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 ${
                        isActive('/profile') ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                      }`}
                    >
                      <User size={18} />
                      <span>Hồ sơ cá nhân</span>
                    </Link>
                    
                    <Link 
                      href="/profile/address" 
                      className={`flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 ${
                        isActive('/profile/address') ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                      }`}
                    >
                      <MapPin size={18} />
                      <span>Địa chỉ</span>
                    </Link>
                    
                    <Link 
                      href="/profile/password" 
                      className={`flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 ${
                        isActive('/profile/password') ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                      }`}
                    >
                      <Lock size={18} />
                      <span>Đổi mật khẩu</span>
                    </Link>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                    Thao tác nhanh
                  </h4>
                  <div className="space-y-1">
                    <Link 
                      href="/" 
                      className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                    >
                      <Home size={18} />
                      <span>Về trang chủ</span>
                    </Link>
                    
                    <Link 
                      href="/shop" 
                      className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                    >
                      <Heart size={18} />
                      <span>Mua thuốc</span>
                    </Link>
                  </div>
                </div>

                {/* Logout */}
                <div className="pt-4 border-t border-gray-100">
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <LogOut size={18} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}