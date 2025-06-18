'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const adminMenus = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Quản lý sản phẩm', path: '/admin/product' },
  { label: 'Quản lý đơn hàng', path: '/admin/orders' },
  { label: 'Thông tin bác sĩ', path: '/admin/doctors' },
  { label: 'Phòng khám', path: '/admin/clinics' },
  { label: 'Chuyên khoa', path: '/admin/specialties' },
  { label: 'Lịch hẹn', path: '/admin/appointments' },
  { label: 'Tài khoản', path: '/admin/accounts' },
  { label: 'Doanh thu', path: '/admin/revenues' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-4 space-y-2">
        <h2 className="text-xl font-bold mb-4">🧑‍⚕️ Quản trị</h2>
        {adminMenus.map((menu) => (
          <Link
            key={menu.path}
            href={menu.path}
            className={`block px-3 py-2 rounded hover:bg-blue-600 ${
              pathname === menu.path ? 'bg-blue-600 font-semibold' : ''
            }`}
          >
            {menu.label}
          </Link>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
