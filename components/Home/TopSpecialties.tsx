'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Specialty {
  id: number;
  name: string;
  image: string;
}

const TopSpecialties = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/specializations/top`)
      .then((res) => setSpecialties(res.data))
      .catch((err) => console.error('Lỗi khi tải chuyên khoa:', err));
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
           <p className="text-blue-600 font-semibold">Chuyên Khoa</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Các chuyên khoa nổi bật</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Lựa chọn chuyên khoa phù hợp với nhu cầu và tìm kiếm bác sĩ hàng đầu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {specialties.map((specialty) => (
            <div
              key={specialty.id}
              className="group text-center p-6 bg-gray-50 rounded-xl transition-all duration-300 hover:bg-blue-600 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="mb-4 inline-block p-4 bg-white rounded-full transition-all duration-300 group-hover:bg-white/90">
                <img
                  src={`${API_BASE}${specialty.image ?? '/uploads/default.png'}`}
                  alt={specialty.name ?? 'Chuyên khoa'}
                  className="w-16 h-16 mx-auto object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-white">
                {specialty.name}
              </h3>
              <p className="text-gray-600 mb-4 text-sm transition-colors duration-300 group-hover:text-blue-100">
                Chăm sóc sức khỏe {specialty.name?.toLowerCase()}
              </p>
              <a
                href={`/chuyen-khoa/${specialty.id}`}
                className="inline-flex items-center text-blue-600 font-semibold transition-colors duration-300 group-hover:text-white"
              >
                Xem chi tiết
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSpecialties;