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
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 sm:px-8 py-8 space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-blue-800">CHUYÊN KHOA: Cơ Xương Khớp</h2>
        <p className="mt-2 text-gray-600">Mô tả:</p>
        <ul className="list-disc ml-6 text-gray-700 mt-2 space-y-1">
          <li>Bác sĩ Cơ Xương Khớp giỏi</li>
          <li>Danh sách các bác sĩ uy tín đầu ngành tại Việt Nam</li>
          <li>Các chuyên gia được đào tạo bài bản, nhiều kinh nghiệm...</li>
        </ul>
        <button className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm">
          Xem Thêm
        </button>
      </div>

      <input
        type="text"
        placeholder="🔍 Tìm kiếm bác sĩ ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
      />

      {filteredDoctors.map((doc) => (
        <div
          key={doc.id}
          className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-lg transition"
        >
          <div className="w-full md:w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-sm">
            Ảnh
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">
              {doc.name}{' '}
              {doc.isFavorite && (
                <span className="text-sm text-pink-600 font-medium ml-1">(Yêu thích)</span>
              )}
            </h3>
            <ul className="list-disc ml-6 text-gray-600 space-y-1">
              {doc.description.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
            <p className="text-sm text-gray-500">Địa điểm: {doc.location}</p>
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 text-sm underline transition"
            >
              Xem thêm
            </a>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-64">
            <label htmlFor={`date-${doc.id}`} className="font-medium text-gray-700">
              Chọn ngày
            </label>
            <input
              type="date"
              id={`date-${doc.id}`}
              className="border border-gray-300 p-2 rounded-lg"
              defaultValue="2025-06-25"
            />
            <div className="flex gap-2 flex-wrap">
              {['14:00 - 15:00', '15:00 - 16:00', '17:00 - 17:50'].map((time, index) => (
                <button
                  key={index}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-100 text-sm transition"
                >
                  {time}
                </button>
              ))}
            </div>
            <button className="mt-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
              Tiến hành đặt lịch
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorBooking;
