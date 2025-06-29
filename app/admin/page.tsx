'use client';
import Link from 'next/link';
import {
  Users,
  CalendarClock,
  UserPlus,
  Stethoscope,
  BarChart2,
  DollarSign,
  ArrowUpRight,
  CalendarPlus
} from 'lucide-react';
import React from 'react';

// Component cho các thẻ chỉ số tổng quan
const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
    {change && (
        <p className="text-xs text-green-600 flex items-center mt-2">
            <ArrowUpRight className="h-4 w-4" />
            {change} so với tháng trước
        </p>
    )}
  </div>
);

// Component cho các thẻ hành động chính
const ActionCard = ({ title, description, icon: Icon, href, color }: any) => (
    <Link href={href} className="group block p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
        <div className={`p-4 inline-block rounded-lg ${color.bg}`}>
            <Icon className={`h-8 w-8 ${color.text}`} />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
    </Link>
)

export default function AdminDashboard() {
  // --- DỮ LIỆU ĐÃ CẬP NHẬT ---
  const stats = [
    { title: 'Doanh thu (Tháng)', value: '88.2M', change: '+15.3%', icon: DollarSign, color: 'bg-blue-500' },
    { title: 'Lịch hẹn mới', value: '124', change: '+20.1%', icon: CalendarPlus, color: 'bg-green-500' },
    { title: 'Người dùng mới', value: '86', change: '+5.1%', icon: UserPlus, color: 'bg-yellow-500' },
  ];
   const actions = [
    { title: 'Quản lý Lịch hẹn', description: 'Kiểm tra, xác nhận và xử lý các lịch hẹn đã đặt.', icon: CalendarClock, href: '/admin/appointments', color: { bg: 'bg-indigo-100', text: 'text-indigo-600' } },
    { title: 'Quản lý Bác sĩ', description: 'Cập nhật thông tin và lịch làm việc của bác sĩ.', icon: Stethoscope, href: '/admin/doctors', color: { bg: 'bg-pink-100', text: 'text-pink-600' } },
    { title: 'Quản lý Người dùng', description: 'Xem danh sách người dùng và phân quyền quản trị.', icon: Users, href: '/admin/accounts', color: { bg: 'bg-yellow-100', text: 'text-yellow-600' } },
    { title: 'Báo cáo Doanh thu', description: 'Thống kê chi tiết doanh thu theo dịch vụ và thời gian.', icon: BarChart2, href: '/admin/revenues', color: { bg: 'bg-teal-100', text: 'text-teal-600' } },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển</h1>
            <p className="text-gray-500 mt-1">Chào mừng trở lại, Admin! Đây là tổng quan hệ thống của bạn.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => <StatCard key={index} {...stat} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tác vụ chính</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {actions.map((action, index) => <ActionCard key={index} {...action} />)}
                </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Doanh thu 7 ngày qua</h2>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <div className="flex items-end h-48 space-x-2">
                            <div className="bg-blue-300 w-full rounded-t-md" style={{height: '40%'}}></div>
                            <div className="bg-blue-500 w-full rounded-t-md" style={{height: '60%'}}></div>
                            <div className="bg-blue-300 w-full rounded-t-md" style={{height: '50%'}}></div>
                            <div className="bg-blue-500 w-full rounded-t-md" style={{height: '80%'}}></div>
                            <div className="bg-blue-300 w-full rounded-t-md" style={{height: '70%'}}></div>
                            <div className="bg-blue-500 w-full rounded-t-md" style={{height: '90%'}}></div>
                            <div className="bg-blue-300 w-full rounded-t-md" style={{height: '75%'}}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hoạt động gần đây</h2>
                    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                       <ul className="space-y-4">
                           <li className="flex items-center gap-3">
                               <div className="p-2 bg-indigo-100 rounded-full"><CalendarClock className="h-5 w-5 text-indigo-600"/></div>
                               <p className="text-sm text-gray-700">Lịch hẹn với <span className="font-bold">BS. Minh</span> vừa được xác nhận. <span className="text-gray-400">/ 5 phút trước</span></p>
                           </li>
                           <li className="flex items-center gap-3">
                               <div className="p-2 bg-yellow-100 rounded-full"><UserPlus className="h-5 w-5 text-yellow-600"/></div>
                               <p className="text-sm text-gray-700"><span className="font-bold">Lê Thị B</span> vừa đăng ký tài khoản. <span className="text-gray-400">/ 1 giờ trước</span></p>
                           </li>
                           <li className="flex items-center gap-3">
                               <div className="p-2 bg-pink-100 rounded-full"><Stethoscope className="h-5 w-5 text-pink-600"/></div>
                               <p className="text-sm text-gray-700">Thông tin <span className="font-bold">BS. Lan Anh</span> vừa được cập nhật. <span className="text-gray-400">/ 2 giờ trước</span></p>
                           </li>
                       </ul>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}