// File: app/bookingdoctor/DoctorDetailsModal.tsx
'use client';

import { X } from 'lucide-react';

// Định nghĩa interface cho bác sĩ để đảm bảo type-safety
interface Doctor {
  id: number;
  name: string;
  img: string;
  introduction: string;
  specialization_id: number;
  consultation_fee: number;
  certificate: string;
  degree: string;
}

// Định nghĩa props cho component modal
interface DoctorDetailsModalProps {
  doctor: Doctor;
  specialtyName: string;
  onClose: () => void;
}

export default function DoctorDetailsModal({ doctor, specialtyName, onClose }: DoctorDetailsModalProps) {
  // Ngăn sự kiện click từ bên trong modal lan ra lớp phủ bên ngoài
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    // Lớp phủ (Overlay) bao toàn màn hình
    <div
      onClick={onClose} // Click vào lớp phủ sẽ đóng modal
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-300"
    >
      {/* Nội dung của Modal */}
      <div
        onClick={handleModalContentClick}
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative transform transition-all animate-in fade-in-0 zoom-in-95 duration-300"
      >
        {/* Nút Đóng Modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Đóng"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Cột Trái: Ảnh, Tên, Chuyên Khoa, Phí */}
          <div className="flex-shrink-0 text-center md:w-1/3">
            <img
              src={doctor.img || '/default-avatar.png'} // Sử dụng ảnh mặc định nếu không có
              alt={`Ảnh bác sĩ ${doctor.name}`}
              className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-blue-200 shadow-md"
            />
            <h2 className="text-2xl font-bold text-gray-800 mt-4">{doctor.name}</h2>
            <p className="text-blue-600 font-semibold mt-1">{specialtyName}</p>
            {doctor.consultation_fee > 0 && (
              <div className="mt-4 bg-green-100 text-green-800 text-sm font-semibold px-3 py-1.5 rounded-full inline-block">
                Phí tư vấn: {doctor.consultation_fee.toLocaleString('vi-VN')} VNĐ
              </div>
            )}
          </div>

          {/* Cột Phải: Thông tin chi tiết */}
          <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Giới thiệu</h3>
            <p className="text-gray-600 mb-6 text-justify prose prose-sm max-w-none">
              {doctor.introduction || 'Bác sĩ chưa cập nhật thông tin giới thiệu.'}
            </p>

            <h3 className="text-xl font-semibold text-gray-700 mb-3">Bằng cấp & Chứng chỉ</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-600">Bằng cấp chuyên môn:</h4>
                {doctor.degree ? (
                  <img src={doctor.degree} alt="Bằng cấp" className="mt-2 rounded-lg border w-full h-auto object-contain max-h-80" />
                ) : (
                  <p className="text-sm text-gray-500 italic">Chưa có thông tin.</p>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-600">Chứng chỉ hành nghề:</h4>
                {doctor.certificate ? (
                  <img src={doctor.certificate} alt="Chứng chỉ" className="mt-2 rounded-lg border w-full h-auto object-contain max-h-80" />
                ) : (
                  <p className="text-sm text-gray-500 italic">Chưa có thông tin.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}