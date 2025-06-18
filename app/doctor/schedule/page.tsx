'use client';

import React from 'react';
import Sidebardoctor from '@/components/layout/Sidebardoctor';

interface Slot {
  id: number;
  slot_date: string;
  start_time: string;
  end_time: string;
}

const doctorSlots: Slot[] = [
  { id: 1, slot_date: '2025-06-21', start_time: '08:00:00', end_time: '08:15:00' },
  { id: 2, slot_date: '2025-06-21', start_time: '08:15:00', end_time: '08:30:00' },
  { id: 3, slot_date: '2025-06-21', start_time: '08:30:00', end_time: '08:45:00' },
  { id: 4, slot_date: '2025-06-21', start_time: '08:45:00', end_time: '09:00:00' },
  { id: 5, slot_date: '2025-06-21', start_time: '09:00:00', end_time: '09:15:00' },
  { id: 6, slot_date: '2025-06-21', start_time: '09:15:00', end_time: '09:30:00' },
  { id: 7, slot_date: '2025-06-21', start_time: '09:30:00', end_time: '09:45:00' },
  { id: 8, slot_date: '2025-06-21', start_time: '09:45:00', end_time: '10:00:00' },
  { id: 9, slot_date: '2025-06-21', start_time: '10:00:00', end_time: '10:15:00' },
  { id: 10, slot_date: '2025-06-21', start_time: '10:15:00', end_time: '10:30:00' },
  { id: 11, slot_date: '2025-06-21', start_time: '10:30:00', end_time: '10:45:00' },
  { id: 12, slot_date: '2025-06-21', start_time: '10:45:00', end_time: '11:00:00' },
];

export default function DoctorSchedulePage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar bên trái */}
      <Sidebardoctor />

      {/* Phần nội dung lịch khám bên phải */}
      <main className="flex-1 bg-gray-50 p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">
          📅 Lịch khám ngày {doctorSlots[0].slot_date}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {doctorSlots.map((slot) => (
            <div
              key={slot.id}
              className="bg-white border border-gray-200 rounded-md p-4 shadow hover:shadow-md transition"
            >
              <p className="text-sm text-gray-600 mb-1">Khung giờ:</p>
              <p className="text-lg font-semibold text-blue-800">
                ⏰ {slot.start_time} - {slot.end_time}
              </p>
              <button className="mt-3 text-sm bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
