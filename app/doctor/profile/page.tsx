'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebardoctor';

export default function DoctorProfilePage() {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const doctorId = 1;

  useEffect(() => {
    fetch(`http://localhost:5000/api/doctors/${doctorId}`)
      .then((res) => res.json())
      .then((data) => {
        setDoctor(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Lỗi khi tải hồ sơ:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', doctor.name);
    formData.append('email', doctor.email);
    formData.append('phone', doctor.phone);
    formData.append('specialization_id', doctor.specialization_id);
    formData.append('introduction', doctor.introduction || '');
    if (newImage) {
      formData.append('img', newImage);
    }

    const res = await fetch(`http://localhost:5000/api/doctors/${doctorId}`, {
      method: 'PUT',
      body: formData,
    });

    if (res.ok) {
      const updated = await res.json();
      setDoctor(updated);
      setNewImage(null);
      setIsEditing(false);
      alert('✅ Cập nhật thành công!');
    } else {
      alert('❌ Cập nhật thất bại!');
    }
  };

  if (loading) return <p className="p-6">Đang tải hồ sơ...</p>;
  if (!doctor) return <p className="p-6 text-red-600">Không tìm thấy hồ sơ bác sĩ.</p>;

  // 🚫 Kiểm tra trạng thái tài khoản
  if (doctor.account_status !== 'active') {
    return (
      <div className="flex h-screen font-sans bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded shadow max-w-lg">
            <h2 className="text-xl font-semibold mb-2">⏳ Tài khoản đang chờ xét duyệt</h2>
            <p>Vui lòng chờ quản trị viên phê duyệt tài khoản của bạn để sử dụng các chức năng quản lý.</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Tài khoản đã được duyệt – hiển thị giao diện đầy đủ
  return (
    <div className="flex h-screen font-sans bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-6">Hồ sơ Bác sĩ</h1>

          <div className="flex items-center gap-4 mb-4">
            <img
              src={
                newImage
                  ? URL.createObjectURL(newImage)
                  : doctor.img
                  ? `/uploads/${doctor.img}`
                  : '/images/default-doctor.jpg'
              }
              alt="Ảnh bác sĩ"
              className="w-24 h-24 rounded-full border object-cover"
            />
            <div>
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                  className="text-sm text-gray-600 mt-2"
                />
              )}
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={doctor.name}
                  onChange={handleChange}
                  className="text-xl font-semibold border px-2 py-1 rounded"
                />
              ) : (
                <h2 className="text-xl font-semibold">{doctor.name}</h2>
              )}
              {isEditing ? (
                <input
                  type="text"
                  name="email"
                  value={doctor.email}
                  onChange={handleChange}
                  className="text-sm border px-2 py-1 mt-1 rounded"
                />
              ) : (
                <p className="text-sm text-gray-600">📧 {doctor.email}</p>
              )}
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={doctor.phone}
                  onChange={handleChange}
                  className="text-sm border px-2 py-1 mt-1 rounded"
                />
              ) : (
                <p className="text-sm text-gray-600">📞 {doctor.phone}</p>
              )}
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2">Chuyên khoa</h3>
          {isEditing ? (
            <input
              type="number"
              name="specialization_id"
              value={doctor.specialization_id}
              onChange={handleChange}
              className="border px-2 py-1 rounded mb-6"
            />
          ) : (
            <p className="mb-6">
              {doctor.specialization_id === 1
                ? 'Nội khoa'
                : doctor.specialization_id === 2
                ? 'Ngoại khoa'
                : 'Khác'}
            </p>
          )}

          <h3 className="text-lg font-semibold mb-2">Giới thiệu bản thân</h3>
          {isEditing ? (
            <textarea
              name="introduction"
              value={doctor.introduction || ''}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded mb-6"
            />
          ) : (
            <p className="text-justify leading-relaxed mb-6">
              {doctor.introduction || 'Chưa có thông tin giới thiệu.'}
            </p>
          )}

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ✏️ Chỉnh sửa thông tin
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                💾 Lưu lại
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNewImage(null);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                ❌ Hủy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
