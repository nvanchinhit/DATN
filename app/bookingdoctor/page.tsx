// File: DoctorBooking.jsx

'use client';

import React, { useState } from 'react';

const DoctorBooking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const doctors = [
    {
      id: 1,
      name: 'Trần Trọng Thắng',
      isFavorite: true,
      description: [
        'Bác sĩ chuyên khoa II Trần Trọng Thắng',
        'Gần 30 năm kinh nghiệm khám và điều trị cơ xương khớp',
        'Từng công tác tại Bệnh viện Xanh Pôn, Bệnh viện Phục hồi chức năng Hà Nội',
      ],
      location: 'Đà Nẵng',
    },
    {
      id: 2,
      name: 'Trần Cao Thắng',
      isFavorite: true,
      description: [
        'Bác sĩ chuyên khoa II Trần Cao Thắng',
        'Gần 30 năm kinh nghiệm khám và điều trị cơ xương khớp',
        'Từng công tác tại Bệnh viện Phục hồi chức năng Đà Nẵng',
      ],
      location: 'Đà Nẵng',
    },
  ];

  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-gray-200 p-6 rounded">
          <h2 className="text-xl font-bold">CHUYÊN KHOA: Cơ Xương Khớp</h2>
          <p className="mt-2">Mô tả:</p>
          <ul className="list-disc ml-5">
            <li>Bác sĩ Cơ Xương Khớp giỏi</li>
            <li>Danh sách các bác sĩ uy tín đầu ngành Cơ Xương Khớp tại Việt Nam</li>
            <li>Các chuyên gia có quá trình đào tạo bài bản, nhiều kinh nghiệm...</li>
          </ul>
          <button className="mt-4 px-4 py-2 bg-black text-white rounded">Xem Thêm</button>
        </div>

        <input
          type="text"
          placeholder="Tìm kiếm bác sĩ ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        {filteredDoctors.map((doc) => (
          <div key={doc.id} className="bg-gray-100 p-4 rounded flex gap-4">
            <div className="w-32 h-32 bg-gray-300 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold">
                {doc.name} {doc.isFavorite && <span>(Yêu thích)</span>}
              </h3>
              <ul className="list-disc ml-5">
                {doc.description.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
              <p className="text-sm text-gray-500">Bác sĩ khám tại: {doc.location}</p>
              <a href="#" className="text-blue-500 underline">Xem thêm</a>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor={`date-${doc.id}`} className="font-medium">Chọn ngày</label>
              <input type="date" id={`date-${doc.id}`} className="border p-1 rounded" defaultValue="2025-06-25" />
              <div className="flex gap-2 flex-wrap">
                {['14:00 - 15:00', '15:00 - 16:00', '17:00 - 17:50'].map((time, index) => (
                  <button key={index} className="px-2 py-1 bg-white border rounded hover:bg-gray-200">
                    {time}
                  </button>
                ))}
              </div>
              <button className="mt-2 bg-black text-white px-4 py-1 rounded hover:bg-gray-800">Tiến hành đặt lịch</button>
            </div>
          </div>
        ))}
      </div>
     
    </>
  );
};

export default DoctorBooking;
