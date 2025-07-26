'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// <-- Thêm icon mới ShieldCheck
import { X, Stethoscope, GraduationCap, FileText, BadgeInfo, ImageOff, Loader2, School, Award, CalendarCheck, Star, ShieldCheck } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Interface cho chi tiết bác sĩ - ĐÃ CẬP NHẬT
interface DoctorDetails {
  id: number;
  name: string;
  img: string | null;
  introduction: string | null;
  experience: string | null;
  university: string | null;
  gpa: string | null;
  graduation_date: string | null;
  degree_type: string | null;
  degree_image: string | null;
  certificate_image: string | null;
  certificate_source: string | null; // <-- Thêm trường nguồn cấp chứng chỉ
  specialization_name: string;
}

// Props cho Modal
interface DoctorDetailsModalProps {
  doctorId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const getImageUrl = (fileName: string | null | undefined): string | null => {
    if (!fileName) return null;
    if (fileName.startsWith('http')) return fileName;
    const path = fileName.startsWith('/') ? fileName : `/${fileName}`;
    const cleanPath = path.startsWith('/uploads/') ? path : `/uploads${path}`;
    return `${API_URL}${cleanPath}`;
}

const formatGraduationYear = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Chưa có thông tin';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }
        return date.getFullYear().toString();
    } catch (e) {
        return dateString;
    }
};

export default function DoctorDetailsModal({ doctorId, isOpen, onClose }: DoctorDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [doctor, setDoctor] = useState<DoctorDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isOpen && doctorId) {
        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            setDoctor(null);
            try {
                console.log(`Fetching details for doctor ID: ${doctorId}`);
                const res = await fetch(`${API_URL}/api/doctors/${doctorId}`);
                if (!res.ok) {
                    throw new Error(`Không thể tải thông tin bác sĩ (Lỗi: ${res.status})`);
                }
                const data: DoctorDetails = await res.json();
                console.log("Doctor details received:", data);
                setDoctor(data);
            } catch (e: any) {
                console.error("Error fetching doctor details:", e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }
  }, [isOpen, doctorId]);


  if (!isOpen) return null;

  const avatarUrl = doctor ? getImageUrl(doctor.img) || '/default-avatar.png' : '/default-avatar.png';
  const degreeUrl = doctor ? getImageUrl(doctor.degree_image) : null;
  const certificateUrl = doctor ? getImageUrl(doctor.certificate_image) : null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4 backdrop-blur-sm"
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        >
          {loading && (
            <div className="flex-grow flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-blue-500" />
            </div>
          )}
          {error && (
            <div className="flex-grow flex items-center justify-center text-red-500 p-6">
                {error}
            </div>
          )}
          {doctor && (
            <>
              {/* --- Header --- */}
              <div className="relative p-6 bg-gradient-to-br from-blue-600 to-teal-500 text-white rounded-t-2xl">
                  <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white"><X/></button>
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                      <img src={avatarUrl} alt={`Bác sĩ ${doctor.name}`} className="w-28 h-28 rounded-full object-cover border-4 border-white/50 shadow-lg"/>
                      <div className="text-center sm:text-left">
                          <h2 className="text-3xl font-bold">{doctor.name}</h2>
                          <p className="text-blue-200 font-medium mt-1 flex items-center justify-center sm:justify-start gap-2"><Stethoscope size={18}/> {doctor.specialization_name}</p>
                      </div>
                  </div>
              </div>

              {/* --- Content with Tabs --- */}
              <div className="flex-grow overflow-y-auto">
                <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
                    <nav className="-mb-px flex space-x-6 px-6">
                         <TabButton id="info" activeTab={activeTab} setActiveTab={setActiveTab} icon={<BadgeInfo size={16}/>}>Giới thiệu & Kinh nghiệm</TabButton>
                         <TabButton id="degree" activeTab={activeTab} setActiveTab={setActiveTab} icon={<GraduationCap size={16}/>}>Học vấn & Bằng cấp</TabButton>
                         <TabButton id="certificate" activeTab={activeTab} setActiveTab={setActiveTab} icon={<FileText size={16}/>}>Chứng chỉ</TabButton>
                    </nav>
                </div>
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'info' && (
                                <div className="space-y-4 text-gray-700 leading-relaxed prose prose-sm max-w-none">
                                    <h4 className='font-bold'>Giới thiệu</h4>
                                    <p>{doctor.introduction || 'Chưa có thông tin.'}</p>
                                    <h4 className='font-bold pt-4'>Kinh nghiệm</h4>
                                    <p className='whitespace-pre-line'>{doctor.experience || 'Chưa có thông tin.'}</p>
                                </div>
                            )}
                            {activeTab === 'degree' && (
                                <div className="space-y-6">
                                    <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-lg shadow-sm">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-blue-200 pb-2">Thông tin học vấn</h4>
                                        <div className="space-y-3">
                                            <InfoRow icon={<School size={18} className="text-blue-500" />} label="Trường tốt nghiệp" value={doctor.university} />
                                            <InfoRow icon={<Award size={18} className="text-blue-500" />} label="Loại bằng" value={doctor.degree_type} />
                                            <InfoRow icon={<CalendarCheck size={18} className="text-blue-500" />} label="Năm tốt nghiệp" value={formatGraduationYear(doctor.graduation_date)} />
                                            <InfoRow icon={<Star size={18} className="text-blue-500" />} label="GPA" value={doctor.gpa} />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Ảnh minh chứng bằng cấp</h4>
                                        <ImageViewer url={degreeUrl} type="Bằng cấp" />
                                    </div>
                                </div>
                            )}
                            {/* --- THAY ĐỔI LỚN TẠI ĐÂY --- */}
                            {activeTab === 'certificate' && (
                                <div className="space-y-6">
                                    {/* Section for text details */}
                                    <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-lg shadow-sm">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-blue-200 pb-2">Thông tin chứng chỉ</h4>
                                        <div className="space-y-3">
                                            <InfoRow icon={<ShieldCheck size={18} className="text-blue-500" />} label="Nguồn cấp" value={doctor.certificate_source} />
                                        </div>
                                    </div>

                                    {/* Section for the image */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Ảnh minh chứng chứng chỉ</h4>
                                        <ImageViewer url={certificateUrl} type="Chứng chỉ" />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// --- Component con cho Tab Button ---
const TabButton = ({ id, activeTab, setActiveTab, icon, children }: any) => (
    <button onClick={() => setActiveTab(id)}
        className={`flex items-center gap-2 py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${
            activeTab === id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}>
        {icon} {children}
    </button>
);

// --- Component con để hiển thị ảnh ---
const ImageViewer = ({ url, type }: { url: string | null, type: string }) => {
    if (!url) {
        return <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-100 rounded-md"><ImageOff size={40} /><p className='mt-2'>Chưa có {type.toLowerCase()}.</p></div>
    }
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" title={`Xem ảnh ${type} đầy đủ`}>
            <img src={url} alt={type} className="rounded-lg border w-full h-auto object-contain max-h-[50vh] bg-gray-100" />
        </a>
    );
};

// --- Component con để hiển thị một dòng thông tin ---
const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | null | undefined }) => {
    // Không hiển thị nếu không có dữ liệu hoặc dữ liệu là chuỗi rỗng
    if (!value || value.trim() === '') return null;
    
    return (
        <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 pt-0.5">{icon}</div>
            <div className="flex-grow">
                <p className="font-medium text-gray-500 text-sm">{label}</p>
                <p className="text-gray-800 font-semibold">{value}</p>
            </div>
        </div>
    );
};