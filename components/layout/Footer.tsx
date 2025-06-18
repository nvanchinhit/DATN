import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
   <footer className="bg-blue-50 border-t border-blue-200 text-sm text-gray-600">
  <div className="container mx-auto px-4 py-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Giới thiệu */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-blue-700">TDCare</h2>
        <p>
          Hệ thống bán thuốc & đặt lịch khám trực tuyến với hơn 12 năm hoạt động, đồng hành cùng hàng triệu người Việt.
        </p>
        <ul className="space-y-1 text-sm">
          <li className="flex items-center gap-2">
            <MapPin size={16} className="text-blue-600" />
            123 Đường ABC, TP.HCM
          </li>
          <li className="flex items-center gap-2">
            <Mail size={16} className="text-blue-600" />
            cskh@tdcare.vn
          </li>
          <li className="flex items-center gap-2">
            <Phone size={16} className="text-blue-600" />
            1900 1806
          </li>
        </ul>
      </div>

      {/* Liên kết nhanh */}
      <div>
        <h3 className="text-base font-semibold text-blue-700 mb-2">Liên kết nhanh</h3>
        <ul className="space-y-2 text-sm">
          <li><Link href="#" className="hover:text-blue-600">Trang chủ</Link></li>
          <li><Link href="#" className="hover:text-blue-600">Tất cả sản phẩm</Link></li>
          <li><Link href="#" className="hover:text-blue-600">Khuyến mãi</Link></li>
        </ul>
      </div>

      {/* Giờ làm việc */}
      <div>
        <h3 className="text-base font-semibold text-blue-700 mb-2">Giờ làm việc</h3>
        <p className="leading-snug text-sm">
          T2 - CN: 7h30 - 20h<br />
          Cấp cứu: 24/24<br />
          Đặt lịch khám: 1900 1806<br />
          Hotline: 0911 615 115
        </p>
      </div>

      {/* Đăng ký nhận tin */}
      <div>
        <h3 className="text-base font-semibold text-blue-700 mb-2">Đăng ký nhận tin</h3>
        <p className="text-sm mb-2">Nhận thông tin mới nhất về khuyến mãi, ưu đãi và tin tức sức khỏe!</p>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="w-full mt-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Đăng ký
        </button>

        <div className="flex gap-3 mt-3 text-gray-600">
          <Facebook className="hover:text-blue-600 cursor-pointer" />
          <Twitter className="hover:text-blue-400 cursor-pointer" />
          <Instagram className="hover:text-pink-500 cursor-pointer" />
          <Youtube className="hover:text-red-500 cursor-pointer" />
        </div>
      </div>
    </div>

    <Separator className="my-6" />

    <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-2">
      <p>© {currentYear} TDCare. All rights reserved.</p>
      <div className="flex space-x-4">
        <Link href="#" className="hover:text-blue-600">Chính sách bảo mật</Link>
        <Link href="#" className="hover:text-blue-600">Điều khoản</Link>
        <Link href="#" className="hover:text-blue-600">Cookie</Link>
      </div>
    </div>
  </div>
</footer>

  );
}
