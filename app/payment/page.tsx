'use client';

import React, { useState, useEffect } from 'react';

const CheckoutPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'cod',
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const products = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      price: 150000,
      quantity: 1,
      image:
        'https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/00032865_paracetamol_stada_500mg_10x10_4111_61af_large_6bbfac12ff.jpg',
    },
    {
      id: 2,
      name: 'Vitamin C 1000mg',
      price: 200000,
      quantity: 1,
      image:
        'https://nhathuocthanthien.com.vn/wp-content/uploads/2023/02/dgm_nttt_Vitamin-c-1000-mg-zinc-rosehip.jpg',
    },
  ];

  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const shipping = 0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const formatVND = (number: number) => {
    return isClient ? number.toLocaleString('vi-VN') + ' VND' : number + ' VND';
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-10 py-10">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">
        Trang chủ / sản phẩm / thanh toán
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Form Thanh Toán */}
        <div className="bg-white p-6 rounded-xl shadow border border-blue-100">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            Địa chỉ thanh toán
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Tên người nhận"
              value={form.name}
              onChange={handleChange}
              className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email người nhận"
              value={form.email}
              onChange={handleChange}
              className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={handleChange}
              className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              name="address"
              placeholder="Địa chỉ người nhận"
              value={form.address}
              onChange={handleChange}
              className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <h3 className="text-lg font-medium mb-2 text-blue-700">
            Phương thức thanh toán
          </h3>
          <div className="space-y-2 mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={form.paymentMethod === 'cod'}
                onChange={handleChange}
                className="accent-blue-600"
              />
              <span>Thanh toán khi nhận hàng</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={form.paymentMethod === 'online'}
                onChange={handleChange}
                className="accent-blue-600"
              />
              <span>Thanh toán điện tử</span>
            </label>
          </div>

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
            onClick={() => alert('Đặt hàng thành công!')}
          >
            Đặt Hàng
          </button>
        </div>

        {/* Chi Tiết Đơn Hàng */}
        <div className="bg-white p-6 rounded-xl shadow border border-blue-100">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            Chi tiết đơn hàng
          </h2>
          <ul className="space-y-4">
            {products.map((product) => (
              <li key={product.id} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-md border"
                  />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatVND(product.price)} × {product.quantity}
                    </p>
                  </div>
                </div>
                <div className="font-semibold">
                  {formatVND(product.price * product.quantity)}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t pt-4 space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{formatVND(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Vận chuyển:</span>
              <span>{formatVND(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span>Giảm giá:</span>
              <span>{formatVND(discount)}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-black pt-2 border-t">
              <span>Tổng:</span>
              <span>{formatVND(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
