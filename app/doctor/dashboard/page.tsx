'use client';

import Sidebar from '@/components/layout/Sidebardoctor';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import React from 'react';

export default function App() {
  // Dữ liệu mẫu
  const appointmentsToday = 8;
  const pendingPatients = 3;
  const recentAppointments = [
    { date: '14/06', total: 4 },
    { date: '15/06', total: 6 },
    { date: '16/06', total: 2 },
    { date: '17/06', total: 5 },
    { date: '18/06', total: 7 },
  ];

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Nội dung chính */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">👨‍⚕️ Chào mừng, Bác sĩ!</h1>

          {/* Thống kê nhanh */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Lịch khám hôm nay</h2>
              <p className="text-3xl text-blue-600 font-bold">{appointmentsToday}</p>
              <p className="text-gray-500 text-sm">Tổng số lịch hẹn</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Bệnh nhân đang đợi</h2>
              <p className="text-3xl text-yellow-500 font-bold">{pendingPatients}</p>
              <p className="text-gray-500 text-sm">Chưa được khám</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Tổng số ca khám</h2>
              <p className="text-3xl text-green-600 font-bold">125</p>
              <p className="text-gray-500 text-sm">Từ đầu tháng</p>
            </div>
          </div>

          {/* Biểu đồ số ca khám gần đây */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">📊 Số ca khám gần đây</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={recentAppointments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
