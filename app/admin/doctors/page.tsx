'use client';

import { useState, useEffect, useMemo } from 'react';
// Đã thêm CheckCircle cho nút duyệt
import { Eye, Pencil, Trash2, PlusCircle, Search, X, LoaderCircle, AlertTriangle, ImageOff, CheckCircle } from 'lucide-react';
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Interface Doctor không đổi
interface Doctor {
  id: number;
  name: string;
  phone: string;
  email: string;
  img: string;
  specialization: string;
  status: 'Đang hoạt động' | 'Chờ xét duyệt';
  certificate: string | null;
  degree: string | null;
  introduction: string;
}

// Interface DoctorFromAPI không đổi
interface DoctorFromAPI {
  id: number;
  name: string;
  phone: string;
  email: string;
  img: string | null;
  specialty_name: string;
  account_status: 'active' | string;
  certificate_image: string | null;
  degree_image: string | null;
  introduction: string;
}

// Hàm getFullUrl không đổi
const getFullUrl = (base: string, path: string | null | undefined): string | null => {
  if (!path) return null;
  if (!base) return path;
  try {
    return new URL(path, base).href;
  } catch (e) {
    console.error('URL không hợp lệ:', e);
    return null;
  }
};


export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  // THÊM MỚI: State để theo dõi bác sĩ nào đang được duyệt (hiển thị loading)
  const [approvingId, setApprovingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/api/doctors`);
        if (!response.ok) {
          throw new Error('Không thể kết nối tới server. Vui lòng thử lại sau.');
        }
        const data: DoctorFromAPI[] = await response.json();
        const mappedDoctors: Doctor[] = data.map(doc => ({
            id: doc.id,
            name: doc.name,
            phone: doc.phone,
            email: doc.email,
            introduction: doc.introduction,
            img: getFullUrl(API_URL, doc.img) || '/default-avatar.jpg',
            certificate: getFullUrl(API_URL, doc.certificate_image),
            degree: getFullUrl(API_URL, doc.degree_image),
            specialization: doc.specialty_name || 'Chưa cập nhật',
            status: doc.account_status === 'active' ? 'Đang hoạt động' : 'Chờ xét duyệt',
          }));
        setDoctors(mappedDoctors);
      } catch (err: any) {
        setError(err.message);
        console.error("Lỗi khi fetch dữ liệu bác sĩ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // THÊM MỚI: Hàm xử lý duyệt bác sĩ
  const handleApproveDoctor = async (doctorId: number) => {
    if (approvingId) return; // Ngăn chặn click nhiều lần
    setApprovingId(doctorId);

    try {
      const response = await fetch(`${API_URL}/api/doctors/${doctorId}/approve`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        // Thử lấy thông tin lỗi từ server
        const errorData = await response.json().catch(() => ({ msg: 'Duyệt bác sĩ thất bại. Vui lòng thử lại.' }));
        throw new Error(errorData.msg);
      }

      // Cập nhật state trên frontend ngay lập tức để người dùng thấy thay đổi
      setDoctors(prevDoctors =>
        prevDoctors.map(doc =>
          doc.id === doctorId
            ? { ...doc, status: 'Đang hoạt động' }
            : doc
        )
      );

    } catch (err: any) {
      console.error(err);
      alert(err.message); // Hiển thị lỗi cho người dùng
    } finally {
      setApprovingId(null); // Tắt loading
    }
  };

  const specializations = useMemo(() => [...new Set(doctors.map(d => d.specialization))], [doctors]);
  const statuses = useMemo(() => [...new Set(doctors.map(d => d.status))], [doctors]);
  const displayedDoctors = doctors
    .filter(doc => (filterStatus === 'all' ? true : doc.status === filterStatus))
    .filter(doc => (filterSpecialization === 'all' ? true : doc.specialization === filterSpecialization))
    .filter(doc => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        doc.name.toLowerCase().includes(term) ||
        doc.phone.includes(term) ||
        `BS${doc.id}`.toLowerCase().includes(term)
      );
    });
  const handleViewDetails = (doctor: Doctor) => setSelectedDoctor(doctor);
  const handleCloseModal = () => setSelectedDoctor(null);


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">👨‍⚕️ Quản lý Bác sĩ</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition">
          <PlusCircle size={20} /> Thêm Bác sĩ
        </button>
      </div>

      <div className="mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT, mã BS..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <select value={filterSpecialization} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterSpecialization(e.target.value)} className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-white"><option value="all">Tất cả chuyên khoa</option>{specializations.map(spec => (<option key={spec} value={spec}>{spec}</option>))}</select>
          <select value={filterStatus} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)} className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-white"><option value="all">Tất cả trạng thái</option>{statuses.map(status => (<option key={status} value={status}>{status}</option>))}</select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase tracking-wide">
            <tr>
              <th className="px-6 py-4 border-b">Bác sĩ</th>
              <th className="px-6 py-4 border-b">Chuyên khoa</th>
              <th className="px-6 py-4 border-b">Trạng thái</th>
              <th className="px-6 py-4 border-b text-center">Bằng cấp</th>
              <th className="px-6 py-4 border-b text-center">Chứng chỉ</th>
              <th className="px-6 py-4 border-b text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-500"><div className="flex justify-center items-center gap-2"><LoaderCircle className="animate-spin" size={20} /> Đang tải dữ liệu...</div></td></tr>
            ) : error ? (
              <tr><td colSpan={6} className="text-center py-10 text-red-500"><div className="flex justify-center items-center gap-2"><AlertTriangle size={20} /> {error}</div></td></tr>
            ) : displayedDoctors.length > 0 ? (
              displayedDoctors.map(doc => (
                <tr key={doc.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <img src={doc.img} alt={doc.name} className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md" />
                    <div><p className="text-gray-900 font-semibold">{doc.name}</p><p className="text-gray-500 text-xs">{doc.email}</p></div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{doc.specialization}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${doc.status === 'Đang hoạt động' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {doc.degree ? (
                      <a href={doc.degree} target="_blank" rel="noopener noreferrer" title="Xem ảnh đầy đủ">
                        <img src={doc.degree} alt="Bằng cấp" className="w-16 h-12 object-cover mx-auto rounded-sm border hover:scale-125 hover:shadow-lg transition-transform duration-200" />
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">Chưa có</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {doc.certificate ? (
                      <a href={doc.certificate} target="_blank" rel="noopener noreferrer" title="Xem ảnh đầy đủ">
                        <img src={doc.certificate} alt="Chứng chỉ" className="w-16 h-12 object-cover mx-auto rounded-sm border hover:scale-125 hover:shadow-lg transition-transform duration-200" />
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">Chưa có</span>
                    )}
                  </td>
                  {/* CẬP NHẬT: Cột hành động với nút duyệt */}
                  <td className="px-6 py-4 flex justify-center items-center gap-4">
                    {doc.status === 'Chờ xét duyệt' && (
                      <button
                        onClick={() => handleApproveDoctor(doc.id)}
                        disabled={approvingId === doc.id}
                        className="text-green-600 hover:text-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Duyệt bác sĩ"
                      >
                        {approvingId === doc.id ? <LoaderCircle size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                      </button>
                    )}
                    <button onClick={() => handleViewDetails(doc)} className="text-blue-600 hover:text-blue-800 transition" title="Xem hồ sơ"><Eye size={18} /></button>
                    <button className="text-yellow-600 hover:text-yellow-800 transition" title="Chỉnh sửa"><Pencil size={18} /></button>
                    <button className="text-red-600 hover:text-red-800 transition" title="Xoá bác sĩ"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="text-center py-10 text-gray-500">Không tìm thấy bác sĩ nào phù hợp.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Section không đổi */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center"><h2 className="text-2xl font-bold text-gray-800">Hồ sơ Bác sĩ</h2><button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button></div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 flex flex-col items-center text-center">
                <img src={selectedDoctor.img} alt={selectedDoctor.name} className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg mb-4" />
                <h3 className="text-xl font-bold text-gray-900">{selectedDoctor.name}</h3>
                <p className="text-blue-600 font-semibold">{selectedDoctor.specialization}</p>
                <span className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full ${selectedDoctor.status === 'Đang hoạt động' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{selectedDoctor.status}</span>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div><h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Thông tin liên hệ</h4><p className="text-gray-600"><strong>Điện thoại:</strong> {selectedDoctor.phone}</p><p className="text-gray-600"><strong>Email:</strong> {selectedDoctor.email}</p></div>
                <div>
                  <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Chứng chỉ & Bằng cấp</h4>
                  <div className="flex flex-wrap gap-4 mt-2">
                     <div className="text-center">
                        <p className="text-xs font-bold text-gray-500 mb-1">BẰNG CẤP</p>
                        {selectedDoctor.degree ? (
                           <a href={selectedDoctor.degree} target="_blank" rel="noopener noreferrer"><img src={selectedDoctor.degree} alt="Bằng cấp" className="w-40 h-auto rounded-md border shadow-md hover:shadow-xl transition-shadow"/></a>
                        ) : (
                           <div className="w-40 h-28 bg-gray-100 flex items-center justify-center rounded-md border text-gray-400 flex-col gap-1"><ImageOff size={24} /><span className="text-xs">Chưa có</span></div>
                        )}
                     </div>
                     <div className="text-center">
                        <p className="text-xs font-bold text-gray-500 mb-1">CHỨNG CHỈ</p>
                        {selectedDoctor.certificate ? (
                           <a href={selectedDoctor.certificate} target="_blank" rel="noopener noreferrer"><img src={selectedDoctor.certificate} alt="Chứng chỉ" className="w-40 h-auto rounded-md border shadow-md hover:shadow-xl transition-shadow"/></a>
                        ) : (
                           <div className="w-40 h-28 bg-gray-100 flex items-center justify-center rounded-md border text-gray-400 flex-col gap-1"><ImageOff size={24} /><span className="text-xs">Chưa có</span></div>
                        )}
                     </div>
                  </div>
                </div>
                <div><h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Giới thiệu</h4><p className="text-gray-600 text-justify leading-relaxed">{selectedDoctor.introduction}</p></div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t text-right"><button onClick={handleCloseModal} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition">Đóng</button></div>
          </div>
        </div>
      )}
    </div>
  );
}