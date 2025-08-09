"use client";
import React, { useEffect, useState, useCallback } from 'react';
import Sidebardoctor from '@/components/layout/Sidebardoctor';

interface MedicalRecord {
  record_id: number;
  diagnosis: string;
  treatment: string | null;
  notes: string | null;
  doctor_note: string | null;
  follow_up_date: string | null;
  is_examined: boolean;
  created_at: string;
  updated_at: string;
  appointment_id: number;
  patient_name: string;
  age: number | null;
  gender: string | null;
  patient_email: string | null;
  patient_phone: string | null;
  address: string | null;
  reason: string | null;
  appointment_status: string | null;
  customer_name: string | null;
  customer_email: string | null;
  slot_date: string | null;
  start_time: string | null;
  end_time: string | null;
  visit_count?: number; // Số lần khám
}
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DoctorMedicalRecordsPage() {
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDiagnosis, setEditDiagnosis] = useState('');
  const [editTreatment, setEditTreatment] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editDoctorNote, setEditDoctorNote] = useState('');
  const [editFollowUpDate, setEditFollowUpDate] = useState('');

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

  const fetchMedicalRecords = useCallback(() => {
    if (!doctorId) return;
    setLoading(true);
    fetch(`${API_URL}/api/medical-records/doctor/${doctorId}/all-records`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải hồ sơ bệnh án.");
        return res.json();
      })
      .then((data) => {
        // Thêm số lần khám cho mỗi bệnh nhân
        const recordsWithVisitCount = data.map((record: MedicalRecord) => {
          const patientRecords = data.filter((r: MedicalRecord) => r.patient_name === record.patient_name);
          return {
            ...record,
            visit_count: patientRecords.length
          };
        });
        setRecords(recordsWithVisitCount);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [doctorId]);

  useEffect(() => {
    if (doctorId) fetchMedicalRecords();
  }, [doctorId, fetchMedicalRecords]);

  // Khi chọn hồ sơ để xem chi tiết, reset editMode và set giá trị form
  useEffect(() => {
    if (selectedRecord) {
      setEditMode(false);
      setEditDiagnosis(selectedRecord.diagnosis || '');
      setEditTreatment(selectedRecord.treatment || '');
      setEditNotes(selectedRecord.notes || '');
      setEditDoctorNote(selectedRecord.doctor_note || '');
      setEditFollowUpDate(selectedRecord.follow_up_date || '');
    }
  }, [selectedRecord]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMedicalRecords();
    setTimeout(() => setRefreshing(false), 1000);
  }, [fetchMedicalRecords]);

  const handleUpdateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    await fetch(`${API_URL}/api/medical-records/save-from-schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        appointment_id: selectedRecord.appointment_id,
        doctor_id: user.id,
        customer_id: selectedRecord.customer_name, // Nếu có customer_id thì dùng customer_id
        diagnosis: editDiagnosis,
        treatment: editTreatment,
        notes: editNotes,
        doctor_note: editDoctorNote,
        follow_up_date: editFollowUpDate
      })
    });
    setEditMode(false);
    setSelectedRecord(null);
    fetchMedicalRecords();
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch = searchTerm
      ? record.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesDate = filterDate 
      ? record.slot_date === filterDate 
      : true;
    
    return matchesSearch && matchesDate;
  });

  // Statistics
  const totalRecords = records.length;
  const thisMonthRecords = records.filter(record => {
    const recordDate = new Date(record.created_at);
    const now = new Date();
    return recordDate.getMonth() === now.getMonth() && 
           recordDate.getFullYear() === now.getFullYear();
  }).length;
  const pendingFollowUp = records.filter(record => 
    record.follow_up_date && new Date(record.follow_up_date) > new Date()
  ).length;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN');
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
                <div className="bg-white/20 p-3 rounded-2xl">
                  <span className="text-white text-2xl">📋</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">Hồ sơ bệnh án của tôi</h1>
                  <p className="text-blue-100 text-lg">Quản lý tất cả hồ sơ bệnh án đã tạo</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleRefresh} 
                  disabled={refreshing} 
                  className="bg-white/20 p-3 rounded-2xl hover:bg-white/30 group"
                >
                  <span className={`text-white text-xl transition-transform ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`}>
                    🔄
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all">
              <p className="text-sm font-medium text-blue-100">Tổng hồ sơ</p>
              <div className="flex justify-between items-end">
                <p className="text-4xl font-bold">{totalRecords}</p>
                <div className="bg-white/20 p-3 rounded-xl">
                  <span className="text-white text-2xl">📋</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all">
              <p className="text-sm font-medium text-green-100">Tháng này</p>
              <div className="flex justify-between items-end">
                <p className="text-4xl font-bold">{thisMonthRecords}</p>
                <div className="bg-white/20 p-3 rounded-xl">
                  <span className="text-white text-2xl">📈</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all">
              <p className="text-sm font-medium text-orange-100">Chờ tái khám</p>
              <div className="flex justify-between items-end">
                <p className="text-4xl font-bold">{pendingFollowUp}</p>
                <div className="bg-white/20 p-3 rounded-xl">
                  <span className="text-white text-2xl">⏰</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border p-6 mb-8">
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <span className="text-blue-600 text-lg">📅</span>
                </div>
                <input 
                  type="date" 
                  value={filterDate} 
                  onChange={(e) => setFilterDate(e.target.value)} 
                  className="border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm bệnh nhân, chẩn đoán..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-12 pr-4 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>
          </div>

          {/* Records List */}
          {loading && (
            <div className="text-center p-12">
              <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải hồ sơ bệnh án...</p>
            </div>
          )}

          {error && (
            <div className="text-center p-12 text-red-600">
              <span className="text-4xl mb-2 block">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredRecords.length === 0 && (
            <div className="text-center p-12 text-gray-500">
              <span className="text-6xl mb-4 block">📋</span>
              <h3>Không tìm thấy hồ sơ bệnh án nào.</h3>
            </div>
          )}

          {!loading && !error && filteredRecords.length > 0 && (
            <div className="space-y-6">
              {filteredRecords.map((record) => (
                <div 
                  key={record.record_id} 
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border p-6 hover:shadow-2xl transition-all cursor-pointer"
                  onClick={() => setSelectedRecord(record)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <span className="text-blue-600 text-xl">👤</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{record.patient_name}</h3>
                        <p className="text-gray-600">{record.customer_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{formatDate(record.slot_date)}</p>
                      <p className="text-sm text-gray-500">{record.start_time} - {record.end_time}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Chẩn đoán</p>
                      <p className="text-gray-800 font-semibold">{record.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Điều trị</p>
                      <p className="text-gray-800">{record.treatment || 'Chưa có'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <span className="mr-1">📞</span>
                        {record.patient_phone || 'N/A'}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">📧</span>
                        {record.patient_email || 'N/A'}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">🏥</span>
                        Lần khám: {record.visit_count || 1}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {record.follow_up_date && (
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                          Tái khám: {formatDate(record.follow_up_date)}
                        </span>
                      )}
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {formatDate(record.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal for Record Detail */}
          {selectedRecord && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
              <div className="bg-white max-w-4xl w-full mx-auto rounded-3xl shadow-2xl animate-in zoom-in-95 max-h-[95vh] flex flex-col">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 flex justify-between items-center rounded-t-3xl">
                  <div>
                    <h2 className="text-3xl font-bold">Chi tiết hồ sơ bệnh án</h2>
                    <p className="text-blue-200">ID: {selectedRecord.record_id}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => setEditMode(true)}
                    >
                      Sửa hồ sơ
                    </button>
                    <button 
                      onClick={() => setSelectedRecord(null)} 
                      className="p-2 rounded-full hover:bg-white/20"
                    >
                      <span className="text-2xl">×</span>
                    </button>
                  </div>
                </div>
                <div className="p-8 overflow-y-auto space-y-6">
                  {editMode ? (
                    <form onSubmit={handleUpdateRecord} className="space-y-4">
                      <div>
                        <label className="block font-semibold mb-1">Chẩn đoán *</label>
                        <input type="text" value={editDiagnosis} onChange={e => setEditDiagnosis(e.target.value)} required className="w-full p-2 border rounded" />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Điều trị</label>
                        <input type="text" value={editTreatment} onChange={e => setEditTreatment(e.target.value)} className="w-full p-2 border rounded" />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Ghi chú</label>
                        <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} className="w-full p-2 border rounded" />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Ghi chú bác sĩ</label>
                        <textarea value={editDoctorNote} onChange={e => setEditDoctorNote(e.target.value)} className="w-full p-2 border rounded" />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Ngày tái khám</label>
                        <input type="date" value={editFollowUpDate} onChange={e => setEditFollowUpDate(e.target.value)} className="w-full p-2 border rounded" />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Lưu</button>
                        <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setEditMode(false)}>Hủy</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      {/* Patient Info */}
                      <div className="bg-gray-50 p-6 rounded-2xl border">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span>👤</span>
                          Thông tin cá nhân
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                          <div className="flex justify-between">
                            <span className="font-semibold">Tên bệnh nhân:</span>
                            <span>{selectedRecord.patient_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Tài khoản:</span>
                            <span>{selectedRecord.customer_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Tuổi:</span>
                            <span>{selectedRecord.age || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Giới tính:</span>
                            <span>{selectedRecord.gender || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Số điện thoại:</span>
                            <span>{selectedRecord.patient_phone || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Email:</span>
                            <span>{selectedRecord.patient_email || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between col-span-full">
                            <span className="font-semibold">Địa chỉ:</span>
                            <span>{selectedRecord.address || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between col-span-full">
                            <span className="font-semibold">Số lần khám:</span>
                            <span className="font-bold text-blue-600">{selectedRecord.visit_count || 1}</span>
                          </div>
                          <div className="flex justify-between col-span-full">
                            <span className="font-semibold">Lý do khám:</span>
                            <span>{selectedRecord.reason || 'Không có'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Medical Record */}
                      <div className="bg-gray-50 p-6 rounded-2xl border">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span>🏥</span>
                          Thông tin bệnh án
                        </h3>
                        <div className="space-y-4 text-gray-700">
                          <div>
                            <p className="font-semibold text-gray-600 mb-1">Chẩn đoán:</p>
                            <p className="text-lg font-semibold text-gray-800">{selectedRecord.diagnosis}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-600 mb-1">Điều trị:</p>
                            <p className="text-gray-800">{selectedRecord.treatment || 'Chưa có'}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-600 mb-1">Ghi chú:</p>
                            <p className="text-gray-800">{selectedRecord.notes || 'Không có'}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-600 mb-1">Ghi chú bác sĩ:</p>
                            <p className="text-gray-800">{selectedRecord.doctor_note || 'Không có'}</p>
                          </div>
                          {selectedRecord.follow_up_date && (
                            <div>
                              <p className="font-semibold text-gray-600 mb-1">Lịch tái khám:</p>
                              <p className="text-orange-600 font-semibold">{formatDate(selectedRecord.follow_up_date)}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Timestamps */}
                      <div className="bg-gray-50 p-6 rounded-2xl border">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span>⏰</span>
                          Thông tin thời gian
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                          <div className="flex justify-between">
                            <span className="font-semibold">Ngày khám:</span>
                            <span>{formatDate(selectedRecord.slot_date)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Giờ khám:</span>
                            <span>{selectedRecord.start_time} - {selectedRecord.end_time}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Tạo hồ sơ:</span>
                            <span>{formatDateTime(selectedRecord.created_at)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Cập nhật cuối:</span>
                            <span>{formatDateTime(selectedRecord.updated_at)}</span>
                          </div>
                        </div>
                      </div>
                    </>
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