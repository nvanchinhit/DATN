"use client";
import React, { useState } from 'react';

const AppointmentForm: React.FC = () => {
  const [bookingFor, setBookingFor] = useState<'self' | 'relative'>('self');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    reason: '',
    payment: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ và tên.";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại.";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email.";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ.";
    if (!formData.payment) newErrors.payment = "Vui lòng chọn hình thức thanh toán.";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      console.log("Submitting data:", formData);
    
      alert("Đặt lịch thành công!");
    }
  };

  return (
    <>
      <a href="#" className="text-blue-500 underline block mb-4 max-w-2xl mx-auto">Quay lại</a>

      <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-md shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full" />
          <div>
            <p className="font-semibold">Nguyễn Văn A</p>
            <p>Chuyên khoa: Cơ xương khớp</p>
            <p>Thứ 5 ngày 25 tháng 06 năm 2025 &nbsp;|&nbsp; 14:00 - 15:00</p>
          </div>
        </div>

        <div className="flex border border-gray-300 rounded mb-4 overflow-hidden">
          <button
            onClick={() => setBookingFor('self')}
            className={`w-1/2 py-2 ${bookingFor === 'self' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          >
            Đặt cho bản thân
          </button>
          <button
            onClick={() => setBookingFor('relative')}
            className={`w-1/2 py-2 ${bookingFor === 'relative' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          >
            Đặt cho người thân
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <h3 className="text-lg font-semibold mb-2">
            Đặt cho {bookingFor === 'self' ? 'bản thân' : 'người thân'}
          </h3>

          <div>
            <input
              type="text"
              name="name"
              placeholder="Họ & tên (bắt buộc)"
              className="w-full border border-gray-300 p-2 rounded"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại (bắt buộc)"
              className="w-full border border-gray-300 p-2 rounded"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email (bắt buộc)"
              className="w-full border border-gray-300 p-2 rounded"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <input
              type="text"
              name="address"
              placeholder="Địa chỉ (bắt buộc)"
              className="w-full border border-gray-300 p-2 rounded"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          <div>
            <textarea
              name="reason"
              placeholder="Lý do khám bệnh"
              className="w-full border border-gray-300 p-2 rounded"
              rows={3}
              value={formData.reason}
              onChange={handleChange}
            ></textarea>
          </div>

          <div>
            <p className="font-medium">Hình thức thanh toán:</p>
            <label className="block mt-1">
              <input
                type="radio"
                name="payment"
                value="online"
                checked={formData.payment === 'online'}
                onChange={handleChange}
                className="mr-2"
              />
              Thanh toán điện tử
            </label>
            <label className="block">
              <input
                type="radio"
                name="payment"
                value="on-site"
                checked={formData.payment === 'on-site'}
                onChange={handleChange}
                className="mr-2"
              />
              Thanh toán tại cơ sở khám bệnh
            </label>
            {errors.payment && <p className="text-red-500 text-sm">{errors.payment}</p>}
          </div>

          <div>
            <p><strong>Giá khám:</strong> 500.000 VNĐ / một lượt khám</p>
            <p><strong>Phí đặt lịch:</strong> Miễn phí đặt lịch khám bệnh</p>
          </div>

          <div className="bg-gray-200 p-3 rounded text-sm text-gray-700">
            <p><strong>Lưu ý:</strong></p>
            <ul className="list-disc pl-5">
              <li>Thông tin điền/chụp cung cấp sẽ được sử dụng làm hồ sơ khám bệnh.</li>
              <li>Chỉ có thể huỷ, thay đổi địa chỉ đặt lịch trước 24h.</li>
              <li>Vui lòng kiểm tra kỹ thông tin trước khi nhấn “Xác nhận”.</li>
            </ul>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Đặt lịch
          </button>
        </form>
      </div>
    </>
  );
};

export default AppointmentForm;
