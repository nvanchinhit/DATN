'use client';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Trang quản lý tổng</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/products" className="block p-5 bg-white rounded-lg shadow hover:shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">📦 Quản lý sản phẩm</h2>
          <p className="text-sm text-gray-600">Thêm, sửa, xoá và xem danh sách sản phẩm.</p>
        </Link>

        <Link href="/admin/orders" className="block p-5 bg-white rounded-lg shadow hover:shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">📑 Quản lý đơn hàng</h2>
          <p className="text-sm text-gray-600">Xem và cập nhật trạng thái đơn hàng.</p>
        </Link>

        <Link href="/admin/accounts" className="block p-5 bg-white rounded-lg shadow hover:shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">👥 Quản lý tài khoản</h2>
          <p className="text-sm text-gray-600">Danh sách tài khoản người dùng và phân quyền.</p>
        </Link>

        <Link href="/admin/appointments" className="block p-5 bg-white rounded-lg shadow hover:shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">📅 Lịch hẹn khám</h2>
          <p className="text-sm text-gray-600">Kiểm tra và xử lý các lịch hẹn với bác sĩ.</p>
        </Link>

        <Link href="/admin/doctors" className="block p-5 bg-white rounded-lg shadow hover:shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">👨‍⚕️ Quản lý bác sĩ</h2>
          <p className="text-sm text-gray-600">Cập nhật thông tin bác sĩ hợp tác.</p>
        </Link>

        <Link href="/admin/revenues" className="block p-5 bg-white rounded-lg shadow hover:shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">💰 Doanh thu</h2>
          <p className="text-sm text-gray-600">Thống kê doanh thu theo thời gian.</p>
        </Link>
      </div>
    </div>
  );
}
