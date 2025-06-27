'use client';

import React, { useEffect, useState } from 'react';
import Sidebardoctor from '@/components/layout/Sidebardoctor';

interface Slot {
  id: number;
  slot_date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

interface AppointmentDetail {
  id: number;
  patient_name: string;
  email: string;
  phone: string;
  note: string;
  status: string;
  doctor_confirmation: string;
  payment_status: string;
}

interface DoctorInfo {
  account_status: string;
}

export default function DoctorSchedulePage() {
  const doctorId = 1;
  const [doctorStatus, setDoctorStatus] = useState<'loading' | 'active' | 'pending' | 'error'>('loading');
  const [doctorSlots, setDoctorSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [appointmentDetail, setAppointmentDetail] = useState<AppointmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/doctors/${doctorId}`)
      .then((res) => res.json())
      .then((data: DoctorInfo) => {
        setDoctorStatus(data.account_status === 'active' ? 'active' : 'pending');
      })
      .catch((err) => {
        console.error('❌ Lỗi khi lấy trạng thái bác sĩ:', err);
        setDoctorStatus('error');
      });
  }, []);

  useEffect(() => {
    if (doctorStatus !== 'active') return;

    fetch(`http://localhost:5000/api/doctors/${doctorId}/time-slots`)
      .then((res) => res.json())
      .then((data) => {
        const merged: Slot[] = [];
        Object.entries(data).forEach(([date, slots]: any) => {
          slots.forEach((slot: any) => {
            merged.push({
              id: slot.id,
              slot_date: date,
              start_time: slot.start,
              end_time: slot.end,
              is_booked: slot.is_booked,
            });
          });
        });
        setDoctorSlots(merged);
        setLoading(false);
      });
  }, [doctorStatus]);

  const handleViewDetail = (slot: Slot) => {
    setSelectedSlot(slot);
    if (slot.is_booked) {
      fetch(`http://localhost:5000/api/appointments/slot/${slot.id}`)
        .then((res) => res.json())
        .then((data) => setAppointmentDetail(data))
        .catch((err) => {
          console.error("❌ Lỗi lấy chi tiết lịch hẹn:", err);
          setAppointmentDetail(null);
        });
    } else {
      setAppointmentDetail(null);
    }
  };

  const handleConfirm = async () => {
    if (!appointmentDetail) return;
    setConfirming(true);
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${appointmentDetail.id}/confirm`, {
        method: 'PUT',
      });
      if (res.ok) {
        setAppointmentDetail({
          ...appointmentDetail,
          doctor_confirmation: 'Đã xác nhận',
        });
        alert('✅ Đã xác nhận lịch hẹn!');
      } else {
        alert('❌ Không thể xác nhận!');
      }
    } catch (error) {
      console.error('Lỗi xác nhận:', error);
      alert('❌ Có lỗi xảy ra!');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      <Sidebardoctor />
      <main className="flex-1 bg-gray-50 p-6">
        {doctorStatus === 'loading' && (
          <p className="text-gray-600 text-center mt-20">⏳ Đang tải...</p>
        )}

        {doctorStatus === 'error' && (
          <div className="text-center mt-20 text-red-600 text-lg font-semibold">
            ❌ Không thể tải trạng thái bác sĩ. Vui lòng thử lại sau.
          </div>
        )}

        {doctorStatus === 'pending' && (
          <div className="flex items-center justify-center mt-20 text-center">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded shadow max-w-lg">
              <h2 className="text-xl font-semibold mb-2">⏳ Tài khoản đang chờ xét duyệt</h2>
              <p>Vui lòng chờ quản trị viên phê duyệt tài khoản của bạn để sử dụng các chức năng quản lý.</p>
            </div>
          </div>
        )}

        {doctorStatus === 'active' && (
          <>
            <h1 className="text-2xl font-bold text-blue-700 mb-6">📅 Lịch khám của tôi</h1>
            {loading ? (
              <p>Đang tải lịch khám...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctorSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="bg-white border border-gray-200 rounded-md p-4 shadow hover:shadow-md transition"
                  >
                    <p className="text-sm text-gray-600 mb-1">🗓 {slot.slot_date}</p>
                    <p className="text-lg font-semibold text-blue-800">
                      ⏰ {slot.start_time} - {slot.end_time}
                    </p>
                    <p className={`mt-2 text-sm ${slot.is_booked ? 'text-green-600' : 'text-gray-400'}`}>
                      {slot.is_booked ? 'Đã có bệnh nhân' : 'Trống'}
                    </p>
                    <button
                      onClick={() => handleViewDetail(slot)}
                      className="mt-3 text-sm bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedSlot && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded shadow max-w-md w-full relative">
                  <h2 className="text-xl font-bold mb-4">📝 Chi tiết lịch khám</h2>
                  <p><strong>Ngày:</strong> {selectedSlot.slot_date}</p>
                  <p><strong>Giờ:</strong> {selectedSlot.start_time} - {selectedSlot.end_time}</p>
                  <p><strong>Trạng thái:</strong> {selectedSlot.is_booked ? 'Đã đặt' : 'Chưa có lịch'}</p>

                  {selectedSlot.is_booked && appointmentDetail && (
                    <div className="mt-4 border-t pt-4 space-y-1">
                      <p><strong>Bệnh nhân:</strong> {appointmentDetail.patient_name}</p>
                      <p><strong>Email:</strong> {appointmentDetail.email}</p>
                      <p><strong>SĐT:</strong> {appointmentDetail.phone}</p>
                      <p><strong>Ghi chú:</strong> {appointmentDetail.note || 'Không có'}</p>
                      <p><strong>Thanh toán:</strong> {appointmentDetail.payment_status}</p>
                      <p><strong>Xác nhận:</strong> {appointmentDetail.doctor_confirmation}</p>

                      {appointmentDetail.doctor_confirmation === 'Chưa xác nhận' && (
                        <button
                          disabled={confirming}
                          onClick={handleConfirm}
                          className="mt-3 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                        >
                          {confirming ? 'Đang xác nhận...' : '✅ Xác nhận lịch khám'}
                        </button>
                      )}
                    </div>
                  )}

                  <div className="text-right mt-6">
                    <button
                      onClick={() => {
                        setSelectedSlot(null);
                        setAppointmentDetail(null);
                      }}
                      className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
