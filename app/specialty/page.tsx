'use client';

import { useEffect, useState } from 'react';
import SpecialtyCard from '@/components/SpecialtyCard';

interface Specialization {
  id: number;
  name: string;
}

export default function SpecialtyPage() {
  const [data, setData] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/specializations')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-screen font-sans bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center">
            🔬 Danh sách Chuyên khoa
          </h1>

          {loading ? (
            <p className="text-center text-blue-500 text-lg">Đang tải...</p>
          ) : data.length === 0 ? (
            <p className="text-center text-red-500">Không có chuyên khoa nào!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data.map(sp => (
                <SpecialtyCard key={sp.id} name={sp.name} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
