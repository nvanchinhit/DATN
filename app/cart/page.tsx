'use client';
import React, { useState } from 'react';

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Sản phẩm 1', price: 500000, quantity: 1 },
    { id: 2, name: 'Sản phẩm 2', price: 200000, quantity: 1 }
  ]);

  const handleQuantityChange = (id: number, delta: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const formatCurrency = (amount: number) => {
    if (typeof window === 'undefined') return amount.toString();
    return amount.toLocaleString('vi-VN') + ' VND';

  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 40000;
  const total = subtotal + shipping;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <nav className="text-sm mb-4">
        <ol className="flex space-x-2 text-gray-600">
          <li><a href="/" className="hover:underline text-blue-600">Trang chủ</a></li>
          <li>/</li>
          <li className="text-black font-semibold">Giỏ hàng</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <table className="w-full text-sm border rounded-lg overflow-hidden shadow">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3 text-left">Ảnh</th>
                <th className="p-3 text-left">Sản phẩm</th>
                <th className="p-3 text-left">Giá</th>
                <th className="p-3 text-left">Số lượng</th>
                <th className="p-3 text-left">Tổng</th>
                <th className="p-3 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {cartItems.map(item => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">
                    <img
                      src="https://production-cdn.pharmacity.io/digital/828x828/plain/e-com/images/ecommerce/20250523103220-0-P24647_1.jpg"
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                  </td>
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">{formatCurrency(item.price)}</td>
                  <td className="p-3">
                    <div className="flex items-center border rounded w-fit">
                      <button
                        className="px-2 py-1 text-gray-600 hover:text-blue-600"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >−</button>
                      <input
                        type="text"
                        readOnly
                        value={item.quantity}
                        className="w-10 text-center bg-gray-100 border-l border-r py-1"
                      />
                      <button
                        className="px-2 py-1 text-gray-600 hover:text-blue-600"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >+</button>
                    </div>
                  </td>
                  <td className="p-3 font-semibold">{formatCurrency(item.price * item.quantity)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold mb-4">Tóm Tắt Giỏ Hàng</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Tạm tính</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </li>
            <li className="flex justify-between">
              <span>Vận chuyển</span>
              <strong>{formatCurrency(shipping)}</strong>
            </li>
            <li className="flex justify-between">
              <span>Giảm giá</span>
              <strong>0 VND</strong>
            </li>
            <li className="flex justify-between font-bold border-t pt-2">
              <span>Tổng</span>
              <strong>{formatCurrency(total)}</strong>
            </li>
          </ul>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Tiến Hành Thanh Toán</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
