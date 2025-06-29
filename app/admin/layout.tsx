'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { useAuth } from '@/app/contexts/page';
import {
  LayoutDashboard,
  Stethoscope,
  Building,
  ClipboardList,
  CalendarClock,
  Users,
  BarChart2,
  X,
  Menu,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

// Cấu trúc menu mới với icon và nhóm
const adminMenuGroups = [
  {
    group: 'Tổng quan',
    items: [
      { label: 'Bảng điều khiển', path: '/admin', icon: LayoutDashboard },
      { label: 'Doanh thu', path: '/admin/revenues', icon: BarChart2 },
    ],
  },
  {
    group: 'Quản lý',
    items: [
      { label: 'Lịch hẹn', path: '/admin/appointments', icon: CalendarClock },
      { label: 'Bác sĩ', path: '/admin/doctors', icon: Stethoscope },
      { label: 'Phòng khám', path: '/admin/clinics', icon: Building },
      { label: 'Chuyên khoa', path: '/admin/specialties', icon: ClipboardList },
      { label: 'Người dùng', path: '/admin/accounts', icon: Users },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path || (path !== '/admin' && pathname.startsWith(path));
  };
  
  const SidebarContent = () => (
    <>
      <div className="px-4 py-3 mb-4 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
            <img src="/logo-icon-white.png" alt="Logo" className="h-8 w-8" />
            <h2 className="text-xl font-bold text-white">TDCARE</h2>
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
              <Link
                key={menu.path}
                href={menu.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive(menu.path)
                    ? 'bg-slate-700 font-semibold text-white'
                    : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <menu.icon size={20} />
                <span>{menu.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
            onClick={() => setSidebarOpen(false)} 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 w-64 bg-slate-900 flex flex-col z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header Bar */}
        <header className="sticky top-0 bg-white shadow-sm z-10">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-800">
                    <Menu size={24} />
                </button>
                <div className="flex-1"></div> {/* Spacer */}
                <div className="relative">
                  {user ? (
                    <div className="flex items-center gap-3">
                       <span className='text-sm text-gray-600 hidden sm:inline'>Chào, <span className='font-semibold'>{user.name}</span></span>
                        <button className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                           {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={20}/>}
                        </button>
                    </div>
                  ) : <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>}
                </div>
            </div>
        </header>
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </div>
    </div>
  );
}