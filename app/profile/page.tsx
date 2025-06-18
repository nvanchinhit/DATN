'use client';

import React, { useState } from 'react';

export default function ProfilePage() {
  const [gender, setGender] = useState('');

  return (
    <div className="min-h-screen bg-[#f2fcff] p-6">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-xl p-6 flex gap-6">
        {/* Sidebar */}
        <aside className="w-1/4 border-r pr-4">
          <div className="mb-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto"></div>
            <p className="text-sm mt-2 font-semibold">r94q59ep7c</p>
            <p className="text-xs text-blue-500 cursor-pointer hover:underline">Sửa Hồ Sơ</p>
          </div>
          <nav className="space-y-2 text-sm font-medium">
            <div className="text-blue-600">Hồ Sơ</div>
            <div className="hover:text-blue-500 cursor-pointer">Ngân Hàng</div>
            <div className="hover:text-blue-500 cursor-pointer">Địa Chỉ</div>
            <div className="hover:text-blue-500 cursor-pointer">Đổi Mật Khẩu</div>
            <div className="hover:text-blue-500 cursor-pointer">Cài Đặt Thông Báo</div>
            <div className="hover:text-blue-500 cursor-pointer">Thiết Lập Riêng Tư</div>
          </nav>
        </aside>

        {/* Form */}
        <main className="flex-1">
          <h2 className="text-lg font-bold mb-4">Hồ Sơ Của Tôi</h2>
          <p className="text-sm text-gray-500 mb-6">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
          
          <form className="space-y-4">
            <div>
              <label className="block font-semibold">Tên đăng nhập</label>
              <input
                type="text"
                defaultValue="r94q59ep7c"
                disabled
                className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-100"
              />
              <p className="text-xs text-gray-500">Tên Đăng nhập chỉ có thể thay đổi một lần.</p>
            </div>

            <div>
              <label className="block font-semibold">Tên</label>
              <input type="text" className="mt-1 w-full border rounded-md p-2" placeholder="Nhập tên của bạn" />
            </div>

            <div>
              <label className="block font-semibold">Email</label>
              <div className="flex items-center gap-2">
                <input type="text" disabled value="co********@gmail.com" className="w-full p-2 border rounded-md bg-gray-100" />
                <span className="text-blue-500 text-sm cursor-pointer hover:underline">Thay Đổi</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold">Số điện thoại</label>
              <span className="text-blue-500 text-sm cursor-pointer hover:underline">Thêm</span>
            </div>

            <div>
              <label className="block font-semibold">Giới tính</label>
              <div className="flex items-center gap-4 mt-1">
                {["Nam", "Nữ", "Khác"].map((option) => (
                  <label key={option} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={gender === option}
                      onChange={() => setGender(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold">Ngày sinh</label>
              <div className="flex gap-2 mt-1">
                <select className="border p-2 rounded-md w-1/3">
                  <option>Ngày</option>
                </select>
                <select className="border p-2 rounded-md w-1/3">
                  <option>Tháng</option>
                </select>
                <select className="border p-2 rounded-md w-1/3">
                  <option>Năm</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xl">
                  👤
                </div>
                <div>
                  <label className="block font-semibold mb-1">Chọn Ảnh</label>
                  <input type="file" accept=".jpeg,.png" />
                  <p className="text-xs text-gray-400 mt-1">Dung lượng tối đa 1MB. Định dạng: .JPEG, .PNG</p>
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Lưu
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
