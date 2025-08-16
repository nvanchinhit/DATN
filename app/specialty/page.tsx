'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Stethoscope, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

interface Specialization {
  id: number;
  name: string;
  image: string;
  price: number;
}

// === Component: Thẻ Chuyên khoa (Card) ===
function SpecialtyCard({ name, image, price, onClick }: Specialization & { onClick: () => void }) {
  const imageUrl = image && image.startsWith('http') ? image : `${API_URL}${image}`;
  
  return (
    <div
      onClick={onClick}
      className="group flex flex-col bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100"
    >
      <div className="h-44 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 -mt-10 bg-white">
                 <img src={imageUrl} alt={`${name} icon`} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 leading-tight">
              {name}
            </h3>
        </div>
        <p className="text-sm text-gray-500 mb-4 flex-grow">
          Tìm kiếm các bác sĩ và chuyên gia hàng đầu trong lĩnh vực {name.toLowerCase()}.
        </p>
        {price > 0 && (
          <div className="mb-3">
            <span className="text-lg font-bold text-green-600">
             {Number(price).toLocaleString('vi-VN')} VND
            </span>
            <span className="text-sm text-gray-500 ml-1">/lần khám</span>
          </div>
        )}
        <div className="mt-auto text-blue-600 font-semibold text-sm flex items-center group-hover:text-blue-700">
          Xem bác sĩ
          <ArrowRight className="ml-1.5 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}

// === Component: Khung xương cho trạng thái Loading ===
function SpecialtyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 animate-pulse">
        <div className="h-36 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-5 w-3/4 bg-gray-200 rounded-md mb-2"></div>
        <div className="h-4 w-full bg-gray-200 rounded-md mb-1"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded-md"></div>
    </div>
  );
}

// === Component Trang Chính ===
export default function SpecialtyPage() {
  const [data, setData] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/specializations`);
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

  const handleClick = (id: number) => {
    router.push(`/bookingdoctor?specialization=${id}`);
  };

  const filtered = data.filter(sp =>
    sp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- Hero Section --- */}
      <div className="relative bg-gradient-to-br from-blue-600 to-teal-500 text-white py-20 px-4 text-center">
         <div className="absolute inset-0 bg-black/20"></div>
         <div className="relative max-w-3xl mx-auto">
            <Stethoscope className="mx-auto h-16 w-16 mb-4 opacity-80" />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Tìm kiếm Chuyên khoa
            </h1>
            <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
                Lựa chọn chuyên khoa phù hợp để kết nối với các bác sĩ chuyên môn cao, giàu kinh nghiệm và nhận được sự tư vấn tốt nhất.
            </p>
            <div className="relative mt-8 max-w-lg mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Nhập tên chuyên khoa (vd: Tim mạch, Da liễu...)"
                    className="w-full pl-12 pr-4 py-3 border border-transparent rounded-full shadow-lg text-gray-800 focus:ring-2 focus:ring-white/80 transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
         </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => <SpecialtyCardSkeleton key={index} />)}
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600 bg-red-50 p-6 rounded-lg">
            <AlertTriangle className="mx-auto h-10 w-10 mb-2" />
            <p className="font-semibold">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-10 text-gray-500">Không tìm thấy chuyên khoa nào phù hợp với tìm kiếm của bạn.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(sp => (
              <SpecialtyCard
                key={sp.id}
                {...sp}
                onClick={() => handleClick(sp.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}