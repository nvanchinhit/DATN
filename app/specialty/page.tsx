'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Định nghĩa kiểu dữ liệu cho một chuyên khoa
interface Specialization {
  id: number;
  name: string;
  image: string;
}

// Địa chỉ API backend (có thể đưa ra file .env nếu cần)
const API_BASE_URL = 'http://localhost:5000';

// Component thẻ chuyên khoa
function SpecialtyCard({ id, name, image, onClick }: Specialization & { onClick: (id: number) => void }) {
  return (
    <div
      onClick={() => onClick(id)}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer group"
    >
      <img
        src={`${API_BASE_URL}${image}`} // ✅ THÊM domain đầy đủ vào src ảnh
        alt={name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{name}</h3>
      </div>
    </div>
  );
}

// Component trang chính
export default function SpecialtyPage() {
  const [data, setData] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/specializations`);
        if (!response.ok) {
          throw new Error('Không thể kết nối đến server.');
        }
        const specialtiesData: Specialization[] = await response.json();
        setData(specialtiesData);
      } catch (err: any) {
        console.error("Lỗi khi fetch dữ liệu chuyên khoa:", err);
        setError(err.message || 'Đã có lỗi xảy ra khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  const handleClick = (id: number) => {
    router.push(`/bookingdoctor?specialization=${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-8 text-center">
          🔬 Danh sách Chuyên khoa
        </h1>
        {loading ? (
          <p className="text-center text-blue-500 text-lg">Đang tải danh sách chuyên khoa...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-500">Không tìm thấy chuyên khoa nào.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.map(sp => (
              <SpecialtyCard
                key={sp.id}
                id={sp.id}
                name={sp.name}
                image={sp.image}
                onClick={handleClick}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
