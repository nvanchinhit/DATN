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
  price: number; // Thêm price vào BookingInfo
}

interface DoctorInfo {
  id: number;
  name: string;
  price: number;
  specialization_name: string;
}
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const data = searchParams.get('data');

  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [doctorInfo, setDoctorInfo] = useState<DoctorInfo | null>(null);
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
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash'); // Mặc định thanh toán khi đến khám
  const [showPaymentInfo, setShowPaymentInfo] = useState(false); // Hiển thị thông tin thanh toán chi tiết
  const [clinicInfo, setClinicInfo] = useState<{ clinic_name: string; room_number: string; address: string } | null>(null);

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

  // Lấy thông tin đặt lịch từ URL và thông tin bác sĩ
  useEffect(() => {
    if (data) {
      try {
        const decoded = JSON.parse(decodeURIComponent(data));
        
        // Cập nhật bookingInfo
        setBookingInfo({ 
          ...decoded, 
          time_slot_id: decoded.time.id,
          price: typeof decoded.price === 'number' ? decoded.price : 0 // Đảm bảo price được truyền vào
        });
        
        // Set doctorInfo trực tiếp từ decoded data, không cần fetch API riêng cho giá
        setDoctorInfo({
          id: decoded.doctorId,
          name: decoded.doctorName,
          price: typeof decoded.price === 'number' ? decoded.price : 0, // Lấy giá từ bookingData
          specialization_name: decoded.specialty // Lấy chuyên khoa từ bookingData
        });

      } catch (err) {
        console.error("Lỗi khi parse dữ liệu đặt lịch:", err);
        alert("Dữ liệu đặt lịch không hợp lệ.");
        router.back();
      }
    } else {
      // Nếu không có dữ liệu đặt lịch, quay lại trang trước
      router.back();
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

    // Nếu chọn thanh toán online, chuyển sang trang thanh toán
    if (paymentMethod === 'online') {
      const paymentData = {
        doctorName: bookingInfo.doctorName,
        doctorEmail: 'doctor@example.com', // Có thể lấy từ API sau
        amount: doctorInfo?.price || 0,
        description: `Thanh toán khám bệnh - ${bookingInfo.doctorName} - ${bookingInfo.date} ${bookingInfo.time.start}-${bookingInfo.time.end}`,
        patientName: form.name,
        patientPhone: form.phone,
        patientEmail: form.email,
        appointmentDate: bookingInfo.date,
        appointmentTime: `${bookingInfo.time.start}-${bookingInfo.time.end}`,
        specialty: bookingInfo.specialty,
        // Thông tin form để tạo appointment sau khi thanh toán thành công
        formData: {
          ...form,
          age: parseInt(form.age),
          doctor_id: bookingInfo.doctorId,
          time_slot_id: bookingInfo.time_slot_id,
          payment_method: 'online'
        }
      };
      
      const encodedPaymentData = encodeURIComponent(JSON.stringify(paymentData));
      router.push(`/payment?data=${encodedPaymentData}`);
      return;
    }

    // Nếu thanh toán tiền mặt, tiếp tục logic cũ
    setIsSubmitting(true); // Bắt đầu gửi, vô hiệu hóa nút

    const payload = {
      ...form,
      age: parseInt(form.age),
      doctor_id: bookingInfo.doctorId,
      time_slot_id: bookingInfo.time_slot_id,
      payment_method: paymentMethod, // Thêm phương thức thanh toán
    };

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const response = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });
      const resultData = await response.json();

      if (response.ok) {
        setSubmitted(true); // Đặt lịch thành công
        if (resultData.clinic) setClinicInfo({
          clinic_name: 'Phòng khám Đa khoa ABC', // hardcode
          room_number: resultData.clinic.room_number, // lấy từ DB
          address: '123 Đường XYZ, Quận 1, TP.HCM' // hardcode
        });
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

  

  // Hàm format giá tiền
  const formatPrice = (price: number) => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
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
            <div className="rounded-2xl overflow-hidden border border-emerald-200 bg-white shadow-xl">
              <div className="px-6 py-8 text-center bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-200 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 opacity-40" style={{backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(16,185,129,0.15), transparent 40%), radial-gradient(circle at 80% 0%, rgba(16,185,129,0.1), transparent 35%)'}}></div>
                <div className="relative mx-auto mb-4 h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center ring-8 ring-emerald-50 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-2.41a.75.75 0 1 0-1.22-.88l-3.67 5.07-1.62-1.62a.75.75 0 0 0-1.06 1.06l2.25 2.25c.33.33.86.29 1.13-.09l4.19-5.78Z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="relative text-2xl font-bold text-emerald-900">Đặt lịch thành công!</h3>
                <p className="relative mt-2 text-emerald-700">Thông tin lịch hẹn đã được ghi nhận. Vui lòng kiểm tra email hoặc mục "Lịch hẹn của tôi" để xem chi tiết.</p>
              </div>

              <div className="p-6">
                <ol className="mb-6 grid grid-cols-4 gap-2">
                  {['Đặt lịch', 'Chờ xác nhận', 'Khám', 'Bệnh án'].map((step, idx) => (
                    <li key={step} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${idx <= 1 ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${idx <= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-700'}`}>{idx+1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Thông tin cuộc hẹn</h4>
                  <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Bệnh nhân</span>
                      <span className="font-medium text-gray-900">{form.name}</span>
                    </div>
                    
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Bác sĩ</span>
                      <span className="font-medium text-gray-900">{bookingInfo?.doctorName}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Ngày</span>
                      <span className="font-medium text-gray-900">{new Date(bookingInfo.date + 'T00:00:00').toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Giờ</span>
                      <span className="font-medium text-gray-900">{bookingInfo.time.start} - {bookingInfo.time.end}</span>
                    </div>
                    {doctorInfo && doctorInfo.price > 0 && (
                      <div className="flex justify-between py-1">
                        <span className="text-gray-500">Phí khám</span>
                        <span className="font-semibold text-emerald-700">{formatPrice(doctorInfo.price)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Thông tin phòng khám</h4>
                  <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Cơ sở</span>
                      <span className="font-medium text-gray-900">{clinicInfo?.clinic_name || 'Phòng khám Đa khoa ABC'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Số phòng</span>
                      <span className="font-medium text-gray-900">{clinicInfo?.room_number || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Địa chỉ</span>
                      <span className="font-medium text-gray-900 text-right max-w-[60%]">{clinicInfo?.address || '123 Đường XYZ, Quận 1, TP.HCM'}</span>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentMethod === 'online' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'}`}>
                          {paymentMethod === 'online' ? 'Thanh toán online' : 'Thanh toán khi khám'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">Trạng thái: <span className="font-medium text-gray-700">Chờ bác sĩ xác nhận</span></span>
                    </div>
                  </div>
                </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link href="/profile/appointment" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow hover:bg-blue-700 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M6.75 3A2.75 2.75 0 0 0 4 5.75v12.5A2.75 2.75 0 0 0 6.75 21h10.5A2.75 2.75 0 0 0 20 18.25V8.5l-5.5-5.5H6.75Z"/><path d="M14.5 3v3.25A2.25 2.25 0 0 0 16.75 8.5H20"/></svg>
                  Lịch hẹn của tôi
                </Link>
                <Link href="/" className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-semibold border border-gray-200 hover:bg-gray-200 transition">
                  Trang chủ
                </Link>
              </div>

              <p className="pb-6 text-center text-sm text-gray-600">💡 Sau khi khám xong, bạn có thể xem hồ sơ bệnh án tại mục "Hồ Sơ Bệnh Án" trong trang cá nhân.</p>
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

                {/* Phần hiển thị giá tiền */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-800 mb-1">Thông tin thanh toán</h3>
                      <p className="text-sm text-blue-600">Phí khám bệnh</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-800">
                        {doctorInfo && doctorInfo.price > 0 ? formatPrice(doctorInfo.price) : '0 VND'}
                      </p>
                      <p className="text-xs text-blue-600">
                        {paymentMethod === 'online' ? 'Thanh toán ngay' : 'Thanh toán sau khi khám'}
                      </p>
                    </div>
                  </div>

                  {/* Hiển thị thông tin chi tiết khi chọn thanh toán online */}
                  {paymentMethod === 'online' && doctorInfo && doctorInfo.price > 0 && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-2">Chi tiết thanh toán:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bác sĩ:</span>
                          <span className="font-medium">{bookingInfo.doctorName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Chuyên khoa:</span>
                          <span className="font-medium">{bookingInfo.specialty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngày khám:</span>
                          <span className="font-medium">{new Date(bookingInfo.date + 'T00:00:00').toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Giờ khám:</span>
                          <span className="font-medium">{bookingInfo.time.start} - {bookingInfo.time.end}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-gray-600 font-semibold">Tổng tiền:</span>
                          <span className="font-bold text-blue-800">{formatPrice(doctorInfo.price)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Chọn phương thức thanh toán:</label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={paymentMethod === 'cash'}
                          onChange={() => setPaymentMethod('cash')}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Thanh toán khi đến khám</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={paymentMethod === 'online'}
                          onChange={() => setPaymentMethod('online')}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Thanh toán online (chuyển khoản/ví điện tử)</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-6">
                  <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-10 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all text-base disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Đang xử lý...' : 
                     paymentMethod === 'online' ? 'Tiến hành thanh toán' : 'Xác nhận Đặt lịch'}
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