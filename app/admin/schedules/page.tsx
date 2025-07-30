"use client";
import { useEffect, useState } from "react";

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
    patientEmail: string;
    patientPhone: string;
    note: string;
    status: string;
  };
}

export default function AdminDoctorSchedulesPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<Record<string, TimeSlot[]>>({});
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [selectedDoctorObj, setSelectedDoctorObj] = useState<Doctor | null>(null);

  // Fetch danh sách bác sĩ
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      const res = await fetch("http://localhost:5000/api/doctors");
      const data = await res.json();
      setDoctors(data);
      setLoadingDoctors(false);
    };
    fetchDoctors();
  }, []);

  // Fetch lịch khám khi chọn bác sĩ
  useEffect(() => {
    if (!selectedDoctor) {
      setSelectedDoctorObj(null);
      return;
    }
    setLoadingSchedule(true);
    const doctor = doctors.find((d) => d.id === selectedDoctor) || null;
    setSelectedDoctorObj(doctor);
    fetch(`http://localhost:5000/api/doctors/${selectedDoctor}/time-slots`)
      .then((res) => res.json())
      .then((data) => {
        setSchedule(data);
        setLoadingSchedule(false);
      });
  }, [selectedDoctor, doctors]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-blue-700 flex items-center gap-3">
        <span className="inline-block w-2 h-8 bg-blue-500 rounded-full mr-2"></span>
        Lịch khám của bác sĩ
      </h1>
      <div className="mb-8 flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <label className="block mb-2 font-medium text-gray-700">Chọn bác sĩ:</label>
          {loadingDoctors ? (
            <div>Đang tải danh sách bác sĩ...</div>
          ) : (
            <select
              className="border border-blue-300 rounded px-3 py-2 w-full max-w-md focus:ring-2 focus:ring-blue-400"
              value={selectedDoctor ?? ""}
              onChange={(e) => setSelectedDoctor(Number(e.target.value))}
            >
              <option value="">-- Chọn bác sĩ --</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} {doc.specialty_name ? `- ${doc.specialty_name}` : ""}
                </option>
              ))}
            </select>
          )}
        </div>
        {selectedDoctorObj && (
          <div className="flex items-center gap-4 bg-white border border-blue-100 rounded-xl shadow p-4">
            <img
              src={
                selectedDoctorObj.img
                  ? selectedDoctorObj.img.startsWith('http') || selectedDoctorObj.img.startsWith('/uploads')
                    ? selectedDoctorObj.img.startsWith('http')
                      ? selectedDoctorObj.img
                      : `http://localhost:5000${selectedDoctorObj.img}`
                    : `http://localhost:5000/uploads/${selectedDoctorObj.img}`
                  : "https://via.placeholder.com/80x80?text=Dr"
              }
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-200 shadow"
            />
            <div>
              <div className="font-bold text-lg text-blue-800">{selectedDoctorObj.name}</div>
              <div className="text-sm text-blue-500 mt-1">{selectedDoctorObj.specialty_name || "Bác sĩ chuyên khoa"}</div>
            </div>
          </div>
        )}
      </div>
      {/* Hiển thị illustration khi chưa chọn bác sĩ */}
      {!selectedDoctor && (
        <div className="flex flex-col items-center justify-center h-80 text-gray-400 animate-fade-in">
          <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
          </svg>
          <div className="text-lg font-medium">Vui lòng chọn bác sĩ để xem lịch khám</div>
          <div className="text-sm mt-2">Chọn một bác sĩ từ danh sách để xem chi tiết lịch khám của họ.</div>
        </div>
      )}
      {/* Hiển thị lịch khám nếu đã chọn bác sĩ */}
      {loadingSchedule && selectedDoctor && <div>Đang tải lịch khám...</div>}
      {!loadingSchedule && selectedDoctor && (
        <div>
          {Object.keys(schedule).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-fade-in">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2" />
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
              </svg>
              <div className="text-lg">Không có lịch khám nào cho bác sĩ này.</div>
            </div>
          ) : (
            Object.entries(schedule).map(([date, slots]) => (
              <div key={date} className="mb-8">
                <h2 className="font-semibold text-lg mb-3 text-blue-600">Ngày: {date}</h2>
                <div className="overflow-x-auto rounded-xl shadow border border-blue-100 bg-white">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-blue-50 text-blue-700">
                        <th className="p-3 border-b">Giờ</th>
                        <th className="p-3 border-b">Trạng thái</th>
                        <th className="p-3 border-b">Bệnh nhân</th>
                        <th className="p-3 border-b">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slots.map((slot) => (
                        <tr key={slot.id} className="hover:bg-blue-50 transition">
                          <td className="p-3 border-b font-mono text-base">{slot.start} - {slot.end}</td>
                          <td className="p-3 border-b">
                            {slot.is_booked ? (
                              <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
                                {slot.booking?.status || "Đã đặt"}
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-1 rounded bg-gray-100 text-gray-500 text-xs font-medium">Chưa đặt</span>
                            )}
                          </td>
                          <td className="p-3 border-b">{slot.booking?.patientName || <span className="text-gray-400">-</span>}</td>
                          <td className="p-3 border-b">{slot.booking?.note || <span className="text-gray-400">-</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
