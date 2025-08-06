
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, Clock, User, PlusCircle, XCircle, 
  AlertTriangle, CheckCircle, Loader2, Power, PowerOff 
} from 'lucide-react';
import { format } from 'date-fns';
import Sidebardoctor from "@/components/layout/Sidebardoctor"; 

// --- ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU ---

interface DoctorData {
  id: number;
  name: string;
  token: string;
}

interface WorkShift {
  id: number;
  shift_name: string;
  start_time: string;
  end_time: string;
  status: 'Active' | 'Cancelled';
}

interface TimeSlot {
  id: number;
  work_shift_id: number;
  start_time: string;
  end_time: string;
  status: 'Available' | 'Booked';
  is_active: boolean;
}

const SHIFT_TYPES = {
  morning: { name: 'Ca sáng', startTime: '07:00:00', endTime: '12:00:00' },
  afternoon: { name: 'Ca chiều', startTime: '13:30:00', endTime: '17:30:00' },
};

export default function ManageWorkSchedulePage() {
  const [doctor, setDoctor] = useState<DoctorData | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [shifts, setShifts] = useState<WorkShift[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submittingActions, setSubmittingActions] = useState<Set<string>>(new Set());
  const [validateError, setValidateError] = useState('');

  // 1. Tự động nhận diện bác sĩ từ localStorage (ĐÃ SỬA LỖI)
  useEffect(() => {
    // Lấy thông tin người dùng (bác sĩ) từ key 'user'
    const rawDoctorData = localStorage.getItem('user'); 
    
    // Lấy token từ key 'token'. Đây là key phổ biến nhất.
    // Nếu bạn lưu token với key khác, hãy đổi lại ở đây.
    const token = localStorage.getItem('token'); 

    if (rawDoctorData && token) {
      try {
        const parsedData = JSON.parse(rawDoctorData);
        // Kiểm tra xem có phải là tài khoản bác sĩ không
        if (parsedData && parsedData.id && parsedData.role_id === 3) {
          // Gộp thông tin bác sĩ và token vào cùng một state object
          const doctorDataWithToken: DoctorData = { ...parsedData, token };
          setDoctor(doctorDataWithToken);
          setError(''); // Xóa lỗi nếu tìm thấy thông tin hợp lệ
        } else {
          setError("Dữ liệu đăng nhập không hợp lệ hoặc không phải tài khoản Bác sĩ.");
          setLoading(false); // Ngừng loading khi có lỗi
        }
      } catch (e) {
        console.error("Lỗi khi parse dữ liệu người dùng:", e);
        setError("Lỗi đọc dữ liệu đăng nhập. Vui lòng đăng nhập lại.");
        setLoading(false); // Ngừng loading khi có lỗi
      }
    } else {
      // Log ra để kiểm tra xem đang thiếu dữ liệu nào
      if (!rawDoctorData) console.error("DEBUG: Không tìm thấy 'user' trong localStorage.");
      if (!token) console.error("DEBUG: Không tìm thấy 'token' trong localStorage.");
      
      setError("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.");
      setLoading(false); // Ngừng loading khi có lỗi
    }
  }, []); // useEffect này chỉ chạy một lần khi component mount

  // 2. Hàm gọi API để lấy lịch làm việc
  const fetchSchedule = useCallback(async (date: string, currentDoctor: DoctorData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`http://localhost:5000/api/schedules/doctor-schedule?date=${date}`, {
        headers: { 'Authorization': `Bearer ${currentDoctor.token}` }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Không thể tải lịch làm việc.');
      }
      const data = await res.json();
      setShifts(data.data.shifts || []);
      setSlots(data.data.slots || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Tự động gọi fetchSchedule khi có thông tin bác sĩ hoặc ngày thay đổi
  useEffect(() => {
    if (doctor) {
      fetchSchedule(selectedDate, doctor);
    } else {
      // Nếu không có doctor (do lỗi ở useEffect trên), ngừng loading
      if(error) setLoading(false);
    }
  }, [selectedDate, doctor, fetchSchedule, error]);

  // 4. Hàm bao bọc chung cho các hành động (thêm, xóa, sửa)
  const handleAction = async (actionId: string, apiCall: () => Promise<any>) => {
    if (submittingActions.has(actionId) || !doctor) return;

    setSubmittingActions(prev => new Set(prev).add(actionId));
    setError('');
    setSuccess('');

    try {
      const result = await apiCall();
      if (result && result.message) setSuccess(result.message);
      await fetchSchedule(selectedDate, doctor); // Tải lại dữ liệu sau khi thành công
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmittingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
    }
  };

  const createApiOptions = (method: 'POST' | 'PUT', body?: object) => {
    if (!doctor) return null;
    return {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${doctor.token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    };
  };

  const handleApiCall = async (url: string, options: RequestInit | null) => {
    if (!options) throw new Error("Chưa đăng nhập");
    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Thao tác thất bại.');
    return data;
  };

  const handleAddShift = (shiftType: 'morning' | 'afternoon') => {
    const shiftDetails = SHIFT_TYPES[shiftType];
    const today = new Date();
    const selected = new Date(selectedDate + 'T00:00:00');
    // Nếu ngày đã qua
    if (selected < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      setValidateError('Không thể thêm ca cho ngày đã qua.');
      return;
    }
    // Nếu là hôm nay, kiểm tra giờ kết thúc ca
    if (selected.toDateString() === today.toDateString()) {
      const [endHour, endMinute] = shiftDetails.endTime.split(':').map(Number);
      if (
        endHour < today.getHours() ||
        (endHour === today.getHours() && endMinute <= today.getMinutes())
      ) {
        setValidateError('Đã quá thời gian đăng kí ca làm việc.');
        return;
      }
    }
    setValidateError('');
    setError('');
    const actionId = `add-${shiftType}`;
    const apiOptions = createApiOptions('POST', {
      workDate: selectedDate,
      ...shiftDetails,
    });
    handleAction(actionId, () => handleApiCall('http://localhost:5000/api/schedules/shifts', apiOptions));
  };

  const handleCancelShift = (shiftId: number) => {
    if (!window.confirm('Bạn có chắc muốn hủy cả ca làm việc này không? Các khung giờ chưa có người đặt sẽ bị tắt.')) return;
    const actionId = `cancel-shift-${shiftId}`;
    const apiOptions = createApiOptions('PUT');
    handleAction(actionId, () => handleApiCall(`http://localhost:5000/api/schedules/shifts/${shiftId}/cancel`, apiOptions));
  };

  const handleToggleSlot = (slotId: number) => {
    const actionId = `toggle-slot-${slotId}`;
    const apiOptions = createApiOptions('PUT');
    handleAction(actionId, () => handleApiCall(`http://localhost:5000/api/schedules/slots/${slotId}/toggle-status`, apiOptions));
  };

  // 5. Render giao diện
  
  // Hiển thị lỗi nếu không tìm thấy thông tin đăng nhập sau khi đã kiểm tra xong
  if (!doctor && !loading) {
    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebardoctor />
            <main className="flex-1 p-6 flex justify-center items-center">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                    <p className="mt-4 text-xl text-red-600 font-semibold">
                        {error || "Không thể xác định thông tin đăng nhập."}
                    </p>
                    <p className="mt-2 text-gray-500">Vui lòng đăng xuất và đăng nhập lại.</p>
                </div>
            </main>
        </div>
    );
  }
  
  const hasActiveMorningShift = shifts.some(s => s.shift_name === 'Ca sáng' && s.status === 'Active');
  const hasActiveAfternoonShift = shifts.some(s => s.shift_name === 'Ca chiều' && s.status === 'Active');

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebardoctor />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tạo Lịch Làm Việc</h1>
        {doctor && <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center gap-2"><User /> {doctor.name}</h2>}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap items-end gap-4">
            <div>
                <label htmlFor="date-picker" className="block text-sm font-medium text-gray-700 mb-1">Chọn ngày để tạo lịch</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="date" id="date-picker" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setValidateError(''); }} className="w-full md:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>
            </div>
            <div className="flex-grow flex justify-start md:justify-end gap-2">
                <button onClick={() => handleAddShift('morning')} disabled={hasActiveMorningShift || submittingActions.has('add-morning')} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {submittingActions.has('add-morning') ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
                    Thêm ca sáng
                </button>
                <button onClick={() => handleAddShift('afternoon')} disabled={hasActiveAfternoonShift || submittingActions.has('add-afternoon')} className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {submittingActions.has('add-afternoon') ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
                    Thêm ca chiều
                </button>
            </div>
        </div>
        
        {/* Hiển thị alert lỗi validate hoặc lỗi API ở dưới */}
        {(validateError || error) && (
          <div className="mt-2 px-4 py-2 rounded-xl flex items-center gap-3 border-2 border-red-400 bg-red-50 text-red-700 font-semibold shadow-sm animate-fade-in">
            <AlertTriangle size={28} className="text-red-500 flex-shrink-0" />
            <span className="text-base leading-tight">{validateError || error}</span>
          </div>
        )}

        {success && <div className="mb-4 p-3 rounded-lg flex items-center gap-2 bg-green-100 text-green-800 border border-green-200"><CheckCircle size={20} />{success}</div>}

        {loading ? (
          <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
        ) : shifts.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">Chưa có ca làm việc nào cho ngày này. Hãy nhấn "Thêm ca" để bắt đầu.</p>
        ) : (
          <div className="space-y-6">
            {shifts.map(shift => (
              <div key={shift.id} className={`p-4 rounded-lg shadow ${shift.status === 'Cancelled' ? 'bg-gray-200 opacity-70' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-4 pb-3 border-b">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Clock/> {shift.shift_name} 
                    {shift.status === 'Cancelled' && <span className="text-sm font-semibold text-red-600 ml-2">[ĐÃ HỦY]</span>}
                  </h3>
                  {shift.status === 'Active' && (
                    <button onClick={() => handleCancelShift(shift.id)} disabled={submittingActions.has(`cancel-shift-${shift.id}`)} className="text-red-500 hover:text-red-700 disabled:text-gray-400 flex items-center gap-1">
                        {submittingActions.has(`cancel-shift-${shift.id}`) ? <Loader2 size={16} className="animate-spin"/> : <XCircle size={20}/>}
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {slots.filter(s => s.work_shift_id === shift.id).map(slot => {
                      const isBooked = slot.status === 'Booked';
                      const isActiveByDoctor = slot.is_active;
                      const isToggling = submittingActions.has(`toggle-slot-${slot.id}`);

                      let slotClasses = "p-2 rounded-md text-center font-medium border-2 transition-all duration-200 ";
                      if (isBooked) {
                        slotClasses += 'bg-yellow-100 border-yellow-400 text-yellow-800 cursor-not-allowed';
                      } else if (isActiveByDoctor) {
                        slotClasses += 'bg-green-100 border-green-400 text-green-800';
                      } else { // Slot bị bác sĩ tắt
                        slotClasses += 'bg-red-100 border-red-400 text-red-800 opacity-80';
                      }

                      return (
                        <div key={slot.id} className={slotClasses}>
                          <p>{slot.start_time.substring(0,5)} - {slot.end_time.substring(0,5)}</p>
                          <div className="mt-2 flex justify-center items-center h-6">
                            {isBooked ? (
                              <span className="text-xs font-bold uppercase">Đã đặt</span>
                            ) : (
                              <button 
                                onClick={() => handleToggleSlot(slot.id)} 
                                disabled={isToggling} 
                                title={isActiveByDoctor ? "Tạm tắt khung giờ" : "Mở lại khung giờ"} 
                                className="disabled:opacity-50 disabled:cursor-wait"
                              >
                                {isToggling ? (
                                    <Loader2 size={18} className="animate-spin" /> 
                                ) : isActiveByDoctor ? (
                                    <Power size={18} className="text-green-600"/> 
                                ) : (
                                    <PowerOff size={18} className="text-red-600"/>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Thêm hiệu ứng fade-in cho alert
<style jsx global>{`
  .animate-fade-in {
    animation: fadeInAlert 0.5s;
  }
  @keyframes fadeInAlert {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`}</style>