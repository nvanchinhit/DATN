'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebardoctor';

export default function DoctorProfilePage() {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [newImage, setNewImage] = useState<File | null>(null);
  const [newCertificate, setNewCertificate] = useState<File | null>(null);
  const [newDegree, setNewDegree] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const doctorId = 1;

  const requiredFields = ['name', 'email', 'phone', 'specialization_id', 'introduction', 'education', 'experience'];

  useEffect(() => {
    fetch(`http://localhost:5000/api/doctors/${doctorId}`)
      .then((res) => res.json())
      .then((data) => {
        setDoctor(data);
        setLoading(false);

        const isProfileIncomplete = requiredFields.some((field) => !data[field]);
        if (isProfileIncomplete || data.account_status === 'pending') {
          setIsEditing(true);
        }
      })
      .catch((err) => {
        console.error('❌ Lỗi khi tải hồ sơ:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDoctor((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', doctor.name || '');
    formData.append('email', doctor.email || '');
    formData.append('phone', doctor.phone || '');
    formData.append('specialization_id', doctor.specialization_id || '');
    formData.append('introduction', doctor.introduction || '');
    formData.append('education', doctor.education || '');
    formData.append('experience', doctor.experience || '');

    const isSensitiveChange = !!(newCertificate || newDegree);

    formData.append(
      'account_status',
      isSensitiveChange ? 'pending' : doctor.account_status || 'pending'
    );

    if (newImage) formData.append('img', newImage);
    if (newCertificate) formData.append('certificate_image', newCertificate);
    if (newDegree) formData.append('degree_image', newDegree);

    try {
      const res = await fetch(`http://localhost:5000/api/doctors/${doctorId}`, {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        const updated = await res.json();
        setDoctor(updated);
        setIsEditing(false);
        setNewImage(null);
        setNewCertificate(null);
        setNewDegree(null);

        if (isSensitiveChange) {
          alert('✅ Đã cập nhật! Tài khoản đang chờ xét duyệt do có thay đổi bằng cấp/chứng chỉ.');
        } else {
          alert('✅ Đã cập nhật hồ sơ thành công.');
        }
      } else {
        alert('❌ Cập nhật thất bại!');
      }
    } catch (error) {
      console.error('❌ Lỗi khi gửi form:', error);
      alert('❌ Có lỗi xảy ra khi gửi dữ liệu.');
    }
  };

  if (loading) return <p className="p-6">Đang tải hồ sơ...</p>;
  if (!doctor) return <p className="p-6 text-red-600">Không tìm thấy hồ sơ bác sĩ.</p>;

  if (doctor.account_status !== 'active') {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded shadow max-w-lg">
            <h2 className="text-2xl font-semibold mb-2">⏳ Tài khoản đang chờ xét duyệt</h2>
            <p className="text-base">Vui lòng chờ quản trị viên phê duyệt tài khoản của bạn để sử dụng các chức năng.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto"> {/* Changed p-6 to p-8, removed items-center and justify-center */}
        <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded shadow-lg"> {/* Increased max-w-2xl to max-w-4xl and added mx-auto */}
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Hồ sơ Bác sĩ</h1>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
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
            <div className="flex-1"> {/* Added flex-1 here to allow content to take available space */}
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                  className="text-sm text-gray-600 mt-2"
                />
              )}
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={doctor.name}
                    onChange={handleChange}
                    className="text-xl font-semibold border px-2 py-1 rounded w-full mb-2" // Added mb-2 for spacing
                  />
                  <input
                    type="text"
                    name="email"
                    value={doctor.email}
                    onChange={handleChange}
                    className="text-sm border px-2 py-1 mt-2 rounded w-full mb-2" // Added mb-2 for spacing
                  />
                  <input
                    type="text"
                    name="phone"
                    value={doctor.phone}
                    onChange={handleChange}
                    className="text-sm border px-2 py-1 mt-2 rounded w-full"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{doctor.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">📧 {doctor.email}</p>
                  <p className="text-sm text-gray-600">📞 {doctor.phone}</p>
                </>
              )}
            </div>
          </div>

          {/* Thông tin khác */}
          {[{ label: 'Chuyên khoa', name: 'specialization_id', type: 'number' },
            { label: 'Trình độ học vấn', name: 'education', type: 'text' },
            { label: 'Giới thiệu', name: 'introduction', type: 'textarea' },
            { label: 'Kinh nghiệm', name: 'experience', type: 'textarea' }
          ].map(({ label, name, type }) => (
            <div key={name} className="mb-5">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{label}</h3>
              {isEditing ? (
                type === 'textarea' ? (
                  <textarea name={name} value={doctor[name] || ''} onChange={handleChange}
                    className="w-full border px-2 py-1 rounded min-h-[100px]" // Added min-h for textareas
                  />
                ) : (
                  <input type={type} name={name} value={doctor[name] || ''} onChange={handleChange}
                    className="w-full border px-2 py-1 rounded" />
                )
              ) : (
                <p className="text-base text-gray-700">{doctor[name] || 'Chưa cập nhật'}</p>
              )}
            </div>
          ))}

          {/* Chứng chỉ và bằng cấp */}
          <div className="flex flex-col md:flex-row md:space-x-8 mb-6">
              {[{ label: 'Chứng chỉ', name: 'certificate_image', setter: setNewCertificate },
                  { label: 'Bằng cấp', name: 'degree_image', setter: setNewDegree }
              ].map(({ label, name, setter }) => (
                  <div key={name} className="flex-1 mb-4 md:mb-0">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{label}</h3>
                      {isEditing ? (
                          <input type="file" accept="image/*" onChange={(e) => setter(e.target.files?.[0] || null)} />
                      ) : doctor[name] ? (
                          <div className="flex justify-center">
                              <img src={`/uploads/${doctor[name]}`} alt={label}
                                  className="w-60 rounded shadow cursor-pointer hover:scale-105 transition"
                                  onClick={() => setPreviewImage(`/uploads/${doctor[name]}`)} />
                          </div>
                      ) : (
                          <p className="text-base text-gray-600">Chưa có {label.toLowerCase()}</p>
                      )}
                  </div>
              ))}
          </div>

          {/* Nút lưu và hủy */}
          {isEditing && (
            <div className="flex gap-4 mt-6"> {/* Added mt-6 for more top margin */}
              <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                💾 Lưu lại
              </button>
              <button onClick={() => {
                setIsEditing(false);
                setNewImage(null);
                setNewCertificate(null);
                setNewDegree(null);
              }} className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500">
                ❌ Hủy
              </button>
            </div>
          )}

          {!isEditing && doctor.account_status === 'active' && (
            <button onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-6"> {/* Added mt-6 */}
              ✏️ Chỉnh sửa thông tin
            </button>
          )}
        </div>

        {/* Modal phóng to ảnh */}
        {previewImage && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"> {/* Added p-4 */}
            <div className="relative">
              <img src={previewImage} alt="Xem ảnh"
                className="max-w-full max-h-[90vh] rounded shadow-lg" />
              <button onClick={() => setPreviewImage(null)}
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded hover:bg-opacity-80">
                ✖
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}