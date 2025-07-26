"use client";
import React, { useEffect, useState, useCallback } from 'react';
import Sidebardoctor from '@/components/layout/Sidebardoctor';

interface PatientAppointment {
  appointment_id: number;
  patient_name: string;
  patient_email: string;
  reason: string;
  customer_id: number;
  doctor_id: number;
  medical_record_id: number | null;
  diagnosis: string | null;
  treatment: string | null;
  notes: string | null;
  created_at: string | null;
  customer_name?: string; // tên tài khoản đặt lịch
}

interface MedicalRecordHistory {
  appointment_id: number;
  customer_id: number;
  diagnosis: string | null;
  doctor_note: string | null;
  follow_up_date: string | null;
  reason: string | null;
  start_time?: string | null;
  end_time?: string | null;
  created_at?: string | null;
  patient_name?: string; // tên bệnh nhân từng ca khám
}


export default function PatientMedicalRecordsPage() {
  const [patients, setPatients] = useState<PatientAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [history, setHistory] = useState<MedicalRecordHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

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

  // Lấy lịch sử hồ sơ bệnh án của tài khoản đặt lịch
  const fetchMedicalRecordHistory = async (customerId: number) => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`http://localhost:5000/api/medical-records/history/${customerId}`);
      if (!res.ok) throw new Error('Không thể tải lịch sử hồ sơ bệnh án.');
      const data = await res.json();
      setHistory(data);
    } catch (err: any) {
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

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

  // Nhóm theo customer_id
  const customers = Array.from(
    patients.reduce((map, p) => {
      if (!map.has(p.customer_id)) {
        map.set(p.customer_id, {
          customer_id: p.customer_id,
          customer_name: p.customer_name || '', // chỉ lấy tên tài khoản từ backend
          patient_email: p.patient_email
        });
      }
      return map;
    }, new Map<number, { customer_id: number; customer_name: string; patient_email: string }>() ).values()
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebardoctor />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Hồ Sơ Bệnh Án</h1>
        {isLoading && <p>Đang tải dữ liệu...</p>}
        {error && <p className="text-red-500 bg-red-100 p-3 rounded">{error}</p>}
        {!isLoading && !error && (
          <div className="space-y-4">
            {customers.map((c) => (
              <div key={c.customer_id} className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                {/* Bỏ header ID người dùng đặt lịch và tên bệnh nhân */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center text-blue-600 text-2xl font-bold shadow-sm">
                      <span>{c.customer_name && c.customer_name.trim().length > 0 ? c.customer_name.charAt(0).toUpperCase() : 'N'}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                        {c.customer_name && c.customer_name.trim().length > 0 ? c.customer_name : 'Chưa có tên'}
                        <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-200 text-blue-800 font-semibold">ID: {c.customer_id}</span>
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (selectedCustomerId === c.customer_id) {
                        setSelectedCustomerId(null);
                        setHistory([]);
                      } else {
                        setSelectedCustomerId(c.customer_id);
                        fetchMedicalRecordHistory(c.customer_id);
                      }
                    }}
                    className={`px-5 py-2 rounded-lg font-semibold text-sm shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${selectedCustomerId === c.customer_id ? 'bg-gray-300 text-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    {selectedCustomerId === c.customer_id ? 'Đóng' : 'Xem hồ sơ'}
                  </button>
                </div>
                {selectedCustomerId === c.customer_id && (
                  <div className="mt-6 border-t border-blue-100 pt-6">
                    <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl shadow-sm">
                      <h4 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">🕑 Lịch sử các lần đặt lịch khám</h4>
                      {loadingHistory ? (
                        <div className="flex items-center gap-2 text-blue-500"><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> Đang tải lịch sử...</div>
                      ) : history.length === 0 ? (
                        <div className="text-gray-400 italic">Không có lịch sử khám.</div>
                      ) : (
                        <div className="relative pl-8 before:content-[''] before:absolute before:top-0 before:left-3 before:w-1 before:h-full before:bg-blue-100 before:rounded-full">
                          {history.map((h, idx) => (
                            <div key={h.appointment_id || idx} className="relative mb-8 group">
                              <div className="absolute -left-1.5 top-2 w-7 h-7 bg-white border-2 border-blue-400 rounded-full flex items-center justify-center shadow group-hover:bg-blue-500 group-hover:border-blue-600 transition-colors">
                                <span className="text-blue-500 group-hover:text-white font-bold text-lg">{idx + 1}</span>
                              </div>
                              <div className="ml-8 bg-white border border-blue-100 rounded-xl p-4 shadow group-hover:shadow-lg transition-shadow">
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="font-semibold text-blue-700">Tên bệnh nhân:</span> <span className="text-blue-900">{h.patient_name || ''}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="font-semibold text-gray-700">Ca khám:</span> <span className="text-gray-900">{h.appointment_id}</span>
                                    {h.start_time && h.end_time && (
                                      <span className="ml-2 text-gray-500">({h.start_time.substring(0,5)} - {h.end_time.substring(0,5)})</span>
                                    )}
                                  </div>
                                  {h.created_at && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="font-semibold text-gray-700">Thời gian đặt lịch:</span> <span className="text-gray-900">{new Date(h.created_at).toLocaleString()}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="font-semibold text-gray-700">Lý do khám:</span> <span className="text-gray-900">{h.reason || 'Không rõ'}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="font-semibold text-gray-700">Chẩn đoán:</span> <span className="text-gray-900">{h.diagnosis || 'Chưa có'}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="font-semibold text-gray-700">Ngày tái khám:</span> <span className="text-gray-900">{h.follow_up_date ? new Date(h.follow_up_date).toLocaleDateString() : 'Không rõ'}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="font-semibold text-gray-700">Ghi chú bác sĩ:</span> <span className="text-gray-900">{h.doctor_note || 'Chưa có'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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