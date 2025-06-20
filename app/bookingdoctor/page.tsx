// File: app/bookingdoctor/page.tsx

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, X, Loader2 } from 'lucide-react';

// --- INTERFACES ---
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
  specialization_id: number;
  certificate: string;
  degree: string;
}

interface TimeSlotItem {
  start: string;
  end: string;
}

type TimeSlots = {
  [date: string]: TimeSlotItem[];
};

// --- WRAPPER COMPONENT ---
export default function BookingDoctorPageWrapper() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-blue-600">Đang tải trang...</div>}>
      <BookingDoctorPage />
    </Suspense>
  );
}

// --- MAIN COMPONENT ---
function BookingDoctorPage() {
  const searchParams = useSearchParams();
  const specialtyId = searchParams.get('specialization');

  // --- STATES ---
  const [specialty, setSpecialty] = useState<Specialization | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeSlotItem | null>(null); 
  const [doctorForDetails, setDoctorForDetails] = useState<Doctor | null>(null);

  const [timeSlots, setTimeSlots] = useState<TimeSlots>({});
  const [slotsLoading, setSlotsLoading] = useState(false);

  // --- EFFECTS ---

  useEffect(() => {
    if (specialtyId) {
      const fetchBookingData = async () => {
        setLoading(true);
        setError(null);
        try {
          const [specialtyRes, doctorsRes] = await Promise.all([
            fetch(`http://localhost:5000/api/specializations/${specialtyId}`),
            fetch(`http://localhost:5000/api/doctors-by-specialization/${specialtyId}`)
          ]);
          if (!specialtyRes.ok || !doctorsRes.ok) throw new Error('Không thể tải dữ liệu.');
          
          const specialtyData = await specialtyRes.json();
          const doctorsData = await doctorsRes.json();
          
          setSpecialty(specialtyData);
          setDoctors(doctorsData);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false); 
        }
      };
      fetchBookingData();
    } else {
      setError("Vui lòng chọn một chuyên khoa.");
      setLoading(false);
    }
  }, [specialtyId]);

  useEffect(() => {
    if (!selectedDoctorId) {
      setTimeSlots({});
      return;
    }
    const fetchTimeSlots = async () => {
      setSlotsLoading(true);
      setSelectedDate(null);
      setSelectedTime(null);
      try {
        const response = await fetch(`http://localhost:5000/api/doctors/${selectedDoctorId}/time-slots`);
        if (!response.ok) throw new Error('Không thể tải lịch làm việc.');
        const slotsData: TimeSlots = await response.json();
        setTimeSlots(slotsData);
      } catch (err: any) {
        console.error("Lỗi fetch lịch làm việc:", err);
        setTimeSlots({});
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchTimeSlots();
  }, [selectedDoctorId]);

  // --- HANDLERS ---
  const handleBooking = () => {
    if (!selectedDoctorId || !selectedDate || !selectedTime) {
      alert('Vui lòng chọn đầy đủ thông tin: Bác sĩ, Ngày và Giờ khám.');
      return;
    }
    const doctorName = doctors.find(d => d.id === selectedDoctorId)?.name;
    const bookingDate = new Date(selectedDate).toLocaleDateString('vi-VN');
    const bookingTime = `${selectedTime.start} - ${selectedTime.end}`;
    alert(`🎉 Đặt lịch thành công!\n\nBác sĩ: ${doctorName}\nChuyên khoa: ${specialty?.name}\nNgày khám: ${bookingDate}\nGiờ khám: ${bookingTime}`);
  };

  // --- RENDER LOGIC ---
  if (loading) return <div className="flex h-screen items-center justify-center text-blue-600">Đang tải thông tin...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-600">{error}</div>;
  if (!specialty) return <div className="flex h-screen items-center justify-center text-gray-500">Không tìm thấy thông tin chuyên khoa.</div>;
  
  const availableDates = Object.keys(timeSlots);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* ✅ DÒNG NÀY ĐÃ ĐƯỢC SỬA LỖI */}
        <header className='mb-8 text-center'>
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
                      <p className="text-sm text-gray-500 line-clamp-2">{doctor.introduction || 'Chưa có thông tin giới thiệu.'}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDoctorForDetails(doctor); }}
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
            <div className="bg-white p-6 rounded-xl shadow-lg min-h-[150px]">
              <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2"><Calendar size={20}/> 2. Chọn ngày khám</h3>
              {!selectedDoctorId ? (
                <p className="text-gray-400 text-sm">Vui lòng chọn bác sĩ để xem lịch khám.</p>
              ) : slotsLoading ? (
                <div className="flex items-center justify-center text-gray-500"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải lịch...</div>
              ) : availableDates.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {availableDates.map(dateStr => {
                    const date = new Date(dateStr);
                    const day = date.getDate();
                    const dayName = date.toLocaleDateString('vi-VN', { weekday: 'short' });
                    return (
                      <button key={dateStr} onClick={() => setSelectedDate(dateStr)} className={`p-2 rounded-md text-center transition-colors ${selectedDate === dateStr ? 'bg-blue-600 text-white font-bold' : 'bg-gray-100 hover:bg-blue-100'}`}>
                        <p className="text-xs">{dayName}</p>
                        <p className="font-bold text-lg">{day}</p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Bác sĩ này hiện chưa có lịch làm việc.</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg min-h-[150px]">
              <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2"><Clock size={20}/> 3. Chọn giờ khám</h3>
              {!selectedDate ? (
                <p className="text-gray-400 text-sm">Vui lòng chọn ngày khám.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots[selectedDate].map((slot) => {
                    const isSelected = selectedTime?.start === slot.start && selectedTime?.end === slot.end;
                    return (
                      <button 
                        key={`${slot.start}-${slot.end}`} 
                        onClick={() => setSelectedTime(slot)}
                        className={`p-2 rounded-md font-semibold transition-colors ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-blue-100'
                        }`}
                      >
                        {`${slot.start} - ${slot.end}`}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            
            <button onClick={handleBooking} disabled={!selectedDoctorId || !selectedDate || !selectedTime} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
              Xác nhận Đặt lịch
            </button>
          </div>
        </div>
      </div>
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