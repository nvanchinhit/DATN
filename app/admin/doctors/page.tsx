'use client';

import { useEffect, useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  phone: string;
  email: string;
  img: string;
  specialization: string;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/doctors')
      .then((res) => res.json())
      .then((data: Doctor[]) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi tải danh sách bác sĩ:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">👨‍⚕️ Danh sách bác sĩ</h1>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase tracking-wide">
              <tr>
                <th className="px-6 py-4 border-b">Mã BS</th>
                <th className="px-6 py-4 border-b">Bác sĩ</th>
                <th className="px-6 py-4 border-b">Chuyên khoa</th>
                <th className="px-6 py-4 border-b">Điện thoại</th>
                <th className="px-6 py-4 border-b text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b hover:bg-gray-100 transition duration-150"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{`BS${doc.id}`}</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={
                        doc.img
                          ? `http://localhost:5000/uploads/${doc.img}`
                          : '/default-avatar.jpg'
                      }
                      alt={doc.name}
                      className="w-10 h-10 rounded-full object-cover border shadow-sm"
                    />
                    <span className="text-gray-800 font-medium">{doc.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{doc.specialization}</td>
                  <td className="px-6 py-4 text-gray-700">{doc.phone}</td>
                  <td className="px-6 py-4 flex justify-center gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Xem hồ sơ"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="text-yellow-600 hover:text-yellow-800 transition"
                      title="Chỉnh sửa"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition"
                      title="Xoá bác sĩ"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
