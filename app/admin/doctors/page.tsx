'use client';

import { useState } from 'react';
import { Eye, Pencil, Trash2, PlusCircle, Search, X } from 'lucide-react';

// 1. Cập nhật Interface: status giờ là 'Đang hoạt động' | 'Chờ xét duyệt'
interface Doctor {
  id: number;
  name: string;
  phone: string;
  email: string;
  img: string;
  specialization: string;
  status: 'Đang hoạt động' | 'Chờ xét duyệt';
  certificate: string;
  degree: string;
  introduction: string;
}

// 2. Cập nhật Dữ liệu Mẫu với trạng thái mới
const initialDoctors: Doctor[] = [
  {
    id: 201,
    name: 'GS.TS. Trần Văn An',
    phone: '0905123456',
    email: 'an.tv@clinic.vn',
    img: 'https://cdn.bookingcare.vn/fr/w200/2023/11/27/111857-bsckii-nguyen-thi-nu.jpg',
    specialization: 'Tim mạch',
    status: 'Đang hoạt động',
    certificate: 'https://i.imgur.com/r3eYFRC.jpeg',
    degree: 'https://i.imgur.com/T0azHTQ.jpeg',
    introduction: 'Hơn 20 năm kinh nghiệm trong lĩnh vực tim mạch can thiệp, từng tu nghiệp tại Pháp và Hoa Kỳ. Là chuyên gia hàng đầu về đặt stent và các thủ thuật tim mạch phức tạp.',
  },
  {
    id: 202,
    name: 'BSCKII. Nguyễn Thị Lan',
    phone: '0912987654',
    email: 'lan.nt@clinic.vn',
    img: 'https://cdn.bookingcare.vn/fr/w200/2024/01/10/144612-bs-hoang-cuong.jpg',
    specialization: 'Da liễu',
    status: 'Đang hoạt động',
    certificate: 'https://i.imgur.com/r3eYFRC.jpeg',
    degree: 'https://i.imgur.com/T0azHTQ.jpeg',
    introduction: 'Chuyên gia về các bệnh da liễu thẩm mỹ, ứng dụng công nghệ laser tiên tiến trong điều trị nám, tàn nhang và trẻ hóa da. Rất mát tay và được nhiều bệnh nhân tin tưởng.',
  },
  {
    id: 203,
    name: 'ThS.BS. Lê Hoàng Minh',
    phone: '0988112233',
    email: 'minh.lh@clinic.vn',
    img: 'https://cdn.bookingcare.vn/fr/w200/2023/06/06/171556-bs-ma-thanh-xuan.jpg',
    specialization: 'Nhi khoa',
    status: 'Đang hoạt động',
    certificate: 'https://i.imgur.com/r3eYFRC.jpeg',
    degree: 'https://i.imgur.com/T0azHTQ.jpeg',
    introduction: 'Tận tâm với sức khỏe trẻ em, đặc biệt có chuyên môn sâu về các vấn đề dinh dưỡng, tiêu hóa và tiêm chủng mở rộng. Luôn nhẹ nhàng và thấu hiểu tâm lý trẻ nhỏ.',
  },
  {
    id: 204,
    name: 'BS. Phạm Thu Hà',
    phone: '0934555888',
    email: 'ha.pt@clinic.vn',
    img: 'https://cdn.bookingcare.vn/fr/w200/2023/12/11/110542-bsckii-tran-thi-huyen-trang.jpg',
    specialization: 'Sản phụ khoa',
    status: 'Chờ xét duyệt', // Cập nhật trạng thái
    certificate: 'https://i.imgur.com/r3eYFRC.jpeg',
    degree: 'https://i.imgur.com/T0azHTQ.jpeg',
    introduction: 'Hồ sơ mới, đang chờ hội đồng y khoa phê duyệt chứng chỉ và bằng cấp.',
  },
];

const specializations = [...new Set(initialDoctors.map(d => d.specialization))];
const statuses = [...new Set(initialDoctors.map(d => d.status))];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const displayedDoctors = doctors
    .filter(doc => (filterStatus === 'all' ? true : doc.status === filterStatus))
    .filter(doc => (filterSpecialization === 'all' ? true : doc.specialization === filterSpecialization))
    .filter(doc => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        doc.name.toLowerCase().includes(term) ||
        doc.phone.includes(term) ||
        `BS${doc.id}`.toLowerCase().includes(term)
      );
    });
  
  const handleViewDetails = (doctor: Doctor) => setSelectedDoctor(doctor);
  const handleCloseModal = () => setSelectedDoctor(null);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">👨‍⚕️ Quản lý Bác sĩ</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition">
          <PlusCircle size={20} /> Thêm Bác sĩ
        </button>
      </div>

      <div className="mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
            {/* 3. SỬA LỖI BÁO ĐỎ: Thêm type cho event của input */}
            <input 
              type="text"
              placeholder="Tìm theo tên, SĐT, mã BS..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <select value={filterSpecialization} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterSpecialization(e.target.value)} className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-white"><option value="all">Tất cả chuyên khoa</option>{specializations.map(spec => (<option key={spec} value={spec}>{spec}</option>))}</select>
          <select value={filterStatus} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)} className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-white"><option value="all">Tất cả trạng thái</option>{statuses.map(status => (<option key={status} value={status}>{status}</option>))}</select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase tracking-wide">
            <tr>
              <th className="px-6 py-4 border-b">Bác sĩ</th>
              <th className="px-6 py-4 border-b">Chuyên khoa</th>
              <th className="px-6 py-4 border-b">Trạng thái</th>
              <th className="px-6 py-4 border-b text-center">Bằng cấp</th>
              <th className="px-6 py-4 border-b text-center">Chứng chỉ</th>
              <th className="px-6 py-4 border-b text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {displayedDoctors.length > 0 ? (
              displayedDoctors.map((doc) => (
                <tr key={doc.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <img src={doc.img || '/default-avatar.jpg'} alt={doc.name} className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md"/>
                    <div><p className="text-gray-900 font-semibold">{doc.name}</p><p className="text-gray-500 text-xs">{doc.email}</p></div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{doc.specialization}</td>
                  <td className="px-6 py-4">
                    {/* 4. Cập nhật logic hiển thị màu cho trạng thái mới */}
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      doc.status === 'Đang hoạt động' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center"><a href={doc.degree} target="_blank" rel="noopener noreferrer" title="Xem ảnh đầy đủ"><img src={doc.degree} alt="Bằng cấp" className="w-16 h-auto mx-auto rounded-sm border hover:scale-125 hover:shadow-lg transition-transform duration-200"/></a></td>
                  <td className="px-6 py-4 text-center"><a href={doc.certificate} target="_blank" rel="noopener noreferrer" title="Xem ảnh đầy đủ"><img src={doc.certificate} alt="Chứng chỉ" className="w-16 h-auto mx-auto rounded-sm border hover:scale-125 hover:shadow-lg transition-transform duration-200"/></a></td>
                  <td className="px-6 py-4 flex justify-center items-center gap-4">
                    <button onClick={() => handleViewDetails(doc)} className="text-blue-600 hover:text-blue-800 transition" title="Xem hồ sơ"><Eye size={18} /></button>
                    <button className="text-yellow-600 hover:text-yellow-800 transition" title="Chỉnh sửa"><Pencil size={18} /></button>
                    <button className="text-red-600 hover:text-red-800 transition" title="Xoá bác sĩ"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="text-center py-10 text-gray-500">Không tìm thấy bác sĩ nào phù hợp.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center"><h2 className="text-2xl font-bold text-gray-800">Hồ sơ Bác sĩ</h2><button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button></div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 flex flex-col items-center text-center">
                <img src={selectedDoctor.img} alt={selectedDoctor.name} className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg mb-4"/>
                <h3 className="text-xl font-bold text-gray-900">{selectedDoctor.name}</h3>
                <p className="text-blue-600 font-semibold">{selectedDoctor.specialization}</p>
                <span className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full ${ 
                  selectedDoctor.status === 'Đang hoạt động' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>{selectedDoctor.status}</span>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div><h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Thông tin liên hệ</h4><p className="text-gray-600"><strong>Điện thoại:</strong> {selectedDoctor.phone}</p><p className="text-gray-600"><strong>Email:</strong> {selectedDoctor.email}</p></div>
                <div>
                  <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Chứng chỉ & Bằng cấp</h4>
                  <div className="flex gap-4 mt-2">
                    <div className="text-center"><p className="text-xs font-bold text-gray-500 mb-1">BẰNG CẤP</p><a href={selectedDoctor.degree} target="_blank" rel="noopener noreferrer"><img src={selectedDoctor.degree} alt="Bằng cấp" className="w-40 h-auto rounded-md border shadow-md hover:shadow-xl transition-shadow"/></a></div>
                    <div className="text-center"><p className="text-xs font-bold text-gray-500 mb-1">CHỨNG CHỈ</p><a href={selectedDoctor.certificate} target="_blank" rel="noopener noreferrer"><img src={selectedDoctor.certificate} alt="Chứng chỉ" className="w-40 h-auto rounded-md border shadow-md hover:shadow-xl transition-shadow"/></a></div>
                  </div>
                </div>
                <div><h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Giới thiệu</h4><p className="text-gray-600 text-justify leading-relaxed">{selectedDoctor.introduction}</p></div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t text-right"><button onClick={handleCloseModal} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition">Đóng</button></div>
          </div>
        </div>
      )}
    </div>
  );
}