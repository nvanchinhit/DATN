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
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Chuyên khoa nổi bật</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Đa dạng chuyên khoa với đội ngũ bác sĩ giàu kinh nghiệm
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialties.map((specialty) => (
            <div
              key={specialty.id}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="p-6 text-center">
                <img
                  src={`${API_BASE}${specialty.image ?? '/uploads/default.png'}`}
                  alt={specialty.name ?? 'Chuyên khoa'}
                  className="w-20 h-20 mx-auto mb-4 rounded-full object-cover border"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {specialty.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  Chuyên khoa chăm sóc và điều trị {specialty.name?.toLowerCase()}
                </p>
                <a
                  href={`/chuyen-khoa/${specialty.id}`}
                  className="inline-flex items-center text-teal-600 font-medium hover:text-teal-700"
                >
                  Xem bác sĩ
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSpecialties;
