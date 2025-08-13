import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowRight
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/about-us", label: "Về chúng tôi" },
    { href: "/specialty", label: "Chuyên khoa" },
    { href: "/staff", label: "Đội ngũ Bác sĩ" },
    { href: "/faq", label: "Câu hỏi thường gặp" },
  ];

  const patientSupportLinks = [
    { href: "/booking", label: "Đặt lịch khám" },
    { href: "/profile", label: "Quản lý hồ sơ" },
    { href: "/contact-us", label: "Hỗ trợ khách hàng" },
    { href: "/refund-policy", label: "Chính sách hoàn tiền" },
  ];

  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: About & Contact */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <img
                src="https://i.imgur.com/bUBPKF9.jpeg" // Replace with your white/transparent logo
                alt="TDCARE Logo"
                className="h-20" // Makes a black logo white
              />
            </Link>
            <p className="text-gray-400 mb-6 text-sm">
              Nền tảng chăm sóc sức khỏe toàn diện, kết nối bạn với các dịch vụ y tế hàng đầu một cách nhanh chóng và tiện lợi.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">123 Đường ABC, Phường B, Quận C, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:cskh@tdcare.vn" className="text-gray-300 hover:text-white transition-colors">cskh@tdcare.vn</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <a href="tel:19001806" className="text-gray-300 hover:text-white transition-colors">1900 1806</a>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Liên kết nhanh</h3>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center gap-2 text-gray-400 hover:text-white hover:pl-1 transition-all">
                     <ArrowRight size={14} />
                     <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Patient Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Hỗ trợ bệnh nhân</h3>
            <ul className="space-y-3">
               {patientSupportLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center gap-2 text-gray-400 hover:text-white hover:pl-1 transition-all">
                     <ArrowRight size={14} />
                     <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Đăng ký nhận tin</h3>
            <p className="text-gray-400 text-sm mb-4">Nhận các cập nhật mới nhất và ưu đãi đặc biệt từ chúng tôi.</p>
            <form className="flex items-center">
              <input
                type="email"
                placeholder="Email của bạn"
                className="w-full px-4 py-2.5 text-sm bg-slate-700 text-white border border-slate-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" aria-label="Đăng ký" className="p-3 bg-blue-600 hover:bg-blue-700 transition-colors rounded-r-md">
                <ArrowRight size={18} />
              </button>
            </form>
            <div className="flex gap-4 mt-6">
              <a href="#" aria-label="Facebook" className="w-9 h-9 flex items-center justify-center bg-slate-700 hover:bg-blue-600 rounded-full transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 flex items-center justify-center bg-slate-700 hover:bg-sky-500 rounded-full transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 flex items-center justify-center bg-slate-700 hover:bg-pink-600 rounded-full transition-colors">
                <Instagram size={18} />
              </a>
               <a href="#" aria-label="Youtube" className="w-9 h-9 flex items-center justify-center bg-slate-700 hover:bg-red-600 rounded-full transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

        </div>
      </div>
      
      {/* Copyright Bar */}
      <div className="bg-slate-900 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2">
            <p>© {currentYear} TDCare. Bảo lưu mọi quyền.</p>
            <div className="flex space-x-4">
                <Link href="/terms" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}