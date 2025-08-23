// app/doctor/examination/page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebardoctor from "@/components/layout/Sidebardoctor";
import {
  Stethoscope,
  User,
  Activity,
  Thermometer,
  Heart,
  Weight,
  Ruler,
  Pill,
  AlertTriangle,
  FileText,
  Check,
  X,
  ArrowLeft,
  Printer,
  Save,
  Clock,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Download,
  Eye
} from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


interface PatientInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  address: string;
  note: string;
}

interface ExaminationData {
  appointmentDate: string;
  appointmentTime: string;
  doctorName: string;
  roomNumber: string;
  vitalSigns: {
    bloodPressure: string;
    temperature: string;
    heartRate: string;
    weight: string;
    
    height: string;
  };
  symptoms: string[];
  allergies: string[];
  medications: string[];
  notes: string;
  recommendations: string;
  diagnosis: string;
  followUpDate: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const commonSymptoms = [
  "Sốt", "Ho", "Đau họng", "Sổ mũi", "Đau đầu", "Chóng mặt",
  "Buồn nôn", "Nôn", "Tiêu chảy", "Táo bón", "Đau bụng",
  "Đau ngực", "Khó thở", "Mệt mỏi", "Mất ngủ", "Chán ăn",
  "Đau khớp", "Đau cơ", "Ngứa", "Phát ban", "Sưng",
  "Chảy máu", "Bầm tím", "Tê", "Yếu cơ", "Co giật"
];

const commonAllergies = [
  "Không có", "Thuốc kháng sinh", "Aspirin", "Ibuprofen",
  "Paracetamol", "Thực phẩm", "Phấn hoa", "Bụi", "Lông thú",
  "Latex", "Thuốc gây mê", "Thuốc cản quang"
];

const commonMedications = [
  "Không có", "Thuốc huyết áp", "Thuốc tiểu đường", "Thuốc tim mạch",
  "Thuốc kháng sinh", "Thuốc giảm đau", "Thuốc kháng viêm",
  "Thuốc chống dị ứng", "Thuốc ngủ", "Thuốc an thần",
  "Vitamin", "Thực phẩm chức năng"
];

export default function ExaminationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('id');
  const patientId = searchParams.get('patientId');
  const printRef = useRef<HTMLDivElement>(null);
  
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [examinationData, setExaminationData] = useState<ExaminationData>({
    appointmentDate: '',
    appointmentTime: '',
    doctorName: '',
    roomNumber: '',
    vitalSigns: {
      bloodPressure: '',
      temperature: '',
      heartRate: '',
      weight: '',
      height: ''
    },
    symptoms: [],
    allergies: [],
    medications: [],
    notes: '',
    recommendations: '',
    diagnosis: '',
    followUpDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !appointmentId || !patientId) {
      if (!appointmentId || !patientId) {
        alert("Thiếu thông tin cuộc hẹn!");
        router.push("/doctor/schedule");
      }
      return;
    }

    // Fetch thông tin cuộc hẹn và dữ liệu khám bệnh (nếu có)
    const fetchData = async () => {
      try {
        // 1. Lấy thông tin cuộc hẹn
        const appointmentResponse = await fetch(`${API_URL}/api/appointments/${appointmentId}/details`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!appointmentResponse.ok) {
          throw new Error('Không thể lấy thông tin cuộc hẹn');
        }

        const appointmentData = await appointmentResponse.json();
        
        // Cập nhật thông tin bệnh nhân
        setPatientInfo({
          id: appointmentData.customer_id,
          name: appointmentData.name,
          email: appointmentData.email,
          phone: appointmentData.phone,
          age: appointmentData.age,
          gender: appointmentData.gender,
          address: appointmentData.address || 'Không có thông tin',
          note: appointmentData.reason || 'Không có ghi chú'
        });

        // Cập nhật thông tin cuộc hẹn
        setExaminationData(prev => ({
          ...prev,
          appointmentDate: appointmentData.slot_date,
          appointmentTime: `${appointmentData.start_time} - ${appointmentData.end_time}`,
          doctorName: appointmentData.doctor_name,
          roomNumber: appointmentData.room_number
        }));

        // 2. Lấy dữ liệu khám bệnh đã lưu (nếu có)
        const medicalResponse = await fetch(`${API_URL}/api/examination/${appointmentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (medicalResponse.ok) {
          const examinationData = await medicalResponse.json();
          
          if (examinationData.hasRecord) {
            const record = examinationData.record;
            
            // Cập nhật dữ liệu khám bệnh đã lưu
            setExaminationData(prev => ({
              ...prev,
              vitalSigns: {
                temperature: record.temperature || '',
                bloodPressure: record.blood_pressure || '',
                heartRate: record.heart_rate || '',
                weight: record.weight || '',
                height: record.height || ''
              },
                             symptoms: record.symptoms || [],
               allergies: record.allergies || [],
               medications: record.medications || [],
               notes: record.notes || '',
               diagnosis: record.diagnosis || '',
               recommendations: record.recommendations || '',
               followUpDate: record.follow_up_date || ''
            }));
          }
        }

      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        alert('Không thể lấy thông tin cuộc hẹn. Vui lòng thử lại.');
        router.push("/doctor/schedule");
        return;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appointmentId, patientId, router, mounted]);

  const handleSymptomToggle = (symptom: string) => {
    setExaminationData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleAllergyToggle = (allergy: string) => {
    setExaminationData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  const handleMedicationToggle = (medication: string) => {
    setExaminationData(prev => ({
      ...prev,
      medications: prev.medications.includes(medication)
        ? prev.medications.filter(m => m !== medication)
        : [...prev.medications, medication]
    }));
  };

  const handleSave = async () => {
    if (!examinationData.diagnosis.trim()) {
      alert("Vui lòng nhập chẩn đoán!");
      return;
    }

    setSaving(true);
    try {
             // 1. Lưu dữ liệu khám bệnh vào database
       const saveResponse = await fetch(`${API_URL}/api/examination/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          appointmentId: parseInt(appointmentId!),
          patientId: parseInt(patientId!),
          vitalSigns: examinationData.vitalSigns,
          symptoms: examinationData.symptoms,
          allergies: examinationData.allergies,
          medications: examinationData.medications,
          notes: examinationData.notes,
          diagnosis: examinationData.diagnosis,
          recommendations: examinationData.recommendations,
          followUpDate: examinationData.followUpDate,
          status: 'draft' // Lưu dưới dạng nháp
        })
      });

      if (!saveResponse.ok) {
        let errorMessage = 'Không thể lưu dữ liệu khám bệnh';
        try {
          const errorData = await saveResponse.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Không thể parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      let saveResult;
      try {
        saveResult = await saveResponse.json();
        console.log('Lưu dữ liệu khám bệnh:', saveResult);
      } catch (parseError) {
        console.error('Không thể parse success response:', parseError);
        saveResult = { message: 'Lưu thành công' };
      }

      // 2. Cập nhật trạng thái cuộc hẹn thành "Đang khám"
      const statusResponse = await fetch(`${API_URL}/api/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          status: 'Đang khám'
        })
      });

      if (!statusResponse.ok) {
        let errorMessage = 'Không thể cập nhật trạng thái cuộc hẹn';
        try {
          const errorData = await statusResponse.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Không thể parse status error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      alert("✅ Đã lưu thông tin khám bệnh thành công!");
      
      // Chuyển về trang lịch khám và refresh hoàn toàn
      window.location.href = "/doctor/schedule";
      
    } catch (error) {
      console.error('Lỗi khi lưu thông tin:', error);
      alert("❌ Lỗi khi lưu thông tin! Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteExamination = async () => {
    if (!examinationData.diagnosis.trim()) {
      alert("Vui lòng nhập chẩn đoán trước khi hoàn tất!");
      return;
    }

    setSaving(true);
    try {
             // 1. Lưu dữ liệu khám bệnh vào database với trạng thái hoàn thành
       const saveResponse = await fetch(`${API_URL}/api/examination/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          appointmentId: parseInt(appointmentId!),
          patientId: parseInt(patientId!),
          vitalSigns: examinationData.vitalSigns,
          symptoms: examinationData.symptoms,
          allergies: examinationData.allergies,
          medications: examinationData.medications,
          notes: examinationData.notes,
          diagnosis: examinationData.diagnosis,
          recommendations: examinationData.recommendations,
          followUpDate: examinationData.followUpDate,
          status: 'completed' // Lưu dưới dạng hoàn thành
        })
      });

      if (!saveResponse.ok) {
        let errorMessage = 'Không thể lưu dữ liệu khám bệnh';
        try {
          const errorData = await saveResponse.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Không thể parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      let saveResult;
      try {
        saveResult = await saveResponse.json();
        console.log('Lưu dữ liệu khám bệnh hoàn thành:', saveResult);
      } catch (parseError) {
        console.error('Không thể parse success response:', parseError);
        saveResult = { message: 'Lưu thành công' };
      }

      // 2. Cập nhật trạng thái cuộc hẹn thành "Đã khám xong"
      const statusResponse = await fetch(`${API_URL}/api/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          status: 'Đã khám xong'
        })
      });

      if (!statusResponse.ok) {
        let errorMessage = 'Không thể cập nhật trạng thái cuộc hẹn';
        try {
          const errorData = await statusResponse.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Không thể parse status error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      alert("✅ Đã hoàn tất khám bệnh! Bệnh nhân có thể thanh toán.");
      
      // Set flag để trang schedule biết cần refresh dữ liệu
      sessionStorage.setItem('returningFromExamination', 'true');
      
      // Chuyển về trang lịch khám và refresh hoàn toàn
      window.location.href = "/doctor/schedule";
      
    } catch (error) {
      console.error('Lỗi khi hoàn tất khám:', error);
      alert("❌ Lỗi khi hoàn tất khám! Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    setShowPrintPreview(true);
    setTimeout(() => {
      window.print();
      setShowPrintPreview(false);
    }, 100);
  };

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`phieu-kham-benh-${appointmentId}.pdf`);
    } catch (error) {
      console.error('Lỗi khi xuất PDF:', error);
      alert('Không thể xuất PDF. Vui lòng thử lại.');
    }
  };

  if (!mounted || loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" suppressHydrationWarning>
        <Sidebardoctor />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">
              {!mounted ? 'Đang khởi tạo...' : 'Đang tải thông tin bệnh nhân...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" suppressHydrationWarning>
      <Sidebardoctor />
      
      <div className="flex-1 overflow-x-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-lg sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => router.push("/doctor/schedule")}
                  className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <div className="bg-white/20 p-2 rounded-xl">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Khám bệnh</h1>
                  <p className="text-blue-100 text-sm">Cuộc hẹn #{appointmentId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowPrintPreview(true)}
                  className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition"
                  title="Xem trước"
                >
                  <Eye className="w-5 h-5 text-white" />
                </button>
                <button 
                  onClick={handleExportPDF}
                  className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition"
                  title="Xuất PDF"
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
                <button 
                  onClick={handlePrint}
                  className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition"
                  title="In"
                >
                  <Printer className="w-5 h-5 text-white" />
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition disabled:opacity-50"
                  title="Lưu tạm thời"
                >
                  <Save className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Patient Info & Vital Signs */}
            <div className="lg:col-span-1 space-y-4">
              {/* Patient Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2 text-blue-600" />
                  Thông tin bệnh nhân
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <User className="w-3 h-3 text-gray-500" />
                    <span><strong>Họ tên:</strong> {patientInfo?.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    <span><strong>Tuổi:</strong> {patientInfo?.age} tuổi</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-3 h-3 text-gray-500" />
                    <span><strong>Giới tính:</strong> {patientInfo?.gender}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3 h-3 text-gray-500" />
                    <span><strong>Điện thoại:</strong> {patientInfo?.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3 h-3 text-gray-500" />
                    <span><strong>Email:</strong> {patientInfo?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <span><strong>Địa chỉ:</strong> {patientInfo?.address}</span>
                  </div>
                  {patientInfo?.note && (
                    <div className="pt-2 border-t border-gray-100">
                      <p><strong>Ghi chú:</strong> {patientInfo.note}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vital Signs */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-green-600" />
                  Dấu hiệu sinh tồn
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      <Thermometer className="w-3 h-3 inline mr-1" />
                      Nhiệt độ (°C)
                    </label>
                    <input
                      type="text"
                      value={examinationData.vitalSigns.temperature}
                      onChange={(e) => setExaminationData(prev => ({ 
                        ...prev, 
                        vitalSigns: { ...prev.vitalSigns, temperature: e.target.value }
                      }))}
                      placeholder="36.5"
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      <Heart className="w-3 h-3 inline mr-1" />
                      Huyết áp (mmHg)
                    </label>
                    <input
                      type="text"
                      value={examinationData.vitalSigns.bloodPressure}
                      onChange={(e) => setExaminationData(prev => ({ 
                        ...prev, 
                        vitalSigns: { ...prev.vitalSigns, bloodPressure: e.target.value }
                      }))}
                      placeholder="120/80"
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      <Activity className="w-3 h-3 inline mr-1" />
                      Nhịp tim (lần/phút)
                    </label>
                    <input
                      type="text"
                      value={examinationData.vitalSigns.heartRate}
                      onChange={(e) => setExaminationData(prev => ({ 
                        ...prev, 
                        vitalSigns: { ...prev.vitalSigns, heartRate: e.target.value }
                      }))}
                      placeholder="72"
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        <Weight className="w-3 h-3 inline mr-1" />
                        Cân nặng (kg)
                      </label>
                      <input
                        type="text"
                        value={examinationData.vitalSigns.weight}
                        onChange={(e) => setExaminationData(prev => ({ 
                          ...prev, 
                          vitalSigns: { ...prev.vitalSigns, weight: e.target.value }
                        }))}
                        placeholder="65"
                        className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        <Ruler className="w-3 h-3 inline mr-1" />
                        Chiều cao (cm)
                      </label>
                      <input
                        type="text"
                        value={examinationData.vitalSigns.height}
                        onChange={(e) => setExaminationData(prev => ({ 
                          ...prev, 
                          vitalSigns: { ...prev.vitalSigns, height: e.target.value }
                        }))}
                        placeholder="170"
                        className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Examination Forms */}
            <div className="lg:col-span-2 space-y-4">
              {/* Symptoms Selection */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-orange-600" />
                  Triệu chứng
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                  {commonSymptoms.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => handleSymptomToggle(symptom)}
                      className={`p-2 text-xs rounded-lg border transition ${
                        examinationData.symptoms.includes(symptom)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Triệu chứng khác
                  </label>
                  <textarea
                    value={examinationData.notes}
                    onChange={(e) => setExaminationData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Mô tả thêm các triệu chứng khác..."
                    rows={2}
                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Allergies & Medications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Allergies */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                    Dị ứng
                  </h3>
                  <div className="space-y-1">
                    {commonAllergies.map((allergy) => (
                      <button
                        key={allergy}
                        onClick={() => handleAllergyToggle(allergy)}
                        className={`w-full p-2 text-xs rounded-lg border transition text-left ${
                          examinationData.allergies.includes(allergy)
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {allergy}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Medications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Pill className="w-4 h-4 mr-2 text-purple-600" />
                    Thuốc đang dùng
                  </h3>
                  <div className="space-y-1">
                    {commonMedications.map((medication) => (
                      <button
                        key={medication}
                        onClick={() => handleMedicationToggle(medication)}
                        className={`w-full p-2 text-xs rounded-lg border transition text-left ${
                          examinationData.medications.includes(medication)
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {medication}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Diagnosis & Recommendations */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                  Chẩn đoán & Điều trị
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Chẩn đoán *
                    </label>
                    <input
                      type="text"
                      value={examinationData.diagnosis}
                      onChange={(e) => setExaminationData(prev => ({ ...prev, diagnosis: e.target.value }))}
                      placeholder="VD: Viêm họng cấp, Cảm cúm..."
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Khuyến nghị & Hướng dẫn
                    </label>
                    <textarea
                      value={examinationData.recommendations}
                      onChange={(e) => setExaminationData(prev => ({ ...prev, recommendations: e.target.value }))}
                      placeholder="Lời khuyên, hướng dẫn..."
                      rows={3}
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Ngày tái khám (nếu có)
                    </label>
                    <input
                      type="date"
                      value={examinationData.followUpDate}
                      onChange={(e) => setExaminationData(prev => ({ ...prev, followUpDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center space-x-2 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Đang lưu...' : 'Lưu tạm thời'}</span>
                  </button>
                  <button
                    onClick={handleCompleteExamination}
                    disabled={saving || !examinationData.diagnosis.trim()}
                    className="flex-1 bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 flex items-center justify-center space-x-2 text-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>{saving ? 'Đang xử lý...' : 'Hoàn tất khám'}</span>
                  </button>
                  <button
                    onClick={() => router.push("/doctor/schedule")}
                    className="flex-1 bg-gray-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-700 transition flex items-center justify-center space-x-2 text-sm"
                  >
                    <X className="w-4 h-4" />
                    <span>Hủy</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Preview Modal */}
      {showPrintPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6" ref={printRef}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">PHIẾU KHÁM BỆNH</h2>
                <p className="text-gray-600 mt-1">TDCARE - Hệ thống quản lý y tế</p>
              </div>
              
              {/* Patient Info */}
              <div className="mb-4 p-3 border border-gray-200 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-gray-800">Thông tin bệnh nhân</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <p><strong>Họ tên:</strong> {patientInfo?.name}</p>
                  <p><strong>Tuổi:</strong> {patientInfo?.age} tuổi</p>
                  <p><strong>Giới tính:</strong> {patientInfo?.gender}</p>
                  <p><strong>Điện thoại:</strong> {patientInfo?.phone}</p>
                </div>
              </div>

              {/* Vital Signs */}
              <div className="mb-4 p-3 border border-gray-200 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-gray-800">Dấu hiệu sinh tồn</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <p><strong>Nhiệt độ:</strong> {examinationData.vitalSigns.temperature || 'N/A'} °C</p>
                  <p><strong>Huyết áp:</strong> {examinationData.vitalSigns.bloodPressure || 'N/A'} mmHg</p>
                  <p><strong>Nhịp tim:</strong> {examinationData.vitalSigns.heartRate || 'N/A'} lần/phút</p>
                  <p><strong>Cân nặng:</strong> {examinationData.vitalSigns.weight || 'N/A'} kg</p>
                  <p><strong>Chiều cao:</strong> {examinationData.vitalSigns.height || 'N/A'} cm</p>
                </div>
              </div>

              {/* Symptoms */}
              {examinationData.symptoms.length > 0 && (
                <div className="mb-4 p-3 border border-gray-200 rounded-lg">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">Triệu chứng</h3>
                  <p className="text-sm">{examinationData.symptoms.join(', ')}</p>
                </div>
              )}

              {/* Diagnosis */}
              <div className="mb-4 p-3 border border-gray-200 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-gray-800">Chẩn đoán</h3>
                <p className="text-lg text-gray-800">{examinationData.diagnosis || 'Chưa có chẩn đoán'}</p>
              </div>



              {/* Recommendations */}
              {examinationData.recommendations && (
                <div className="mb-4 p-3 border border-gray-200 rounded-lg">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">Khuyến nghị & Hướng dẫn</h3>
                  <p className="text-sm">{examinationData.recommendations}</p>
                </div>
              )}

              {/* Follow-up */}
              {examinationData.followUpDate && (
                <div className="mb-4 p-3 border border-gray-200 rounded-lg">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">Lịch tái khám</h3>
                  <p className="text-sm">{new Date(examinationData.followUpDate).toLocaleDateString('vi-VN')}</p>
                </div>
              )}

              {/* Appointment Info */}
              <div className="mb-4 p-3 border border-gray-200 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-gray-800">Thông tin cuộc hẹn</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <p><strong>Ngày khám:</strong> {examinationData.appointmentDate}</p>
                  <p><strong>Giờ khám:</strong> {examinationData.appointmentTime}</p>
                  <p><strong>Bác sĩ:</strong> {examinationData.doctorName}</p>
                  <p><strong>Phòng:</strong> {examinationData.roomNumber}</p>
                </div>
              </div>

              <div className="text-center text-xs text-gray-500 mt-6 pt-4 border-t border-gray-200">
                <p>Ngày in: {new Date().toLocaleDateString('vi-VN')}</p>
                <p>Bác sĩ khám: {examinationData.doctorName}</p>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex justify-center space-x-3">
                <button
                  onClick={handleExportPDF}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Xuất PDF
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                >
                  <Printer className="w-4 h-4 inline mr-2" />
                  In
                </button>
                <button
                  onClick={() => setShowPrintPreview(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
                >
                  <X className="w-4 h-4 inline mr-2" />
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
