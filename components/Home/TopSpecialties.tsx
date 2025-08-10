'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Specialty {
  id: number;
  name: string;
  image: string;
  price: number;
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
          {specialties.map((specialty, idx) => (
            <div
              key={specialty.id}
              className="group text-center p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-blue-400 hover:scale-105 relative"
            >
              {/* Ribbon cho card đầu tiên */}
              {idx === 0 && (
                <span className="absolute -top-4 left-4 bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-20">Hot</span>
              )}
              <div className="mb-6 flex items-center justify-center relative">
                <div className="p-4 rounded-full bg-blue-50 border-4 border-blue-100 group-hover:border-blue-400 shadow-lg transition-all duration-300">
                  <img
                    src={`${API_BASE}${specialty.image ?? '/uploads/default.png'}`}
                    alt={specialty.name ?? 'Chuyên khoa'}
                    className="w-20 h-20 object-contain rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl bg-white"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-blue-700">
                {specialty.name}
              </h3>
              <p className="text-gray-600 mb-2 text-sm transition-colors duration-300 group-hover:text-blue-400 group-hover:opacity-80">
                Chăm sóc sức khỏe {specialty.name?.toLowerCase()}
              </p>
              {/* Ẩn giá khám */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSpecialties;