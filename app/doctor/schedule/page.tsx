"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Calendar, Clock, User, X, Loader2, Search, AlertCircle, Check, Trash2 } from 'lucide-react';
import Sidebardoctor from "@/components/layout/Sidebardoctor";

// ====================================================================
// INTERFACES (Định nghĩa cấu trúc dữ liệu)
// ====================================================================
interface BookingDetail {
  id: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  note: string;
  status: string;
  paymentStatus: string;
}

interface Slot {
  id: number;
  date: string;
  start: string;
  end: string;
  is_booked: boolean;
  booking: BookingDetail | null;
}

interface GroupedSlotsApiResponse {
  [date: string]: Omit<Slot, 'date'>[];
}

// ====================================================================
// COMPONENT CHÍNH CỦA TRANG
// ====================================================================
export default function DoctorSchedulePage() {
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [allSlots, setAllSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Lấy doctorId từ localStorage
  useEffect(() => {
    const rawData = localStorage.getItem('user');
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        if (parsed?.id && parsed?.role_id === 3) {
          setDoctorId(parsed.id);
        } else {
          setError("Dữ liệu đăng nhập không hợp lệ hoặc không phải tài khoản bác sĩ.");
          setLoading(false);
        }
      } catch (err) {
        setError("Lỗi đọc dữ liệu người dùng.");
        setLoading(false);
      }
    } else {
        setError("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
        setLoading(false);
    }
  }, []);

  // 2. Hàm gọi API để lấy lịch
  const fetchDoctorSlots = useCallback(() => {
    if (!doctorId) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:5000/api/doctors/${doctorId}/time-slots`)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải lịch hẹn từ máy chủ.');
        return res.json();
      })
      .then((data: GroupedSlotsApiResponse) => {
        const flattenedSlots = Object.entries(data).flatMap(([date, slotsOnDate]) =>
          slotsOnDate.map(slot => ({ ...slot, date }))
        );
        setAllSlots(flattenedSlots);
      })
      .catch((err: any) => {
        console.error("Lỗi khi lấy lịch khám:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [doctorId]);

  // 3. Tự động gọi API khi có doctorId
  useEffect(() => {
    if (doctorId) {
      fetchDoctorSlots();
    }
  }, [doctorId, fetchDoctorSlots]);

  // 4. Hàm xử lý khi xem chi tiết
  const handleViewDetail = (slot: Slot) => {
    if (slot.is_booked) {
      setSelectedSlot(slot);
    }
  };

  // 5. Hàm xử lý hành động (Xác nhận / Hủy) - ĐÃ SỬA LỖI 401
  const handleAppointmentAction = async (action: 'confirm' | 'reject') => {
    const appointmentId = selectedSlot?.booking?.id;
    // Lấy token từ localStorage
    const token = localStorage.getItem('doctorToken'); // Hoặc tên key bạn dùng để lưu token

    // Kiểm tra nếu không có appointmentId hoặc đang gửi hoặc không có token
    if (!appointmentId || submitting || !token) {
      if (!token) {
        alert("Lỗi xác thực. Vui lòng đăng nhập lại.");
      }
      return;
    }
    
    setSubmitting(true);
    try {
      // Gọi API với header Authorization
      const res = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/${action}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // <--- SỬA LỖI Ở ĐÂY
        },
      });

      if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || `Thao tác thất bại.`);
      }
      
      // Tải lại dữ liệu mới nhất từ server
      fetchDoctorSlots();
      // Đóng popup
      setSelectedSlot(null);
      alert(`✅ Lịch đã được ${action === 'confirm' ? 'xác nhận' : 'hủy'} thành công!`);
    } catch (err: any) {
      alert(`❌ Lỗi: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // --- LOGIC LỌC VÀ HIỂN THỊ ---
  const filteredSlots = allSlots.filter(slot => {
    const status = slot.booking?.status || 'Trống';
    const patientName = slot.booking?.patientName || '';
    const matchesDate = filterDate ? slot.date === filterDate : true;
    const matchesSearch = searchTerm
      ? status.toLowerCase().includes(searchTerm.toLowerCase()) || patientName.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesDate && matchesSearch;
  });

  const pendingSlots = allSlots.filter(slot => slot.booking?.status === 'Chưa xác nhận');

  const groupedForRender = filteredSlots.reduce((acc: Record<string, Slot[]>, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  // --- RENDER COMPONENT ---
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebardoctor />
      <main className="flex-1 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Calendar className="text-blue-600"/> Quản lý Lịch khám
        </h1>
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row items-center gap-4">
            <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="w-full md:w-auto border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
            <div className="relative w-full md:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm theo trạng thái hoặc tên bệnh nhân..." className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
            </div>
        </div>
        {error && ( <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-center gap-3"> <AlertCircle /> {error} </div> )}
        {!loading && pendingSlots.length > 0 && ( <div className="mb-8 p-4 bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-lg"> <h2 className="text-xl font-bold text-yellow-800 mb-3">⏳ {pendingSlots.length} Lịch chờ xác nhận</h2> <div className="space-y-2 max-h-48 overflow-y-auto pr-2"> {pendingSlots.map(slot => ( <div key={slot.id} onClick={() => handleViewDetail(slot)} className="p-3 bg-white rounded-md cursor-pointer hover:bg-yellow-100 flex justify-between items-center shadow-sm border border-gray-200"> <div> <span className="font-semibold text-gray-800">{slot.booking?.patientName}</span> <span className="text-sm text-gray-600 ml-2">({new Date(slot.date + 'T00:00:00').toLocaleDateString('vi-VN')} | {slot.start})</span> </div> <span className="font-semibold text-yellow-700">{slot.booking?.status}</span> </div> ))} </div> </div> )}
        {loading ? ( <div className="flex justify-center items-center py-10"><Loader2 className="w-8 h-8 animate-spin text-blue-600"/></div> ) : Object.keys(groupedForRender).length === 0 && !error ? ( <p className="text-center text-gray-500 mt-10">Không có lịch hẹn nào phù hợp.</p> ) : ( Object.entries(groupedForRender).map(([date, slots]) => ( <div key={date} className="mb-8"> <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2"><Calendar size={20}/> Ngày: {new Date(date + 'T00:00:00').toLocaleDateString('vi-VN')}</h2> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"> {slots.map(slot => { let borderClass = 'border-gray-200'; if(slot.booking?.status === 'Chờ xác nhận') borderClass = 'border-yellow-400 bg-yellow-50'; else if(slot.booking?.status === 'Đã xác nhận') borderClass = 'border-green-400 bg-green-50'; else if(slot.booking?.status === 'Từ chối') borderClass = 'border-red-300 bg-red-50 opacity-70'; return ( <div key={slot.id} onClick={() => handleViewDetail(slot)} className={`p-4 rounded-lg shadow-sm border-2 transition-all ${slot.is_booked ? 'cursor-pointer hover:shadow-md hover:-translate-y-1' : 'cursor-default bg-gray-100/50'} ${borderClass}`}> <div className="flex justify-between items-center font-semibold text-lg"> <span className="flex items-center gap-2 text-gray-800"><Clock size={18}/> {slot.start} - {slot.end}</span> </div> <div className="mt-2 h-10 flex flex-col justify-end"> {slot.is_booked && slot.booking ? ( <> <p className="text-gray-700 flex items-center gap-2 truncate font-medium"><User size={16}/>{slot.booking.patientName}</p> <span className={`text-xs font-bold mt-1 ${slot.booking.status === 'Chờ xác nhận' ? 'text-yellow-600' : ''} ${slot.booking.status === 'Đã xác nhận' ? 'text-green-600' : ''} ${slot.booking.status === 'Từ chối' ? 'text-red-600' : ''}`}> {slot.booking.status} </span> </> ) : ( <span className="text-sm text-gray-400">Trống</span> )} </div> </div> ); })} </div> </div> )) )}
        
        {/* === POPUP CHI TIẾT VỚI ĐẦY ĐỦ NÚT BẤM === */}
        {selectedSlot && selectedSlot.booking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={() => setSelectedSlot(null)}>
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg text-gray-800" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-2xl font-bold text-blue-700">Chi tiết lịch khám</h2>
                    <button onClick={() => setSelectedSlot(null)} className="text-gray-400 hover:text-gray-600" title="Đóng"><X size={24}/></button>
                </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-base">
                <p><strong className="text-gray-600">Bệnh nhân:</strong> {selectedSlot.booking.patientName}</p>
                <p><strong className="text-gray-600">Trạng thái:</strong> <span className="font-bold">{selectedSlot.booking.status}</span></p>
                <p><strong className="text-gray-600">Ngày:</strong> {new Date(selectedSlot.date + 'T00:00:00').toLocaleDateString('vi-VN')}</p>
                <p><strong className="text-gray-600">Giờ:</strong> {selectedSlot.start} - {selectedSlot.end}</p>
                <p className="sm:col-span-2"><strong className="text-gray-600">Email:</strong> {selectedSlot.booking.patientEmail}</p>
                <p className="sm:col-span-2"><strong className="text-gray-600">SĐT:</strong> {selectedSlot.booking.patientPhone}</p>
                <p className="sm:col-span-2"><strong className="text-gray-600">Thanh toán:</strong> {selectedSlot.booking.paymentStatus}</p>
                <p className="sm:col-span-2"><strong className="text-gray-600">Ghi chú:</strong> {selectedSlot.booking.note || 'Không có'}</p>
              </div>

              {/* PHẦN NÚT BẤM (CHỈ HIỆN KHI CẦN) */}
              <div className="mt-6 pt-4 border-t">
                  {selectedSlot.booking.status === 'Chưa xác nhận' && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button onClick={() => handleAppointmentAction('confirm')} disabled={submitting} className="w-full flex justify-center items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:bg-gray-400 disabled:cursor-wait">
                        {submitting ? <Loader2 className="animate-spin"/> : <Check/>} Xác nhận lịch
                      </button>
                      <button onClick={() => handleAppointmentAction('reject')} disabled={submitting} className="w-full flex justify-center items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-all disabled:bg-gray-400 disabled:cursor-wait">
                        {submitting ? <Loader2 className="animate-spin"/> : <Trash2/>} Hủy lịch
                      </button>
                    </div>
                  )}
                  {selectedSlot.booking.status === 'Đã xác nhận' && <p className="text-center text-green-600 font-semibold">✔️ Lịch hẹn này đã được bạn xác nhận.</p>}
                  {selectedSlot.booking.status === 'Từ chối' && <p className="text-center text-red-600 font-semibold">❌ Lịch hẹn này đã bị bạn hủy.</p>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}