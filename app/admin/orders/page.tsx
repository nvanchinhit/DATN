'use client';

import { CheckCircle, Clock, XCircle, Eye, RotateCcw, Trash2 } from 'lucide-react';

export default function OrdersPage() {
  const orders = [
    { id: 'DH001', customer: 'Nguyễn Văn A', total: 220000, status: 'Đang xử lý', date: '2025-06-17' },
    { id: 'DH002', customer: 'Trần Thị B', total: 450000, status: 'Hoàn thành', date: '2025-06-16' },
    { id: 'DH003', customer: 'Lê Văn C', total: 175000, status: 'Đã huỷ', date: '2025-06-15' },
  ];

  const renderStatus = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return (
          <span className="flex items-center gap-1 text-green-600 font-semibold">
            <CheckCircle size={16} /> {status}
          </span>
        );
      case 'Đang xử lý':
        return (
          <span className="flex items-center gap-1 text-yellow-600 font-semibold">
            <Clock size={16} /> {status}
          </span>
        );
      case 'Đã huỷ':
        return (
          <span className="flex items-center gap-1 text-red-600 font-semibold">
            <XCircle size={16} /> {status}
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📦 Quản lý đơn hàng</h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3 border-b">Mã đơn</th>
              <th className="px-6 py-3 border-b">Khách hàng</th>
              <th className="px-6 py-3 border-b">Ngày đặt</th>
              <th className="px-6 py-3 border-b">Tổng tiền</th>
              <th className="px-6 py-3 border-b">Trạng thái</th>
              <th className="px-6 py-3 border-b text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{order.id}</td>
                <td className="px-6 py-4">{order.customer}</td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4 text-green-700 font-semibold">
                  {order.total.toLocaleString('vi-VN')}₫
                </td>
                <td className="px-6 py-4">{renderStatus(order.status)}</td>
                <td className="px-6 py-4 flex justify-center gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    title="Xem chi tiết"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    className="text-yellow-600 hover:text-yellow-800"
                    title="Cập nhật trạng thái"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    title="Huỷ đơn"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
