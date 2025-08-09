"use client";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Định nghĩa kiểu dữ liệu (interface)
interface Doctor {
  id: number;
  name: string;
  img?: string;
  specialty_name?: string;
}

interface TimeSlot {
  id: number;
  start: string;
  end: string;
  is_active: boolean;
  is_booked: boolean;
  booking: null | {
    id: number;
    patientName: string;
    patientEmail: string | null;
    patientPhone: string | null;
    note: string;
    status: string;
  };
}

// Hàm tiện ích để format thời gian
const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
};

export default function AdminDoctorSchedulesPage() {
  // Các state quản lý trạng thái
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<Record<string, TimeSlot[]>>({});
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [selectedDoctorObj, setSelectedDoctorObj] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Hook để fetch danh sách bác sĩ
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const res = await fetch(`${API_URL}/api/doctors`);
        const data = await res.json();
        setDoctors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi khi fetch danh sách bác sĩ:", error);
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  // Hook để fetch lịch khám
  useEffect(() => {
    if (!selectedDoctor) {
      setSchedule({});
      setSelectedDoctorObj(null);
      return;
    }
    setLoadingSchedule(true);
    const doctor = doctors.find((d) => d.id === selectedDoctor) || null;
    setSelectedDoctorObj(doctor);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    fetch(`${API_URL}/api/doctors/${selectedDoctor}/schedule-by-date?date=${formattedDate}`)
      .then((res) => {
        if (!res.ok) throw new Error('Yêu cầu API thất bại');
        return res.json();
      })
      .then((data) => {
        setSchedule(typeof data === 'object' && data !== null ? data : {});
      })
      .catch((error) => {
        console.error("Lỗi khi fetch lịch khám:", error);
        setSchedule({});
      })
      .finally(() => {
        setLoadingSchedule(false);
      });
  }, [selectedDoctor, selectedDate, doctors]);

  // Hàm render nội dung chính của khu vực lịch khám
  const renderScheduleContent = () => {
    // 1. Nếu chưa chọn bác sĩ
    if (!selectedDoctor) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p className="text-lg">Vui lòng chọn một bác sĩ để xem lịch làm việc.</p>
        </div>
      );
    }
    // 2. Nếu đang tải
    if (loadingSchedule) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Đang tải lịch khám...
        </div>
      );
    }
    // 3. Nếu không có lịch hoặc lịch rỗng
    const hasNoSchedule = Object.keys(schedule).length === 0 || Object.values(schedule).every(arr => arr.length === 0);
    if (hasNoSchedule) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p className="text-lg">Bác sĩ không có lịch làm việc vào ngày {selectedDate.toLocaleDateString('vi-VN')}.</p>
        </div>
      );
    }
    // 4. Nếu có lịch, hiển thị bảng
    return Object.entries(schedule).map(([date, slots]) => (
      Array.isArray(slots) && slots.length > 0 && (
        <div key={date}>
          <h2 className="font-semibold text-xl mb-4 text-gray-800">
            Lịch làm việc ngày: {new Date(date + 'T00:00:00').toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                  <th className="p-3 text-left">Giờ</th>
                  <th className="p-3 text-left">Trạng thái</th>
                  <th className="p-3 text-left">Bệnh nhân</th>
                  <th className="p-3 text-left">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {slots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-gray-50 border-b">
                    <td className="p-3 font-mono">{formatTime(slot.start)} - {formatTime(slot.end)}</td>
                    <td className="p-3">
                      {slot.is_booked ? (
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            slot.booking?.status === 'Đã xác nhận' ? 'bg-blue-100 text-blue-800' :
                            slot.booking?.status === 'Đã khám xong' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                          {slot.booking?.status || "Đã đặt"}
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-medium">Còn trống</span>
                      )}
                    </td>
                    <td className="p-3 font-medium">{slot.booking?.patientName || <span className="text-gray-400">-</span>}</td>
                    <td className="p-3 text-sm">{slot.booking?.note || <span className="text-gray-400">-</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    ));
  };


  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-blue-700">Lịch làm việc của Bác sĩ</h1>
      
      {/* Bộ lọc */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-end bg-white p-4 rounded-lg shadow-sm border">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Chọn bác sĩ:</label>
          <select
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDoctor ?? ""}
            onChange={(e) => setSelectedDoctor(Number(e.target.value))}
            disabled={loadingDoctors}
          >
            <option value="">-- {loadingDoctors ? "Đang tải..." : "Chọn bác sĩ"} --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} {doc.specialty_name ? `- ${doc.specialty_name}` : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
            <label className="block mb-2 font-medium text-gray-700">Chọn ngày xem:</label>
            <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => {
                    if (date) {
                        setSelectedDate(date);
                    }
                }}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                dateFormat="dd/MM/yyyy"
            />
        </div>
      </div>
      
      {/* Thông tin bác sĩ */}
      {selectedDoctorObj && (
        <div className="flex items-center gap-4 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <img
            src={
              selectedDoctorObj.img
                ? selectedDoctorObj.img.startsWith('http')
                  ? selectedDoctorObj.img
                  : `${API_URL}${selectedDoctorObj.img}`
                : "https://via.placeholder.com/80x80?text=Dr"
            }
            alt={`Avatar của ${selectedDoctorObj.name}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-300"
          />
          <div>
            <div className="font-bold text-lg text-blue-800">{selectedDoctorObj.name}</div>
            <div className="text-sm text-blue-600 mt-1">{selectedDoctorObj.specialty_name || "Bác sĩ chuyên khoa"}</div>
          </div>
        </div>
      )}
      
      {/* Khu vực hiển thị bảng lịch khám (đã được cấu trúc lại) */}
      <div className="bg-white p-4 rounded-lg shadow-sm border min-h-[300px]">
        {renderScheduleContent()}
      </div>
    </div>
  );
}