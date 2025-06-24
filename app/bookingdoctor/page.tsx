// File: app/bookingdoctor/page.tsx

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, Loader2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DoctorDetailsModal from './DoctorDetailsModal'; // Import component Modal

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
  consultation_fee: number;
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

// --- WRAPPER COMPONENT for Suspense ---
export default function BookingDoctorPageWrapper() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-blue-600">Đang tải trang...</div>}>
      <BookingDoctorPage />
    </Suspense>
  );
}

// --- MAIN PAGE COMPONENT ---
function BookingDoctorPage() {
  const searchParams = useSearchParams();
  const specialtyId = searchParams.get('specialization');

  // States
  const [specialty, setSpecialty] = useState<Specialization | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeSlotItem | null>(null);
  const [doctorForDetails, setDoctorForDetails] = useState<Doctor | null>(null); // State để quản lý modal
  const [timeSlots, setTimeSlots] = useState<TimeSlots>({});
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Effect để fetch dữ liệu chuyên khoa và bác sĩ
  useEffect(() => {
    if (specialtyId) {
      const fetchBookingData = async () => {
        setLoading(true);
        setError(null);
        try {
          const [specialtyRes, doctorsRes] = await Promise.all([
            fetch(`http://localhost:5000/api/specializations/${specialtyId}`),
            fetch(`http://localhost:5000/api/doctors-by-specialization/${specialtyId}`),
          ]);
          if (!specialtyRes.ok || !doctorsRes.ok) {
            throw new Error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
          }
          setSpecialty(await specialtyRes.json());
          setDoctors(await doctorsRes.json());
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchBookingData();
    } else {
      setError('Vui lòng chọn một chuyên khoa từ trang chủ.');
      setLoading(false);
    }
  }, [specialtyId]);

  // Effect để fetch lịch làm việc khi chọn bác sĩ
  useEffect(() => {
    if (!selectedDoctorId) {
      setTimeSlots({});
      setSelectedDate(null);
      setSelectedTime(null);
      return;
    }
    const fetchTimeSlots = async () => {
      setSlotsLoading(true);
      setSelectedDate(null);
      setSelectedTime(null);
      try {
        const res = await fetch(`http://localhost:5000/api/doctors/${selectedDoctorId}/time-slots`);
        if (!res.ok) throw new Error('Không thể tải lịch làm việc của bác sĩ.');
        const slotsData = await res.json();
        setTimeSlots(slotsData);
      } catch (err) {
        console.error('Lỗi khi fetch lịch làm việc:', err);
        setTimeSlots({}); // Reset nếu có lỗi
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchTimeSlots();
  }, [selectedDoctorId]);

  // Hàm xử lý khi nhấn nút đặt lịch
  const handleBooking = () => {
    if (!selectedDoctorId || !selectedDate || !selectedTime) {
      alert('Vui lòng chọn đầy đủ thông tin: Bác sĩ, Ngày, và Giờ khám.');
      return;
    }
    const doctorName = doctors.find((d) => d.id === selectedDoctorId)?.name;
    const bookingDate = selectedDate.toLocaleDateString('vi-VN');
    alert(`🎉 Đặt lịch thành công!\n\nBác sĩ: ${doctorName}\nChuyên khoa: ${specialty?.name}\nNgày: ${bookingDate}\nGiờ: ${selectedTime.start} - ${selectedTime.end}`);
    // Sau khi đặt thành công, reset các lựa chọn
    setSelectedDoctorId(null);
  };

  // Xử lý các trạng thái loading và error
  if (loading) return <div className="flex h-screen items-center justify-center text-blue-600">Đang tải thông tin...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-600">{error}</div>;
  if (!specialty) return <div className="flex h-screen items-center justify-center text-gray-500">Không tìm thấy thông tin chuyên khoa.</div>;

  // Chuẩn bị dữ liệu ngày tháng cho DatePicker (đã sửa lỗi timezone)
  const availableDates = Object.keys(timeSlots).filter(date => timeSlots[date].length > 0);
  const availableDateObjects = availableDates.map(d => new Date(d)); // new Date("YYYY-MM-DD") sẽ hiểu là UTC, cần thêm T00:00:00
  const selectedDateKey = selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` : null;


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Đặt lịch khám Chuyên khoa</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mt-2">{specialty.name}</h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột Trái: Danh sách bác sĩ */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-700 mb-4">1. Chọn một bác sĩ</h3>
            {doctors.length > 0 ? (
              <div className="space-y-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => setSelectedDoctorId(doctor.id)}
                    className={`p-4 border-2 rounded-lg flex items-center gap-4 cursor-pointer transition-all duration-300 ${
                      selectedDoctorId === doctor.id
                        ? 'bg-blue-50 border-blue-500 scale-105 shadow-md'
                        : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                  >
                    <img src={doctor.img || '/default-avatar.png'} alt={doctor.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{doctor.name}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{doctor.introduction || 'Chưa có giới thiệu.'}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn click vào div cha
                        setDoctorForDetails(doctor);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex-shrink-0 ml-2 py-1 px-3 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Không có bác sĩ nào cho chuyên khoa này.</p>
            )}
          </div>

          {/* Cột Phải: Chọn lịch và xác nhận */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Calendar size={20} /> 2. Chọn ngày khám
              </h3>
              {!selectedDoctorId ? (
                <p className="text-gray-400 text-sm">Vui lòng chọn bác sĩ để xem lịch.</p>
              ) : slotsLoading ? (
                <div className="flex items-center justify-center text-gray-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải lịch...
                </div>
              ) : availableDates.length === 0 ? (
                <p className="text-gray-500 text-sm">Bác sĩ này hiện chưa có lịch làm việc.</p>
              ) : (
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date as Date)}
                  includeDates={availableDateObjects.map(d => new Date(d.valueOf() + d.getTimezoneOffset() * 60 * 1000))} // Fix timezone issue
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Chọn một ngày"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  minDate={new Date()}
                />
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Clock size={20} /> 3. Chọn giờ khám
              </h3>
              {!selectedDate ? (
                <p className="text-gray-400 text-sm">Vui lòng chọn ngày khám ở trên.</p>
              ) : !selectedDateKey || !timeSlots[selectedDateKey] || timeSlots[selectedDateKey].length === 0 ? (
                <p className="text-gray-500 text-sm">Không có khung giờ trống cho ngày này.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {timeSlots[selectedDateKey]?.map((slot) => (
                    <button
                      key={`${slot.start}-${slot.end}`}
                      onClick={() => setSelectedTime(slot)}
                      className={`p-2.5 rounded-lg font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                        selectedTime?.start === slot.start && selectedTime?.end === slot.end
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 hover:bg-blue-100 text-gray-700'
                      }`}
                    >
                      {`${slot.start} - ${slot.end}`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleBooking}
              disabled={!selectedDoctorId || !selectedDate || !selectedTime || loading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Xác nhận Đặt lịch
            </button>
          </div>
        </div>
      </div>

      {/* Render Modal nếu doctorForDetails có giá trị */}
      {doctorForDetails && (
        <DoctorDetailsModal
          doctor={doctorForDetails}
          specialtyName={specialty.name}
          onClose={() => setDoctorForDetails(null)}
        />
      )}
    </div>
  );
}