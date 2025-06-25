"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar, Clock, Loader2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DoctorDetailsModal from "./DoctorDetailsModal";

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

export default function BookingDoctorPageWrapper() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-blue-600">Đang tải trang...</div>}>
      <BookingDoctorPage />
    </Suspense>
  );
}

function BookingDoctorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const specialtyId = searchParams.get("specialization");

  const [specialty, setSpecialty] = useState<Specialization | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeSlotItem | null>(null);
  const [doctorForDetails, setDoctorForDetails] = useState<Doctor | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlots>({});
  const [slotsLoading, setSlotsLoading] = useState(false);

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
          if (!specialtyRes.ok || !doctorsRes.ok) throw new Error("Không thể tải dữ liệu.");
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
      setError("Vui lòng chọn một chuyên khoa từ trang chủ.");
      setLoading(false);
    }
  }, [specialtyId]);

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
        if (!res.ok) throw new Error("Không thể tải lịch làm việc của bác sĩ.");
        const slotsData = await res.json();
        setTimeSlots(slotsData);
      } catch (err) {
        console.error("Lỗi khi fetch lịch làm việc:", err);
        setTimeSlots({});
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchTimeSlots();
  }, [selectedDoctorId]);

  const handleBooking = () => {
    if (!selectedDoctorId || !selectedDate || !selectedTime) {
      alert("Vui lòng chọn đầy đủ thông tin: Bác sĩ, Ngày, và Giờ khám.");
      return;
    }
    const doctor = doctors.find((d) => d.id === selectedDoctorId);
    if (!doctor || !specialty) {
      alert("Không tìm thấy thông tin bác sĩ hoặc chuyên khoa.");
      return;
    }
    const dateStr = selectedDate.toISOString().split("T")[0];
    const bookingData = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: specialty.name,
      date: dateStr,
      time: { start: selectedTime.start, end: selectedTime.end },
    };
    const encoded = encodeURIComponent(JSON.stringify(bookingData));
    router.push(`/checkout?data=${encoded}`);
  };

  const availableDates = Object.keys(timeSlots).filter(date => timeSlots[date].length > 0);
  const availableDateObjects = availableDates.map(d => new Date(d));
  const selectedDateKey = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    : null;

  if (loading) return <div className="flex h-screen items-center justify-center text-blue-600">Đang tải thông tin...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-600">{error}</div>;
  if (!specialty) return <div className="flex h-screen items-center justify-center text-gray-500">Không tìm thấy chuyên khoa.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Đặt lịch khám Chuyên khoa</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mt-2">{specialty.name}</h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Danh sách bác sĩ */}
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
                        ? "bg-blue-50 border-blue-500 scale-105 shadow-md"
                        : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
                    }`}
                  >
                    <img src={doctor.img || "/default-avatar.png"} alt={doctor.name} className="w-16 h-16 rounded-full object-cover" />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{doctor.name}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{doctor.introduction || "Chưa có giới thiệu."}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDoctorForDetails(doctor);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold ml-2 py-1 px-3 rounded-md hover:bg-blue-100"
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

          {/* Ngày và giờ */}
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
                  includeDates={availableDateObjects.map(d => new Date(d.valueOf() + d.getTimezoneOffset() * 60 * 1000))}
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
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 hover:bg-blue-100 text-gray-700"
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
