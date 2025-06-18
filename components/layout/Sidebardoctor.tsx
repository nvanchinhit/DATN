'use client';
import Link from 'next/link';

export default function Sidebardoctor() {
  return (
    <aside className="w-64 bg-white border-r p-4 min-h-screen">
      {/* Avatar & Name */}
      <div className="text-center mb-6">
        <img
          src="https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="avatar"
          className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
        />
        <h2 className="font-semibold">Dr. Trần Trọng Thắng</h2>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 text-gray-700">
        <Link href="/doctor/dashboard" className="no-underline">
          <div className="font-medium bg-gray-200 p-2 rounded hover:bg-gray-300 cursor-pointer">
            📊 Dashboard
          </div>
        </Link>

        <Link href="/doctor/schedule" className="no-underline">
          <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">🗓️ Lịch khám</div>
        </Link>

        <Link href="/doctor/patients" className="no-underline">
          <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">📁 Hồ sơ bệnh nhân</div>
        </Link>

        <Link href="/doctor/messages" className="no-underline">
          <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">💬 Tin nhắn</div>
        </Link>

        <Link href="/doctor/profile" className="no-underline">
          <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">👤 Hồ sơ cá nhân</div>
        </Link>
      </nav>
    </aside>
  );
}
