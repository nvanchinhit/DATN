'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Pencil, Trash2, PlusCircle, Search, X, LoaderCircle, AlertTriangle, ImageOff, CheckCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// --- Interfaces không đổi ---
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

interface DoctorFromAPI {
  id: number; name: string; phone: string; email: string; img: string | null;
  specialty_name: string; account_status: 'active' | string; certificate_image: string | null;
  degree_image: string | null; introduction: string;
}

// --- Hàm getFullUrl không đổi ---
const getFullUrl = (base: string, path: string | null | undefined): string | null => {
  if (!path) return null;
  if (!base) return path;
  try { return new URL(path, base).href; } catch (e) { console.error('URL không hợp lệ:', e); return null; }
};


// === COMPONENT MODAL THÊM BÁC SĨ MỚI ===
const AddDoctorModal = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void; }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specializationId, setSpecializationId] = useState('');
  const [specializations, setSpecializations] = useState<{ id: number; name: string }[]>([]);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/specializations`)
      .then((res) => res.json())
      .then((data) => setSpecializations(data))
      .catch(() => setErrorMsg('Không thể tải danh sách chuyên khoa.'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg(''); setErrorMsg('');
    try {
      const res = await fetch(`${API_URL}/api/doctors/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, specialization_id: specializationId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Có lỗi xảy ra.');
      setMsg(data.msg);
      setName(''); setEmail(''); setSpecializationId('');
      onSuccess(); // Gọi callback để tải lại danh sách
      setTimeout(() => onClose(), 1500); // Tự động đóng sau 1.5s
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Tạo tài khoản Bác sĩ mới</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">Tên bác sĩ</label>
            <input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="w-full p-2.5 border border-gray-300 rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">Chuyên khoa</label>
            <select className="w-full p-2.5 border border-gray-300 rounded-lg bg-white" value={specializationId} onChange={(e) => setSpecializationId(e.target.value)} required>
              <option value="">-- Chọn chuyên khoa --</option>
              {specializations.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
            </select>
          </div>
          {msg && <p className="text-sm text-green-600">{msg}</p>}
          {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
          <div className="pt-2 flex justify-end gap-3">
             <button type="button" onClick={onClose} className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-200 transition">Hủy</button>
             <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center gap-2" disabled={loading}>
                {loading && <LoaderCircle className="animate-spin" size={18}/>}
                {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
             </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};


// === COMPONENT TRANG QUẢN LÝ BÁC SĨ CHÍNH ===
export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  
  // State mới để quản lý modal thêm
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Gói logic fetch vào một hàm có thể tái sử dụng
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const response = await fetch(`${API_URL}/api/doctors`);
      if (!response.ok) throw new Error('Không thể kết nối tới server.');
      const data: DoctorFromAPI[] = await response.json();
      const mappedDoctors: Doctor[] = data.map(doc => ({
          id: doc.id, name: doc.name, phone: doc.phone, email: doc.email, introduction: doc.introduction,
          img: getFullUrl(API_URL, doc.img) || '/default-avatar.jpg',
          certificate: getFullUrl(API_URL, doc.certificate_image), degree: getFullUrl(API_URL, doc.degree_image),
          specialization: doc.specialty_name || 'Chưa cập nhật',
          status: doc.account_status === 'active' ? 'Đang hoạt động' : 'Chờ xét duyệt',
        }));
      setDoctors(mappedDoctors);
    } catch (err: any) {
      setError(err.message); console.error("Lỗi khi fetch dữ liệu bác sĩ:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleApproveDoctor = async (doctorId: number) => {
    if (approvingId) return; setApprovingId(doctorId);
    try {
      const response = await fetch(`${API_URL}/api/doctors/${doctorId}/approve`, { method: 'PATCH' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ msg: 'Duyệt bác sĩ thất bại.' }));
        throw new Error(errorData.msg);
      }
      setDoctors(prev => prev.map(doc => doc.id === doctorId ? { ...doc, status: 'Đang hoạt động' } : doc));
    } catch (err: any) {
      console.error(err); alert(err.message);
    } finally {
      setApprovingId(null);
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
      return (doc.name.toLowerCase().includes(term) || doc.phone.includes(term) || `BS${doc.id}`.toLowerCase().includes(term));
    });
  const handleViewDetails = (doctor: Doctor) => setSelectedDoctor(doctor);
  const handleCloseModal = () => setSelectedDoctor(null);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Bác sĩ</h1>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition">
          <PlusCircle size={20} /> Thêm Bác sĩ
        </button>
      </div>

      {/* Phần bộ lọc không đổi */}
      <div className="mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Tìm theo tên, SĐT, mã BS..." value={searchTerm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <select value={filterSpecialization} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterSpecialization(e.target.value)} className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-white"><option value="all">Tất cả chuyên khoa</option>{specializations.map(spec => (<option key={spec} value={spec}>{spec}</option>))}</select>
          <select value={filterStatus} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)} className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-white"><option value="all">Tất cả trạng thái</option>{statuses.map(status => (<option key={status} value={status}>{status}</option>))}</select>
        </div>
      </div>

      {/* Phần bảng không đổi */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full text-sm text-left">
          {/* ... thead ... */}
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
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${doc.status === 'Đang hoạt động' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{doc.status}</span>
                  </td>
                  <td className="px-6 py-4 text-center">{doc.degree ? (<a href={doc.degree} target="_blank" rel="noopener noreferrer" title="Xem ảnh đầy đủ"><img src={doc.degree} alt="Bằng cấp" className="w-16 h-12 object-cover mx-auto rounded-sm border hover:scale-125 hover:shadow-lg transition-transform duration-200" /></a>) : (<span className="text-gray-400 text-xs">Chưa có</span>)}</td>
                  <td className="px-6 py-4 text-center">{doc.certificate ? (<a href={doc.certificate} target="_blank" rel="noopener noreferrer" title="Xem ảnh đầy đủ"><img src={doc.certificate} alt="Chứng chỉ" className="w-16 h-12 object-cover mx-auto rounded-sm border hover:scale-125 hover:shadow-lg transition-transform duration-200" /></a>) : (<span className="text-gray-400 text-xs">Chưa có</span>)}</td>
                  <td className="px-6 py-4 flex justify-center items-center gap-4">
                    {doc.status === 'Chờ xét duyệt' && (<button onClick={() => handleApproveDoctor(doc.id)} disabled={approvingId === doc.id} className="text-green-600 hover:text-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed" title="Duyệt bác sĩ">{approvingId === doc.id ? <LoaderCircle size={18} className="animate-spin" /> : <CheckCircle size={18} />}</button>)}
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

      {/* Render Modal Thêm Bác sĩ */}
      <AnimatePresence>
        {isAddModalOpen && <AddDoctorModal onClose={() => setIsAddModalOpen(false)} onSuccess={fetchDoctors} />}
      </AnimatePresence>

      {/* Modal chi tiết không đổi */}
      <AnimatePresence>
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white"><h2 className="text-2xl font-bold text-gray-800">Hồ sơ Bác sĩ</h2><button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button></div>
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
                          {selectedDoctor.degree ? (<a href={selectedDoctor.degree} target="_blank" rel="noopener noreferrer"><img src={selectedDoctor.degree} alt="Bằng cấp" className="w-40 h-auto rounded-md border shadow-md hover:shadow-xl transition-shadow"/></a>) : (<div className="w-40 h-28 bg-gray-100 flex items-center justify-center rounded-md border text-gray-400 flex-col gap-1"><ImageOff size={24} /><span className="text-xs">Chưa có</span></div>)}
                       </div>
                       <div className="text-center">
                          <p className="text-xs font-bold text-gray-500 mb-1">CHỨNG CHỈ</p>
                          {selectedDoctor.certificate ? (<a href={selectedDoctor.certificate} target="_blank" rel="noopener noreferrer"><img src={selectedDoctor.certificate} alt="Chứng chỉ" className="w-40 h-auto rounded-md border shadow-md hover:shadow-xl transition-shadow"/></a>) : (<div className="w-40 h-28 bg-gray-100 flex items-center justify-center rounded-md border text-gray-400 flex-col gap-1"><ImageOff size={24} /><span className="text-xs">Chưa có</span></div>)}
                       </div>
                    </div>
                  </div>
                  <div><h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Giới thiệu</h4><p className="text-gray-600 text-justify leading-relaxed">{selectedDoctor.introduction}</p></div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 border-t text-right sticky bottom-0"><button onClick={handleCloseModal} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition">Đóng</button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}