'use client';

import { useEffect, useState } from 'react';
import { Star, Calendar, ArrowRight } from 'lucide-react';
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold">Đội ngũ Y Bác sĩ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Bác sĩ hàng đầu của chúng tôi</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Gặp gỡ các chuyên gia y tế giỏi, giàu kinh nghiệm, luôn tận tâm vì sức khỏe của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={`${API_BASE}${doctor.img}`}
                  alt={doctor.name}
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                    <a
                      href={`/dat-lich/${doctor.id}`}
                      className="text-white font-semibold flex items-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100"
                    >
                      Đặt lịch ngay <ArrowRight className="ml-2 w-4 h-4" />
                    </a>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <p className="text-sm font-semibold text-blue-600 mb-1">{doctor.specialty}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
                <p className="text-gray-500 text-sm flex-grow">
                    {doctor.introduction || 'Bác sĩ có nhiều năm kinh nghiệm trong lĩnh vực.'}
                </p>
                 <div className="flex items-center text-sm text-yellow-500 mt-4 mb-4">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-gray-600 ml-2">(5.0)</span>
                </div>
                <a
                  href={`/dat-lich/${doctor.id}`}
                  className="block w-full text-center py-2.5 px-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-semibold mt-auto"
                >
                  Xem hồ sơ
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