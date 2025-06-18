'use client';

import Sidebardoctor from '@/components/layout/Sidebardoctor';
import React from 'react';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  appointment_date: string;
  time: string;
  reason: string;
}

const patientList: Patient[] = [
  {
    id: 1,
    name: 'Trần Thị Khách',
    email: 'khach1@example.com',
    phone: '0909123456',
    appointment_date: '2025-06-21',
    time: '08:15 - 08:30',
    reason: 'Khám tổng quát',
  },
  {
    id: 2,
    name: 'Phạm Văn Mua',
    email: 'khach2@example.com',
    phone: '0909234567',
    appointment_date: '2025-06-21',
    time: '09:00 - 09:15',
    reason: 'Khám da liễu',
  },
];

export default function PatientListPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebardoctor />

      <main className="flex-1 bg-gray-50 p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">
          👨‍⚕️ Hồ sơ bệnh nhân đang đặt lịch
        </h1>

        {patientList.length === 0 ? (
          <p className="text-gray-500">Hiện chưa có bệnh nhân nào đặt lịch khám.</p>
        ) : (
          <div className="space-y-4">
            {patientList.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-gray-200 p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-blue-800">{p.name}</h3>
                <p className="text-sm text-gray-700">📧 {p.email}</p>
                <p className="text-sm text-gray-700">📞 {p.phone}</p>
                <p className="text-sm text-gray-700">
                  🗓️ Ngày khám: <strong>{p.appointment_date}</strong>
                </p>
                <p className="text-sm text-gray-700">⏰ Giờ: {p.time}</p>
                <p className="text-sm text-gray-700">📝 Lý do: {p.reason}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
