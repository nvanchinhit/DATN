"use client";

import React, { useEffect, useState } from "react";
import Sidebardoctor from "@/components/layout/Sidebardoctor";

interface Slot {
  id: number;
  slot_date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  status?: string;
}

interface AppointmentDetail {
  id: number;
  patient_name: string;
  email: string;
  phone: string;
  note: string;
  status: string;
  payment_status: string;
}

export default function DoctorSchedulePage() {
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [doctorSlots, setDoctorSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [appointmentDetail, setAppointmentDetail] = useState<AppointmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const rawData = localStorage.getItem('user');
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        setDoctorId(parsed.id);
      } catch (err) {
        console.error("Lỗi parse user:", err);
      }
    }
  }, []);

  const fetchDoctorSlots = () => {
    if (!doctorId) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/doctors/${doctorId}/time-slots`)
      .then((res) => res.json())
      .then((data) => {
        const merged: Slot[] = [];
        Object.entries(data).forEach(([date, slots]: any) => {
          slots.forEach((slot: any) => {
            let displayStatus = 'Trống';
            if (slot.is_booked) {
              const statusMap: Record<string, string> = {
                pending: 'Chờ xác nhận',
                confirmed: 'Đã xác nhận',
                rejected: 'Từ chối',
                'Chưa xác nhận': 'Chờ xác nhận'
                
              };
              console.log("SLOT:", slot);


             const bookingStatus = slot.booking?.status;
displayStatus = statusMap[bookingStatus] || bookingStatus || 'Chờ xác nhận';

            }
            merged.push({
              id: slot.id,
              slot_date: date,
              start_time: slot.start,
              end_time: slot.end,
              is_booked: slot.is_booked,
                status: displayStatus,
            });
          });
        });
        setDoctorSlots(merged);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy lịch khám:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
      fetchDoctorSlots();
  }, [doctorId]);

  const handleViewDetail = (slot: Slot) => {
    setSelectedSlot(slot);
    if (slot.is_booked) {
      fetch(`http://localhost:5000/api/appointments/slot/${slot.id}`)
        .then(res => res.json())
        .then(data => {
          const statusMap: Record<string, string> = {
            pending: 'Chờ xác nhận',
            confirmed: 'Đã xác nhận',
            rejected: 'Từ chối',
            'Chưa xác nhận': 'Chờ xác nhận'
          };
          data.status = statusMap[data.status] || data.status;
          setAppointmentDetail(data);
        })
        .catch(() => setAppointmentDetail(null));
    } else {
      setAppointmentDetail(null);
    }
  };

  const handleConfirm = async () => {
    if (!appointmentDetail || !selectedSlot) return;
    setConfirming(true);
    try {
      await fetch(`http://localhost:5000/api/appointments/${appointmentDetail.id}/confirm`, { method: 'PUT' });
      setAppointmentDetail({ ...appointmentDetail, status: 'Đã xác nhận' });
      setDoctorSlots(prev =>
        prev.map(slot =>
          slot.id === selectedSlot.id ? { ...slot, status: 'Đã xác nhận', is_booked: true } : slot
        )
      );
      setTimeout(() => fetchDoctorSlots(), 500);
      alert('✅ Lịch đã được xác nhận!');
    } catch {
      alert('❌ Xác nhận thất bại!');
    } finally {
      setConfirming(false);
    }
  };

  const handleReject = async () => {
    if (!appointmentDetail || !selectedSlot) return;
    try {
     await fetch(`http://localhost:5000/api/appointments/${appointmentDetail.id}/confirm`, { method: 'PUT' });
      setAppointmentDetail({ ...appointmentDetail, status: 'Từ chối' });
      setDoctorSlots(prev =>
        prev.map(slot =>
          slot.id === selectedSlot.id ? { ...slot, status: 'Từ chối', is_booked: true } : slot
        )
      );
      setTimeout(() => fetchDoctorSlots(), 500);
      alert('❌ Lịch đã bị từ chối.');
    } catch {
      alert('❌ Từ chối thất bại!');
    }
  };

  const filteredSlots = doctorSlots.filter(slot => {
    const matchesDate = filterDate ? slot.slot_date === filterDate : true;
    const matchesSearch = search ? slot.status?.toLowerCase().includes(search.toLowerCase()) : true;
    return matchesDate && matchesSearch;
  });

  const pendingSlots = doctorSlots.filter(slot => slot.status === 'Chờ xác nhận');


  const groupedByDate: Record<string, Slot[]> = {};
  filteredSlots.forEach(slot => {
    if (!groupedByDate[slot.slot_date]) groupedByDate[slot.slot_date] = [];
    groupedByDate[slot.slot_date].push(slot);
  });

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebardoctor />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">📅 Lịch khám bác sĩ</h1>

        <div className="flex gap-4 mb-6">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border rounded px-4 py-2 w-1/3"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo trạng thái..."
            className="border rounded px-4 py-2 w-2/3"
          />
        </div>

        {pendingSlots.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-red-600 mb-4">⏳ Đơn chờ xác nhận</h2>
            <div className="space-y-2">
              {pendingSlots.map(slot => (
                <div
                  key={slot.id}
                  onClick={() => handleViewDetail(slot)}
                  className="p-3 border border-yellow-500 bg-yellow-50 rounded cursor-pointer hover:bg-yellow-100 flex justify-between"
                >
                  <span>📆 {slot.slot_date} ⏰ {slot.start_time} - {slot.end_time}</span>
                  <span className="font-semibold text-yellow-700">{slot.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <p>⏳ Đang tải lịch...</p>
        ) : (
          Object.keys(groupedByDate).map(date => (
            <div key={date} className="mb-8">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">📆 Ngày: {date}</h2>
              <div className="space-y-3">
                {groupedByDate[date].map(slot => (
                  <div
                    key={slot.id}
                    onClick={() => handleViewDetail(slot)}
                    className={`p-4 rounded-lg shadow-sm cursor-pointer border hover:shadow-md transition flex justify-between items-center
                      ${slot.status === 'Chờ xác nhận' ? 'bg-yellow-100 border-yellow-500' :
                        slot.status === 'Đã xác nhận' ? 'bg-green-100 border-green-500' :
                        slot.status === 'Từ chối' ? 'bg-red-100 border-red-500' :
                        'bg-white border-gray-300'}`}
                  >
                    <div className="text-blue-800 font-medium text-lg">
                      ⏰ {slot.start_time} - {slot.end_time}
                    </div>
                    <div className={`text-sm font-semibold ${slot.status === 'Đã xác nhận' ? 'text-green-700' : slot.status === 'Từ chối' ? 'text-red-600' : 'text-black'}`}>
                      {slot.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {selectedSlot && appointmentDetail && (
           // Giao diện popup chi tiết mới
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-xl text-gray-900">
              <h2 className="text-2xl font-bold mb-4 text-blue-700 border-b pb-2">📝 Chi tiết lịch khám</h2>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-base">
                <p><span className="font-semibold text-black">📅 Ngày:</span> {selectedSlot.slot_date}</p>
                <p><span className="font-semibold text-black">⏰ Giờ:</span> {selectedSlot.start_time} - {selectedSlot.end_time}</p>
                <p><span className="font-semibold text-black">📌 Trạng thái:</span> {appointmentDetail.status}</p>
                <p><span className="font-semibold text-black">💵 Thanh toán:</span> {appointmentDetail.payment_status}</p>
              </div>

              <div className="border-t my-4" />
              <div className="space-y-1 text-base">
                <p><span className="font-semibold text-black">🙍‍♂️ Bệnh nhân:</span> {appointmentDetail.patient_name}</p>
                <p><span className="font-semibold text-black">📧 Email:</span> {appointmentDetail.email}</p>
                <p><span className="font-semibold text-black">📞 SĐT:</span> {appointmentDetail.phone}</p>
                <p><span className="font-semibold text-black">🗒️ Ghi chú:</span> {appointmentDetail.note || 'Không có'}</p>
              </div>

              {appointmentDetail.status === 'Chờ xác nhận' && (
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleConfirm}
                    disabled={confirming}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
                  >
                    ✅ Xác nhận
                  </button>
                  <button
                    onClick={handleReject}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
                  >
                    ❌ Từ chối
                  </button>
                </div>
              )}

              {appointmentDetail.status === 'Đã xác nhận' && (
                <p className="mt-4 text-green-600 font-semibold text-center">✔️ Lịch đã được xác nhận</p>
              )}

              {appointmentDetail.status === 'Từ chối' && (
                <p className="mt-4 text-red-600 font-semibold text-center">❌ Lịch đã bị từ chối</p>
              )}
                <button
                  onClick={() => {
                    setSelectedSlot(null);
                    setAppointmentDetail(null);
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Đóng
                </button>
              </div>
            </div>
         
        )}
      </main>
    </div>
  );
}
