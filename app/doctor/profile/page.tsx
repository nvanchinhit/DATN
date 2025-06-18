'use client';

import React from "react";
import Sidebar from '@/components/layout/Sidebardoctor';

const DoctorProfile = () => {
  return (
    <div className="flex h-screen font-sans bg-gray-50">
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Nội dung hồ sơ bên phải */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-6">Hồ sơ Bác sĩ</h1>

          <h2 className="text-xl font-semibold mb-2">TS.BS Trần Trọng Thắng</h2>
          <p className="mb-1"><strong>Chuyên khoa:</strong> Cơ xương khớp</p>
          <p className="mb-6"><strong>Cơ sở:</strong> Bệnh viện Đa khoa Đà Nẵng</p>

          <h3 className="text-lg font-semibold mb-2">Kinh nghiệm làm việc</h3>
          <ul className="list-disc list-inside mb-6 space-y-1">
            <li>Hơn 15 năm kinh nghiệm trong ngành y.</li>
            <li>Nguyên Phó trưởng khoa Cơ Xương Khớp - BV Bạch Mai.</li>
            <li>Thành viên Hội Cơ Xương Khớp Việt Nam.</li>
            <li>Tham gia nhiều hội thảo y khoa quốc tế.</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">Giới thiệu bản thân</h3>
          <p className="text-justify leading-relaxed">
            Bác sĩ Trần Trọng Thắng luôn đặt lợi ích và sự an tâm của bệnh nhân lên hàng đầu. 
            Với chuyên môn sâu rộng cùng thái độ tận tâm, bác sĩ đã điều trị thành công cho hàng nghìn bệnh nhân mắc các vấn đề về xương khớp và cơ vận động.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
