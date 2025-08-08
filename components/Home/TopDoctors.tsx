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
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={`${API_URL}${doctor.img}`}
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

                {doctor.price && doctor.price > 0 && (
                  <div className="mb-3">
                    <span className="text-lg font-bold text-green-600">
                      {doctor.price.toLocaleString('vi-VN')} VNĐ
                    </span>
                    <span className="text-sm text-gray-500 ml-1">/lần khám</span>
                  </div>
                )}
                 <div className="flex items-center text-sm text-yellow-500 mt-4 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        doctor.average_rating && star <= Math.round(Number(doctor.average_rating))
                          ? 'fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-gray-600 ml-2">
                    ({doctor.average_rating ? Number(doctor.average_rating).toFixed(1) : '0.0'})
                    {doctor.review_count && ` (${doctor.review_count} đánh giá)`}
                  </span>
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