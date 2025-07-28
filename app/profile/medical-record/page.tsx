// File: app/profile/medical-record/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/page';
import { FaFileMedicalAlt } from 'react-icons/fa';

// Định nghĩa kiểu dữ liệu cho hồ sơ bệnh án
interface MedicalRecord {
  appointment_id: number;
  slot_date: string;
  start_time: string;
  end_time: string;
  doctor_name: string;
  specialization_name: string;
  reason: string;
  diagnosis: string;
  treatment: string | null;
  doctor_note: string | null;
  follow_up_date: string | null;
  record_created_at: string; // Thời gian bác sĩ lưu hồ sơ
  record_updated_at: string; // Thời gian cập nhật cuối
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Component Card để hiển thị một hồ sơ, đã được thiết kế lại
const MedicalRecordCard: React.FC<{ record: MedicalRecord }> = ({ record }) => {
  // Hàm định dạng ngày (VD: 24-07-2025)
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Hàm định dạng ngày giờ (VD: 24-07-2025 13:48)
  const formatDateTime = (dateString: string | null) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      return `${formatDate(dateString)} ${time}`;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Phần Header của Card */}
      <div className="flex justify-between items-center pb-3 border-b border-dashed">
        <div>
          <h3 className="text-lg font-bold text-blue-700">
            Ngày khám: {formatDate(record.slot_date)} • {record.start_time} - {record.end_time}
          </h3>
          <p className="text-sm text-gray-600">
            Bác sĩ: {record.doctor_name} ({record.specialization_name})
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500 flex-shrink-0 ml-4 block">
            Tạo lúc: {formatDateTime(record.record_created_at)}
          </span>
          {record.record_updated_at !== record.record_created_at && (
            <span className="text-xs text-gray-400 block">
              Cập nhật: {formatDateTime(record.record_updated_at)}
            </span>
          )}
        </div>
      </div>
      
      {/* Phần Body của Card */}
      <div className="pt-4 space-y-2">
        <p><strong className="font-semibold text-gray-800 w-28 inline-block">Lý do khám:</strong> {record.reason}</p>
        <p><strong className="font-semibold text-gray-800 w-28 inline-block">Chẩn đoán:</strong> {record.diagnosis}</p>
        {record.treatment && (
          <p><strong className="font-semibold text-gray-800 w-28 inline-block">Điều trị:</strong> {record.treatment}</p>
        )}
        {record.follow_up_date && (
          <p><strong className="font-semibold text-gray-800 w-28 inline-block">Tái khám:</strong> 
            <span className="text-orange-600 font-semibold ml-2">{formatDate(record.follow_up_date)}</span>
          </p>
        )}
        <p><strong className="font-semibold text-gray-800 w-28 inline-block">Ghi chú thêm:</strong> {record.doctor_note || 'Không có'}</p>
      </div>
    </div>
  );
};

// Component chính của trang Hồ Sơ Bệnh Án
export default function MyMedicalRecordsPage() {
  const { token, loading: authLoading } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return; // Chờ cho đến khi xác thực xong

    const fetchRecords = async () => {
      if (!token) {
        setError("Vui lòng đăng nhập để xem hồ sơ.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        console.log("🔍 Đang gọi API hồ sơ bệnh án...");
        const response = await fetch(`${API_URL}/api/medical-records/my-records`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log("📡 Response status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("❌ API Error:", errorData);
            throw new Error(errorData.error || 'Không thể tải dữ liệu hồ sơ bệnh án.');
        }
        
        const data = await response.json();
        console.log("✅ API Response:", data);
        setRecords(data);
      } catch (err: any) {
        console.error("❌ Frontend Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [token, authLoading]);

  // Hàm render nội dung chính
  const renderContent = () => {
    if (isLoading) {
        return <p className="text-center text-gray-500">Đang tải hồ sơ của bạn...</p>;
    }
    if (error) {
        return <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>;
    }
    if (records.length === 0) {
      return (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <FaFileMedicalAlt className="mx-auto text-4xl text-gray-300 mb-4" />
          <p className="text-gray-500">Bạn chưa có hồ sơ bệnh án nào.</p>
          <p className="text-sm text-gray-400 mt-2">Hồ sơ sẽ được cập nhật tại đây sau khi bạn hoàn tất một buổi khám.</p>
        </div>
      );
    }
    // Hiển thị danh sách các hồ sơ
    return records.map(record => <MedicalRecordCard key={record.appointment_id} record={record} />);
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Hồ Sơ Bệnh Án Của Tôi
      </h1>
  
      
      <div>
        {renderContent()}
      </div>
    </div>
  );
}