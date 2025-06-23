'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/* ---------- TYPES ---------- */
interface Specialization {
  id: number;
  name: string;
  image: string;
}

const API_BASE_URL = 'http://localhost:5000';

/* ---------- CARD ---------- */
function SpecialtyCard({
  id, name, image, onClick,
}: Specialization & { onClick: (id: number) => void }) {
  return (
    <div
      onClick={() => onClick(id)}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-2 overflow-hidden cursor-pointer group"
    >
      <img
        src={`${API_BASE_URL}${image}`}
        alt={name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition">
          {name}
        </h3>
      </div>
    </div>
  );
}

/* ---------- PAGE ---------- */
export default function SpecialtyPage() {
  const [data, setData] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* state cho ô tìm kiếm */
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  /* fetch dữ liệu 1 lần */
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/specializations`);
        if (!res.ok) throw new Error('Không thể kết nối đến server.');
        setData(await res.json());
      } catch (e: any) {
        setError(e.message || 'Đã có lỗi xảy ra.');
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialties();
  }, []);

  /* hàm điều hướng */
  const handleClick = (id: number) => {
    router.push(`/bookingdoctor?specialization=${id}`);
  };

  /* lọc theo searchTerm (không phân biệt hoa thường) */
  const filtered = data.filter(sp =>
    sp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-6 text-center">
          🔬 Danh sách Chuyên khoa
        </h1>

        {/* ---------- THANH TÌM KIẾM ---------- */}
        <div className="relative w-full max-w-sm mx-auto mb-8">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm chuyên khoa..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ---------- NỘI DUNG ---------- */}
        {loading ? (
          <p className="text-center text-blue-500">Đang tải danh sách chuyên khoa...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">Không tìm thấy chuyên khoa nào.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(sp => (
              <SpecialtyCard
                key={sp.id}
                {...sp}
                onClick={handleClick}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
