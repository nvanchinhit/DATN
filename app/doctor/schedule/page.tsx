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
  PlayCircle, // Icon cho "Đang khám"
  CreditCard // Icon cho thanh toán
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
  paymentMethod?: 'cash' | 'online';
  paidAmount?: number;
  transactionId?: string;
  paymentDate?: string;
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
  const [showPaymentForm, setShowPaymentForm] = useState(false); // State để hiển thị form thanh toán
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash'); // Phương thức thanh toán
  const [paymentAmount, setPaymentAmount] = useState(''); // Số tiền thanh toán
  const [paymentNote, setPaymentNote] = useState(''); // Ghi chú thanh toán
  const [transactionId, setTransactionId] = useState(''); // ID giao dịch chuyển khoản
  const [checkingPayment, setCheckingPayment] = useState(false); // Đang kiểm tra thanh toán
  const [paymentSettings, setPaymentSettings] = useState<any>(null); // Cài đặt thanh toán
  const [qrCodeUrl, setQrCodeUrl] = useState<string>(''); // URL QR code được tạo
  const [generatingQR, setGeneratingQR] = useState(false); // Đang tạo QR code
  
  useEffect(() => {
    const rawData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    console.log("🔍 [DEBUG] User data from localStorage:", rawData);
    console.log("🔍 [DEBUG] Token exists:", !!token);
    
    if (rawData && token) {
      try {
        const parsed = JSON.parse(rawData);
        console.log("🔍 [DEBUG] Parsed user data:", parsed);
        
        if (parsed?.id && parsed?.role_id === 3) {
          setDoctorId(parsed.id);
          console.log("✅ [DEBUG] Doctor ID set:", parsed.id);
        } else {
          console.log("❌ [DEBUG] Invalid user role:", parsed?.role_id);
          setError("Tài khoản không hợp lệ hoặc không phải bác sĩ.");
          setLoading(false);
        }
      } catch (err) {
        console.error("❌ [DEBUG] Error parsing user data:", err);
        setError("Lỗi đọc dữ liệu đăng nhập.");
        setLoading(false);
      }
    } else {
      console.log("❌ [DEBUG] Missing user data or token");
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

  // Load payment settings
  useEffect(() => {
    const loadPaymentSettings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/payment/settings');
        if (response.ok) {
          const data = await response.json();
          setPaymentSettings(data.data);
        }
      } catch (error) {
        console.error('Error loading payment settings:', error);
      }
    };
    loadPaymentSettings();
  }, []);

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
    const token = localStorage.getItem("token");
    
    console.log("🔍 [DEBUG] handleStatusUpdate called with:", { newStatus, appointmentId, token: token ? "exists" : "missing" });
    
    if (!appointmentId || !token || submitting) {
      console.log("❌ [DEBUG] Missing required data:", { appointmentId, token: !!token, submitting });
      return;
    }
    
    setSubmitting(true);
    try {
        console.log("🔍 [DEBUG] Sending request to:", `http://localhost:5000/api/appointments/${appointmentId}/status`);
        console.log("🔍 [DEBUG] Request body:", { status: newStatus });
        
        const res = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ status: newStatus }),
        });

        console.log("🔍 [DEBUG] Response status:", res.status);
        
        if (!res.ok) {
            const errorData = await res.json();
            console.error("❌ [DEBUG] API Error:", errorData);
            throw new Error(errorData.message || "Lỗi cập nhật trạng thái.");
        }
        
        const successData = await res.json();
        console.log("✅ [DEBUG] API Success:", successData);
        
        alert(`✅ Đã cập nhật trạng thái thành "${newStatus}"`);
        setSelectedSlot(prev => prev && prev.booking ? { ...prev, booking: { ...prev.booking, status: newStatus } } : null);
        fetchDoctorSlots();
    } catch (err: any) {
        console.error("❌ [DEBUG] Error in handleStatusUpdate:", err);
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

  // Function xử lý thanh toán tiền mặt
  const handleCashPayment = async () => {
    const appointmentId = selectedSlot?.booking?.id;
    const token = localStorage.getItem("token");
    if (!appointmentId || !token) return alert("Lỗi xác thực.");
    if (!paymentAmount.trim()) return alert("Vui lòng nhập số tiền.");
    
    setSubmitting(true);
    try {
      const requestBody = {
        appointment_id: appointmentId,
        payment_method: 'cash',
        paid_amount: parseInt(paymentAmount),
        payment_note: paymentNote,
        payment_date: new Date().toISOString()
      };
      
      const res = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/payment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`},
        body: JSON.stringify(requestBody),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Không thể cập nhật thanh toán.");
      }

      alert("✅ Đã cập nhật thanh toán tiền mặt thành công.");
      setShowPaymentForm(false);
      setPaymentAmount('');
      setPaymentNote('');
      fetchDoctorSlots();
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Function kiểm tra thanh toán chuyển khoản
  const handleCheckOnlinePayment = async () => {
    if (!paymentSettings?.token_auto || !paymentSettings?.account_number || !paymentAmount.trim()) {
      return alert("Vui lòng điền đầy đủ thông tin.");
    }

    setCheckingPayment(true);
    try {
      // Tạo transaction_id tự động dựa trên appointment_id
      const autoTransactionId = `TDCARE${selectedSlot?.booking?.id}`;
      
      const response = await fetch('http://localhost:5000/api/payment/check-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          token: paymentSettings.token_auto,
          account_number: paymentSettings.account_number,
          transaction_id: autoTransactionId, // Sử dụng transaction_id tự động
          amount: parseInt(paymentAmount),
          appointment_id: selectedSlot?.booking?.id
        })
      });

      const data = await response.json();
      
      if (data.success && data.hasPayment) {
        alert("✅ Thanh toán thành công! Giao dịch đã được xác nhận.");
        setShowPaymentForm(false);
        setPaymentAmount('');
        fetchDoctorSlots();
      } else {
        alert("❌ Chưa tìm thấy giao dịch thanh toán. Vui lòng kiểm tra lại hoặc thử lại sau.");
      }
    } catch (error) {
      console.error('Error checking payment:', error);
      alert("❌ Lỗi khi kiểm tra thanh toán.");
    } finally {
      setCheckingPayment(false);
    }
  };

  // Function tạo QR code động
  const handleGenerateQR = async () => {
    if (!paymentAmount.trim() || !selectedSlot?.booking?.id) {
      return alert("Vui lòng nhập số tiền trước khi tạo QR code.");
    }

    setGeneratingQR(true);
    try {
      const response = await fetch('http://localhost:5000/api/payment/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bank_name: paymentSettings?.bank_name,
          account_number: paymentSettings?.account_number,
          account_holder: paymentSettings?.account_holder,
          amount: parseInt(paymentAmount),
          content: `TDCARE${selectedSlot.booking.id}`
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setQrCodeUrl(data.qrCodeUrl);
        alert("✅ Đã tạo QR code thành công!");
      } else {
        alert("❌ Không thể tạo QR code. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error('Error generating QR:', error);
      alert("❌ Lỗi khi tạo QR code.");
    } finally {
      setGeneratingQR(false);
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
                         <button 
                           onClick={() => {
                             console.log("🔍 [DEBUG] Bắt đầu khám button clicked");
                             console.log("🔍 [DEBUG] Selected slot:", selectedSlot);
                             handleStatusUpdate('Đang khám');
                           }} 
                           disabled={submitting} 
                           className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center space-x-2"
                         >
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

                  {/* Payment Section */}
                  {selectedSlot.booking?.status === "Đã khám xong" && selectedSlot.booking?.paymentStatus !== "Đã thanh toán" && (
                     <div className="bg-gray-50 p-6 rounded-2xl border">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Thanh toán</h3>
                        
                        {showPaymentForm ? (
                            <div className="space-y-4">
                                {/* Payment Method Selection */}
                                <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</label>
                                   <div className="flex gap-4">
                                       <button 
                                           onClick={() => setPaymentMethod('cash')}
                                           className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
                                               paymentMethod === 'cash' 
                                                   ? 'border-green-500 bg-green-50 text-green-700' 
                                                   : 'border-gray-300 bg-white text-gray-700'
                                           }`}
                                       >
                                           💰 Tiền mặt
                                       </button>
                                       <button 
                                           onClick={() => setPaymentMethod('online')}
                                           className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
                                               paymentMethod === 'online' 
                                                   ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                                   : 'border-gray-300 bg-white text-gray-700'
                                           }`}
                                       >
                                           💳 Chuyển khoản
                                       </button>
                                   </div>
                                </div>

                                {/* Amount Input */}
                                <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền *</label>
                                   <input 
                                       type="number" 
                                       value={paymentAmount} 
                                       onChange={(e) => setPaymentAmount(e.target.value)} 
                                       placeholder="Nhập số tiền..." 
                                       className="w-full p-3 border-gray-300 rounded-lg"
                                   />
                                </div>

                                {/* Cash Payment Form */}
                                {paymentMethod === 'cash' && (
                                    <div className="space-y-4">
                                        <div>
                                           <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (tùy chọn)</label>
                                           <input 
                                               type="text" 
                                               value={paymentNote} 
                                               onChange={(e) => setPaymentNote(e.target.value)} 
                                               placeholder="Ghi chú thanh toán..." 
                                               className="w-full p-3 border-gray-300 rounded-lg"
                                           />
                                        </div>
                                        <button 
                                            onClick={handleCashPayment} 
                                            disabled={!paymentAmount.trim() || submitting}
                                            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                                        >
                                            {submitting ? 'Đang xử lý...' : 'Xác nhận tiền mặt'}
                                        </button>
                                    </div>
                                )}

                                {/* Online Payment Form */}
                                {paymentMethod === 'online' && (
                                    <div className="space-y-4">
                                        {/* QR Code Display */}
                                        {paymentSettings && (
                                            <div className="bg-white p-6 rounded-lg border text-center">
                                                <h4 className="font-semibold text-gray-800 mb-4">Quét mã QR để thanh toán</h4>
                                                
                                                {/* QR Code Image */}
                                                {qrCodeUrl ? (
                                                    <div className="mb-4">
                                                        <img 
                                                            src={qrCodeUrl} 
                                                            alt="QR Code" 
                                                            className="w-48 h-48 mx-auto border-2 border-gray-200 rounded-lg"
                                                        />
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={handleGenerateQR}
                                                        disabled={!paymentAmount.trim() || generatingQR}
                                                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 mb-4"
                                                    >
                                                        {generatingQR ? 'Đang tạo QR...' : 'Tạo QR Code'}
                                                    </button>
                                                )}

                                                {/* Payment Information */}
                                                <div className="space-y-2 text-sm text-gray-600">
                                                    <div><strong>Ngân hàng:</strong> {paymentSettings.bank_name}</div>
                                                    <div><strong>Số tài khoản:</strong> {paymentSettings.account_number}</div>
                                                    <div><strong>Chủ tài khoản:</strong> {paymentSettings.account_holder}</div>
                                                    <div className="bg-gray-100 p-2 rounded">
                                                        <strong>Nội dung:</strong> TDCARE{selectedSlot.booking?.id}
                                                    </div>
                                                </div>

                                                {/* Instructions */}
                                                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                                                    <strong>Hướng dẫn:</strong> Quét mã QR bằng ứng dụng ngân hàng, nhập số tiền và nội dung chuyển khoản như trên.
                                                </div>
                                            </div>
                                        )}

                                        {/* Payment Status Display */}
                                        <div className="bg-gray-50 p-4 rounded-lg border">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-700">Trạng thái thanh toán:</span>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                                                    <span className="text-yellow-700 font-medium">Chờ thanh toán</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Hệ thống sẽ tự động kiểm tra và cập nhật trạng thái khi có giao dịch thanh toán.
                                            </p>
                                        </div>

                                        {/* Auto Check Button */}
                                        <button 
                                            onClick={handleCheckOnlinePayment} 
                                            disabled={!paymentAmount.trim() || checkingPayment}
                                            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                                        >
                                            {checkingPayment ? 'Đang kiểm tra...' : 'Kiểm tra thanh toán'}
                                        </button>
                                    </div>
                                )}

                                <button 
                                    onClick={() => setShowPaymentForm(false)} 
                                    className="w-full bg-gray-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition"
                                >
                                    Hủy
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setShowPaymentForm(true)} 
                                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2"
                            >
                                <CreditCard className="w-5 h-5"/><span>Nhập thanh toán</span>
                            </button>
                        )}
                     </div>
                  )}

                  {/* Payment Info Section - Hiển thị khi đã thanh toán */}
                  {selectedSlot.booking?.status === "Đã khám xong" && selectedSlot.booking?.paymentStatus === "Đã thanh toán" && (
                     <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                        <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                           <Check className="w-5 h-5 mr-2"/> Đã thanh toán
                        </h3>
                        
                        <div className="space-y-3 text-green-800">
                           <div className="flex justify-between">
                              <span className="font-medium">Phương thức:</span>
                              <span className="capitalize">
                                 {selectedSlot.booking.paymentMethod === 'cash' ? 'Tiền mặt' : 
                                  selectedSlot.booking.paymentMethod === 'online' ? 'Chuyển khoản' : 
                                  selectedSlot.booking.paymentMethod || 'Không xác định'}
                              </span>
                           </div>
                           <div className="flex justify-between">
                              <span className="font-medium">Số tiền:</span>
                              <span className="font-bold">
                                 {selectedSlot.booking.paidAmount ? 
                                    selectedSlot.booking.paidAmount.toLocaleString('vi-VN') + ' VNĐ' : 
                                    'Chưa cập nhật'
                                 }
                              </span>
                           </div>
                           {selectedSlot.booking.transactionId && (
                              <div className="flex justify-between">
                                 <span className="font-medium">Ghi chú:</span>
                                 <span className="text-sm">{selectedSlot.booking.transactionId}</span>
                              </div>
                           )}
                           {selectedSlot.booking.paymentDate && (
                              <div className="flex justify-between">
                                 <span className="font-medium">Ngày thanh toán:</span>
                                 <span>{new Date(selectedSlot.booking.paymentDate).toLocaleDateString('vi-VN')}</span>
                              </div>
                           )}
                        </div>
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