'use client';
import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full text-sm">
      {/* Top blue bar */}
      <div className="w-full bg-blue-500 h-8"></div>

      {/* Top bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b">
        <div className="space-x-4">
          <a href="#" className="no-underline hover:text-blue-600">Về chúng tôi</a>
          <a href="#" className="no-underline hover:text-blue-600">Liên hệ</a>
          <a href="#" className="no-underline hover:text-blue-600">Giúp đỡ</a>
          <a href="#" className="no-underline hover:text-blue-600">FAQs</a>
        </div>
        <div className="flex items-center space-x-2">
          <select className="border rounded px-2 py-1">
            <option>Tài khoản</option>
            <option>Thông tin</option>
          </select>
          <select className="border rounded px-2 py-1">
            <option>EN</option>
            <option>VN</option>
          </select>
        </div>
      </div>

      {/* Middle bar */}
     <div className="flex justify-between items-center px-4 py-4 bg-blue-50 rounded-md shadow-sm">

        {/* Logo */}
        <div className="w-1/4 flex items-center">
          <img
            src="https://i.imgur.com/EYZSLd6.png"
            alt="Logo"
            className="h-10 object-contain"
          />
        </div>

      <div className="w-2/4">
  <div className="flex items-center bg-white border border-gray-300 rounded-full overflow-hidden shadow-sm">
    <span className="pl-4 text-gray-500 text-lg">🔍</span>
    <input
      type="text"
      placeholder="Tìm kiếm sản phẩm ......"
      className="px-3 py-2 w-full focus:outline-none rounded-full"
    />
  </div>
</div>


        {/* Phone + icons */}
        <div className="w-1/4 flex flex-col items-end text-right">
          <div className="text-xs">Dịch vụ khách hàng</div>
          <div className="font-bold text-lg">0888888888</div>
          <div className="flex space-x-4 mt-2 text-xl">
            <Link href="/account" className="hover:text-blue-600 no-underline">👤</Link>
            <Link href="/cart" className="hover:text-blue-600 no-underline">🛒</Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-200 flex items-center px-4 py-2">
        {/* Nút chuyên khoa */}
        <button className="bg-blue-500 text-white px-4 py-2 rounded mr-4">
          ☰ Chuyên khoa ▼
        </button>

        {/* Menu chính */}
        <div className="space-x-4 flex flex-wrap">
          <Link href="#" className="no-underline hover:text-blue-600">Trang chủ</Link>
          <Link href="/shop" className="no-underline hover:text-blue-600">Tất cả sản phẩm</Link>
          <Link href="/doctorbooking" className="no-underline hover:text-blue-600">Đặt lịch khám</Link>
          <Link href="#" className="no-underline hover:text-blue-600">Về chúng tôi ▼</Link>
          <Link href="#" className="no-underline hover:text-blue-600">Tin tức</Link>
          <Link href="#" className="no-underline hover:text-blue-600">Liên hệ</Link>
        </div>

        {/* Login/Đăng ký */}
        <div className="ml-auto">
          <Link href="/login" className="no-underline px-4 py-2 hover:text-blue-600">
            Đăng nhập / Đăng ký
          </Link>
        </div>
      </nav>
    </header>
  );
}
