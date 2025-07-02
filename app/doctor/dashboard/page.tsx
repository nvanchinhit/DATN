'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebardoctor';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

export default function DoctorDashboardPage() {
  const [status, setStatus] = useState<'pending' | 'active'>('active');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Gán dữ liệu mock (giả lập)
    setData({
      today: {
        total_today: 6,
        pending: 2,
      },
      chart: [
        { date: '2025-06-25', total: 1 },
        { date: '2025-06-26', total: 2 },
        { date: '2025-06-27', total: 3 },
        { date: '2025-06-28', total: 2 },
        { date: '2025-06-29', total: 1 },
        { date: '2025-06-30', total: 4 },
        { date: '2025-07-01', total: 2 },
      ],
    });
  }, []);

  if (status === 'pending') {
    return (
      <div className="flex h-screen font-sans bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded shadow max-w-lg">
            <h2 className="text-xl font-semibold mb-2">⏳ Tài khoản đang chờ xét duyệt</h2>
            <p>Vui lòng chờ quản trị viên phê duyệt tài khoản của bạn để sử dụng các chức năng quản lý.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">👨‍⚕️ Chào mừng, Bác sĩ!</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Lịch khám hôm nay</h2>
              <p className="text-3xl text-blue-600 font-bold">{data?.today?.total_today ?? 0}</p>
              <p className="text-gray-500 text-sm">Tổng số lịch hẹn</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Bệnh nhân đang đợi</h2>
              <p className="text-3xl text-yellow-500 font-bold">{data?.today?.pending ?? 0}</p>
              <p className="text-gray-500 text-sm">Chưa được khám</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Tổng số ca khám</h2>
              <p className="text-3xl text-green-600 font-bold">
                {data?.chart?.reduce((acc: number, cur: any) => acc + cur.total, 0) ?? 0}
              </p>
              <p className="text-gray-500 text-sm">Trong 7 ngày gần nhất</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">📊 Số ca khám gần đây</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={data?.chart || []}>
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
