import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-50 border-t py-8 mt-14">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between px-6 gap-6 md:gap-0">
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-1">Liên hệ</h4>
          <p className="text-gray-600 text-sm">Điện thoại: 0888-888-888</p>
          <p className="text-gray-600 text-sm">Email: support@medicare.vn</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-1">Địa chỉ</h4>
          <p className="text-gray-600 text-sm">123, Đường Sức Khỏe, Hà Nội</p>
        </div>
      </div>
      <div className="text-center text-gray-400 text-xs mt-6">
        © 2025 Medicare. All Rights Reserved.
      </div>
    </footer>
  );
}
