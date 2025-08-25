// app/doctor/schedule/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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

  RefreshCw,
  ChevronRight,
  Heart,
  Star,
  PlayCircle, // Icon cho "Đang khám"
  CreditCard, // Icon cho thanh toán
  XCircle // Icon cho nút từ chối
} from "lucide-react";

// Form từ chối lịch hẹn
interface RejectFormProps {
  appointmentId: number;
  onRejected: () => void;
  onCancel: () => void;
}

const RejectForm: React.FC<RejectFormProps> = ({ appointmentId, onRejected, onCancel }) => {
  const reasons = [
    "Bác sĩ bận đột xuất",
    "Bệnh nhân cung cấp thông tin chưa đầy đủ",
    "Lịch trùng với ca khác",
    "Không phù hợp chuyên khoa",
    "Khác"
  ];

  const [selectedReason, setSelectedReason] = React.useState("");
  const [customReason, setCustomReason] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleReject = async () => {
    if (!selectedReason) {
      alert("Vui lòng chọn lý do từ chối");
      return;
    }

    let finalReason = selectedReason;
    if (selectedReason === "Khác") {
      finalReason = customReason.trim() || "Không có lý do cụ thể";
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appointments/${appointmentId}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reject_reason: finalReason })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi khi từ chối lịch hẹn");
      alert(data.message || "Đã từ chối lịch hẹn");
      onRejected();
    } catch (error: any) {
      console.error("Lỗi khi từ chối:", error);
      alert(`❌ ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h3 className="font-bold mb-2 text-red-600">Chọn lý do từ chối</h3>
      {reasons.map((reason, idx) => (
        <div key={idx} className="flex items-center mb-2">
          <input
            type="radio"
            id={`reject-reason-${idx}`}
            name="rejectReason"
            value={reason}
            checked={selectedReason === reason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="mr-2"
          />
          <label className="text-black" htmlFor={`reject-reason-${idx}`}>{reason}</label>
        </div>
      ))}

      {selectedReason === "Khác" && (
        <textarea
          className="w-full p-2 border rounded mt-2"
          rows={3}
          placeholder="Nhập lý do khác..."
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
        />
      )}

      <div className="mt-3 flex gap-3">
        <button
          onClick={handleReject}
          disabled={submitting || !selectedReason}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
        >
          {submitting ? "Đang xử lý..." : "Xác nhận từ chối"}
        </button>
        <button
          onClick={onCancel}
          disabled={submitting}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400"
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

// Form báo cáo lịch hẹn
interface ReportFormProps {
  appointmentId: number;
  onReported: () => void;
  onCancel: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ appointmentId, onReported, onCancel }) => {
  const reasons = [
    "Bệnh nhân không đến",
    "Bác sĩ bận đột xuất",
    "Lịch trùng với ca khác",
    "Khác"
  ];

  const [selectedReason, setSelectedReason] = React.useState("");
  const [customReason, setCustomReason] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleReport = async () => {
    if (!selectedReason) {
      alert("Vui lòng chọn lý do báo cáo");
      return;
    }

    let finalReason = selectedReason;
    if (selectedReason === "Khác") {
      finalReason = customReason.trim() || "Không có lý do cụ thể";
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appointments/${appointmentId}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reject_reason: finalReason })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi khi báo cáo lịch hẹn");
      alert(data.message || "Đã báo cáo lịch hẹn");
      onReported();
    } catch (error: any) {
      console.error("Lỗi khi báo cáo:", error);
      alert(`❌ ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h3 className="font-bold mb-2 text-blue-600">Báo cáo lịch hẹn</h3>
      {reasons.map((reason, idx) => (
        <div key={idx} className="flex items-center mb-2">
          <input
            type="radio"
            id={`reason-${idx}`}
            name="reportReason"
            value={reason}
            checked={selectedReason === reason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="mr-2"
          />
          <label className="text-black" htmlFor={`reason-${idx}`}>{reason}</label>
        </div>
      ))}

      {selectedReason === "Khác" && (
        <textarea
          className="w-full p-2 border rounded mt-2"
          rows={3}
          placeholder="Nhập lý do khác..."
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
        />
      )}

      <div className="mt-3 flex gap-3">
        <button
          onClick={handleReport}
          disabled={submitting || !selectedReason}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {submitting ? "Đang xử lý..." : "Gửi báo cáo"}
        </button>
        <button
          onClick={onCancel}
          disabled={submitting}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400"
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

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
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DoctorSchedulePage() {
  const router = useRouter();
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
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'custom'>('all'); // Bộ lọc thời gian
  const [startDate, setStartDate] = useState(''); // Ngày bắt đầu cho bộ lọc tùy chỉnh
  const [endDate, setEndDate] = useState(''); // Ngày kết thúc cho bộ lọc tùy chỉnh
  const [showHistoricalData, setShowHistoricalData] = useState(false); // Hiển thị dữ liệu lịch sử
  const [showRejectForm, setShowRejectForm] = useState(false); // Hiển thị form lý do từ chối
  const [showReportForm, setShowReportForm] = useState(false); // Hiển thị form báo cáo
  

  
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
    
    // Tạo URL với các tham số bộ lọc thời gian
    let url = `${API_URL}/api/doctors/${doctorId}/time-slots`;
    const params = new URLSearchParams();
    
    // Thêm tham số bộ lọc thời gian
    if (dateRange === 'week') {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      const startDateStr = startOfWeek.toISOString().split('T')[0];
      const endDateStr = endOfWeek.toISOString().split('T')[0];
      params.append('start_date', startDateStr);
      params.append('end_date', endDateStr);
      console.log("🔍 [DEBUG] Fetching week data:", startDateStr, "to", endDateStr);
    } else if (dateRange === 'month') {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const startDateStr = startOfMonth.toISOString().split('T')[0];
      const endDateStr = endOfMonth.toISOString().split('T')[0];
      params.append('start_date', startDateStr);
      params.append('end_date', endDateStr);
      console.log("🔍 [DEBUG] Fetching month data:", startDateStr, "to", endDateStr);
    } else if (dateRange === 'custom' && startDate && endDate) {
      params.append('start_date', startDate);
      params.append('end_date', endDate);
      console.log("🔍 [DEBUG] Fetching custom date range:", startDate, "to", endDate);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    console.log("🔍 [DEBUG] Final URL:", url);
    
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải lịch.");
        return res.json();
      })
      .then((data: GroupedSlotsApiResponse) => {
        console.log("🔍 [DEBUG] Received data:", data);
        const flattenedSlots = Object.entries(data).flatMap(([date, slots]) =>
          slots.map((slot) => ({ ...slot, date }))
        );
        console.log("🔍 [DEBUG] Flattened slots:", flattenedSlots.length, "slots");
        setAllSlots(flattenedSlots);
      })
      .catch((err) => {
        console.error("❌ [DEBUG] Error fetching slots:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [doctorId, dateRange, startDate, endDate]);

  useEffect(() => {
    if (doctorId) fetchDoctorSlots();
  }, [doctorId, fetchDoctorSlots]);

  // Auto-fetch when date range changes
  useEffect(() => {
    if (doctorId && (dateRange === 'all' || dateRange === 'week' || dateRange === 'month')) {
      fetchDoctorSlots();
    }
  }, [dateRange, doctorId, fetchDoctorSlots]);

  // Auto-fetch when custom date range is set
  useEffect(() => {
    if (doctorId && dateRange === 'custom' && startDate && endDate) {
      console.log("🔍 [DEBUG] Auto-fetching custom date range:", startDate, "to", endDate);
      fetchDoctorSlots();
    }
  }, [startDate, endDate, doctorId, fetchDoctorSlots]);

  // Auto-reject unconfirmed appointments when appointment time arrives
  useEffect(() => {
    if (!doctorId) return;

    const checkAndAutoReject = async () => {
      const now = new Date();
      const currentTime = now.getTime();
      
      // Lọc các cuộc hẹn chưa xác nhận và đã đến giờ
      const appointmentsToReject = allSlots.filter(slot => {
        if (!slot.booking || slot.booking.status !== "Chưa xác nhận") return false;
        
        // Tạo đối tượng Date cho giờ hẹn
        const appointmentDateTime = new Date(`${slot.date}T${slot.start}`);
        const appointmentTime = appointmentDateTime.getTime();
        
        // Kiểm tra xem đã đến giờ hẹn chưa (cho phép 15 phút trễ)
        const timeDiff = currentTime - appointmentTime;
        const fifteenMinutes = 15 * 60 * 1000; // 15 phút tính bằng milliseconds
        
        return timeDiff >= fifteenMinutes;
      });

      if (appointmentsToReject.length > 0) {
        console.log("🔍 [DEBUG] Found appointments to auto-reject:", appointmentsToReject.length);
        
        for (const slot of appointmentsToReject) {
          if (slot.booking?.id) {
            try {
              await autoRejectAppointment(slot.booking.id);
              console.log("✅ [DEBUG] Auto-rejected appointment:", slot.booking.id);
            } catch (error) {
              console.error("❌ [DEBUG] Error auto-rejecting appointment:", slot.booking.id, error);
            }
          }
        }
        
        // Refresh data sau khi xử lý
        fetchDoctorSlots();
      }
    };

    // Kiểm tra mỗi phút
    const interval = setInterval(checkAndAutoReject, 60000);
    
    // Kiểm tra ngay lập tức khi component mount
    checkAndAutoReject();

    return () => clearInterval(interval);
  }, [doctorId, allSlots, fetchDoctorSlots]);

  // Hàm tự động từ chối cuộc hẹn
  const autoRejectAppointment = async (appointmentId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appointments/${appointmentId}/reject`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          reject_reason: "Bác sĩ không xác nhận lịch hẹn" 
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Lỗi khi tự động từ chối lịch hẹn");
      }

      console.log("✅ [DEBUG] Auto-rejected appointment successfully:", appointmentId);
    } catch (error: any) {
      console.error("❌ [DEBUG] Error in autoRejectAppointment:", error);
      throw error;
    }
  };

  // Refresh data when page becomes visible (e.g., returning from examination page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && doctorId) {
        console.log("🔍 [DEBUG] Page became visible, refreshing data...");
        fetchDoctorSlots();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refresh when window gains focus
    const handleFocus = () => {
      if (doctorId) {
        console.log("🔍 [DEBUG] Window gained focus, refreshing data...");
        fetchDoctorSlots();
      }
    };
    
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [doctorId, fetchDoctorSlots]);

  // Refresh data when returning from examination page
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Set a flag in sessionStorage to indicate we're going to examination page
      sessionStorage.setItem('returningFromExamination', 'true');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Check if we're returning from examination page
    const returningFromExamination = sessionStorage.getItem('returningFromExamination');
    if (returningFromExamination === 'true' && doctorId) {
      console.log("🔍 [DEBUG] Returning from examination page, refreshing data...");
      sessionStorage.removeItem('returningFromExamination');
      // Small delay to ensure the page is fully loaded
      setTimeout(() => {
        fetchDoctorSlots();
      }, 100);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [doctorId, fetchDoctorSlots]);

  // Load payment settings
  useEffect(() => {
    const loadPaymentSettings = async () => {
      try {
        const response = await fetch(`${API_URL}/api/payment/settings`);
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
      setShowRejectForm(false);
      setShowReportForm(false);
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
        console.log("🔍 [DEBUG] Sending request to:", `${API_URL}/api/appointments/${appointmentId}/status`);
        console.log("🔍 [DEBUG] Request body:", { status: newStatus });
        
        const res = await fetch(`${API_URL}/api/appointments/${appointmentId}/status`, {
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
      const res = await fetch(`${API_URL}/api/appointments/${appointmentId}/${action}`, {
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
      
      const res = await fetch(`${API_URL}/api/medical-records/save-from-schedule`, {
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
      
      const res = await fetch(`${API_URL}/api/appointments/${appointmentId}/payment`, {
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
      
      const response = await fetch(`${API_URL}/api/payment/check-history`, {
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
      const response = await fetch(`${API_URL}/api/payment/generate-qr`, {
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
    const patientName = slot.booking?.patientName || "";
    const patientPhone = slot.booking?.patientPhone || "";
    const patientEmail = slot.booking?.patientEmail || "";
    const slotDate = slot.date;

    // Lọc theo ngày cụ thể (nếu có)
    const matchesDateFilter = filterDate ? slotDate === filterDate : true;
    
    // Lọc theo từ khóa tìm kiếm
    const matchesSearch = searchTerm
      ? status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patientPhone.includes(searchTerm) ||
        patientEmail.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesDateFilter && matchesSearch;
  });

  const groupedSlots = filteredSlots.reduce((acc: Record<string, Slot[]>, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  const unconfirmedSlots = allSlots.filter(
    (slot) => slot.booking && slot.booking.status === "Chưa xác nhận"
  );
  


  // Statistics
  const totalSlots = allSlots.length;
  const bookedSlots = allSlots.filter(slot => slot.is_booked).length;
  const examiningSlots = allSlots.filter(slot => slot.booking?.status === 'Đang khám').length;
  const confirmedSlots = allSlots.filter(slot => slot.booking?.status === "Đã xác nhận").length;
  const completedSlots = allSlots.filter(slot => slot.booking?.status === 'Đã khám xong').length;
  const cancelledSlots = allSlots.filter(slot => slot.booking?.status === 'Đã hủy').length;
  
  const getCardStyle = (slot: Slot) => {
    const status = slot.booking?.status;
    if (status === "Đã khám xong" || slot.booking?.isExamined) {
      return "border-orange-500 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 hover:from-orange-100 hover:to-amber-100";
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
    if (status === "Đã hủy") {
      return "border-red-500 bg-gradient-to-br from-red-50 via-pink-50 to-red-100 hover:from-red-100 hover:to-pink-100 opacity-75";
    }
    return "border-gray-400 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 hover:from-gray-100 hover:to-slate-100";
  };
  
  const getStatusBadgeStyle = (status?: string) => {
     switch(status) {
        case "Đã khám xong": return "bg-orange-200 text-orange-900 border border-orange-300";
        case "Đang khám": return "bg-purple-200 text-purple-900 border border-purple-300";
        case "Đã xác nhận": return "bg-emerald-200 text-emerald-900 border border-emerald-300";
        case "Chưa xác nhận": return "bg-amber-200 text-amber-900 border border-amber-300";
        case "Đã hủy": return "bg-red-200 text-red-900 border border-red-300";
        default: return "bg-gray-200 text-gray-700 border border-gray-300";
     }
  }
  
  const getStatusIcon = (status?: string) => {
    switch(status) {
        case "Đã khám xong": return <Check className="w-3 h-3 mr-1" />;
        case "Đang khám": return <PlayCircle className="w-3 h-3 mr-1 animate-pulse" />;
        case "Đã xác nhận": return <Check className="w-3 h-3 mr-1" />;
        case "Chưa xác nhận": return <Clock className="w-3 h-3 mr-1" />;
        case "Đã hủy": return <X className="w-3 h-3 mr-1" />;
        default: return null;
     }
  }

  // Hàm tạo tiêu đề cho khoảng thời gian
  const getDateRangeTitle = () => {
    switch(dateRange) {
      case 'all':
        return 'Tất cả lịch hẹn';
      case 'week':
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `Tuần này (${startOfWeek.toLocaleDateString('vi-VN')} - ${endOfWeek.toLocaleDateString('vi-VN')})`;
      case 'month':
        const currentMonth = new Date();
        return `Tháng ${currentMonth.getMonth() + 1}/${currentMonth.getFullYear()}`;
      case 'custom':
        if (startDate && endDate) {
          const startDateObj = new Date(startDate);
          const endDateObj = new Date(endDate);
          const today = new Date();
          
          let title = `Từ ${startDateObj.toLocaleDateString('vi-VN')} đến ${endDateObj.toLocaleDateString('vi-VN')}`;
          
          // Thêm chỉ báo nếu đang xem dữ liệu lịch sử
          if (startDateObj < today) {
            title += ' (Dữ liệu lịch sử)';
          }
          
          return title;
        }
        return 'Khoảng thời gian tùy chọn';
      default:
        return 'Tất cả lịch hẹn';
    }
  };


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
                            <p className="text-blue-100 text-lg">{getDateRangeTitle()}</p>
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
          {/* Statistics Cards - 6 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
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
            {/* Đã hủy */}
            <div className="bg-gradient-to-br from-red-500 to-pink-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all">
                <p className="text-sm font-medium text-red-100">Đã hủy</p>
                <div className="flex justify-between items-end">
                    <p className="text-4xl font-bold">{cancelledSlots}</p>
                    <div className="bg-white/20 p-3 rounded-xl"><X className="w-7 h-7" /></div>
                </div>
            </div>
          </div>

          {/* Historical Data Summary */}
          {showHistoricalData && totalSlots > 0 && (
            <div className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center mb-4">
                <TrendingUp className="w-6 h-6 mr-3"/> Tổng quan dữ liệu lịch sử
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white/20 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{totalSlots}</div>
                  <div>Tổng cuộc hẹn</div>
                </div>
                <div className="bg-white/20 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{completedSlots}</div>
                  <div>Đã hoàn thành</div>
                </div>
                <div className="bg-white/20 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{cancelledSlots}</div>
                  <div>Đã hủy</div>
                </div>
                <div className="bg-white/20 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{Math.round((completedSlots / totalSlots) * 100)}%</div>
                  <div>Tỷ lệ hoàn thành</div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filter */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border p-6 mb-8">
            <div className="space-y-6">
              {/* Time Range Filter */}
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg"><Calendar className="w-5 h-5 text-blue-600" /></div>
                  <span className="font-medium text-gray-700">Khoảng thời gian:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setDateRange('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      dateRange === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setDateRange('week')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      dateRange === 'week'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Tuần này
                  </button>
                  <button
                    onClick={() => setDateRange('month')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      dateRange === 'month'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Tháng này
                  </button>
                  <button
                    onClick={() => setDateRange('custom')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      dateRange === 'custom'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Tùy chọn
                  </button>
                  <button
                    onClick={() => {
                      const today = new Date();
                      const lastWeek = new Date(today);
                      lastWeek.setDate(today.getDate() - 7);
                      const lastWeekEnd = new Date(lastWeek);
                      lastWeekEnd.setDate(lastWeek.getDate() + 6);
                      
                      setDateRange('custom');
                      setStartDate(lastWeek.toISOString().split('T')[0]);
                      setEndDate(lastWeekEnd.toISOString().split('T')[0]);
                      setShowHistoricalData(true);
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition bg-orange-100 text-orange-700 hover:bg-orange-200"
                  >
                    Tuần trước
                  </button>
                  <button
                    onClick={() => {
                      const today = new Date();
                      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
                      
                      setDateRange('custom');
                      setStartDate(lastMonth.toISOString().split('T')[0]);
                      setEndDate(lastMonthEnd.toISOString().split('T')[0]);
                      setShowHistoricalData(true);
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition bg-purple-100 text-purple-700 hover:bg-purple-200"
                  >
                    Tháng trước
                  </button>
                  <button
                    onClick={() => {
                      const today = new Date();
                      const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
                      const lastYearEnd = new Date(today.getFullYear() - 1, today.getMonth() + 1, 0);
                      
                      setDateRange('custom');
                      setStartDate(lastYear.toISOString().split('T')[0]);
                      setEndDate(lastYearEnd.toISOString().split('T')[0]);
                      setShowHistoricalData(true);
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Năm trước
                  </button>
                </div>
              </div>

              {/* Custom Date Range */}
              {dateRange === 'custom' && (
                <div className="flex flex-col lg:flex-row items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <label className="font-medium text-gray-700">Từ ngày:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        if (new Date(e.target.value) < new Date()) {
                          setShowHistoricalData(true);
                        }
                      }}
                      className="border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <label className="font-medium text-gray-700">Đến ngày:</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        if (new Date(e.target.value) < new Date()) {
                          setShowHistoricalData(true);
                        }
                      }}
                      min={startDate}
                      className="border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => fetchDoctorSlots()}
                    disabled={!startDate || !endDate}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Làm mới
                  </button>
                  <button
                    onClick={() => {
                      setDateRange('all');
                      setStartDate('');
                      setEndDate('');
                      setShowHistoricalData(false);
                    }}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition"
                  >
                    Về tất cả
                  </button>
                </div>
              )}

              {/* Search Bar */}
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg"><Search className="w-5 h-5 text-green-600" /></div>
                  <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Lọc theo ngày cụ thể" />
                </div>
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" placeholder="Tìm kiếm bệnh nhân hoặc trạng thái..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                </div>
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

          {/* Historical Data Alert */}
          {showHistoricalData && (
            <div className="mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center mb-4">
                <Clock className="w-6 h-6 mr-3"/> Dữ liệu lịch sử
              </h2>
              <p className="text-blue-100 mb-3">
                Bạn đang xem lịch khám trong quá khứ. Hiển thị đầy đủ tất cả các trạng thái bao gồm: Đã xác nhận, Đang khám, Đã khám xong, và Đã hủy.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-white/20 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Đã xác nhận</span>
                  </div>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Đang khám</span>
                  </div>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Đã khám xong</span>
                  </div>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Đã hủy</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white/20 rounded-lg">
                <p className="text-sm">
                  <strong>Lưu ý:</strong> Khi xem dữ liệu lịch sử, bạn có thể xem chi tiết các cuộc hẹn đã hoàn thành nhưng không thể thực hiện các hành động thay đổi trạng thái.
                </p>
              </div>
            </div>
          )}
          



          {/* Main Schedule */}
          {loading && <div className="text-center p-12"><Loader2 className="animate-spin w-10 h-10 text-blue-600 mx-auto" /></div>}
          {error && <div className="text-center p-12 text-red-600"><AlertCircle className="w-10 h-10 mx-auto mb-2"/>{error}</div>}
          {!loading && !error && Object.keys(groupedSlots).length === 0 && (
            <div className="text-center p-12 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4"/>
              <h3 className="text-xl font-semibold mb-2">Không có lịch hẹn nào được tìm thấy</h3>
              <p className="text-gray-400">Trong khoảng thời gian: {getDateRangeTitle()}</p>
              

              
              {showHistoricalData && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-700">
                    <strong>Gợi ý:</strong> Thử chọn khoảng thời gian khác hoặc kiểm tra lại ngày tháng đã chọn.
                  </p>
                </div>
              )}
            </div>
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
                       {selectedSlot.booking?.status === "Chưa xác nhận" && !showRejectForm && !showReportForm && (
                         <div className="flex gap-4">
                           <button 
                             onClick={() => handleAppointmentAction("confirm")} 
                             disabled={submitting || showHistoricalData} 
                             className="flex-1 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                           >
                             Xác nhận
                           </button>
                           <button 
                             onClick={() => setShowRejectForm(true)} 
                             disabled={submitting || showHistoricalData} 
                             className="flex-1 bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400"
                           >
                             Từ chối
                           </button>
                         </div>
                       )}

                       {/* Reject Form */}
                       {selectedSlot.booking?.status === "Chưa xác nhận" && showRejectForm && selectedSlot.booking?.id && (
                         <RejectForm
                           appointmentId={selectedSlot.booking.id}
                           onRejected={() => {
                             setShowRejectForm(false);
                             handleCloseModal();
                             fetchDoctorSlots();
                           }}
                           onCancel={() => setShowRejectForm(false)}
                         />
                       )}

                                             {/* Action for "Đã xác nhận" */}
                       {selectedSlot.booking?.status === 'Đã xác nhận' && !showReportForm && (
                          <div className="space-y-3">
                             <button 
                                onClick={() => {
                                  // Lấy ngày hôm nay theo múi giờ Việt Nam
                                  const today = new Date();
                                  const todayStr = today.toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
                                  
                                  console.log('🔍 [DEBUG] Today:', todayStr);
                                  console.log('🔍 [DEBUG] Appointment date:', selectedSlot.date);
                                  
                                  // Cho phép khám vào ngày hẹn hoặc sau ngày hẹn (không phải trước ngày hẹn)
                                  if (selectedSlot.date > todayStr) {
                                    alert(`Chỉ được bắt đầu khám vào ngày hẹn hoặc sau đó. Hôm nay: ${todayStr}, Ngày hẹn: ${selectedSlot.date}`);
                                    return;
                                  }
                                  
                                  // Chuyển sang trang examination
                                  router.push(`/doctor/examination?id=${selectedSlot.booking?.id}&patientId=${selectedSlot.booking?.customer_id}`);
                                }} 
                                disabled={submitting || showHistoricalData} 
                                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center space-x-2"
                             >
                                <PlayCircle className="w-5 h-5" /><span>Bắt đầu khám</span>
                             </button>
                             
                             <button
                                onClick={() => setShowReportForm(true)}
                                disabled={submitting}
                                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center space-x-2"
                             >
                                <XCircle className="w-5 h-5" /><span>Báo cáo</span>
                             </button>
                          </div>
                       )}

                       {/* Report Form */}
                       {selectedSlot.booking?.status === 'Đã xác nhận' && showReportForm && selectedSlot.booking?.id && (
                         <ReportForm
                           appointmentId={selectedSlot.booking.id}
                           onReported={() => {
                             setShowReportForm(false);
                             handleCloseModal();
                             fetchDoctorSlots();
                           }}
                           onCancel={() => setShowReportForm(false)}
                         />
                       )}

                      {/* Action for "Đang khám" */}
                      {selectedSlot.booking?.status === 'Đang khám' && (
                         <button 
                           onClick={() => handleStatusUpdate('Đã khám xong')} 
                           disabled={submitting || showHistoricalData} 
                           className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 flex items-center justify-center space-x-2"
                         >
                            <Check className="w-5 h-5" /><span>Hoàn tất khám</span>
                         </button>
                      )}

                      {/* Display for "Đã hủy" */}
                      {selectedSlot.booking?.status === 'Đã hủy' && (
                         <div className="w-full bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
                           <div className="flex items-center justify-center space-x-2 text-red-700">
                             <X className="w-5 h-5" />
                             <span className="font-semibold">Lịch hẹn đã bị hủy</span>
                           </div>
                           <p className="text-sm text-red-600 mt-2">
                             Lịch hẹn này đã được hủy và không thể thực hiện thêm hành động nào.
                           </p>
                         </div>
                      )}
                  </div>

                  {/* Medical Record Section removed as requested */}

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