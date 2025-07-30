// /app/doctor/dashboard/page.tsx
// PHIÊN BẢN HOÀN CHỈNH - ĐÃ CẬP NHẬT LOGIC THỐNG KÊ "HÔM NAY" VÀ "SẮP TỚI"

'use client';
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebardoctor';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { FaUserClock, FaUserCheck, FaUserSlash, FaUserTimes, FaCalendarCheck, FaCalendarAlt, FaRegCalendar } from 'react-icons/fa';

interface DashboardData {
  pending: number;
  completed_today: number;
  cancelled_future: number;
  rejected_future: number;
  completed_last_7_days: number;
  completed_last_30_days: number;
  completed_current_year: number;
  chart: { label: string; total: number }[];
}

interface Patient {
    name: string;
    age: number;
    gender: string;
    appointment_date: string | null;
    status: string;
}

const FILTERS = [
  { label: '1 ngày', value: '1d' },
  { label: '1 tuần', value: '1w' },
  { label: '1 tháng', value: '1m' },
  { label: '6 tháng', value: '6m' },
  { label: '1 năm', value: '1y' },
];

export default function DoctorDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState('1m');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState<Patient[]>([]);
  const [isModalLoading, setIsModalLoading] = useState(false);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const doctorId = 15;
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/dashboard/${doctorId}?range=${range}`;
        const response = await fetch(apiUrl);
        if (!response.ok) { throw new Error(`Lỗi HTTP ${response.status}`); }
        const result: DashboardData = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        setData({ 
          pending: 0, completed_today: 0, cancelled_future: 0, 
          rejected_future: 0, completed_last_7_days: 0, 
          completed_last_30_days: 0, completed_current_year: 0, 
          chart: [] 
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [range]);

  const handleCardClick = async (type: string, title: string) => {
    if (!type) return;
    setModalTitle(title);
    setIsModalOpen(true);
    setIsModalLoading(true);
    setModalContent([]);
    try {
        const doctorId = 15;
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/dashboard/${doctorId}/patients?type=${type}`;
        const response = await fetch(apiUrl);
        if (!response.ok) { throw new Error(`Không thể tải danh sách. Lỗi: ${response.status}`); }
        const patientList: Patient[] = await response.json();
        setModalContent(patientList);
    } catch (err) {
        console.error("Lỗi khi tải danh sách:", err);
    } finally {
        setIsModalLoading(false);
    }
  };

  if (loading) { return <div className="flex h-screen font-sans"><Sidebar /><main className="flex-1 p-8 bg-gray-100 flex items-center justify-center"><div className="flex items-center gap-3 text-lg font-semibold text-gray-600"><svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Đang tải dữ liệu...</div></main></div>; }
  
  return (
    <div className="flex h-screen font-sans bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">👨‍⚕️ Bảng điều khiển</h1>
          </div>
          
          {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert"><p className="font-bold">Đã xảy ra lỗi</p><p>{error}</p></div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={<FaUserClock />} title="Bệnh nhân đang đợi" value={data?.pending ?? 0} color="yellow" onClick={() => handleCardClick('pending', 'Danh sách bệnh nhân đang đợi')} />
            <StatCard icon={<FaUserCheck />} title="Đã khám (Hôm nay)" value={data?.completed_today ?? 0} color="gray" onClick={() => handleCardClick('completed_today', 'Danh sách đã khám hôm nay')} />
            <StatCard icon={<FaUserSlash />} title="Đã hủy (Hôm nay)" value={data?.cancelled_future ?? 0} color="red" onClick={() => handleCardClick('cancelled_future', 'Danh sách lịch hẹn bị hủy sắp tới')} />
            <StatCard icon={<FaUserTimes />} title="Đã từ chối (Hôm nay)" value={data?.rejected_future ?? 0} color="orange" onClick={() => handleCardClick('rejected_future', 'Danh sách lịch hẹn bị từ chối sắp tới')} />
          </div>

          <h2 className="text-xl font-semibold text-gray-700 mb-4">Thống kê hiệu suất</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard icon={<FaCalendarCheck />} title="Đã khám (7 ngày qua)" value={data?.completed_last_7_days ?? 0} color="green" onClick={() => handleCardClick('completed_last_7_days', 'Danh sách đã khám (7 ngày qua)')} />
            <StatCard icon={<FaCalendarAlt />} title="Đã khám (30 ngày qua)" value={data?.completed_last_30_days ?? 0} color="blue" onClick={() => handleCardClick('completed_last_30_days', 'Danh sách đã khám (30 ngày qua)')} />
            <StatCard icon={<FaRegCalendar />} title="Đã khám (Năm nay)" value={data?.completed_current_year ?? 0} color="purple" onClick={() => handleCardClick('completed_current_year', 'Danh sách đã khám (Năm nay)')} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
             <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-800">📈 Phân tích số ca khám</h2>
                <div className="flex items-center gap-3 bg-gray-100 p-1 rounded-lg">
                  {FILTERS.map(f => (
                    <button key={f.value} onClick={() => setRange(f.value)} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${range === f.value ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            {(data?.chart && data.chart.length > 0) ? (
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <LineChart data={data.chart} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#d1d5db' }} tickLine={{ stroke: '#d1d5db' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#d1d5db' }} tickLine={{ stroke: '#d1d5db' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="total" name="Số ca" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8, strokeWidth: 2, stroke: '#93c5fd' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500 flex flex-col items-center gap-2">
                <svg className="w-16 h-16 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1.5-1.5m1.5 1.5l1.5-1.5m3.75-3l-1.5-1.5m1.5 1.5l1.5-1.5m-7.5 0v4.5A2.25 2.25 0 006.75 21h10.5a2.25 2.25 0 002.25-2.25v-4.5m-15 0a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25m-15 0V11.25m15 0V11.25m0 0a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25m15 0v-1.5a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v1.5" /></svg>
                <p className="font-semibold">Không có dữ liệu biểu đồ</p>
                <p className="text-sm">Vui lòng chọn một khoảng thời gian khác.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {isModalOpen && ( /* ... Modal giữ nguyên ... */ <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"><div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 animate-modal-in"><div className="flex justify-between items-center p-5 border-b border-gray-200"><h3 className="text-xl font-bold text-gray-800">{modalTitle}</h3><button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div className="p-6 overflow-y-auto">{isModalLoading ? <div className="text-center py-12 text-gray-600">Đang tải danh sách...</div> : modalContent.length > 0 ? (<div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-500"><thead className="text-xs text-gray-700 uppercase bg-gray-50"><tr><th scope="col" className="px-6 py-3">Tên Bệnh Nhân</th><th scope="col" className="px-6 py-3">Tuổi</th><th scope="col" className="px-6 py-3">Giới Tính</th><th scope="col" className="px-6 py-3">Ngày Hẹn</th></tr></thead><tbody>{modalContent.map((p, index) => (<tr key={index} className="bg-white border-b hover:bg-gray-50"><th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{p.name}</th><td className="px-6 py-4">{p.age}</td><td className="px-6 py-4">{p.gender}</td><td className="px-6 py-4">{p.appointment_date ? new Date(p.appointment_date).toLocaleDateString('vi-VN') : 'N/A'}</td></tr>))}</tbody></table></div>) : (<div className="text-center py-12 text-gray-500">Không có dữ liệu trong danh sách này.</div>)}</div></div></div>)}
    </div>
  );
}

const StatCard = ({ icon, title, value, color, onClick }: { icon: React.ReactNode, title: string, value: number, color: string, onClick?: () => void }) => {
  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-600', gray: 'bg-gray-100 text-gray-600', red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600', green: 'bg-green-100 text-green-600', blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  };
  const textColors = {
      yellow: 'text-yellow-500', gray: 'text-gray-800', red: 'text-red-500', orange: 'text-orange-500',
      green: 'text-green-500', blue: 'text-blue-500', purple: 'text-purple-500',
  }
  return (
    <div className={`bg-white p-5 rounded-xl shadow-lg flex items-center gap-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <div className={`p-3 rounded-full ${colorClasses[color]}`}>{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className={`text-2xl font-bold ${textColors[color]}`}>{value}</p>
      </div>
    </div>
  );
};