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

function getISODate(dateStr: string | null): string {
  if (!dateStr) return '';
  // Nếu là ISO hoặc yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr.slice(0, 10);
  // Nếu là dạng có giờ
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  // Nếu là dd/mm/yyyy
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
    const [d1, m1, y1] = dateStr.split('/');
    return `${y1}-${m1.padStart(2, '0')}-${d1.padStart(2, '0')}`;
  }
  return '';
}

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
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  // Thêm lại viewMode và groupedByCustomer
  const [viewMode, setViewMode] = useState<'all' | 'byCustomer'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  // Chỉ giữ lại một khai báo duy nhất cho groupedByCustomer
  const groupedByCustomer: Record<string, MedicalRecord[]> = records.reduce((acc, record) => {
    if (record.customer_name) {
      if (!acc[record.customer_name]) acc[record.customer_name] = [];
      acc[record.customer_name].push(record);
    }
    return acc;
  }, {} as Record<string, MedicalRecord[]>);

  useEffect(() => {
    const rawData = localStorage.getItem('user');
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        if (parsed?.id && parsed?.role_id === 3) setDoctorId(parsed.id);
        else {
          setError('Tài khoản không hợp lệ hoặc không phải bác sĩ.');
          setLoading(false);
        }
      } catch {
        setError('Lỗi đọc dữ liệu đăng nhập.');
        setLoading(false);
      }
    } else {
      setError('Vui lòng đăng nhập.');
      setLoading(false);
    }
  }, []);

  const fetchMedicalRecords = useCallback(() => {
    if (!doctorId) return;
    setLoading(true);
    fetch(`${API_URL}/api/medical-records/doctor/${doctorId}/all-records`)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải hồ sơ bệnh án.');
        return res.json();
      })
      .then((data) => {
        // Nhóm theo bệnh nhân
        const grouped: { [patient: string]: MedicalRecord[] } = {};
        data.forEach((record: MedicalRecord) => {
          if (!grouped[record.patient_name]) grouped[record.patient_name] = [];
          grouped[record.patient_name].push(record);
        });
        // Sắp xếp và gán số thứ tự lần khám
        const recordsWithVisitOrder: MedicalRecord[] = [];
        Object.values(grouped).forEach((patientRecords) => {
          patientRecords.sort((a, b) => {
            const dateA = new Date(a.slot_date || a.created_at);
            const dateB = new Date(b.slot_date || b.created_at);
            if (dateA.getTime() !== dateB.getTime()) return dateA.getTime() - dateB.getTime();
            if (a.start_time && b.start_time) return a.start_time.localeCompare(b.start_time);
            return 0;
          });
          patientRecords.forEach((rec, idx) => {
            recordsWithVisitOrder.push({ ...rec, visit_count: idx + 1 });
          });
        });
        setRecords(recordsWithVisitOrder);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [doctorId]);

  useEffect(() => {
    if (doctorId) fetchMedicalRecords();
  }, [doctorId, fetchMedicalRecords]);

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
    const res = await fetch(`${API_URL}/api/medical-records/save-from-schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        appointment_id: selectedRecord.appointment_id,
        doctor_id: user.id,
        customer_id: selectedRecord.customer_name,
        diagnosis: editDiagnosis,
        treatment: editTreatment,
        notes: editNotes,
        doctor_note: editDoctorNote,
        follow_up_date: editFollowUpDate
      })
    });
    if (res.ok) {
      setToast({ type: 'success', message: 'Cập nhật hồ sơ thành công!' });
      setEditMode(false);
      setSelectedRecord(null);
      fetchMedicalRecords();
    } else {
      setToast({ type: 'error', message: 'Cập nhật hồ sơ thất bại!' });
    }
  };

  // Filter logic
  const filteredRecords = records.filter((record) => {
    const matchesSearch = searchTerm
      ? record.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesDate = filterDate
      ? getISODate(record.slot_date) === filterDate
      : true;
    return matchesSearch && matchesDate;
  });

  // Toast tự động ẩn
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebardoctor />
      <div className="flex-1 overflow-x-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-2xl sticky top-0 z-40">
          <div className="px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white">Hồ sơ bệnh án của tôi</h1>
              <p className="text-blue-100 text-lg">Quản lý tất cả hồ sơ bệnh án đã tạo</p>
            </div>
            <button onClick={handleRefresh} disabled={refreshing} className="bg-white/20 p-3 rounded-2xl hover:bg-white/30 group">
              <span className={`text-white text-xl transition-transform ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`}>🔄</span>
            </button>
          </div>
        </div>
        <div className="p-8">
          {/* Thanh tìm kiếm và lọc ngày */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
            <input
              type="date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              className="border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Tìm kiếm bệnh nhân, chẩn đoán..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full md:w-96 pl-4 pr-4 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* View mode toggle */}
          <div className="flex gap-4 mb-6">
            <button
              className={`px-4 py-2 rounded-xl font-semibold border transition-all ${viewMode === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
              onClick={() => { setViewMode('all'); setSelectedCustomer(null); setSelectedRecord(null); }}
            >
              Xem tất cả hồ sơ bệnh án
            </button>
            <button
              className={`px-4 py-2 rounded-xl font-semibold border transition-all ${viewMode === 'byCustomer' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
              onClick={() => { setViewMode('byCustomer'); setSelectedCustomer(null); setSelectedRecord(null); }}
            >
              Xem theo tài khoản đặt lịch
            </button>
          </div>
          {/* Giao diện theo chế độ xem */}
          {viewMode === 'byCustomer' && !selectedCustomer && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Danh sách tài khoản đặt lịch</h2>
              {Object.keys(groupedByCustomer).length === 0 && (
                <div className="text-gray-500">Không có dữ liệu.</div>
              )}
              {Object.keys(groupedByCustomer).map((customer) => (
                <div
                  key={customer}
                  className={`bg-white rounded-xl shadow p-4 cursor-pointer hover:bg-blue-50 border flex items-center justify-between ${selectedCustomer === customer ? 'ring-2 ring-blue-400' : ''}`}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <span className="font-semibold text-lg">{customer}</span>
                  <span className="text-gray-500">{groupedByCustomer[customer].length} lượt đặt</span>
                </div>
              ))}
            </div>
          )}
          {viewMode === 'byCustomer' && selectedCustomer && (
            <div className="space-y-4">
              <button className="mb-4 text-blue-600 underline" onClick={() => setSelectedCustomer(null)}>
                ← Quay lại danh sách tài khoản
              </button>
              <h2 className="text-2xl font-bold mb-4">Các hồ sơ của tài khoản <span className='text-blue-700'>{selectedCustomer}</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(groupedByCustomer[selectedCustomer] || []).map((record) => (
                  <div key={record.record_id} className="bg-white rounded-2xl shadow-xl border p-6 flex flex-col gap-2 hover:shadow-2xl transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{record.patient_name}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{getISODate(record.slot_date)}</p>
                        <p className="text-sm text-gray-500">{record.start_time} - {record.end_time}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${record.visit_count && record.visit_count > 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                          {record.visit_count && record.visit_count > 1 ? `Khám lại lần ${record.visit_count}` : 'Lần khám: 1'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center"><span className="mr-1">📞</span>{record.patient_phone || 'N/A'}</span>
                      <span className="flex items-center"><span className="mr-1">📧</span>{record.patient_email || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Chẩn đoán</p>
                        <p className="text-gray-800 font-semibold">{record.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Điều trị</p>
                        <p className="text-gray-800">{record.treatment || 'Chưa có'}</p>
                      </div>
                    </div>
                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold self-end" onClick={() => setSelectedRecord(record)}>
                      Xem chi tiết
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Danh sách hồ sơ dạng card */}
          {viewMode === 'all' && (
            loading ? (
              <div className="text-center text-blue-600 font-semibold">Đang tải dữ liệu...</div>
            ) : error ? (
              <div className="text-center text-red-600 font-semibold">{error}</div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center text-gray-500">Không có hồ sơ bệnh án nào phù hợp.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRecords.map((record) => (
                  <div key={record.record_id} className="bg-white rounded-2xl shadow-xl border p-6 flex flex-col gap-2 hover:shadow-2xl transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{record.patient_name}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{getISODate(record.slot_date)}</p>
                        <p className="text-sm text-gray-500">{record.start_time} - {record.end_time}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${record.visit_count && record.visit_count > 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                          {record.visit_count && record.visit_count > 1 ? `Khám lại lần ${record.visit_count}` : 'Lần khám: 1'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center"><span className="mr-1">📞</span>{record.patient_phone || 'N/A'}</span>
                      <span className="flex items-center"><span className="mr-1">📧</span>{record.patient_email || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Chẩn đoán</p>
                        <p className="text-gray-800 font-semibold">{record.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Điều trị</p>
                        <p className="text-gray-800">{record.treatment || 'Chưa có'}</p>
                      </div>
                    </div>
                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold self-end" onClick={() => setSelectedRecord(record)}>
                      Xem chi tiết
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-[9999] px-6 py-3 rounded-xl shadow-xl text-white font-semibold ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{toast.message}</div>
        )}
        {/* Modal chi tiết hồ sơ */}
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="bg-white max-w-3xl w-full mx-auto rounded-3xl shadow-2xl animate-in zoom-in-95 max-h-[95vh] flex flex-col">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 flex justify-between items-center rounded-t-3xl">
                <div>
                  <h2 className="text-3xl font-bold">Chi tiết hồ sơ bệnh án</h2>
                  <p className="text-blue-200">ID: {selectedRecord.record_id}</p>
                </div>
                <button onClick={() => setSelectedRecord(null)} className="p-2 rounded-full hover:bg-white/20">
                  <span className="text-2xl">×</span>
                </button>
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
                    {/* Thông tin cá nhân */}
                    <div className="bg-gray-50 p-6 rounded-2xl border">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>👤</span> Thông tin cá nhân
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        <div className="flex justify-between"><span className="font-semibold">Tên bệnh nhân:</span><span>{selectedRecord.patient_name}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Tuổi:</span><span>{selectedRecord.age || 'N/A'}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Giới tính:</span><span>{selectedRecord.gender || 'N/A'}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Số điện thoại:</span><span>{selectedRecord.patient_phone || 'N/A'}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Email:</span><span>{selectedRecord.patient_email || 'N/A'}</span></div>
                        <div className="flex justify-between col-span-full"><span className="font-semibold">Địa chỉ:</span><span>{selectedRecord.address || 'N/A'}</span></div>
                        <div className="flex justify-between col-span-full"><span className="font-semibold">Số lần khám:</span><span className="font-bold text-blue-600">{selectedRecord.visit_count || 1}</span></div>
                        <div className="flex justify-between col-span-full"><span className="font-semibold">Lý do khám:</span><span>{selectedRecord.reason || 'Không có'}</span></div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl border">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>🏥</span> Thông tin bệnh án
                      </h3>
                      <div className="space-y-4 text-gray-700">
                        <div><p className="font-semibold text-gray-600 mb-1">Chẩn đoán:</p><p className="text-lg font-semibold text-gray-800">{selectedRecord.diagnosis}</p></div>
                        <div><p className="font-semibold text-gray-600 mb-1">Điều trị:</p><p className="text-gray-800">{selectedRecord.treatment || 'Chưa có'}</p></div>
                        <div><p className="font-semibold text-gray-600 mb-1">Ghi chú:</p><p className="text-gray-800">{selectedRecord.notes || 'Không có'}</p></div>
                        <div><p className="font-semibold text-gray-600 mb-1">Ghi chú bác sĩ:</p><p className="text-gray-800">{selectedRecord.doctor_note || 'Không có'}</p></div>
                        {selectedRecord.follow_up_date && (
                          <div><p className="font-semibold text-gray-600 mb-1">Lịch tái khám:</p><p className="text-orange-600 font-semibold">{getISODate(selectedRecord.follow_up_date)}</p></div>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl border">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>⏰</span> Thông tin thời gian
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        <div className="flex justify-between"><span className="font-semibold">Ngày khám:</span><span>{getISODate(selectedRecord.slot_date)}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Giờ khám:</span><span>{selectedRecord.start_time} - {selectedRecord.end_time}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Tạo hồ sơ:</span><span>{getISODate(selectedRecord.created_at)}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Cập nhật cuối:</span><span>{getISODate(selectedRecord.updated_at)}</span></div>
                      </div>
                    </div>
                    {/* Lịch sử khám của bệnh nhân này trong modal chi tiết */}
                    <div className="mt-8">
                      <h3 className="text-lg font-bold mb-2 text-blue-700">Lịch sử khám của bệnh nhân này</h3>
                      <div className="space-y-2">
                        {records.filter(r => r.patient_name === selectedRecord.patient_name)
                          .sort((a, b) => {
                            const dateA = new Date(a.slot_date || a.created_at);
                            const dateB = new Date(b.slot_date || b.created_at);
                            if (dateA.getTime() !== dateB.getTime()) return dateA.getTime() - dateB.getTime();
                            if (a.start_time && b.start_time) return a.start_time.localeCompare(b.start_time);
                            return 0;
                          })
                          .map((rec, idx) => (
                            <div
                              key={rec.record_id}
                              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${rec.record_id === selectedRecord.record_id ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 hover:bg-blue-100'}`}
                              onClick={() => setSelectedRecord(rec)}
                              title="Xem chi tiết lần khám này"
                            >
                              <div>
                                <span className="font-semibold">Lần {idx + 1}:</span> {getISODate(rec.slot_date)} {rec.start_time} - {rec.end_time}
                              </div>
                              <div>
                                <span className="text-gray-600">{rec.customer_name}</span>
                                <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${idx > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{idx > 0 ? `Khám lại lần ${idx + 1}` : 'Lần khám: 1'}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              {!editMode && (
                <div className="flex justify-end pb-6 pr-8">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setEditMode(true)}>Sửa hồ sơ</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}