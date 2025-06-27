'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface TimeSlotItem {
  id: number;
  start: string;
  end: string;
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
  const data = searchParams.get('data');

  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [mode, setMode] = useState<'self' | 'other'>('self');
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'Khác',
    phone: '',
    email: '',
    address: '',
    reason: '',
    payment: 'cash'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (data) {
      try {
        const decoded = JSON.parse(decodeURIComponent(data));
        const slotId =
          decoded.time_slot_id ||
          (decoded.time && typeof decoded.time.id === "number" ? decoded.time.id : null);

        if (!slotId) {
          alert("Đã có lỗi xảy ra khi truyền dữ liệu, vui lòng thử lại.");
        }

        setBookingInfo({
          ...decoded,
          time_slot_id: slotId,
        });
      } catch (err) {
        alert("Dữ liệu đặt lịch không hợp lệ, vui lòng quay lại và thử lại.");
      }
    }
  }, [data]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (mode === 'self' && storedUser) {
      const user = JSON.parse(storedUser);
      setForm(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || ''
      }));
    } else if (mode === 'other') {
      setForm(prev => ({
        ...prev,
        name: '',
        phone: '',
        email: '',
        address: ''
      }));
    }
  }, [mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Vui lòng nhập họ tên.';
    if (!form.age.trim()) newErrors.age = 'Vui lòng nhập tuổi.';
    if (!form.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại.';
    if (!/^[0-9]{9,11}$/.test(form.phone)) newErrors.phone = 'Số điện thoại không hợp lệ.';
    if (!form.email.trim()) newErrors.email = 'Vui lòng nhập email.';
    if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email không hợp lệ.';
    if (!form.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!bookingInfo || typeof bookingInfo.time_slot_id !== 'number') {
      alert("Lỗi: Thông tin đặt lịch không đầy đủ. Vui lòng quay lại và thử lại.");
      return;
    }

    const payload = {
      name: form.name,
      age: parseInt(form.age),
      address: form.address,
      gender: form.gender,
      email: form.email,
      phone: form.phone,
      doctor_id: bookingInfo.doctorId,
      reason: form.reason,
      payment_status: form.payment === 'cash' ? 'Chưa thanh toán' : 'Đã thanh toán',
      status: 'Chưa xác nhận',
      time_slot_id: bookingInfo.time_slot_id
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
        alert('Lỗi từ máy chủ: ' + (resultData.error || "Có lỗi xảy ra, vui lòng thử lại."));
      }
    } catch (error) {
      alert("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền mạng.");
    }
  };

  if (!bookingInfo)
    return <div className="p-8 text-center text-blue-600">Đang tải thông tin đặt lịch...</div>;

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 border border-blue-200">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">{bookingInfo.doctorName}</h2>
          <p className="text-sm text-blue-600 mb-4">Chuyên khoa: {bookingInfo.specialty}</p>
          <p className="text-gray-700 mb-6">
            {new Date(bookingInfo.date + 'T00:00:00').toLocaleDateString('vi-VN', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            })} | {bookingInfo.time.start} - {bookingInfo.time.end}
          </p>
          <div className="flex mb-6">
            <button type="button" className={`flex-1 py-2 text-center rounded-l-md font-medium ${mode === 'self' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setMode('self')}>Đặt cho bản thân</button>
            <button type="button" className={`flex-1 py-2 text-center rounded-r-md font-medium ${mode === 'other' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setMode('other')}>Đặt cho người thân</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['name', 'age', 'phone', 'email', 'address'].map(field => (
                <div key={field}>
                  <input
                    name={field}
                    placeholder={`Nhập ${field === 'name' ? 'họ và tên' : field === 'age' ? 'tuổi' : field === 'phone' ? 'số điện thoại' : field === 'email' ? 'email' : 'địa chỉ'}`}
                    value={(form as any)[field]}
                    onChange={handleChange}
                    className="w-full p-3 border border-blue-400 bg-white text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                </div>
              ))}
              <div>
                <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-3 border border-blue-400 bg-white text-gray-800 rounded-md">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>
            <textarea name="reason" placeholder="Lý do khám bệnh (không bắt buộc)" value={form.reason} onChange={handleChange} className="w-full p-3 border border-blue-400 bg-white text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
            <div className="mt-4">
              <p className="mb-2 font-semibold text-blue-700">Hình thức thanh toán:</p>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-blue-800">
                  <input type="radio" name="payment" value="online" onChange={handleChange} disabled /> Thanh toán điện tử (sắp có)
                </label>
                <label className="flex items-center gap-2 text-blue-800">
                  <input type="radio" name="payment" value="cash" defaultChecked onChange={handleChange} /> Thanh toán tại cơ sở khám bệnh
                </label>
              </div>
            </div>
            <div className="text-sm text-blue-700 space-y-1 mt-4">
              <p><strong>Giá khám:</strong> <span className="text-blue-800 font-semibold">500.000 VND</span> / lần khám</p>
              <p><strong>Phí đặt lịch:</strong> Miễn phí</p>
            </div>
            <div className="bg-blue-100 border border-blue-300 p-4 rounded-lg text-sm mt-6">
              <p className="font-semibold text-blue-800 mb-2">Lưu ý</p>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>Thông tin bạn cung cấp sẽ được sử dụng làm hồ sơ khám bệnh. Vui lòng mang theo CMND/CCCD khi đến khám.</li>
                <li>Bạn chỉ có thể huỷ hoặc đổi lịch trước 24 giờ so với thời gian khám đã đặt.</li>
                <li>Vui lòng kiểm tra kỹ thông tin trước khi nhấn <strong>"Đặt lịch khám ngay"</strong>.</li>
              </ul>
            </div>
            <div className="text-center pt-6">
              <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition-all">
                Đặt lịch khám ngay
              </button>
            </div>
          </form>
          {submitted && (
            <div className="mt-10 bg-green-50 border border-green-300 p-6 rounded-xl text-sm text-green-800">
              <h3 className="text-lg font-semibold mb-4 text-green-900">✅ Đặt lịch thành công!</h3>
              <p className="mb-4">Thông tin của bạn đã được ghi nhận. Vui lòng kiểm tra email để xác nhận. Cảm ơn bạn đã sử dụng dịch vụ.</p>
              <ul className="space-y-1">
                <li><strong>Họ tên:</strong> {form.name}</li>
                <li><strong>Bác sĩ:</strong> {bookingInfo.doctorName}</li>
                <li><strong>Chuyên khoa:</strong> {bookingInfo.specialty}</li>
                <li><strong>Ngày khám:</strong> {new Date(bookingInfo.date + 'T00:00:00').toLocaleDateString('vi-VN')}</li>
                <li><strong>Khung giờ:</strong> {bookingInfo.time.start} - {bookingInfo.time.end}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
