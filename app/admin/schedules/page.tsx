'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  PlusCircle, 
  XCircle, 
  AlertTriangle, 
  CheckCircle, 
  Loader2 
} from 'lucide-react';
import { format } from 'date-fns';

interface Doctor {
  id: number;
  name: string;
  account_status: string;
}

interface WorkShift {
  id: number;
  doctor_id: number;
  doctor_name: string;
  work_date: string;
  shift_name: string;
  start_time: string;
  end_time: string;
  status: 'Active' | 'Cancelled';
}

const SHIFT_TYPES = {
  morning: { name: 'Ca sáng', startTime: '07:00:00', endTime: '12:00:00' },
  afternoon: { name: 'Ca chiều', startTime: '13:30:00', endTime: '17:30:00' },
};

export default function ScheduleManagementPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [shifts, setShifts] = useState<WorkShift[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingShifts, setLoadingShifts] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submittingActions, setSubmittingActions] = useState<string[]>([]);

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchDoctors = useCallback(async () => {
    setLoadingDoctors(true);
    try {
      const res = await fetch('http://localhost:5000/api/doctors/all-for-admin', {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Không thể tải danh sách bác sĩ. Vui lòng thử lại.');
      const data = await res.json();
      setDoctors(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingDoctors(false);
    }
  }, []);

  const fetchShifts = useCallback(async (date: string) => {
    if (!date) return;
    setLoadingShifts(true);
    setError('');
    setSuccess('');
    setShifts([]);
    try {
      const res = await fetch(`http://localhost:5000/api/schedules/shifts?date=${date}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Không thể tải lịch làm việc của ngày đã chọn.');
      }
      const data = await res.json();
      setShifts(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingShifts(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    fetchShifts(selectedDate);
  }, [selectedDate, fetchShifts]);

  const handleAddShift = async (doctorId: number, shiftType: 'morning' | 'afternoon') => {
    const actionId = `add-${doctorId}-${shiftType}`;
    if (submittingActions.includes(actionId)) return;

    setSubmittingActions(prev => [...prev, actionId]);
    setError('');
    setSuccess('');

    const shiftDetails = SHIFT_TYPES[shiftType];
    const body = {
      doctorId: Number(doctorId),
      workDate: selectedDate,
      shiftName: shiftDetails.name,
      startTime: shiftDetails.startTime,
      endTime: shiftDetails.endTime
    };

    try {
      const res = await fetch('http://localhost:5000/api/schedules/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Thêm ca thất bại.');
      setSuccess(data.message);
      fetchShifts(selectedDate);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmittingActions(prev => prev.filter(id => id !== actionId));
    }
  };

  const handleCancelShift = async (shiftId: number) => {
    const actionId = `cancel-${shiftId}`;
    if (submittingActions.includes(actionId)) return;

    if (!window.confirm('Bạn có chắc chắn muốn hủy ca làm việc này không? Các khung giờ còn trống sẽ bị xóa.')) {
      return;
    }

    setSubmittingActions(prev => [...prev, actionId]);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`http://localhost:5000/api/schedules/shifts/${shiftId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Hủy ca thất bại.');
      setSuccess(data.message);
      fetchShifts(selectedDate);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmittingActions(prev => prev.filter(id => id !== actionId));
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Quản Lý Lịch Làm Việc</h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <label htmlFor="date-picker" className="block text-sm font-medium text-gray-700 mb-1">Chọn ngày để quản lý</label>
        <div className="relative max-w-xs">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          <input
            type="date"
            id="date-picker"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg flex items-center gap-2 bg-red-100 text-red-800 border border-red-200"><AlertTriangle size={20} />{error}</div>}
      {success && <div className="mb-4 p-3 rounded-lg flex items-center gap-2 bg-green-100 text-green-800 border border-green-200"><CheckCircle size={20} />{success}</div>}

      <div className="space-y-4">
        {loadingDoctors ? (
          <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
        ) : (
          doctors.map(doctor => {
            const doctorShifts = shifts.filter(s => s.doctor_id === doctor.id);
            const isMorningSubmitting = submittingActions.includes(`add-${doctor.id}-morning`);
            const isAfternoonSubmitting = submittingActions.includes(`add-${doctor.id}-afternoon`);
            const hasMorningShift = doctorShifts.some(shift => shift.shift_name === 'Ca sáng');
            const hasAfternoonShift = doctorShifts.some(shift => shift.shift_name === 'Ca chiều');

            return (
              <div key={doctor.id} className="bg-white p-4 rounded-lg shadow transition-all duration-300">
                <div className="flex flex-wrap gap-4 justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <User className="mr-2 h-5 w-5 text-blue-600" />
                    {doctor.name}
                    {doctor.account_status !== 'active' && (
                      <span className="ml-2 text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Tạm khóa</span>
                    )}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddShift(doctor.id, 'morning')}
                      disabled={isMorningSubmitting || hasMorningShift || loadingShifts}
                      className="w-36 justify-center px-3 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isMorningSubmitting ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
                      {isMorningSubmitting ? 'Đang thêm...' : 'Thêm ca sáng'}
                    </button>
                    <button
                      onClick={() => handleAddShift(doctor.id, 'afternoon')}
                      disabled={isAfternoonSubmitting || hasAfternoonShift || loadingShifts}
                      className="w-36 justify-center px-3 py-1.5 text-sm font-medium text-white bg-teal-500 rounded-md hover:bg-teal-600 flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isAfternoonSubmitting ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
                      {isAfternoonSubmitting ? 'Đang thêm...' : 'Thêm ca chiều'}
                    </button>
                  </div>
                </div>

                {loadingShifts ? (
                  <div className="text-sm text-gray-500 flex items-center gap-2 border-t pt-3"><Loader2 size={16} className="animate-spin" /> Đang tải lịch...</div>
                ) : doctorShifts.length > 0 ? (
                  <ul className="space-y-2 border-t pt-3">
                    {doctorShifts.map(shift => {
                      const isCancelling = submittingActions.includes(`cancel-${shift.id}`);
                      return (
                        <li key={shift.id} className={`flex justify-between items-center p-2 rounded-md ${shift.status === 'Cancelled' ? 'bg-gray-100 text-gray-500 line-through' : 'bg-blue-50'}`}>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            <span className="font-medium">{shift.shift_name}</span>
                            <span className="text-sm ml-2">({shift.start_time.substring(0,5)} - {shift.end_time.substring(0,5)})</span>
                            {shift.status === 'Cancelled' && <span className="ml-3 text-xs font-bold text-red-500">[ĐÃ HỦY]</span>}
                          </div>
                          {shift.status === 'Active' && (
                            <button onClick={() => handleCancelShift(shift.id)} disabled={isCancelling || loadingShifts} className="text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-wait">
                              {isCancelling ? <Loader2 size={20} className="animate-spin" /> : <XCircle size={20} />}
                            </button>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 border-t pt-3">Chưa có lịch làm việc cho ngày này.</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}