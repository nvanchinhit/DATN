'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Stethoscope, Star, ArrowRight, Loader2, AlertTriangle, ChevronLeft, ChevronRight, SlidersHorizontal, FilterX } from 'lucide-react';

import { Doctor, Specialization } from '@/types'; // <<< IMPORT TỪ FILE CHUNG

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// <<< XÓA BỎ CÁC INTERFACE CỤC BỘ Ở ĐÂY >>>

// === Component: Thẻ Bác sĩ (Card) ===
const DoctorCard = ({ doctor, onBook, router }: { doctor: Doctor, onBook: (docId: number, specialtyName: string) => void, router: any }) => {
  const imageUrl = doctor.img && doctor.img.startsWith('http') ? doctor.img : doctor.img ? `${API_URL}${doctor.img}` : '/default-avatar.png';
  return (
    <div className="group flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative h-52">
        <img src={imageUrl} alt={doctor.name} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        {doctor.average_rating && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-white text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-md">
            <Star size={14} className="fill-white"/> {parseFloat(String(doctor.average_rating)).toFixed(1)}
          </div>
        )}
        <div className="absolute bottom-0 left-0 p-4">
            <p className="text-sm text-white/90">{doctor.specialty_name}</p>
            <h3 className="text-xl font-bold text-white">{doctor.name}</h3>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
          {doctor.introduction || 'Bác sĩ chưa cập nhật thông tin giới thiệu.'}
        </p>
        {doctor.price && doctor.price > 0 && (
          <div className="mb-4">
            <span className="text-lg font-bold text-green-600">
              {doctor.price.toLocaleString('vi-VN', { 
                minimumFractionDigits: 0,
                maximumFractionDigits: 0 
              })} VNĐ
            </span>
            <span className="text-sm text-gray-500 ml-1">/lần khám</span>
          </div>
        )}
        <div className="mt-auto flex gap-3">
          <button onClick={() => router.push(`/doctors/${doctor.id}`)} className="flex-1 text-center bg-gray-100 text-gray-700 font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-200 transition">Xem hồ sơ</button>
          <button onClick={() => onBook(doctor.id, doctor.specialty_name || '')} className="flex-1 text-center bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">Đặt lịch <ArrowRight size={16}/></button>
        </div>
      </div>
    </div>
  );
};

// === Component: Skeleton Loading Card ===
const DoctorCardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg p-5 animate-pulse">
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-4 w-1/3 bg-gray-200 rounded-md mb-3"></div>
        <div className="h-6 w-3/4 bg-gray-200 rounded-md mb-4"></div>
        <div className="h-4 w-full bg-gray-200 rounded-md mb-1.5"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded-md"></div>
    </div>
);

// === Component Trang Chính ===
export default function DoctorsListPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [doctorsRes, specialtiesRes] = await Promise.all([
          fetch(`${API_URL}/api/doctors`),
          fetch(`${API_URL}/api/specializations`)
        ]);
        if (!doctorsRes.ok || !specialtiesRes.ok) throw new Error('Không thể tải dữ liệu từ server.');
        setDoctors(await doctorsRes.json());
        setSpecializations(await specialtiesRes.json());
      } catch (e: any) { setError(e.message); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const filteredAndSortedDoctors = useMemo(() => {
    let result = [...doctors];
    result = result
      .filter(doc => filterSpecialty === 'all' || doc.specialty_name === filterSpecialty)
      .filter(doc => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return doc.name.toLowerCase().includes(term) || (doc.specialty_name && doc.specialty_name.toLowerCase().includes(term));
      });
    if (sortBy === 'rating') {
      result.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.id - a.id);
    }
    return result;
  }, [doctors, searchTerm, filterSpecialty, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedDoctors.length / itemsPerPage);
  const paginatedDoctors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedDoctors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedDoctors, currentPage, itemsPerPage]);

  const handleBookAppointment = (doctorId: number, specialtyName: string) => {
    const spec = specializations.find(s => s.name === specialtyName);
    if(spec) { router.push(`/bookingdoctor?specialization=${spec.id}`); } 
    else { alert("Không tìm thấy thông tin chuyên khoa để đặt lịch."); }
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilterSpecialty('all');
    setSortBy('rating');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* --- Banner và Chuyên khoa nổi bật --- */}
      <div className="relative pt-16 pb-12 px-4 bg-gradient-to-br from-blue-500 to-teal-400 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Đội ngũ Bác sĩ</h1>
            <p className="mt-4 text-lg text-blue-100">
                Tìm kiếm và kết nối với các chuyên gia y tế hàng đầu, sẵn sàng chăm sóc sức khỏe cho bạn và gia đình.
            </p>
        </div>
        <div className="relative mt-8 max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-2">
            <span className="text-sm font-semibold mr-2 text-white/80">Phổ biến:</span>
            {specializations.slice(0, 5).map(spec => (
              <button key={spec.id} onClick={() => { setFilterSpecialty(spec.name); setCurrentPage(1); }} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${filterSpecialty === spec.name ? 'bg-white text-blue-600 shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                {spec.name}
              </button>
            ))}
             <button onClick={resetFilters} className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors bg-white/20 text-white hover:bg-white/30" title="Xóa bộ lọc"><FilterX size={16}/></button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* --- Toolbar --- */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 p-4 bg-white rounded-xl shadow-md border">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Tìm theo tên bác sĩ..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <select value={filterSpecialty} onChange={(e) => {setFilterSpecialty(e.target.value); setCurrentPage(1);}} className="w-full sm:w-48 px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500">
              <option value="all">Tất cả chuyên khoa</option>
              {specializations.map(spec => <option key={spec.id} value={spec.name}>{spec.name}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => {setSortBy(e.target.value); setCurrentPage(1);}} className="w-full sm:w-48 px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500">
              <option value="rating">Sắp xếp: Nổi bật</option>
              <option value="newest">Sắp xếp: Mới nhất</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, index) => <DoctorCardSkeleton key={index} />)}
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600 bg-red-50 p-6 rounded-lg"><AlertTriangle className="mx-auto h-10 w-10 mb-2" /><p className="font-semibold">{error}</p></div>
        ) : paginatedDoctors.length === 0 ? (
          <p className="text-center py-10 text-gray-500">Không tìm thấy bác sĩ nào phù hợp với tiêu chí của bạn.</p>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">Tìm thấy <span className="font-bold text-blue-600">{filteredAndSortedDoctors.length}</span> bác sĩ.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedDoctors.map(doc => (
                <DoctorCard key={doc.id} doctor={doc} onBook={handleBookAppointment} router={router} />
              ))}
            </div>
            {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"><ChevronLeft size={24}/></button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-md text-sm font-medium transition-colors ${currentPage === page ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-200'}`}>{page}</button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"><ChevronRight size={24}/></button>
                </div>
            )}
          </>
        )}
      </main>


    </div>
  );
}