'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, PlusCircle, Search, X, LoaderCircle, AlertTriangle, ImageOff, CheckCircle, GraduationCap, Briefcase, Info, User, Mail, Stethoscope } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// --- Interfaces ---
interface Doctor {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  img: string;
  introduction: string | null;
  experience: string | null;
  account_status: string;
  specialty_name: string;
  degree: {
    image: string | null;
    gpa: string | null;
    university: string | null;
    graduation_date: string | null;
    degree_type: string | null;
  } | null;
  certificates: {
    image: string;
    source: string;
  }[];
}

interface DoctorFromAPI {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  img: string | null;
  introduction: string | null;
  experience: string | null;
  account_status: string;
  specialty_name: string | null;
  certificate_image: string | null;
  certificate_source: string | null;
  degree_image: string | null;
  gpa: string | null;
  university: string | null;
  graduation_date: string | null;
  degree_type: string | null;
}

interface Specialty {
  id: number;
  name: string;
}

// --- Helper Functions ---
const getFullUrl = (path: string | null): string => {
  if (!path) return '/default-avatar.png'; // QUAN TRỌNG: Đảm bảo file này tồn tại trong thư mục /public của bạn
  if (path.startsWith('http')) return path;
  const finalPath = path.startsWith('/uploads') ? path : `/uploads${path.startsWith('/') ? '' : '/'}${path}`;
  try {
    return new URL(finalPath, API_URL).href;
  } catch (e) {
    return '/default-avatar.png';
  }
};

const statusMap: { [key: string]: { text: string; color: string } } = {
  active: { text: 'Đang hoạt động', color: 'bg-green-100 text-green-800' },
  pending: { text: 'Chờ xét duyệt', color: 'bg-yellow-100 text-yellow-800' },
  inactive: { text: 'Chưa hoàn thiện', color: 'bg-gray-100 text-gray-800' }
};

// === COMPONENT MODAL THÊM BÁC SĨ MỚI (ĐÃ SỬA LẠI ĐÚNG NHƯ YÊU CẦU) ===
const AddDoctorModal = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void; }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization_id: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await fetch(`${API_URL}/api/specializations`);
        if (!res.ok) throw new Error('Không thể tải danh sách chuyên khoa');
        const data = await res.json();
        setSpecialties(data);
      } catch (error) {
        setApiError('Lỗi tải chuyên khoa.');
      }
    };
    fetchSpecialties();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập họ và tên.';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ.';
    if (!formData.specialization_id) newErrors.specialization_id = 'Vui lòng chọn chuyên khoa.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setApiSuccess('');
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/doctors/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Thêm bác sĩ thất bại.');
      }
      setApiSuccess(data.msg || 'Thêm bác sĩ thành công! Mật khẩu đã được gửi đến email.');
      onSuccess(); // Tải lại danh sách bác sĩ
      setTimeout(() => {
        onClose(); // Đóng modal sau 2 giây
      }, 2000);
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Tạo tài khoản Bác sĩ</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1"><User size={14}/>Họ và tên</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1"><Mail size={14}/>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1"><Stethoscope size={14}/>Chuyên khoa</label>
            <select name="specialization_id" value={formData.specialization_id} onChange={handleChange} className={`w-full p-2 border rounded-md bg-white ${errors.specialization_id ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="" disabled>-- Chọn chuyên khoa --</option>
              {specialties.map(spec => (
                <option key={spec.id} value={spec.id}>{spec.name}</option>
              ))}
            </select>
            {errors.specialization_id && <p className="text-xs text-red-500 mt-1">{errors.specialization_id}</p>}
          </div>
          {apiError && <p className="text-sm text-red-600 text-center py-2">{apiError}</p>}
          {apiSuccess && <p className="text-sm text-green-600 text-center py-2">{apiSuccess}</p>}
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Hủy</button>
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center gap-2">
              {isSubmitting && <LoaderCircle size={18} className="animate-spin" />}
              {isSubmitting ? 'Đang tạo...' : 'Tạo tài khoản'}
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/doctors/all-for-admin`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response (not ok):", errorText);
        throw new Error('Không thể tải dữ liệu bác sĩ. Server có thể đang gặp sự cố.');
      }
      
      const data: DoctorFromAPI[] = await response.json();
      const mappedDoctors: Doctor[] = data.map(doc => {
          const certificateImages = doc.certificate_image ? doc.certificate_image.split(',').filter(Boolean) : [];
          const certificateSources = doc.certificate_source ? doc.certificate_source.split(',').filter(Boolean) : [];
          return {
              id: doc.id, name: doc.name, phone: doc.phone, email: doc.email,
              img: getFullUrl(doc.img), introduction: doc.introduction, experience: doc.experience,
              account_status: doc.account_status,
              specialty_name: doc.specialty_name || 'Chưa cập nhật',
              degree: doc.degree_image ? {
                  image: getFullUrl(doc.degree_image), gpa: doc.gpa, university: doc.university,
                  graduation_date: doc.graduation_date, degree_type: doc.degree_type,
              } : null,
              certificates: certificateImages.map((img, index) => ({
                  image: getFullUrl(img), source: certificateSources[index] || 'Không rõ nơi cấp'
              }))
          };
      });
      setDoctors(mappedDoctors);
    } catch (err: any) {
      setError(err.message);
      console.error("Fetch doctors failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleApproveDoctor = async (doctorId: number) => {
    if (approvingId) return; 
    setApprovingId(doctorId);
    try {
      const response = await fetch(`${API_URL}/api/doctors/${doctorId}/approve`, { method: 'PATCH' });
      if (!response.ok) {
          const errorData = await response.json().catch(() => ({ msg: 'Duyệt bác sĩ thất bại.' }));
          throw new Error(errorData.msg);
      }
      setDoctors(prevDoctors => 
        prevDoctors.map(doc => 
          doc.id === doctorId ? { ...doc, account_status: 'active' } : doc
        )
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setApprovingId(null);
    }
  };
  
  const specializations = useMemo(() => {
    const specs = doctors.map(d => d.specialty_name).filter(Boolean);
    return [...new Set(specs)];
  }, [doctors]);
  
  const statuses = useMemo(() => Object.keys(statusMap), []);
  
  const displayedDoctors = useMemo(() => doctors
    .filter(doc => (filterStatus === 'all' ? true : doc.account_status === filterStatus))
    .filter(doc => (filterSpecialization === 'all' ? true : doc.specialty_name === filterSpecialization))
    .filter(doc => {
      const term = searchTerm.toLowerCase();
      return !term || (doc.name.toLowerCase().includes(term) || (doc.email && doc.email.toLowerCase().includes(term)) || `bs${doc.id}`.toLowerCase().includes(term));
    }), [doctors, filterStatus, filterSpecialization, searchTerm]);
  
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

      <div className="mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Tìm theo tên, email, mã BS..." value={searchTerm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <select value={filterSpecialization} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterSpecialization(e.target.value)} className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-white"><option value="all">Tất cả chuyên khoa</option>{specializations.map(spec => (<option key={spec} value={spec}>{spec}</option>))}</select>
          <select value={filterStatus} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)} className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-white">
            <option value="all">Tất cả trạng thái</option>
            {statuses.map(status => (<option key={status} value={status}>{statusMap[status]?.text || status}</option>))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase tracking-wide">
            <tr>
              <th className="px-6 py-4 border-b">Bác sĩ</th>
              <th className="px-6 py-4 border-b">Liên hệ</th>
              <th className="px-6 py-4 border-b">Chuyên khoa</th>
              <th className="px-6 py-4 border-b">Trạng thái</th>
              <th className="px-6 py-4 border-b text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="text-center py-10"><LoaderCircle className="animate-spin mx-auto" size={24} /></td></tr>}
            {error && <tr><td colSpan={5} className="text-center py-10 text-red-500"><AlertTriangle className="inline mr-2" />{error}</td></tr>}
            {!loading && !error && displayedDoctors.map(doc => (
                <tr key={doc.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-4"><img src={doc.img} alt={doc.name} className="w-11 h-11 rounded-full object-cover border" /><div><p className="text-gray-900 font-semibold">{doc.name}</p><p className="text-gray-500 text-xs">ID: BS{doc.id}</p></div></td>
                  <td className="px-6 py-4"><p className="text-gray-700">{doc.email}</p><p className="text-gray-500 text-xs">{doc.phone || 'Chưa cập nhật'}</p></td>
                  <td className="px-6 py-4 text-gray-700">{doc.specialty_name}</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusMap[doc.account_status]?.color || 'bg-gray-200'}`}>{statusMap[doc.account_status]?.text || doc.account_status}</span></td>
                  <td className="px-6 py-4 flex justify-center items-center gap-4">
                    {doc.account_status === 'pending' && (<button onClick={() => handleApproveDoctor(doc.id)} disabled={approvingId === doc.id} className="text-green-600 hover:text-green-800" title="Duyệt">{approvingId === doc.id ? <LoaderCircle size={18} className="animate-spin" /> : <CheckCircle size={18} />}</button>)}
                    <button onClick={() => handleViewDetails(doc)} className="text-blue-600 hover:text-blue-800" title="Xem chi tiết"><Eye size={18} /></button>
                  </td>
                </tr>
            ))}
             {!loading && !error && displayedDoctors.length === 0 && (<tr><td colSpan={5} className="text-center py-10 text-gray-500">Không tìm thấy bác sĩ nào.</td></tr>)}
          </tbody>
        </table>
      </div>

      <AnimatePresence>{isAddModalOpen && <AddDoctorModal onClose={() => setIsAddModalOpen(false)} onSuccess={fetchDoctors} />}</AnimatePresence>
      
      <AnimatePresence>
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold text-gray-800">Hồ sơ: {selectedDoctor.name}</h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>
              <div className="p-6 space-y-6">
                 <div className="p-4 bg-white rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 flex flex-col items-center">
                        <img src={selectedDoctor.img} alt={selectedDoctor.name} className="w-32 h-32 rounded-full object-cover border-4" />
                        <div className="text-center mt-2">
                            <p><strong>SĐT:</strong> {selectedDoctor.phone || 'N/A'}</p>
                            <p><strong>Email:</strong> {selectedDoctor.email || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <div><h4 className="font-semibold text-gray-700 flex items-center gap-2"><Info size={16}/>Giới thiệu</h4><p className="text-gray-600 text-sm mt-1 pl-2 border-l-2 border-blue-200">{selectedDoctor.introduction || 'Chưa có.'}</p></div>
                        <div><h4 className="font-semibold text-gray-700 flex items-center gap-2"><Briefcase size={16}/>Kinh nghiệm</h4><p className="text-gray-600 text-sm mt-1 pl-2 border-l-2 border-blue-200">{selectedDoctor.experience || 'Chưa có.'}</p></div>
                    </div>
                 </div>
                 
                 <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><GraduationCap size={20}/>Văn bằng & Chứng chỉ</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Bằng cấp</h4>
                            {selectedDoctor.degree ? (
                                <div className="flex gap-4 p-3 bg-gray-50 rounded-lg border">
                                    <a href={selectedDoctor.degree.image!} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                                        <img src={selectedDoctor.degree.image!} alt="Bằng cấp" className="w-24 h-24 object-cover rounded-md" />
                                    </a>
                                    <div className="text-xs text-gray-600 space-y-1">
                                        <p><strong>Trường:</strong> {selectedDoctor.degree.university || 'N/A'}</p>
                                        <p><strong>Loại bằng:</strong> {selectedDoctor.degree.degree_type || 'N/A'}</p>
                                        <p><strong>GPA:</strong> {selectedDoctor.degree.gpa || 'N/A'}</p>
                                        <p><strong>Ngày TN:</strong> {selectedDoctor.degree.graduation_date ? new Date(selectedDoctor.degree.graduation_date).toLocaleDateString('vi-VN') : 'N/A'}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 bg-gray-50 rounded-lg border text-center text-gray-500 text-sm">
                                    <ImageOff className="mx-auto mb-1" size={24}/>
                                    Chưa có thông tin bằng cấp.
                                </div>
                            )}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Chứng chỉ hành nghề</h4>
                            {selectedDoctor.certificates.length > 0 ? (
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                    {selectedDoctor.certificates.map((cert, index) => (
                                        <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-lg border">
                                            <a href={cert.image} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                                                <img src={cert.image} alt={`Chứng chỉ ${index + 1}`} className="w-24 h-24 object-cover rounded-md" />
                                            </a>
                                            <div className="text-xs text-gray-600">
                                                <p><strong>Nơi cấp:</strong> {cert.source || 'N/A'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-3 bg-gray-50 rounded-lg border text-center text-gray-500 text-sm">
                                    <ImageOff className="mx-auto mb-1" size={24}/>
                                    Chưa có thông tin chứng chỉ.
                                </div>
                            )}
                        </div>
                    </div>
                 </div>
              </div>
              <div className="p-4 bg-gray-100 border-t text-right sticky bottom-0 z-10">
                  <button onClick={handleCloseModal} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition">Đóng</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}