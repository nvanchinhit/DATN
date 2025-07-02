'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Sidebardoctor from '@/components/layout/Sidebardoctor';

// Interface không cần trường 'prescription' nữa
interface PatientAppointment {
  appointment_id: number;
  patient_name: string;
  patient_email: string; 
  reason: string;
  customer_id: number;
  doctor_id: number;
  medical_record_id: number | null;
  diagnosis: string | null;
  treatment: string | null; // Đây là ghi chú nội bộ của bác sĩ
  notes: string | null;
  created_at: string | null;
}

export default function PatientMedicalRecordsPage() {
  const [patients, setPatients] = useState<PatientAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  
  // State cho form tạo hồ sơ
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');

  // State MỚI dành riêng cho form soạn đơn thuốc
  const [prescriptionText, setPrescriptionText] = useState('');
  const [sendingEmailId, setSendingEmailId] = useState<number | null>(null);

  const fetchPatientData = useCallback((doctorId: number) => {
    setIsLoading(true);
    fetch(`http://localhost:5000/api/medical-records/doctor/${doctorId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải dữ liệu bệnh nhân.');
        return res.json();
      })
      .then((data) => setPatients(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const doctorInfoString = localStorage.getItem('user');
    if (doctorInfoString) {
      const loggedInDoctor = JSON.parse(doctorInfoString);
      fetchPatientData(loggedInDoctor.id);
    } else {
      setError("Không tìm thấy thông tin bác sĩ.");
      setIsLoading(false);
    }
  }, [fetchPatientData]);

  // Hàm lưu hồ sơ (chỉ lưu chẩn đoán và ghi chú điều trị nội bộ)
  const handleSaveRecord = async (appointment: PatientAppointment) => {
    if (!diagnosis || !treatment) {
      alert('Vui lòng điền đầy đủ Chẩn đoán và Phương pháp điều trị (ghi chú).');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/medical-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointment_id: appointment.appointment_id,
          doctor_id: appointment.doctor_id,
          customer_id: appointment.customer_id,
          diagnosis,
          treatment, // Ghi chú nội bộ
          notes,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Có lỗi xảy ra khi lưu hồ sơ.');
      }

      alert('✅ Đã lưu hồ sơ bệnh án thành công!');
      
      setDiagnosis('');
      setTreatment('');
      setNotes('');
      
      const doctorInfoString = localStorage.getItem('user');
      if (doctorInfoString) {
        const loggedInDoctor = JSON.parse(doctorInfoString);
        fetchPatientData(loggedInDoctor.id);
      }
    } catch (err: any) {
      alert(`❌ Lỗi: ${err.message}`);
    }
  };

  // HÀM GỬI EMAIL ĐÃ CẬP NHẬT
  const handleSendPrescription = async (appointment: PatientAppointment) => {
    if (!prescriptionText.trim()) {
      alert('Vui lòng nhập nội dung đơn thuốc.');
      return;
    }

    setSendingEmailId(appointment.appointment_id);
    try {
      const response = await fetch(`http://localhost:5000/api/auth/medical-records/send-prescription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medical_record_id: appointment.medical_record_id,
          prescription_text: prescriptionText, // Gửi nội dung từ form
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.msg || 'Không thể gửi đơn thuốc.');
      }

      alert(`✅ Đã gửi đơn thuốc thành công đến email: ${appointment.patient_email}`);
      setPrescriptionText(''); // Xóa nội dung form sau khi gửi thành công

    } catch (err: any) {
      alert(`❌ Lỗi khi gửi đơn thuốc: ${err.message}`);
    } finally {
      setSendingEmailId(null);
    }
  }
  
  // --- Giao diện chính ---
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebardoctor />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Hồ Sơ Bệnh Án</h1>
        {isLoading && <p>Đang tải dữ liệu...</p>}
        {error && <p className="text-red-500 bg-red-100 p-3 rounded">{error}</p>}
        {!isLoading && !error && (
          <div className="space-y-4">
            {patients.map((p) => (
              <div key={p.appointment_id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900">{p.patient_name}</h3>
                    <p className="text-sm text-gray-600 mt-1">📝 <span className="font-medium">Lý do khám:</span> {p.reason}</p>
                  </div>
                  <button onClick={() => setSelectedPatientId(selectedPatientId === p.appointment_id ? null : p.appointment_id)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium">
                    {selectedPatientId === p.appointment_id ? 'Đóng' : (p.medical_record_id ? 'Xem / Gửi Đơn' : 'Tạo Hồ Sơ')}
                  </button>
                </div>
                {selectedPatientId === p.appointment_id && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    {!p.medical_record_id ? (
                      // FORM TẠO HỒ SƠ (GHI CHÚ NỘI BỘ)
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-semibold text-gray-800 text-lg mb-3">🩺 Tạo hồ sơ bệnh án</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Chẩn đoán <span className="text-red-500">*</span></label>
                            <textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="w-full border-gray-300 rounded-md p-2" rows={3} placeholder="Nhập chẩn đoán..." />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phương pháp điều trị (Ghi chú nội bộ) <span className="text-red-500">*</span></label>
                            <textarea value={treatment} onChange={(e) => setTreatment(e.target.value)} className="w-full border-gray-300 rounded-md p-2" rows={3} placeholder="Ghi chú hướng điều trị cho lần sau..." />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú thêm</label>
                            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border-gray-300 rounded-md p-2" rows={2} placeholder="Ghi chú khác (nếu có)..." />
                          </div>
                          <button onClick={() => handleSaveRecord(p)} className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 font-semibold">💾 Lưu Hồ Sơ</button>
                        </div>
                      </div>
                    ) : (
                      // KHU VỰC HIỂN THỊ HỒ SƠ ĐÃ LƯU VÀ FORM GỬI ĐƠN THUỐC
                      <div>
                        {/* 1. Hiển thị thông tin nội bộ đã lưu */}
                        <div className="bg-blue-50 border border-blue-300 p-4 rounded-md mb-4">
                          <h4 className="text-lg font-semibold text-blue-800 mb-3">📄 Thông tin hồ sơ đã lưu</h4>
                          <p><strong>Chẩn đoán:</strong> {p.diagnosis}</p>
                          <p><strong>Ghi chú điều trị (Nội bộ):</strong> {p.treatment}</p>
                          {p.notes && <p><strong>Ghi chú thêm:</strong> {p.notes}</p>}
                        </div>

                        {/* 2. Form soạn và gửi đơn thuốc */}
                        <div className="bg-green-50 border border-green-300 p-4 rounded-md">
                          <h4 className="text-lg font-semibold text-green-800 mb-3">📧 Soạn và Gửi Đơn Thuốc cho Bệnh nhân</h4>
                          <div className="space-y-3">
                            <label htmlFor={`prescription-${p.appointment_id}`} className="block text-sm font-medium text-gray-700">Nội dung đơn thuốc</label>
                            <textarea
                              id={`prescription-${p.appointment_id}`}
                              value={prescriptionText}
                              onChange={(e) => setPrescriptionText(e.target.value)}
                              className="w-full border-gray-300 rounded-md p-2"
                              rows={5}
                              placeholder="Ví dụ:
1. Paracetamol 500mg (20 viên)
   - Uống 1 viên sau khi ăn, 3 lần/ngày.
2. Amoxicillin 500mg (14 viên)
   - Uống 1 viên sau khi ăn, 2 lần/ngày."
                            />
                            <button
                              onClick={() => handleSendPrescription(p)}
                              disabled={sendingEmailId === p.appointment_id}
                              className="bg-sky-600 text-white px-5 py-2 rounded-md hover:bg-sky-700 font-semibold text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              {sendingEmailId === p.appointment_id ? 'Đang gửi...' : 'Gửi Đơn Thuốc Qua Email'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}