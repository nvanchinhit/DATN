'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebardoctor';

export default function DoctorProfilePage() {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/doctor/profile')
      .then((res) => res.json())
      .then((data) => {
        setDoctor(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Lỗi khi tải hồ sơ:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Đang tải hồ sơ...</p>;
  if (!doctor) return <p className="p-6 text-red-600">Không tìm thấy hồ sơ bác sĩ.</p>;

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-6">Hồ sơ Bác sĩ</h1>

          <div className="flex items-center gap-4 mb-4">
            <img
              src={`/images/doctors/${doctor.img}`} // Bạn có thể chỉnh src tùy ảnh
              alt="Ảnh bác sĩ"
              className="w-24 h-24 rounded-full border object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">{doctor.name}</h2>
              <p className="text-sm text-gray-600">📧 {doctor.email}</p>
              <p className="text-sm text-gray-600">📞 {doctor.phone}</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2">Chuyên khoa</h3>
          <p className="mb-6">{doctor.specialization_id === 1 ? 'Nội khoa' : 'Chuyên khoa khác'}</p>

          <h3 className="text-lg font-semibold mb-2">Giới thiệu bản thân</h3>
          <p className="text-justify leading-relaxed mb-6">
            {doctor.introduction}
          </p>

          <h3 className="text-lg font-semibold mb-2">Bằng cấp</h3>
          <img
            src={doctor.degree_image}
            alt="Bằng cấp"
            className="w-64 border rounded shadow"
          />

          <h3 className="text-lg font-semibold mt-4 mb-2">Chứng chỉ</h3>
          <img
            src={`/images/doctors/${doctor.certificate_image}`}
            alt="Chứng chỉ"
            className="w-64 border rounded shadow"
          />
        </div>
      </div>
    </div>
  );
}
