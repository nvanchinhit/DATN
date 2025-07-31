'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar, Clock, Loader2, ChevronLeft, X, Info } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import DoctorDetailsModal from './DoctorDetailsModal';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const getImageUrl = (fileName: string | null | undefined): string => {
  if (!fileName) return "/default-avatar.png";
  if (fileName.startsWith("http")) return fileName;
  const path = fileName.startsWith('/') ? fileName : `/${fileName}`;
  const finalPath = path.startsWith('/uploads/') ? path : `/uploads${path}`;
  return `${API_URL}${finalPath}`;
};

// --- Interfaces ---
// <<<<<<< SỬA ĐỔI 1: Cập nhật Interface >>>>>>>
interface Specialization { id: number; name: string; }
interface DoctorInfo { id: number; name: string; img: string; price: number; }
interface SlotInfo { time_slot_id: number; doctor: DoctorInfo; }

// Interface này phải khớp với dữ liệu mới từ API
interface ScheduleGroup { 
  time: string; 
  slots: SlotInfo[]; 
  totalSlots: number;
  availableSlots: number; 
  bookedSlots: number;
  inactiveSlots: number;
}

// ==================== MODAL CHỌN BÁC SĨ (Giữ nguyên) ===================
function DoctorSelectionModal({
  isOpen,
  onClose,
  group,
  onBook,
  onViewDetails,
}: {
  isOpen: boolean;
  onClose: () => void;
  group: ScheduleGroup | null;
  onBook: (slot: SlotInfo) => void;
  onViewDetails: (doctorId: number) => void;
}) {
  const [search, setSearch] = useState("");
  if (!isOpen || !group) return null;

  const filteredSlots = group.slots.filter(slot =>
    slot.doctor.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={onClose}>
      <div className="flex flex-col w-11/12 max-w-4xl h-5/6 max-h-[90vh] rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-shrink-0 items-center justify-between border-b pb-4">
          <h3 className="text-xl font-bold">{`Chọn bác sĩ cho ca: ${group.time}`}</h3>
          <button onClick={onClose} className="rounded-full p-1 text-gray-500 hover:bg-gray-200"><X /></button>
        </div>
        <div className="mt-4 mb-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm bác sĩ theo tên..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex-grow overflow-y-auto pr-4">
          <div className="space-y-4">
            {filteredSlots.length === 0 ? (
              <div className="text-center text-gray-500 py-8">Không tìm thấy bác sĩ phù hợp.</div>
            ) : (
              filteredSlots.map((slot) => (
                <div key={slot.time_slot_id} className="rounded-lg border bg-gray-50 p-4 hover:border-blue-400">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img src={getImageUrl(slot.doctor.img)} alt={slot.doctor.name} className="h-16 w-16 rounded-full object-cover"/>
                        <div>
                          <p className="text-lg font-semibold text-gray-800">{slot.doctor.name}</p>
                          <p className="text-sm text-gray-600">Bác sĩ chuyên khoa</p>
                          {typeof slot.doctor.price !== 'undefined' && (
                            <p className="text-sm text-green-600 font-bold mt-1">
                              Giá khám: {Number(slot.doctor.price).toLocaleString('vi-VN', { minimumFractionDigits: 0 })} VND
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex w-full sm:w-auto gap-2">
                          <button
                            onClick={() => onViewDetails(slot.doctor.id)}
                            className="w-1/2 sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-300"
                          >
                            <Info size={16}/> Chi tiết
                          </button>
                          <button
                            onClick={() => { onBook(slot); onClose(); }}
                            className="w-1/2 sm:w-auto rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
                          >
                            Đặt ngay
                          </button>
                      </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Wrapper Component ---
export default function SpecialtySchedulePageWrapper() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-blue-600">Đang tải trang...</div>}>
      <SpecialtySchedulePage />
    </Suspense>
  );
}

// --- Main Page Component ---
function SpecialtySchedulePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const specialtyId = searchParams.get("specialization");

  const [specialty, setSpecialty] = useState<Specialization | null>(null);
  const [schedule, setSchedule] = useState<ScheduleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isSelectionModalOpen, setSelectionModalOpen] = useState(false);
  const [selectedTimeGroup, setSelectedTimeGroup] = useState<ScheduleGroup | null>(null);

  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [viewingDoctorId, setViewingDoctorId] = useState<number | null>(null);

  const formatDateForApi = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!specialtyId) { setError("Không tìm thấy ID chuyên khoa trong URL."); setLoading(false); return; };

    const fetchData = async () => {
        if (!specialty) {
            try {
                const res = await fetch(`${API_URL}/api/specializations/${specialtyId}`);
                if (!res.ok) throw new Error("Không tìm thấy chuyên khoa.");
                setSpecialty(await res.json());
            } catch (err: any) { setError(err.message); }
        }

        setLoading(true);
        setError(null);
        setSchedule([]);
        const dateStr = formatDateForApi(selectedDate);
        try {
            const res = await fetch(`${API_URL}/api/specializations/${specialtyId}/schedule?date=${dateStr}`);
            if (!res.ok) throw new Error(`Không thể tải lịch khám (Lỗi ${res.status})`);
            const data = await res.json();
            setSchedule(data);
        } catch (err: any) { setError(err.message); } 
        finally { setLoading(false); }
    };

    fetchData();
  }, [specialtyId, selectedDate]);

  const handleBooking = (slot: SlotInfo) => {
    if (!specialty || !selectedTimeGroup) return;
    const dateStr = formatDateForApi(selectedDate);
    
    const bookingData = {
      doctorId: slot.doctor.id,
      doctorName: slot.doctor.name,
      specialty: specialty.name,
      date: dateStr,
      time: { id: slot.time_slot_id, start: selectedTimeGroup.time.split(' - ')[0], end: selectedTimeGroup.time.split(' - ')[1] },
      time_slot_id: slot.time_slot_id,
      price: Number(slot.doctor.price) || 0 // Chuyển đổi sang number và fallback về 0 nếu NaN
    };
    
    const encoded = encodeURIComponent(JSON.stringify(bookingData));
    router.push(`/checkout?data=${encoded}`);
  };

  const handleViewDetails = (doctorId: number) => {
    setViewingDoctorId(doctorId);
    setDetailsModalOpen(true);
  };

  // <<<<<<< SỬA ĐỔI 2: Tạo hàm render trạng thái nút >>>>>>>
  const getButtonStatus = (group: ScheduleGroup) => {
    if (group.availableSlots > 0) {
      return {
        disabled: false,
        className: 'bg-white hover:bg-blue-50 text-blue-800 border-2 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        text: `${group.availableSlots} bác sĩ có sẵn`,
        textClassName: 'text-xs font-normal text-gray-600 mt-1',
      };
    }
    
    // Nếu tất cả slot đều do bác sĩ tắt (và không có ai đặt)
    if (group.inactiveSlots === group.totalSlots) {
        return {
            disabled: true,
            className: 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300 cursor-not-allowed',
            text: 'Tạm ngưng',
            textClassName: 'text-xs font-bold text-yellow-700 mt-1',
        };
    }

    // Các trường hợp còn lại (đã đặt hết, hoặc hỗn hợp đặt + tắt)
    return {
      disabled: true,
      className: 'bg-red-100 text-red-800 border-2 border-red-300 cursor-not-allowed',
      text: 'Đã hết chỗ',
      textClassName: 'text-xs font-bold text-red-700 mt-1',
    };
  };

  if (!specialtyId && !error) return <div className="flex h-screen items-center justify-center text-red-600">Thiếu ID chuyên khoa trên URL.</div>;
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"> 
        <header className="mb-8">
            <Link href="/specialties" className="flex items-center text-blue-600 hover:underline mb-4"><ChevronLeft size={20} /> Quay lại</Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Đặt lịch khám</h1>
          {specialty ? ( <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mt-2">{specialty.name}</h2> ) 
          : ( <div className="h-8 w-1/2 bg-gray-200 rounded-md animate-pulse mt-2"></div> )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 xl:col-span-3">
                <div className="bg-white p-6 rounded-xl shadow-lg sticky top-8">
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><Calendar size={20} /> 1. Chọn ngày khám</h3>
                    <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date as Date)} dateFormat="dd/MM/yyyy"
                        className="w-full" minDate={new Date()} inline />
                </div>
            </div>

            <main className="lg:col-span-8 xl:col-span-9">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><Clock size={20} /> 2. Chọn ca khám có sẵn</h3>
              {loading && <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>}
              {error && <div className="text-center py-10 text-red-500 bg-red-50 p-6 rounded-xl">{error}</div>}
              {!loading && !error && schedule.length === 0 && (
                <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-lg">
                    <p>Không có lịch khám nào cho ngày này.</p>
                </div>
              )}

              {/* <<<<<<< SỬA ĐỔI 3: Sử dụng hàm getButtonStatus để render >>>>>>> */}
              {!loading && schedule.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                    {schedule.map((group) => {
                        const status = getButtonStatus(group);
                        return (
                            <button 
                                key={group.time} 
                                onClick={() => { 
                                    if (!status.disabled) {
                                        setSelectedTimeGroup(group); 
                                        setSelectionModalOpen(true); 
                                    }
                                }}
                                disabled={status.disabled}
                                className={`p-3 rounded-lg font-semibold text-center transition-all shadow-sm ${status.className}`}
                            >
                                <p className="text-base">{group.time}</p>
                                <p className={status.textClassName}>
                                    {status.text}
                                </p>
                            </button>
                        )
                    })}
                </div>
              )}
            </main>
        </div>
      </div>

      <DoctorSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setSelectionModalOpen(false)}
        group={selectedTimeGroup}
        onBook={handleBooking}
        onViewDetails={handleViewDetails}
      />
       <DoctorDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        doctorId={viewingDoctorId}
      />
    </div>
  );
}