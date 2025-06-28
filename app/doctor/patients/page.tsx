'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebardoctor from '@/components/layout/Sidebardoctor';

// Định nghĩa kiểu dữ liệu cho rõ ràng
interface Doctor {
  id: number;
  name: string;
  email: string;
  account_status: 'active' | 'pending' | 'inactive';
  // Thêm các thuộc tính khác của doctor nếu cần
}

interface PatientAppointment {
  appointment_id: number;
  patient_name: string;
  reason: string;
  customer_id: number;
  doctor_id: number;
  medical_record_id: number | null;
  diagnosis: string | null;
  treatment: string | null;
  notes: string | null;
  created_at: string | null;
}

export default function PatientMedicalRecordsPage() {
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patients, setPatients] = useState<PatientAppointment[]>([]);
  
  // State quản lý trạng thái tải và lỗi
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  
  // State cho form tạo mới
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');

  // Hàm fetch dữ liệu bệnh nhân dựa trên ID bác sĩ
  const fetchPatientData = (doctorId: number) => {
    fetch(`http://localhost:5000/api/medical-records/doctor/${doctorId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải dữ liệu bệnh nhân.');
        return res.json();
      })
      .then((data) => {
        setPatients(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setPatients([]);
      });
  };

  // useEffect chính để kiểm tra đăng nhập và tải dữ liệu
  useEffect(() => {
    const doctorInfoString = localStorage.getItem('user');
    
    if (!doctorInfoString) {
      // Nếu không có thông tin, chuyển hướng về trang đăng nhập
      router.push('/doctor/login');
      return;
    }

    try {
      const loggedInDoctor: Doctor = JSON.parse(doctorInfoString);
      setDoctor(loggedInDoctor);

      if (loggedInDoctor.account_status === 'active') {
        fetchPatientData(loggedInDoctor.id);
      }
      
    } catch (e) {
      console.error("Lỗi khi đọc thông tin bác sĩ:", e);
      localStorage.removeItem('user'); // Xóa dữ liệu hỏng
      router.push('/doctor/login');
    } finally {
        setIsLoading(false); // Dừng loading sau khi kiểm tra xong
    }
  }, [router]); // Thêm router vào dependencies

  // Hàm xử lý lưu hồ sơ
  const handleSaveRecord = async (appointment: PatientAppointment) => {
    if (!diagnosis || !treatment) {
      alert('Vui lòng điền đầy đủ Chẩn đoán và Điều trị.');
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
          treatment,
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
      
      // Tải lại dữ liệu cho bác sĩ hiện tại
      if (doctor) {
        fetchPatientData(doctor.id);
      }

    } catch (err: any) {
      alert(`❌ Lỗi: ${err.message}`);
    }
  };
  
  // --- Các thành phần UI render ---

  if (isLoading || !doctor) {
    return (
       <div className="flex min-h-screen">
        <Sidebardoctor />
        <main className="flex-1 flex items-center justify-center bg-gray-50 p-6">
            <p>Đang kiểm tra xác thực và tải dữ liệu...</p>
        </main>
      </div>
    );
  }

  if (doctor.account_status !== 'active') {
    return (
      <div className="flex h-screen font-sans bg-gray-50">
        <Sidebardoctor />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded shadow-lg max-w-lg">
            <h2 className="text-xl font-semibold mb-2">
              {doctor.account_status === 'pending' ? '⏳ Tài khoản đang chờ xét duyệt' : '⚠️ Tài khoản chưa được kích hoạt'}
            </h2>
            <p>Vui lòng chờ quản trị viên phê duyệt hoặc hoàn tất hồ sơ để có thể truy cập chức năng này.</p>
          </div>
        </div>
      </div>
    );
  }

  // Giao diện chính khi đã đăng nhập và tài khoản active
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebardoctor />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Hồ Sơ Bệnh Án</h1>

        {error && <p className="text-red-500 bg-red-100 p-3 rounded">{error}</p>}

        {patients.length === 0 ? (
          <p className="text-gray-600 mt-4">Hiện tại không có bệnh nhân nào đã xác nhận lịch hẹn.</p>
        ) : (
          <div className="space-y-4">
            {patients.map((p) => (
              <div key={p.appointment_id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-semibold text-blue-900">{p.patient_name}</h3>
                        <p className="text-sm text-gray-600 mt-1">📝 <span className="font-medium">Lý do khám:</span> {p.reason}</p>
                    </div>
                    <button
                      onClick={() => setSelectedPatientId(selectedPatientId === p.appointment_id ? null : p.appointment_id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                      {selectedPatientId === p.appointment_id ? 'Đóng' : 'Xem / Tạo Hồ Sơ'}
                    </button>
                </div>

                {selectedPatientId === p.appointment_id && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    {!p.medical_record_id ? (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-semibold text-gray-800 text-lg mb-3">🩺 Tạo hồ sơ bệnh án mới</h4>
                        <div className="space-y-4">
                          {/* Form fields here, same as before */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Chẩn đoán <span className="text-red-500">*</span></label>
                            <textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="w-full border-gray-300 rounded-md p-2" rows={3} placeholder="Nhập chẩn đoán..." />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phương pháp điều trị <span className="text-red-500">*</span></label>
                            <textarea value={treatment} onChange={(e) => setTreatment(e.target.value)} className="w-full border-gray-300 rounded-md p-2" rows={3} placeholder="Nhập hướng điều trị..." />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú thêm</label>
                            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border-gray-300 rounded-md p-2" rows={2} placeholder="Ghi chú (nếu có)..." />
                          </div>
                          <button onClick={() => handleSaveRecord(p)} className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 font-semibold">
                            💾 Lưu Hồ Sơ
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-300 p-4 rounded-md">
                        <h4 className="text-lg font-semibold text-green-800 mb-3">✅ Hồ sơ bệnh án đã được lưu</h4>
                        <p><strong>Chẩn đoán:</strong> {p.diagnosis}</p>
                        <p><strong>Điều trị:</strong> {p.treatment}</p>
                        {p.notes && <p><strong>Ghi chú:</strong> {p.notes}</p>}
                        <p className="text-sm text-gray-500 mt-2">📅 Ngày tạo: {new Date(p.created_at!).toLocaleString('vi-VN')}</p>
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