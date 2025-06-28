'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Định nghĩa cấu trúc dữ liệu
interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  role_id: number;
}

interface TimeSlotItem {
  id: number;
  start: string;
  end:string;
}

interface BookingInfo {
  doctorId: number;
  doctorName: string;
  date: string;
  time: TimeSlotItem;
  specialty: string;
  time_slot_id: number;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const data = searchParams.get('data');

  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<'self' | 'other'>('self'); // Thêm lại state cho chế độ đặt lịch
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'Khác',
    phone: '',
    email: '',
    address: '',
    reason: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // --- BƯỚC 1: LẤY THÔNG TIN USER KHI TẢI TRANG ---
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        if (parsedUser.role_id === 2) {
          setCurrentUser(parsedUser);
        }
      } catch (e) {
        console.error("Lỗi khi đọc dữ liệu người dùng:", e);
      }
    }
    setIsLoading(false);
  }, []);

  // --- BƯỚC 2: XỬ LÝ VIỆC ĐIỀN FORM DỰA TRÊN CHẾ ĐỘ (self/other) ---
  useEffect(() => {
    // Nếu chọn "Đặt cho bản thân" và đã có thông tin user
    if (mode === 'self' && currentUser) {
      // Điền thông tin vào form làm GỢI Ý, người dùng vẫn có thể sửa
      setForm({
        name: currentUser.name || '',
        age: '', // Tuổi luôn để trống cho người dùng tự nhập
        gender: 'Khác',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        reason: '',
      });
    } 
    // Nếu chọn "Đặt cho người thân", form sẽ trống hoàn toàn
    else if (mode === 'other') {
      setForm({
        name: '',
        age: '',
        gender: 'Khác',
        phone: '',
        email: '',
        address: '',
        reason: '',
      });
    }
  }, [mode, currentUser]); // Chạy lại khi mode hoặc currentUser thay đổi


  useEffect(() => {
    if (data) {
      try {
        const decoded = JSON.parse(decodeURIComponent(data));
        setBookingInfo({ ...decoded, time_slot_id: decoded.time.id });
      } catch (err) {
        alert("Dữ liệu đặt lịch không hợp lệ.");
        router.back();
      }
    }
  }, [data, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Vui lòng nhập họ tên.';
    if (!form.age.trim() || isNaN(parseInt(form.age)) || parseInt(form.age) <= 0) newErrors.age = 'Vui lòng nhập tuổi hợp lệ.';
    if (!form.phone.trim() || !/^[0-9]{9,11}$/.test(form.phone)) newErrors.phone = 'Số điện thoại không hợp lệ.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email không hợp lệ.';
    if (!form.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Vui lòng đăng nhập để đặt lịch.");
      router.push('/login');
      return;
    }
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (!bookingInfo) return;

    // --- BƯỚC 3: KHI SUBMIT, LUÔN LẤY ID CỦA NGƯỜI DÙNG ĐANG ĐĂNG NHẬP ---
    const payload = {
      ...form, // Lấy toàn bộ thông tin người dùng đã ĐIỀN TRÊN FORM
      age: parseInt(form.age),
      doctor_id: bookingInfo.doctorId,
      time_slot_id: bookingInfo.time_slot_id,
      payment_status: 'Chưa thanh toán',
      status: 'Chưa xác nhận',
      customer_id: currentUser.id // ID này là của người đang đăng nhập
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const resultData = await response.json();
      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Lỗi từ máy chủ: ' + (resultData.error || "Có lỗi không xác định xảy ra."));
      }
    } catch (error) {
      alert("Không thể kết nối đến máy chủ.");
    }
  };

  if (isLoading || !bookingInfo) {
    return <div className="flex items-center justify-center min-h-screen">Đang tải thông tin...</div>;
  }

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 border border-blue-200">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">{bookingInfo.doctorName}</h2>
          <p className="text-sm text-blue-600 mb-4">Chuyên khoa: {bookingInfo.specialty}</p>
          <p className="text-gray-700 mb-6 border-b pb-4">
            Lịch hẹn vào: <strong>{new Date(bookingInfo.date + 'T00:00:00').toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong> | <strong>{bookingInfo.time.start} - {bookingInfo.time.end}</strong>
          </p>
          
          {!currentUser ? (
            <div className="text-center bg-yellow-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-yellow-800 mb-4">⚠️ Yêu cầu đăng nhập</h3>
              <p className="text-yellow-700 mb-6">Bạn cần đăng nhập để có thể đặt lịch khám.</p>
              <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700">
                Đăng nhập ngay
              </Link>
            </div>
          ) : (
            <>
              {/* --- BƯỚC 4: THÊM LẠI NÚT CHỌN CHẾ ĐỘ --- */}
              <div className="flex mb-6">
                <button type="button" className={`flex-1 py-2 text-center rounded-l-md font-medium transition-colors ${mode === 'self' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => setMode('self')}>Đặt cho bản thân</button>
                <button type="button" className={`flex-1 py-2 text-center rounded-r-md font-medium transition-colors ${mode === 'other' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => setMode('other')}>Đặt cho người thân</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* --- BƯỚC 5: GỠ BỎ `readOnly` KHỎI CÁC TRƯỜNG INPUT --- */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Họ và tên bệnh nhân <span className="text-red-500">*</span></label>
                    <input name="name" placeholder="Nhập họ tên người khám" value={form.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Tuổi <span className="text-red-500">*</span></label>
                    <input name="age" type="number" placeholder="Nhập tuổi người khám" value={form.age} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                    {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Số điện thoại liên hệ <span className="text-red-500">*</span></label>
                    <input name="phone" placeholder="Nhập SĐT để nhận thông báo" value={form.phone} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email liên hệ <span className="text-red-500">*</span></label>
                    <input name="email" type="email" placeholder="Nhập email để nhận xác nhận" value={form.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                   <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Địa chỉ <span className="text-red-500">*</span></label>
                    <input name="address" placeholder="Nhập địa chỉ" value={form.address} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-600 mb-1">Giới tính</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Lý do khám bệnh (không bắt buộc)</label>
                  <textarea name="reason" placeholder="Mô tả ngắn gọn triệu chứng..." value={form.reason} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" rows={3} />
                </div>
                <div className="text-center pt-6">
                  <button type="submit" className="bg-blue-600 text-white px-10 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all text-base">
                    Xác nhận Đặt lịch
                  </button>
                </div>
              </form>
            </>
          )}

          {submitted && (
            <div className="mt-10 bg-green-50 border border-green-300 p-6 rounded-xl text-green-800">
              <h3 className="text-lg font-semibold mb-4 text-green-900">✅ Đặt lịch thành công!</h3>
              <p className="mb-4">Thông tin của bạn đã được ghi nhận. Vui lòng kiểm tra email để xác nhận. Cảm ơn bạn đã sử dụng dịch vụ.</p>
              <ul className="space-y-1 text-sm">
                <li><strong>Họ tên bệnh nhân:</strong> {form.name}</li>
                <li><strong>Bác sĩ:</strong> {bookingInfo.doctorName}</li>
                <li><strong>Ngày khám:</strong> {new Date(bookingInfo.date + 'T00:00:00').toLocaleDateString('vi-VN')} | {bookingInfo.time.start} - {bookingInfo.time.end}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}