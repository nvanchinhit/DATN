'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Stethoscope, GraduationCap, FileText, BadgeInfo, ImageOff } from 'lucide-react';
import { Doctor } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

interface DoctorDetailsModalProps {
  doctor: Doctor;
  // specialtyName đã được truyền từ page.tsx
  specialtyName: string; 
  onClose: () => void;
}

const getImageUrl = (path: string | null | undefined): string | null => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
}

export default function DoctorDetailsModal({ doctor, specialtyName, onClose }: DoctorDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('info');

  const avatarUrl = getImageUrl(doctor.img) || '/default-avatar.png';
  // <<< SỬA LẠI CÁCH LẤY URL CHO ĐÚNG >>>
  const degreeUrl = getImageUrl(doctor.degree_image);
  const certificateUrl = getImageUrl(doctor.certificate_image);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
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
          {/* --- Header --- */}
          <div className="relative p-6 bg-gradient-to-br from-blue-600 to-teal-500 text-white rounded-t-2xl">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                aria-label="Đóng"
              >
                <X size={24} />
              </button>
              <div className="flex flex-col sm:flex-row items-center gap-5">
                  <img
                    src={avatarUrl}
                    alt={`Ảnh bác sĩ ${doctor.name}`}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white/50 shadow-lg"
                  />
                  <div className="text-center sm:text-left">
                      <h2 className="text-3xl font-bold">{doctor.name}</h2>
                      <p className="text-blue-200 font-medium mt-1 flex items-center justify-center sm:justify-start gap-2"><Stethoscope size={18}/> {specialtyName}</p>
                      {doctor.consultation_fee && doctor.consultation_fee > 0 && (
                        <div className="mt-2 bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block">
                            Phí tư vấn: {doctor.consultation_fee.toLocaleString('vi-VN')} đ
                        </div>
                      )}
                  </div>
              </div>
          </div>

          {/* --- Content with Tabs --- */}
          <div className="flex-grow overflow-y-auto">
            <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
                <nav className="-mb-px flex space-x-6 px-6">
                     <TabButton id="info" activeTab={activeTab} setActiveTab={setActiveTab} icon={<BadgeInfo size={16}/>}>Giới thiệu</TabButton>
                     <TabButton id="degree" activeTab={activeTab} setActiveTab={setActiveTab} icon={<GraduationCap size={16}/>}>Bằng cấp</TabButton>
                     <TabButton id="certificate" activeTab={activeTab} setActiveTab={setActiveTab} icon={<FileText size={16}/>}>Chứng chỉ</TabButton>
                </nav>
            </div>
            
            <div className="p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'info' && (
                             <p className="text-gray-600 text-justify leading-relaxed prose prose-sm max-w-none">
                                {doctor.introduction || 'Bác sĩ chưa cập nhật thông tin giới thiệu.'}
                            </p>
                        )}
                        {activeTab === 'degree' && (
                            <ImageViewer url={degreeUrl} type="Bằng cấp chuyên môn" />
                        )}
                        {activeTab === 'certificate' && (
                             <ImageViewer url={certificateUrl} type="Chứng chỉ hành nghề" />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// --- Component con cho Tab Button ---
const TabButton = ({ id, activeTab, setActiveTab, icon, children }: any) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-2 py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${
            activeTab === id
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
    >
        {icon} {children}
    </button>
);

// --- Component con để hiển thị ảnh ---
const ImageViewer = ({ url, type }: { url: string | null, type: string }) => {
    if (!url) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-100 rounded-md border">
                <ImageOff size={40} />
                <p className="mt-2 text-sm">Chưa có thông tin {type.toLowerCase()}.</p>
            </div>
        );
    }
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" title={`Xem ảnh đầy đủ - ${type}`}>
            <img
                src={url}
                alt={type}
                className="rounded-lg border w-full h-auto object-contain max-h-[50vh] bg-gray-100"
            />
        </a>
    );
};