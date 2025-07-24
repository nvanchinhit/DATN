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
  Star
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
  const [isExamined, setIsExamined] = useState(false);
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
  const [showMedicalForm, setShowMedicalForm] = useState(false);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Visual feedback
    fetchDoctorSlots();
    setRefreshing(false);
  };

  useEffect(() => {
    if (doctorId) fetchDoctorSlots();
  }, [doctorId, fetchDoctorSlots]);

  const handleViewDetail = (slot: Slot) => {
    if (slot.is_booked) {
      setSelectedSlot(slot);
      setDiagnosis(slot.booking?.diagnosis || "");
      setDoctorNote(slot.booking?.doctorNote || "");
      setFollowUpDate(slot.booking?.followUpDate || "");
    }
  };

  const handleAppointmentAction = async (action: "confirm" | "reject") => {
    const appointmentId = selectedSlot?.booking?.id;
    const token = localStorage.getItem("doctorToken");
    if (!appointmentId || submitting || !token) return alert("Lỗi xác thực.");
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/${action}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Lỗi xử lý thao tác.");
      fetchDoctorSlots();
      setSelectedSlot(null);
      alert(`✅ Đã ${action === "confirm" ? "xác nhận" : "từ chối"} lịch hẹn.`);
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDiagnosis = async () => {
    const appointmentId = selectedSlot?.booking?.id;
    const token = localStorage.getItem("doctorToken");
    if (!appointmentId || !token) return alert("Lỗi xác thực.");
    if (!diagnosis.trim()) return alert("Vui lòng nhập chẩn đoán.");
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/diagnosis`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          diagnosis,
          doctor_note: doctorNote,
          follow_up_date: followUpDate,
          is_examined: 1,
        }),
      });
      if (!res.ok) throw new Error("Không thể lưu bệnh án.");
      alert("✅ Lưu bệnh án thành công.");
      fetchDoctorSlots();
      setShowMedicalForm(false);
      setIsExamined(true); 
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
    (slot) => {
      const today = new Date();
      const slotDate = new Date(slot.date);
      return slot.booking?.status === "Đã xác nhận" && !slot.booking?.isExamined && slotDate < today;
    }
  );

  // Statistics
  const totalSlots = allSlots.length;
  const bookedSlots = allSlots.filter(slot => slot.is_booked).length;
  const confirmedSlots = allSlots.filter(slot => slot.booking?.status === "Đã xác nhận").length;
  const completedSlots = allSlots.filter(slot => slot.booking?.isExamined).length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Sidebar */}
      <Sidebardoctor />
      
      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-2xl sticky top-0 z-40">
          <div className="px-8 py-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-1">Quản lý lịch khám</h1>
                    <p className="text-blue-100 text-lg">
                      {new Date().toLocaleDateString("vi-VN", {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Header Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl hover:bg-white/30 transition-all duration-300 group"
                >
                  <RefreshCw className={`w-6 h-6 text-white transition-transform ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                </button>
                
                <div className="relative">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                    <Bell className="w-6 h-6 text-white" />
                    {(unconfirmedSlots.length + unexaminedSlots.length) > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                        {unconfirmedSlots.length + unexaminedSlots.length}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Enhanced Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300 border border-blue-400">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Tổng lịch hẹn</p>
                  <p className="text-3xl font-bold">{totalSlots}</p>
                  <p className="text-blue-200 text-xs mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Tháng này
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Calendar className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300 border border-green-400">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Đã đặt lịch</p>
                  <p className="text-3xl font-bold">{bookedSlots}</p>
                  <p className="text-green-200 text-xs mt-1 flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    Bệnh nhân
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300 border border-purple-400">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Đã xác nhận</p>
                  <p className="text-3xl font-bold">{confirmedSlots}</p>
                  <p className="text-purple-200 text-xs mt-1 flex items-center">
                    <Award className="w-3 h-3 mr-1" />
                    Lịch hẹn
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Award className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300 border border-orange-400">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">Đã khám</p>
                  <p className="text-3xl font-bold">{completedSlots}</p>
                  <p className="text-orange-200 text-xs mt-1 flex items-center">
                    <Heart className="w-3 h-3 mr-1" />
                    Hoàn thành
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Stethoscope className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Search and Filter */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-8">
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm bg-white/80"
                />
              </div>
              
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bệnh nhân hoặc trạng thái..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm bg-white/80"
                />
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-xl">
                <Filter className="w-4 h-4" />
                <span>Hiển thị: {filteredSlots.length} lịch hẹn</span>
              </div>
            </div>
          </div>

          {/* Priority Alerts - Enhanced */}
          {unconfirmedSlots.length > 0 && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-2xl shadow-xl overflow-hidden border border-orange-300">
                <div className="p-6 text-white">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl animate-pulse">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold flex items-center">
                        🚨 Cần xác nhận ngay
                        <span className="ml-3 bg-white/30 px-3 py-1 rounded-full text-sm font-medium">
                          {unconfirmedSlots.length} lịch hẹn
                        </span>
                      </h2>
                      <p className="text-orange-100">Bệnh nhân đang chờ phản hồi từ bạn</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unconfirmedSlots.slice(0, 6).map((slot) => (
                      <div
                        key={slot.id}
                        onClick={() => handleViewDetail(slot)}
                        className="bg-white/20 backdrop-blur-sm p-4 rounded-xl hover:bg-white/30 cursor-pointer transition-all duration-300 transform hover:scale-105 border border-white/20 group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <p className="text-sm font-medium">{slot.date}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <p className="text-sm">{slot.start} - {slot.end}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <p className="text-sm font-semibold truncate">{slot.booking?.patientName}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {unconfirmedSlots.length > 6 && (
                    <div className="mt-4 text-center">
                      <p className="text-orange-100">và {unconfirmedSlots.length - 6} lịch hẹn khác...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {unexaminedSlots.length > 0 && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden border border-red-400">
                <div className="p-6 text-white">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold flex items-center">
                        📋 Cần hoàn thành bệnh án
                        <span className="ml-3 bg-white/30 px-3 py-1 rounded-full text-sm font-medium">
                          {unexaminedSlots.length} bệnh nhân
                        </span>
                      </h2>
                      <p className="text-red-100">Lịch khám đã qua nhưng chưa có bệnh án</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unexaminedSlots.slice(0, 6).map((slot) => (
                      <div
                        key={slot.id}
                        onClick={() => handleViewDetail(slot)}
                        className="bg-white/20 backdrop-blur-sm p-4 rounded-xl hover:bg-white/30 cursor-pointer transition-all duration-300 transform hover:scale-105 border border-white/20 group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <p className="text-sm font-medium">{slot.date}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <p className="text-sm">{slot.start} - {slot.end}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <p className="text-sm font-semibold truncate">{slot.booking?.patientName}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Schedule - Enhanced */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
                <Loader2 className="animate-spin w-8 h-8 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 text-center font-medium">Đang tải lịch hẹn...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 shadow-xl">
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <p className="text-red-600 text-center font-bold text-lg">{error}</p>
                <button 
                  onClick={handleRefresh}
                  className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mx-auto block"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : Object.keys(groupedSlots).length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">Không có lịch hẹn</h3>
                <p className="text-gray-500">Chưa có lịch hẹn nào trong khoảng thời gian này</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedSlots)
                .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                .map(([date, slots]) => (
                <div key={date} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black px-8 py-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white flex items-center">
                        <div className="bg-white/20 p-2 rounded-lg mr-3">
                          <Calendar className="w-6 h-6" />
                        </div>
                        {new Date(date).toLocaleDateString("vi-VN", {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                      <div className="text-white/70 text-sm">
                        {slots.length} lịch hẹn
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {slots
                        .sort((a, b) => a.start.localeCompare(b.start))
                        .map((slot) => (
                        <div
                          key={slot.id}
                          onClick={() => handleViewDetail(slot)}
                          className={`group p-6 rounded-xl shadow-lg hover:shadow-2xl cursor-pointer border-l-4 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 ${
                            slot.booking?.status === "Đã xác nhận"
                              ? "border-emerald-500 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 hover:from-emerald-100 hover:to-green-100"
                              : slot.booking?.status === "Chưa xác nhận"
                              ? "border-amber-500 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 hover:from-amber-100 hover:to-yellow-100"
                              : slot.booking?.isExamined
                              ? "border-blue-500 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 hover:from-blue-100 hover:to-indigo-100"
                              : "border-gray-400 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 hover:from-gray-100 hover:to-slate-100"
                          }`}
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <div className={`p-2 rounded-lg ${
                                  slot.booking?.status === "Đã xác nhận" ? "bg-emerald-100" :
                                  slot.booking?.status === "Chưa xác nhận" ? "bg-amber-100" : 
                                  "bg-gray-100"
                                }`}>
                                  <Clock className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-lg">{slot.start} - {slot.end}</span>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 group-hover:text-gray-600 transition-all" />
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${
                                slot.booking?.patientName ? "bg-blue-100" : "bg-gray-100"
                              }`}>
                                <User className="w-4 h-4 text-gray-600" />
                              </div>
                              <div className="flex-1">
                                <span className="font-bold text-gray-800 block truncate">
                                  {slot.booking?.patientName || "Slot trống"}
                                </span>
                                {slot.booking?.patientPhone && (
                                  <span className="text-sm text-gray-600">{slot.booking.patientPhone}</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold shadow-sm ${
                                slot.booking?.status === "Đã xác nhận"
                                  ? "bg-emerald-200 text-emerald-900 border border-emerald-300"
                                  : slot.booking?.status === "Chưa xác nhận"
                                  ? "bg-amber-200 text-amber-900 border border-amber-300"
                                  : "bg-gray-200 text-gray-700 border border-gray-300"
                              }`}>
                                {slot.booking?.status === "Đã xác nhận" && <Check className="w-3 h-3 mr-1" />}
                                {slot.booking?.status === "Chưa xác nhận" && <Clock className="w-3 h-3 mr-1" />}
                                {slot.booking?.status || "Trống"}
                              </span>
                              
                              {slot.booking?.isExamined && (
                                <div className="flex items-center text-blue-600">
                                  <Star className="w-4 h-4 fill-current" />
                                  <span className="text-xs font-medium ml-1">Đã khám</span>
                                </div>
                              )}
                              
                              {slot.booking && !slot.booking.isExamined && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Modal */}
          {selectedSlot && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
              <div className="bg-white max-w-6xl w-full mx-4 rounded-3xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] overflow-y-auto border border-gray-200">
                {/* Enhanced Header */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-purple-600/80 to-indigo-700/80"></div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                  
                  <button
                    className="absolute top-6 right-6 text-white hover:text-gray-200 transition-colors p-3 rounded-full hover:bg-white/20 z-10"
                    onClick={() => {
                      setSelectedSlot(null);
                      setShowMedicalForm(false);
                    }}
                  >
                    <X className="w-7 h-7" />
                  </button>
                  
                  <div className="flex items-center space-x-6 relative z-10">
                    <div className="bg-white/20 backdrop-blur-sm p-5 rounded-3xl border border-white/30">
                      <Calendar className="w-10 h-10" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold mb-3">Chi tiết lịch khám</h2>
                      <p className="text-blue-100 text-xl font-medium">
                        {new Date(selectedSlot.date).toLocaleDateString("vi-VN", {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-blue-200 text-lg mt-1">
                        {selectedSlot.start} - {selectedSlot.end}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Body */}
                <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50">
                  {/* Patient Information */}
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                    <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl mr-4 shadow-lg">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      Thông tin bệnh nhân
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-wide">Họ và tên</p>
                            <p className="font-bold text-gray-800 text-2xl">{selectedSlot.booking?.patientName}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 shadow-sm">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg">
                            <Phone className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-wide">Số điện thoại</p>
                            <p className="font-bold text-gray-800 text-2xl">{selectedSlot.booking?.patientPhone}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 shadow-sm">
                          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-2xl shadow-lg">
                            <Mail className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-wide">Email</p>
                            <p className="font-bold text-gray-800 text-xl break-all">{selectedSlot.booking?.patientEmail}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-100 shadow-sm">
                          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-2xl shadow-lg">
                            <Clock className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-wide">Giờ khám</p>
                            <p className="font-bold text-gray-800 text-2xl">{selectedSlot.start} - {selectedSlot.end}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status and Notes */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
                      <h4 className="font-bold text-gray-800 mb-6 flex items-center text-2xl">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-2xl mr-3 shadow-lg">
                          <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        Trạng thái
                      </h4>
                      <div className={`inline-flex items-center px-6 py-4 rounded-2xl text-lg font-bold shadow-lg border-2 ${
                        selectedSlot.booking?.status === "Đã xác nhận"
                          ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300"
                          : selectedSlot.booking?.status === "Chưa xác nhận"
                          ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300"
                          : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-300"
                      }`}>
                        {selectedSlot.booking?.status === "Đã xác nhận" && <Check className="w-5 h-5 mr-2" />}
                        {selectedSlot.booking?.status === "Chưa xác nhận" && <Clock className="w-5 h-5 mr-2" />}
                        {selectedSlot.booking?.status}
                      </div>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
                      <h4 className="font-bold text-gray-800 mb-6 flex items-center text-2xl">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl mr-3 shadow-lg">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        Ghi chú từ bệnh nhân
                      </h4>
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200 shadow-inner">
                        <p className="text-gray-700 text-lg leading-relaxed">
                          {selectedSlot.booking?.note || "Không có ghi chú đặc biệt"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons for Unconfirmed */}
                  {selectedSlot.booking?.status === "Chưa xác nhận" && (
                    <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 rounded-3xl p-8 border-2 border-yellow-200 shadow-xl">
                      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
                        <div className="flex-1">
                          <h4 className="font-bold text-yellow-800 mb-3 text-2xl flex items-center">
                            <AlertCircle className="w-6 h-6 mr-3" />
                            Cần xác nhận lịch hẹn
                          </h4>
                          <p className="text-yellow-700 text-lg">Vui lòng xác nhận hoặc từ chối lịch hẹn này để thông báo cho bệnh nhân</p>
                        </div>
                        <div className="flex gap-4 shrink-0">
                          <button
                            onClick={() => handleAppointmentAction("confirm")}
                            disabled={submitting}
                            className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg font-bold"
                          >
                            {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6" />}
                            <span>Xác nhận</span>
                          </button>
                          <button
                            onClick={() => handleAppointmentAction("reject")}
                            disabled={submitting}
                            className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl hover:from-red-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg font-bold"
                          >
                            {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <X className="w-6 h-6" />}
                            <span>Từ chối</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Medical Records Section */}
                  {selectedSlot.booking?.status === "Đã xác nhận" && (
                    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 border-2 border-blue-200 shadow-xl">
                      <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl mr-4 shadow-lg">
                          <Stethoscope className="w-8 h-8 text-white" />
                        </div>
                        Hồ sơ bệnh án
                      </h3>
                      
                      {selectedSlot.booking?.isExamined ? (
                        // Display completed medical record
                        <div className="space-y-8">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
                              <h5 className="font-bold text-gray-800 mb-6 flex items-center text-2xl">
                                <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-2xl mr-3 shadow-lg">
                                  <Activity className="w-6 h-6 text-white" />
                                </div>
                                Chẩn đoán
                              </h5>
                              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200 shadow-inner">
                                <p className="text-gray-800 font-semibold text-lg leading-relaxed">{selectedSlot.booking?.diagnosis || "Chưa có chẩn đoán"}</p>
                              </div>
                            </div>
                            
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
                              <h5 className="font-bold text-gray-800 mb-6 flex items-center text-2xl">
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl mr-3 shadow-lg">
                                  <FileText className="w-6 h-6 text-white" />
                                </div>
                                Ghi chú bác sĩ
                              </h5>
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 shadow-inner">
                                <p className="text-gray-800 text-lg leading-relaxed">{selectedSlot.booking?.doctorNote || "Không có ghi chú bổ sung"}</p>
                              </div>
                            </div>
                          </div>
                          
                          {selectedSlot.booking?.followUpDate && (
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
                              <h5 className="font-bold text-gray-800 mb-6 flex items-center text-2xl">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-2xl mr-3 shadow-lg">
                                  <Calendar className="w-6 h-6 text-white" />
                                </div>
                                Lịch tái khám
                              </h5>
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 shadow-inner">
                                <p className="text-gray-800 font-bold text-xl">
                                  {new Date(selectedSlot.booking.followUpDate).toLocaleDateString("vi-VN", {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-center p-8 bg-gradient-to-r from-green-100 via-emerald-100 to-green-100 rounded-3xl border-2 border-green-300 shadow-xl">
                            <div className="text-center">
                              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-full inline-block mb-4 shadow-lg">
                                <Check className="w-8 h-8 text-white" />
                              </div>
                              <span className="text-green-800 font-bold text-2xl block mb-2">Bệnh án đã hoàn thành</span>
                              <span className="text-green-600 text-lg">Thông tin đã được lưu thành công</span>
                            </div>
                          </div>
                        </div>
                      ) : !showMedicalForm ? (
                        // Button to open medical form
                        <div className="text-center py-12">
                          <div className="bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8 shadow-2xl border-4 border-white">
                            <Stethoscope className="w-16 h-16 text-blue-600" />
                          </div>
                          <h4 className="font-bold text-gray-800 mb-4 text-3xl">Chưa có bệnh án</h4>
                          <p className="text-gray-600 mb-8 text-xl leading-relaxed max-w-md mx-auto">Nhập thông tin chẩn đoán và kê đơn thuốc cho bệnh nhân</p>
                          <button
                            onClick={() => setShowMedicalForm(true)}
                            className="inline-flex items-center space-x-4 px-10 py-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-xl font-bold"
                          >
                            <Plus className="w-6 h-6" />
                            <span>Tạo bệnh án</span>
                          </button>
                        </div>
                      ) : (
                        // Medical form
                        <div className="space-y-8">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                              <label className="block text-lg font-bold text-gray-800 mb-4">
                                <div className="flex items-center">
                                  <Activity className="w-5 h-5 mr-3 text-red-600" />
                                  Chẩn đoán bệnh *
                                </div>
                              </label>
                              <input
                                type="text"
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                placeholder="Nhập chẩn đoán chính xác..."
                                className="w-full p-5 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-lg text-lg"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-lg font-bold text-gray-800 mb-4">
                                <div className="flex items-center">
                                  <Calendar className="w-5 h-5 mr-3 text-green-600" />
                                  Ngày tái khám (nếu cần)
                                </div>
                              </label>
                              <input
                                type="date"
                                value={followUpDate}
                                onChange={(e) => setFollowUpDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full p-5 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-lg text-lg"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-lg font-bold text-gray-800 mb-4">
                              <div className="flex items-center">
                                <FileText className="w-5 h-5 mr-3 text-blue-600" />
                                Ghi chú và hướng dẫn điều trị
                              </div>
                            </label>
                            <textarea
                              value={doctorNote}
                              onChange={(e) => setDoctorNote(e.target.value)}
                              placeholder="Nhập ghi chú chi tiết, hướng dẫn điều trị, kê đơn thuốc, lời khuyên cho bệnh nhân..."
                              className="w-full p-5 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-lg text-lg"
                              rows={6}
                            />
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t-2 border-gray-200">
                            <button
                              onClick={handleSaveDiagnosis}
                              disabled={submitting || !diagnosis.trim()}
                              className="flex-1 flex items-center justify-center space-x-4 px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-xl font-bold"
                            >
                              {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                              <span>Lưu bệnh án</span>
                            </button>
                            <button
                              onClick={() => setShowMedicalForm(false)}
                              className="flex-1 flex items-center justify-center space-x-4 px-10 py-5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl hover:from-gray-600 hover:to-gray-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-xl font-bold"
                            >
                              <X className="w-6 h-6" />
                              <span>Hủy bỏ</span>
                            </button>
                          </div>
                        </div>
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