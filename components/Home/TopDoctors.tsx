'use client';

import { useEffect, useState } from 'react';
import { Star, Calendar } from 'lucide-react';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Doctor {
  id: number;
  name: string;
  img: string;
  introduction?: string;
  specialty: string;
}

const TopDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/doctors/top`)
      .then((res) => setDoctors(res.data))
      .catch((err) => {
        console.error('❌ Lỗi lấy bác sĩ:', err);
      });
  }, []);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bác sĩ nổi bật</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Đội ngũ bác sĩ giỏi, giàu kinh nghiệm thuộc các chuyên khoa khác nhau
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={`${API_BASE}${doctor.img}`}
                  alt={doctor.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium ml-1 text-gray-700">4.9</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                <p className="text-sm text-teal-600 font-medium mb-2">Chuyên khoa: {doctor.specialty}</p>
                <p className="text-sm text-gray-600 mb-4">{doctor.introduction}</p>
                <p className="text-sm text-gray-500 flex items-center mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  Thứ 2 - 6: 8:00 - 17:00
                </p>
                <a
                  href={`/dat-lich/${doctor.id}`}
                  className="block w-full text-center py-2.5 px-4 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition font-medium"
                >
                  Đặt lịch khám
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDoctors;
