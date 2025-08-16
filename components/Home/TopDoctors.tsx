'use client';

import { useEffect, useState } from 'react';
import { Star, Calendar, ArrowRight } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Doctor {
  id: number;
  name: string;
  img: string;
  introduction?: string;
  specialty: string;
  price?: number;
  average_rating?: number;
  review_count?: number;
}

const TopDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/doctors/top`)
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
          {doctors.map((doctor, idx) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group flex flex-col border border-transparent hover:border-blue-400 hover:scale-105 relative"
            >
              {/* Ribbon cho bác sĩ top 1 */}
              {idx === 0 && (
                <span className="absolute -top-4 left-4 bg-gradient-to-r from-blue-500 to-blue-300 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-20">Top 1</span>
              )}
              <div className="relative h-64 overflow-hidden flex items-center justify-center bg-gradient-to-t from-blue-50 to-white">
                <img
                  src={`${API_URL}${doctor.img}`}
                  alt={doctor.name}
                  className="w-40 h-40 rounded-full object-cover border-4 border-blue-200 shadow-md group-hover:border-blue-400 group-hover:scale-110 transition-all duration-300 bg-white"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col items-center">
                <p className="text-sm font-semibold text-blue-600 mb-1">{doctor.specialty}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{doctor.name}</h3>
                {doctor.price && doctor.price > 0 && (
                  <div className="mb-3">
                    <span className="text-lg font-bold text-green-600">
                      {doctor.price.toLocaleString('vi-VN')} VNĐ
                    </span>
                    <span className="text-sm text-gray-500 ml-1">/lần khám</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-yellow-500 mt-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${doctor.average_rating && star <= Math.round(Number(doctor.average_rating)) ? 'fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-gray-600 ml-2">
                    ({doctor.average_rating ? Number(doctor.average_rating).toFixed(1) : '0.0'})
                    {doctor.review_count && ` (${doctor.review_count} đánh giá)`}
                  </span>
                </div>
                {/* Bỏ phần giới thiệu */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDoctors;