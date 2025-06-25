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
  // Hàm xử lý liên hệ
  const handleContact = (phone: string) => {
    alert(`Liên hệ bệnh nhân qua số: ${phone}`);
    // Hoặc mở tel:
    // window.location.href = `tel:${phone}`;
  };

  // Hàm xử lý hủy lịch
  const handleCancel = (id: number) => {
    if (confirm('Bạn có chắc muốn hủy lịch khám này không?')) {
      // Xử lý gọi API hủy ở đây
      alert(`Đã hủy lịch khám của bệnh nhân ID: ${id}`);
    }
  };

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

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleContact(p.phone)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                  >
                    📞 Liên hệ
                  </button>
                  <button
                    onClick={() => handleCancel(p.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    ❌ Hủy lịch
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
