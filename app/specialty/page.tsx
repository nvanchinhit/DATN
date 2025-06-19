// File: app/specialty/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// 👉 Dữ liệu mẫu được định nghĩa trực tiếp trong file
interface Specialization {
  id: number;
  name: string;
  image: string;
}

const allSpecialties: Specialization[] = [
  { id: 1, name: 'Tim mạch', image: 'https://cdn.bookingcare.vn/fr/w300/2023/12/29/140955-icon-tim-mach.png' },
  { id: 2, name: 'Da liễu', image: 'https://cdn.bookingcare.vn/fr/w300/2023/12/29/141009-icon-da-lieu.png' },
  { id: 3, name: 'Nhi khoa', image: 'https://cdn.bookingcare.vn/fr/w300/2023/12/29/141158-icon-nhi-khoa.png' },
  { id: 4, name: 'Sản phụ khoa', image: 'https://cdn.bookingcare.vn/fr/w300/2023/12/29/141212-icon-san-phu-khoa.png' },
  { id: 5, name: 'Tai Mũi Họng', image: 'https://cdn.bookingcare.vn/fr/w300/2023/12/29/141022-icon-tai-mui-hong.png'},
  { id: 6, name: 'Cơ Xương Khớp', image: 'https://cdn.bookingcare.vn/fr/w300/2023/12/29/140943-icon-co-xuong-khop.png'}
];

// Component SpecialtyCard (có thể đặt trong file riêng hoặc ngay tại đây)
function SpecialtyCard({ id, name, image, onClick }: Specialization & { onClick: (id: number) => void }) {
  return (
    <div
      onClick={() => onClick(id)}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer group"
    >
      <img src={image} alt={name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{name}</h3>
      </div>
    </div>
  );
}

export default function SpecialtyPage() {
  const [data, setData] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Mô phỏng fetch bằng cách dùng dữ liệu mẫu
    setTimeout(() => {
      setData(allSpecialties);
      setLoading(false);
    }, 300);
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
          <p className="text-center text-blue-500 text-lg">Đang tải...</p>
        ) : data.length === 0 ? (
          <p className="text-center text-red-500">Không có chuyên khoa nào!</p>
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