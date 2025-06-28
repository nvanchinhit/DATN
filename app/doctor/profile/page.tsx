'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebardoctor';

export default function DoctorProfilePage() {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.replace('/login'); // hoặc trang mặc định
      return;
    }

    const { id } = JSON.parse(user);
    fetch(`http://localhost:5000/api/doctors/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.account_status === 'pending') {
          router.replace('/doctor/complete-profile');
        } else {
          setDoctor(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('❌ Lỗi khi tải hồ sơ:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">⏳ Đang tải hồ sơ...</p>;
  if (!doctor) return <p className="p-6 text-red-600">❌ Không tìm thấy hồ sơ bác sĩ.</p>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
          <h1 className="text-3xl font-bold text-blue-700 mb-6">👨‍⚕️ Hồ sơ Bác sĩ</h1>

          <div className="flex items-center gap-6 mb-6">
            <img
              src={doctor.img ? `/uploads/${doctor.img}` : '/images/default-doctor.jpg'}
              alt="Avatar"
              className="w-24 h-24 rounded-full border object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">{doctor.name}</h2>
              <p className="text-sm text-gray-600">📧 {doctor.email}</p>
              <p className="text-sm text-gray-600">📞 {doctor.phone}</p>
            </div>
          </div>

          <div className="space-y-4">
            {[{ label: 'Chuyên khoa', key: 'specialization_id' },
              { label: 'Trình độ học vấn', key: 'degree_image' },
              { label: 'Giới thiệu', key: 'introduction' },
              { label: 'Kinh nghiệm', key: 'experience' }
            ].map(({ label, key }) => (
              <div key={key}>
                <h3 className="font-semibold text-gray-700">{label}</h3>
                <p className="text-base text-gray-800">
                  {doctor[key] || 'Chưa cập nhật'}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {[{ label: '📄 Chứng chỉ hành nghề', key: 'certificate_image' },
              { label: '🎓 Bằng cấp chuyên môn', key: 'degree_image' }
            ].map(({ label, key }) => (
              <div key={key}>
                <h3 className="font-semibold text-gray-700 mb-2">{label}</h3>
                {doctor[key] ? (
                  <img
                    src={`/uploads/${doctor[key]}`}
                    alt={label}
                    className="w-full rounded shadow border"
                  />
                ) : (
                  <p className="text-gray-500">Chưa có {label.toLowerCase()}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
