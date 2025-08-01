// app/doctor/schedule/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Sidebardoctor from "@/components/layout/Sidebardoctor";
import {
  Calendar,
  Clock,
  User,
  X,
  Loader2,
  Search,
  AlertCircle,
  Phone,
  Mail,
  FileText,
  Check,
  Activity,
  Stethoscope,
  Plus,
  Save,
  MapPin,
  Bell,
  Users,
  Award,
  TrendingUp,
  Filter,
  RefreshCw,
  ChevronRight,
  Heart,
  Star,
  PlayCircle // Icon cho "Đang khám"
} from "lucide-react";

interface BookingDetail {
  id: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  note: string;
  status: string;
  paymentStatus: string;
  doctorNote?: string;
  diagnosis?: string;
  followUpDate?: string;
  isExamined?: boolean;
  customer_id: number;
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
  [date: string]: Omit<Slot, "date">[];
}

export default function DoctorSchedulePage() {
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [allSlots, setAllSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [doctorNote, setDoctorNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [showMedicalForm, setShowMedicalForm] = useState(false); // State để điều khiển việc hiển thị form
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const rawData = localStorage.getItem("user");
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        if (parsed?.id && parsed?.role_id === 3) {
          setDoctorId(parsed.id);
        } else {
          setError("Tài khoản không hợp lệ hoặc không phải bác sĩ.");
          setLoading(false);
        }
      } catch {
        setError("Lỗi đọc dữ liệu đăng nhập.");
        setLoading(false);
      }
    } else {
      setError("Vui lòng đăng nhập.");
      setLoading(false);
    }
  }, []);

  const fetchDoctorSlots = useCallback(() => {
    if (!doctorId) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/doctors/${doctorId}/time-slots`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải lịch.");
        return res.json();
      })
      .then((data: GroupedSlotsApiResponse) => {
        const flattenedSlots = Object.entries(data).flatMap(([date, slots]) =>
          slots.map((slot) => ({ ...slot, date }))
        );
        setAllSlots(flattenedSlots);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [doctorId]);

  useEffect(() => {
    if (doctorId) fetchDoctorSlots();
  }, [doctorId]);


  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDoctorSlots();
    setTimeout(() => setRefreshing(false), 1000);
  }, [fetchDoctorSlots]);

  const handleViewDetail = (slot: Slot) => {
    if (slot.is_booked && slot.booking) {
      setSelectedSlot(slot);
      setShowMedicalForm(false); // Luôn ẩn form khi mở modal
      setDiagnosis(slot.booking.diagnosis || "");
      setDoctorNote(slot.booking.doctorNote || "");
      setFollowUpDate(slot.booking.followUpDate?.split('T')[0] || "");
    }
  };
  
  const handleCloseModal = () => {
      setSelectedSlot(null);
      setShowMedicalForm(false); // Reset state khi đóng
  }

  const handleStatusUpdate = async (newStatus: "Đang khám" | "Đã khám xong" | "Đã xác nhận") => {
    const appointmentId = selectedSlot?.booking?.id;
    const token = localStorage.getItem("doctorToken");
    if (!appointmentId || !token || submitting) return;
    
    setSubmitting(true);
    try {
        const res = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!res.ok) throw new Error( (await res.json()).message || "Lỗi cập nhật trạng thái.");
        
        setSelectedSlot(prev => prev && prev.booking ? { ...prev, booking: { ...prev.booking, status: newStatus } } : null);
        fetchDoctorSlots();
    } catch (err: any) {
        alert(`❌ ${err.message}`);
    } finally {
        setSubmitting(false);
    }
  };
  
  const handleAppointmentAction = async (action: "confirm" | "reject") => {
    const appointmentId = selectedSlot?.booking?.id;
    const token = localStorage.getItem("token");
    if (!appointmentId || submitting || !token) return;
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/${action}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`},
      });
      if (!res.ok) throw new Error(`Lỗi khi ${action === 'confirm' ? 'xác nhận' : 'từ chối'}.`);
      alert(`✅ Đã ${action === "confirm" ? "xác nhận" : "từ chối"} lịch hẹn.`);
      handleCloseModal();
      fetchDoctorSlots();
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleSaveDiagnosis = async () => {
    const appointmentId = selectedSlot?.booking?.id;
    const token = localStorage.getItem("token");
    if (!appointmentId || !token) return alert("Lỗi xác thực.");
    if (!diagnosis.trim()) return alert("Vui lòng nhập chẩn đoán.");
    
    // Debug: Log thông tin để kiểm tra
    console.log("🔍 [DEBUG] Appointment ID:", appointmentId);
    console.log("🔍 [DEBUG] Doctor ID:", doctorId);
    console.log("🔍 [DEBUG] Customer ID:", selectedSlot?.booking?.customer_id);
    console.log("🔍 [DEBUG] Selected Slot:", selectedSlot);
    
    setSubmitting(true);
    try {
      const requestBody = {
        appointment_id: appointmentId,
        doctor_id: doctorId,
        customer_id: selectedSlot?.booking?.customer_id,
        diagnosis,
        doctor_note: doctorNote,
        follow_up_date: followUpDate || null,
        treatment: null,
        notes: null
      };
      
      console.log("🔍 [DEBUG] Request body:", requestBody);
      
      const res = await fetch(`http://localhost:5000/api/medical-records/save-from-schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`},
        body: JSON.stringify(requestBody),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ [DEBUG] Response error:", errorData);
        throw new Error(errorData.error || "Không thể lưu bệnh án.");
      }

      const responseData = await res.json();
      console.log("✅ [DEBUG] Response success:", responseData);
      alert("✅ Lưu bệnh án thành công.");
      setShowMedicalForm(false); // Ẩn form sau khi lưu
      
      // Cập nhật thông tin trên modal
       setSelectedSlot(prev => {
            if (!prev || !prev.booking) return null;
            return {
                ...prev,
                booking: {
                    ...prev.booking,
                    isExamined: true,
                    diagnosis,
                    doctorNote,
                    followUpDate
                },
            };
        });
      fetchDoctorSlots(); // Tải lại danh sách
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSlots = allSlots.filter((slot) => {
    const status = slot.booking?.status || "Trống";
    const name = slot.booking?.patientName || "";
    const matchesDate = filterDate ? slot.date === filterDate : true;
    const matchesSearch = searchTerm
      ? status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesDate && matchesSearch;
  });

  const groupedSlots = filteredSlots.reduce((acc: Record<string, Slot[]>, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  const unconfirmedSlots = allSlots.filter(
    (slot) => slot.booking && slot.booking.status === "Chưa xác nhận"
  );
  
  const unexaminedSlots = allSlots.filter(
    (slot) => slot.booking?.status === "Đã khám xong" && !slot.booking?.isExamined
  );

  // Statistics
  const totalSlots = allSlots.length;
  const bookedSlots = allSlots.filter(slot => slot.is_booked).length;
  const examiningSlots = allSlots.filter(slot => slot.booking?.status === 'Đang khám').length;
  const confirmedSlots = allSlots.filter(slot => slot.booking?.status === "Đã xác nhận").length;
  const completedSlots = allSlots.filter(slot => slot.booking?.status === 'Đã khám xong').length;
  
  const getCardStyle = (slot: Slot) => {
    const status = slot.booking?.status;
    if (status === "Đã khám xong" || slot.booking?.isExamined) {
      return "border-blue-500 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 hover:from-blue-100 hover:to-indigo-100";
    }
    if (status === "Đang khám") {
      return "border-purple-500 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 hover:from-purple-100 hover:to-pink-100 animate-pulse";
    }
    if (status === "Đã xác nhận") {
      return "border-emerald-500 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 hover:from-emerald-100 hover:to-green-100";
    }
    if (status === "Chưa xác nhận") {
      return "border-amber-500 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 hover:from-amber-100 hover:to-yellow-100";
    }
    return "border-gray-400 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 hover:from-gray-100 hover:to-slate-100";
  };
  
  const getStatusBadgeStyle = (status?: string) => {
     switch(status) {
        case "Đã khám xong": return "bg-blue-200 text-blue-900 border border-blue-300";
        case "Đang khám": return "bg-purple-200 text-purple-900 border border-purple-300";
        case "Đã xác nhận": return "bg-emerald-200 text-emerald-900 border border-emerald-300";
        case "Chưa xác nhận": return "bg-amber-200 text-amber-900 border border-amber-300";
        default: return "bg-gray-200 text-gray-700 border border-gray-300";
     }
  }
  
  const getStatusIcon = (status?: string) => {
    switch(status) {
        case "Đã khám xong": return <Check className="w-3 h-3 mr-1" />;
        case "Đang khám": return <PlayCircle className="w-3 h-3 mr-1 animate-pulse" />;
        case "Đã xác nhận": return <Check className="w-3 h-3 mr-1" />;
        case "Chưa xác nhận": return <Clock className="w-3 h-3 mr-1" />;
        default: return null;
     }
  }


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebardoctor />
      
      <div className="flex-1 overflow-x-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-2xl sticky top-0 z-40">
            <div className="px-8 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-3 rounded-2xl"><Calendar className="w-8 h-8 text-white" /></div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">Quản lý lịch khám</h1>
                            <p className="text-blue-100 text-lg">{new Date().toLocaleDateString("vi-VN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={handleRefresh} disabled={refreshing} className="bg-white/20 p-3 rounded-2xl hover:bg-white/30 group">
                            <RefreshCw className={`w-6 h-6 text-white transition-transform ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-8">
          {/* Statistics Cards - 5 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {/* Tổng lịch hẹn */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all">
                <p className="text-sm font-medium text-blue-100">Tổng lịch hẹn</p>
                <div className="flex justify-between items-end">
                    <p className="text-4xl font-bold">{totalSlots}</p>
                    <div className="bg-white/20 p-3 rounded-xl"><Calendar className="w-7 h-7" /></div>
                </div>
            </div>
            {/* Đã đặt lịch */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all">
                <p className="text-sm font-medium text-green-100">Đã đặt lịch</p>
                <div className="flex justify-between items-end">
                    <p className="text-4xl font-bold">{bookedSlots}</p>
                    <div className="bg-white/20 p-3 rounded-xl"><Users className="w-7 h-7" /></div>
                </div>
            </div>
            {/* Đã xác nhận */}
            <div className="bg-gradient-to-br from-cyan-500 to-teal-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all">
                <p className="text-sm font-medium text-cyan-100">Đã xác nhận</p>
                <div className="flex justify-between items-end">
                    <p className="text-4xl font-bold">{confirmedSlots}</p>
                    <div className="bg-white/20 p-3 rounded-xl"><Award className="w-7 h-7" /></div>
                </div>
            </div>
            {/* Đang khám */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all">
                <p className="text-sm font-medium text-purple-100">Đang khám</p>
                <div className="flex justify-between items-end">
                    <p className="text-4xl font-bold">{examiningSlots}</p>
                    <div className="bg-white/20 p-3 rounded-xl"><PlayCircle className="w-7 h-7" /></div>
                </div>
            </div>
            {/* Đã khám xong */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all">
                <p className="text-sm font-medium text-orange-100">Đã khám xong</p>
                <div className="flex justify-between items-end">
                    <p className="text-4xl font-bold">{completedSlots}</p>
                    <div className="bg-white/20 p-3 rounded-xl"><Stethoscope className="w-7 h-7" /></div>
                </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border p-6 mb-8">
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg"><Calendar className="w-5 h-5 text-blue-600" /></div>
                <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" placeholder="Tìm kiếm bệnh nhân hoặc trạng thái..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* Priority Alerts */}
          {unconfirmedSlots.length > 0 && (
             <div className="mb-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl shadow-xl p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center mb-4"><AlertCircle className="w-6 h-6 mr-3"/> Cần xác nhận ngay ({unconfirmedSlots.length})</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {unconfirmedSlots.slice(0,4).map((slot) => (
                    <div key={slot.id} onClick={() => handleViewDetail(slot)} className="bg-white/20 p-4 rounded-xl hover:bg-white/30 cursor-pointer transition">
                        <p className="font-semibold truncate">{slot.booking?.patientName}</p>
                        <p className="text-sm">{new Date(slot.date).toLocaleDateString('vi-VN')} lúc {slot.start}</p>
                    </div>
                ))}
                </div>
            </div>
          )}
          {unexaminedSlots.length > 0 && (
             <div className="mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center mb-4"><FileText className="w-6 h-6 mr-3"/> Cần tạo bệnh án ({unexaminedSlots.length})</h2>
                 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 {unexaminedSlots.slice(0,4).map((slot) => (
                    <div key={slot.id} onClick={() => handleViewDetail(slot)} className="bg-white/20 p-4 rounded-xl hover:bg-white/30 cursor-pointer transition">
                        <p className="font-semibold truncate">{slot.booking?.patientName}</p>
                        <p className="text-sm">{new Date(slot.date).toLocaleDateString('vi-VN')} lúc {slot.start}</p>
                    </div>
                ))}
                </div>
            </div>
          )}

          {/* Main Schedule */}
          {loading && <div className="text-center p-12"><Loader2 className="animate-spin w-10 h-10 text-blue-600 mx-auto" /></div>}
          {error && <div className="text-center p-12 text-red-600"><AlertCircle className="w-10 h-10 mx-auto mb-2"/>{error}</div>}
          {!loading && !error && Object.keys(groupedSlots).length === 0 && (
            <div className="text-center p-12 text-gray-500"><Calendar className="w-16 h-16 mx-auto mb-4"/><h3>Không có lịch hẹn nào được tìm thấy.</h3></div>
          )}

          {!loading && !error && (
            <div className="space-y-8">
              {Object.entries(groupedSlots).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime()).map(([date, slots]) => (
                <div key={date} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-800 to-black px-8 py-5">
                    <h3 className="text-2xl font-bold text-white">{new Date(date).toLocaleDateString("vi-VN", { weekday: 'long', day: 'numeric', month: 'long'})}</h3>
                  </div>
                  <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {slots.sort((a, b) => a.start.localeCompare(b.start)).map((slot) => (
                      <div key={slot.id} onClick={() => handleViewDetail(slot)} className={`group p-5 rounded-xl shadow-lg border-l-4 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${getCardStyle(slot)}`}>
                          <div className="flex items-center justify-between mb-3">
                              <p className="font-bold text-lg">{slot.start} - {slot.end}</p>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getStatusBadgeStyle(slot.booking?.status)}`}>
                                {getStatusIcon(slot.booking?.status)}
                                {slot.booking?.status || "Trống"}
                              </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-gray-500"/></div>
                            <p className="font-semibold text-gray-800 truncate">{slot.booking?.patientName || "Chưa có bệnh nhân"}</p>
                          </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal for Appointment Detail */}
          {selectedSlot && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
              <div className="bg-white max-w-4xl w-full mx-auto rounded-3xl shadow-2xl animate-in zoom-in-95 max-h-[95vh] flex flex-col">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 flex justify-between items-center rounded-t-3xl flex-shrink-0">
                    <div>
                        <h2 className="text-3xl font-bold">Chi tiết lịch khám</h2>
                        <p className="text-blue-200">{new Date(selectedSlot.date).toLocaleDateString("vi-VN", { weekday: 'long', day: 'numeric', month: 'long'})} | {selectedSlot.start} - {selectedSlot.end}</p>
                    </div>
                    <button onClick={handleCloseModal} className="p-2 rounded-full hover:bg-white/20"><X className="w-6 h-6" /></button>
                </div>
                
                <div className="p-8 overflow-y-auto space-y-6">
                  {/* Patient Info */}
                  <div className="bg-gray-50 p-6 rounded-2xl border">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Thông tin bệnh nhân</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        <p><strong>Họ tên:</strong> {selectedSlot.booking?.patientName}</p>
                        <p><strong>Điện thoại:</strong> {selectedSlot.booking?.patientPhone}</p>
                        <p className="col-span-full"><strong>Email:</strong> {selectedSlot.booking?.patientEmail}</p>
                        <div className="col-span-full">
                           <p><strong>Ghi chú từ bệnh nhân:</strong> {selectedSlot.booking?.note || "Không có"}</p>
                        </div>
                    </div>
                  </div>
                  
                  {/* Status & Actions */}
                  <div className="bg-gray-50 p-6 rounded-2xl border">
                     <h3 className="text-xl font-bold text-gray-800 mb-4">Trạng thái & Hành động</h3>
                      <p className="mb-4">
                        Trạng thái hiện tại: <span className={`font-bold px-3 py-1 rounded-full text-sm ${getStatusBadgeStyle(selectedSlot.booking?.status)}`}>{selectedSlot.booking?.status}</span>
                      </p>

                      {/* Actions for "Chưa xác nhận" */}
                      {selectedSlot.booking?.status === "Chưa xác nhận" && (
                        <div className="flex gap-4">
                          <button onClick={() => handleAppointmentAction("confirm")} disabled={submitting} className="flex-1 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400">Xác nhận</button>
                          <button onClick={() => handleAppointmentAction("reject")} disabled={submitting} className="flex-1 bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400">Từ chối</button>
                        </div>
                      )}

                      {/* Action for "Đã xác nhận" */}
                      {selectedSlot.booking?.status === 'Đã xác nhận' && (
                         <button onClick={() => handleStatusUpdate('Đang khám')} disabled={submitting} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center space-x-2">
                           <PlayCircle className="w-5 h-5" /><span>Bắt đầu khám</span>
                         </button>
                      )}

                      {/* Action for "Đang khám" */}
                      {selectedSlot.booking?.status === 'Đang khám' && (
                         <button onClick={() => handleStatusUpdate('Đã khám xong')} disabled={submitting} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 flex items-center justify-center space-x-2">
                            <Check className="w-5 h-5" /><span>Hoàn tất khám</span>
                         </button>
                      )}
                  </div>

                  {/* Medical Record Section */}
                  {selectedSlot.booking?.status === "Đã khám xong" && (
                     <div className="bg-gray-50 p-6 rounded-2xl border">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Hồ sơ bệnh án</h3>
                        
                        {selectedSlot.booking.isExamined ? (
                            // Display completed record
                             <div className="space-y-4 text-gray-800">
                                <div><strong className="text-gray-500 block">Chẩn đoán:</strong><p className="font-semibold text-lg">{selectedSlot.booking.diagnosis}</p></div>
                                <div><strong className="text-gray-500 block">Ghi chú bác sĩ:</strong><p>{selectedSlot.booking.doctorNote || "Không có"}</p></div>
                                {selectedSlot.booking.followUpDate && (
                                     <div><strong className="text-gray-500 block">Lịch tái khám:</strong><p className="font-semibold">{new Date(selectedSlot.booking.followUpDate).toLocaleDateString('vi-VN')}</p></div>
                                )}
                            </div>
                        ) : showMedicalForm ? (
                            // Show form to create record
                            <div className="space-y-4">
                                <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-1">Chẩn đoán *</label>
                                   <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="VD: Viêm họng cấp" className="w-full p-3 border-gray-300 rounded-lg"/>
                                </div>
                                 <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú và hướng dẫn</label>
                                   <textarea value={doctorNote} onChange={(e) => setDoctorNote(e.target.value)} placeholder="Kê đơn thuốc, lời khuyên..." className="w-full p-3 border-gray-300 rounded-lg" rows={4}/>
                                </div>
                                 <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tái khám (nếu có)</label>
                                   <input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full p-3 border-gray-300 rounded-lg"/>
                                </div>
                                <div className="flex gap-4 pt-4 border-t">
                                    <button onClick={handleSaveDiagnosis} disabled={submitting || !diagnosis.trim()} className="flex-1 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400">Lưu bệnh án</button>
                                    <button onClick={() => setShowMedicalForm(false)} className="flex-1 bg-gray-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition">Hủy</button>
                                </div>
                            </div>
                        ) : (
                             // Button to show the form
                            <button onClick={() => setShowMedicalForm(true)} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center space-x-2">
                                <Plus className="w-5 h-5"/><span>Tạo bệnh án</span>
                            </button>
                        )}
                     </div>
                  )}

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}