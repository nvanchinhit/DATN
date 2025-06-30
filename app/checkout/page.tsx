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
  const [mode, setMode] = useState<'self' | 'other'>('self');
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

  // Các state mới để cải thiện UX
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái đang gửi form
  const [submitted, setSubmitted] = useState(false); // Trạng thái đã gửi thành công

  // Lấy thông tin user khi tải trang
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

  // Tự động điền form dựa trên chế độ đặt lịch
  useEffect(() => {
    if (mode === 'self' && currentUser) {
      setForm({
        name: currentUser.name || '',
        age: '',
        gender: 'Khác',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        reason: '',
      });
    } 
    else if (mode === 'other') {
      setForm({ name: '', age: '', gender: 'Khác', phone: '', email: '', address: '', reason: '' });
    }
  }, [mode, currentUser]);

  // Lấy thông tin đặt lịch từ URL
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
    const token = localStorage.getItem('token'); 

    if (!currentUser || !token) {
      alert("Bạn cần đăng nhập để thực hiện chức năng này.");
      router.push('/login');
      return;
    }
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (!bookingInfo) return;

    setIsSubmitting(true); // Bắt đầu gửi, vô hiệu hóa nút

    const payload = {
      ...form,
      age: parseInt(form.age),
      doctor_id: bookingInfo.doctorId,
      time_slot_id: bookingInfo.time_slot_id,
    };

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appointments`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });
      const resultData = await response.json();

      if (response.ok) {
        setSubmitted(true); // Đặt lịch thành công
      } else {
        alert('Lỗi từ máy chủ: ' + (resultData.message || "Có lỗi không xác định xảy ra."));
      }
    } catch (error) {
      console.error("Lỗi khi kết nối để đặt lịch:", error);
      alert("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false); // Gửi xong, kích hoạt lại nút (nếu có lỗi)
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
          ) : submitted ? ( // Nếu đã đặt lịch thành công
            <div className="text-center bg-green-50 border border-green-300 p-8 rounded-xl text-green-800">
              <h3 className="text-2xl font-bold mb-4 text-green-900">✅ Đặt lịch thành công!</h3>
              <p className="mb-6">Thông tin lịch hẹn của bạn đã được ghi nhận. Vui lòng kiểm tra email hoặc mục "Lịch hẹn của tôi" để xem chi tiết.</p>
              <div className="space-y-1 text-left max-w-md mx-auto bg-white p-4 rounded-lg shadow-sm mb-8">
                <li><strong>Họ tên bệnh nhân:</strong> {form.name}</li>
                <li><strong>Bác sĩ:</strong> {bookingInfo.doctorName}</li>
                <li><strong>Ngày khám:</strong> {new Date(bookingInfo.date + 'T00:00:00').toLocaleDateString('vi-VN')} | {bookingInfo.time.start} - {bookingInfo.time.end}</li>
              </div>
              <div className="flex justify-center gap-4">
                  <Link href="/profile/appointment" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-all">
                    Xem Lịch hẹn của tôi
                  </Link>
                  <Link href="/" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all">
                    Về Trang chủ
                  </Link>
              </div>
            </div>
          ) : ( // Nếu chưa đặt lịch, hiển thị form
            <>
              <div className="flex mb-6">
                <button type="button" className={`flex-1 py-2 text-center rounded-l-md font-medium transition-colors ${mode === 'self' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => setMode('self')}>Đặt cho bản thân</button>
                <button type="button" className={`flex-1 py-2 text-center rounded-r-md font-medium transition-colors ${mode === 'other' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => setMode('other')}>Đặt cho người thân</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-10 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all text-base disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Đang xử lý...' : 'Xác nhận Đặt lịch'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}