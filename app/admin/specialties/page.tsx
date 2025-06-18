'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface Specialization {
  id: number;
  name: string;
}

export default function SpecializationsPage() {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/specializations')
      .then((res) => res.json())
      .then((data: Specialization[]) => {
        setSpecializations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi tải chuyên khoa:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🩺 Danh mục chuyên khoa</h1>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên chuyên khoa</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {specializations.map((spec) => (
                <tr key={spec.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{spec.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{spec.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className="flex justify-center items-center gap-4">
                      <button title="Chỉnh sửa" className="text-yellow-600 hover:text-yellow-800">
                        <Pencil size={18} />
                      </button>
                      <button title="Xoá" className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
