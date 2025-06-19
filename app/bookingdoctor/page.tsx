// File: app/bookingdoctor/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, Eye, X } from 'lucide-react'; // Thêm Eye và X

// 1. Cập nhật Interface để có đủ thông tin
interface Specialization {
  id: number;
  name: string;
  image: string;
}

interface Doctor {
  id: number;
  name: string;
  img: string;
  introduction: string;
  specializationId: number;
  certificate: string; // URL ảnh chứng chỉ
  degree: string;      // URL ảnh bằng cấp
}

// 2. Cập nhật Dữ liệu Mẫu với đầy đủ thông tin
const allSpecialties: Specialization[] = [
  { id: 1, name: 'Tim mạch', image: '...' },
  { id: 2, name: 'Da liễu', image: '...' },
  { id: 3, name: 'Nhi khoa', image: '...' },
  { id: 4, name: 'Sản phụ khoa', image: '...' },
  { id: 5, name: 'Tai Mũi Họng', image: '...'},
  { id: 6, name: 'Cơ Xương Khớp', image: '...'}
];

const allDoctors: Doctor[] = [
  { id: 201, name: 'GS.TS. Trần Văn An', img: 'https://cdn.bookingcare.vn/fr/w200/2023/11/27/111857-bsckii-nguyen-thi-nu.jpg', introduction: 'Hơn 20 năm kinh nghiệm trong lĩnh vực tim mạch can thiệp.', specializationId: 1, certificate: 'https://i.imgur.com/r3eYFRC.jpeg', degree: 'https://i.imgur.com/T0azHTQ.jpeg' },
  { id: 202, name: 'BS. Nguyễn Hoàng Long', img: 'https://cdn.bookingcare.vn/fr/w200/2023/06/06/171556-bs-ma-thanh-xuan.jpg', introduction: 'Chuyên gia đầu ngành về nội soi tim mạch.', specializationId: 1, certificate: 'https://i.imgur.com/r3eYFRC.jpeg', degree: 'https://i.imgur.com/T0azHTQ.jpeg' },
  { id: 203, name: 'BSCKII. Nguyễn Thị Lan', img: 'https://cdn.bookingcare.vn/fr/w200/2024/01/10/144612-bs-hoang-cuong.jpg', introduction: 'Chuyên gia về các bệnh da liễu thẩm mỹ và laser.', specializationId: 2, certificate: 'https://i.imgur.com/r3eYFRC.jpeg', degree: 'https://i.imgur.com/T0azHTQ.jpeg' },
  { id: 204, name: 'BS. Vũ Thị Mai', img: 'https://cdn.bookingcare.vn/fr/w200/2023/12/11/110542-bsckii-tran-thi-huyen-trang.jpg', introduction: 'Nhiều năm kinh nghiệm điều trị mụn và sẹo rỗ.', specializationId: 2, certificate: 'https://i.imgur.com/r3eYFRC.jpeg', degree: 'https://i.imgur.com/T0azHTQ.jpeg' },
  { id: 205, name: 'ThS.BS. Lê Hoàng Minh', img: 'https://cdn.bookingcare.vn/fr/w200/2023/06/06/171556-bs-ma-thanh-xuan.jpg', introduction: 'Tận tâm với sức khỏe trẻ em, chuyên về dinh dưỡng.', specializationId: 3, certificate: 'https://i.imgur.com/r3eYFRC.jpeg', degree: 'https://i.imgur.com/T0azHTQ.jpeg' },
  { id: 206, name: 'BS. Phạm Thu Hà', img: 'https://cdn.bookingcare.vn/fr/w200/2023/12/11/110542-bsckii-tran-thi-huyen-trang.jpg', introduction: 'Chuyên gia theo dõi thai sản và các bệnh phụ khoa.', specializationId: 4, certificate: 'https://i.imgur.com/r3eYFRC.jpeg', degree: 'https://i.imgur.com/T0azHTQ.jpeg' },
];

export default function BookingDoctorPage() {
  const searchParams = useSearchParams();
  const specialtyId = searchParams.get('specialization');

  const [specialty, setSpecialty] = useState<Specialization | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // State cho việc đặt lịch
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // State quản lý modal chi tiết
  const [doctorForDetails, setDoctorForDetails] = useState<Doctor | null>(null);

  const availableDates = Array.from({ length: 7 }).map((_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; });
  const availableTimes = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  useEffect(() => {
    if (specialtyId) {
      setLoading(true);
      setTimeout(() => {
        const foundSpecialty = allSpecialties.find(s => s.id === parseInt(specialtyId));
        const foundDoctors = allDoctors.filter(d => d.specializationId === parseInt(specialtyId));
        setSpecialty(foundSpecialty || null);
        setDoctors(foundDoctors);
        setLoading(false);
      }, 500);
    }
  }, [specialtyId]);

  const handleBooking = () => {
    if (!selectedDoctorId || !selectedDate || !selectedTime) {
      alert('Vui lòng chọn đầy đủ thông tin: Bác sĩ, Ngày và Giờ khám.');
      return;
    }
    const doctorName = doctors.find(d => d.id === selectedDoctorId)?.name;
    const bookingDate = new Date(selectedDate).toLocaleDateString('vi-VN');
    alert(`🎉 Đặt lịch thành công!\n\nBác sĩ: ${doctorName}\nChuyên khoa: ${specialty?.name}\nNgày khám: ${bookingDate}\nGiờ khám: ${selectedTime}`);
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-blue-600">Đang tải thông tin...</div>;
  if (!specialty) return <div className="flex h-screen items-center justify-center text-red-600">Không tìm thấy chuyên khoa này.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Đặt lịch khám Chuyên khoa</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mt-2">{specialty.name}</h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-700 mb-4">1. Chọn một bác sĩ</h3>
            {doctors.length > 0 ? (
              <div className="space-y-4">
                {doctors.map(doctor => (
                  <div
                    key={doctor.id}
                    onClick={() => setSelectedDoctorId(doctor.id)}
                    className={`p-4 border-2 rounded-lg flex items-start gap-4 cursor-pointer transition-all duration-300 ${
                      selectedDoctorId === doctor.id ? 'bg-blue-50 border-blue-500 scale-105 shadow-md' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                  >
                    <img src={doctor.img} alt={doctor.name} className="w-16 h-16 rounded-full object-cover"/>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{doctor.name}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2">{doctor.introduction}</p>
                    </div>
                    {/* 3. Thêm nút Xem chi tiết */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn việc chọn bác sĩ khi chỉ muốn xem chi tiết
                        setDoctorForDetails(doctor);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold whitespace-nowrap"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                ))}
              </div>
            ) : (<p className="text-gray-500">Hiện chưa có bác sĩ nào thuộc chuyên khoa này.</p>)}
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2"><Calendar size={20}/> 2. Chọn ngày khám</h3>
              <div className="grid grid-cols-4 gap-2">
                {availableDates.map(date => { const d = date.getDate(); const dn = date.toLocaleDateString('vi-VN', { weekday: 'short' }); const fd = date.toISOString().split('T')[0]; return (<button key={fd} onClick={() => setSelectedDate(fd)} className={`p-2 rounded-md text-center transition-colors ${selectedDate === fd ? 'bg-blue-600 text-white font-bold' : 'bg-gray-100 hover:bg-blue-100'}`}><p className="text-xs">{dn}</p><p className="font-bold text-lg">{d}</p></button>);})}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2"><Clock size={20}/> 3. Chọn giờ khám</h3>
              <div className="grid grid-cols-3 gap-3">
                {availableTimes.map(time => (<button key={time} onClick={() => setSelectedTime(time)} className={`p-2 rounded-md font-semibold transition-colors ${selectedTime === time ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-blue-100'}`}>{time}</button>))}
              </div>
            </div>
            <button onClick={handleBooking} disabled={!selectedDoctorId || !selectedDate || !selectedTime} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
              Xác nhận Đặt lịch
            </button>
          </div>
        </div>
      </div>

      {/* 4. MODAL XEM CHI TIẾT BÁC SĨ */}
      {doctorForDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={() => setDoctorForDetails(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center"><h2 className="text-2xl font-bold text-gray-800">Thông tin Bác sĩ</h2><button onClick={() => setDoctorForDetails(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button></div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 flex flex-col items-center text-center">
                <img src={doctorForDetails.img} alt={doctorForDetails.name} className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg mb-4"/>
                <h3 className="text-xl font-bold text-gray-900">{doctorForDetails.name}</h3>
                <p className="text-blue-600 font-semibold">{specialty?.name}</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div><h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Giới thiệu</h4><p className="text-gray-600 text-justify leading-relaxed">{doctorForDetails.introduction}</p></div>
                <div>
                  <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Chứng chỉ & Bằng cấp</h4>
                  <div className="flex gap-4 mt-2">
                    <div className="text-center"><p className="text-xs font-bold text-gray-500 mb-1">BẰNG CẤP</p><a href={doctorForDetails.degree} target="_blank" rel="noopener noreferrer"><img src={doctorForDetails.degree} alt="Bằng cấp" className="w-40 h-auto rounded-md border shadow-md hover:shadow-xl transition-shadow"/></a></div>
                    <div className="text-center"><p className="text-xs font-bold text-gray-500 mb-1">CHỨNG CHỈ</p><a href={doctorForDetails.certificate} target="_blank" rel="noopener noreferrer"><img src={doctorForDetails.certificate} alt="Chứng chỉ" className="w-40 h-auto rounded-md border shadow-md hover:shadow-xl transition-shadow"/></a></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t text-right"><button onClick={() => setDoctorForDetails(null)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition">Đóng</button></div>
          </div>
        </div>
      )}
    </div>
  );
}