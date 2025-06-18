'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function BookingForm() {
  const { slotId } = useParams();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    reason: '',
    payment: 'cash',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đặt lịch thành công!');
  };

  return (
    <div className="min-h-screen bg-blue-50 px-4 py-8 sm:px-10 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Cột trái: Thông tin bác sĩ */}
        <div className="bg-blue-100 flex flex-col justify-center items-center px-6 py-10 md:w-1/3 text-center space-y-4">
          <img
  src="https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/anh-bac-si.jpg"
  alt="Ảnh người khám"
  className="w-16 h-16 rounded-full object-cover"
/>

          <h2 className="text-xl font-bold text-blue-900">Phạm Thị Hương</h2>
          <p className="text-gray-700">Chuyên khoa: Cơ Xương Khớp</p>
          <p className="text-blue-800 font-medium">Thứ 5, 26/06/2025</p>
          <p className="text-sm text-blue-700">🕒 14:00 - 15:00</p>
        </div>

        {/* Cột phải: Form */}
        <div className="flex-1 px-6 py-10 bg-white">
          <div className="flex gap-4 mb-6">
            <button className="flex-1 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition">
              Đặt cho bản thân
            </button>
            <button className="flex-1 py-2 bg-gray-100 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition">
              Đặt cho người thân
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="name"
              placeholder="Họ và tên (bắt buộc)"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <input
              name="phone"
              placeholder="Số điện thoại (bắt buộc)"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <input
              name="email"
              placeholder="Email (bắt buộc)"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <textarea
              name="reason"
              placeholder="Lý do khám bệnh"
              value={form.reason}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {/* Thanh toán */}
            <div>
              <p className="font-semibold mb-2">Hình thức thanh toán</p>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={form.payment === 'cash'}
                    onChange={handleChange}
                  />
                  MOMO
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={form.payment === 'online'}
                    onChange={handleChange}
                  />
                  Thanh toán khi đặt lịch
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow"
            >
              Đặt lịch
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
