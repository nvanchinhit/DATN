'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="w-full bg-white shadow text-sm">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white text-xs py-2 px-4 flex justify-between">
        <div className="space-x-4">
          <Link href="#">Về chúng tôi</Link>
          <Link href="#">Liên hệ</Link>
          <Link href="#">Giúp đỡ</Link>
          <Link href="#">FAQs</Link>
        </div>
        <div className="space-x-3">
          <select className="bg-blue-600 text-white border-none">
            <option>Tài khoản</option>
            <option>Thông tin</option>
          </select>
          <select className="bg-blue-600 text-white border-none">
            <option>VN</option>
            <option>EN</option>
          </select>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex items-center justify-between px-4 py-4 gap-4 flex-wrap md:flex-nowrap">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src="https://i.imgur.com/EYZSLd6.png"
            alt="Logo"
            className="h-10"
          />
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-lg mx-4">
          <div className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-4 py-2 shadow-sm">
            <span className="text-gray-500 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm ..."
              className="w-full bg-transparent focus:outline-none ml-2 text-sm"
            />
          </div>
        </div>

        {/* Navigation & Login */}
        <div className="flex items-center gap-4 flex-wrap justify-end">
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
            <Link href="/shop" className="hover:text-blue-600">Sản phẩm</Link>
            <Link href="/doctorbooking" className="hover:text-blue-600">Đặt lịch khám</Link>
            <Link href="#" className="hover:text-blue-600">Về chúng tôi</Link>
            <Link href="#" className="hover:text-blue-600">Tin tức</Link>
            <Link href="#" className="hover:text-blue-600">Liên hệ</Link>
          </nav>

          <Link href="/account" className="text-xl hover:text-blue-600">👤</Link>
          <Link href="/cart" className="text-xl hover:text-blue-600">🛒</Link>

          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">👋 Xin chào, <strong>{user.name}</strong></span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:underline"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-sm text-blue-600 hover:no-underline">
              Đăng nhập / Đăng ký
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
