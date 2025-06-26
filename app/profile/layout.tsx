// app/profile/layout.tsx
'use client';

import { useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UserInfo {
  name: string;
  avatar: string | null;
}

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
        const res = await fetch(`${API_URL}/api/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
           if (res.status === 401 || res.status === 403) { alert("Phiên đăng nhập đã hết hạn."); logout(); }
           throw new Error('Không thể tải dữ liệu người dùng.');
        }
        const result = await res.json();
        setUserInfo({ name: result.data.name, avatar: result.data.avatar });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [authLoading, user, token, router, logout]);

  const displayAvatar = userInfo?.avatar ? `${API_URL}${userInfo.avatar}` : '/placeholder-avatar.png';
  const isActive = (path: string) => pathname === path;

  if (authLoading || loading) {
    return <p className="p-6 text-center text-lg">Đang tải trang...</p>;
  }

  return (
    <div className="bg-gray-100 py-6 px-4">
      <div className="max-w-6xl mx-auto flex gap-8">
        {/* === Sidebar DUY NHẤT === */}
        <aside className="w-1/4 hidden lg:block">
          <div className="flex items-center gap-3 pb-4 border-b mb-4">
            <img 
              src={displayAvatar} 
              alt="Avatar" 
              className="w-12 h-12 rounded-full object-cover" 
              onError={(e) => { e.currentTarget.src = '/placeholder-avatar.png'; }} 
            />
            {userInfo && (
              <div>
                <p className="font-semibold truncate">{userInfo.name}</p>
                <Link href="/profile" className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
                  Sửa Hồ Sơ
                </Link>
              </div>
            )}
          </div>
          <nav className="space-y-2">
            <Link href="#" className="flex items-center gap-3 p-2 rounded text-gray-700 hover:bg-gray-200"><span>📅</span> Đặt Lịch Khám</Link>
            <div>
              <div className="flex items-center gap-3 p-2 rounded text-gray-700"><span>👤</span> Tài Khoản Của Tôi</div>
              <div className="pl-8 mt-2 space-y-2 text-gray-600">
                <Link href="/profile" className={`block hover:text-blue-600 ${isActive('/profile') ? 'text-blue-600 font-semibold' : ''}`}>Hồ Sơ</Link>
                <Link href="/profile/address" className={`block hover:text-blue-600 ${isActive('/profile/address') ? 'text-blue-600 font-semibold' : ''}`}>Địa Chỉ</Link>
                <Link href="/profile/password" className={`block hover:text-blue-600 ${isActive('/profile/password') ? 'text-blue-600 font-semibold' : ''}`}>Đổi Mật Khẩu</Link>
              </div>
            </div>
          </nav>
        </aside>

        {/* Vùng nội dung chính, nơi các page.tsx sẽ được render */}
        <main className="flex-1 bg-white p-6 rounded-lg shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
}