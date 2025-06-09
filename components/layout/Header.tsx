import React from "react";


const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "#services", label: "Dịch vụ" },
  { href: "/", label: "Đặt lịch khám" },
  { href: "#medicine", label: "Mua thuốc" },
  { href: "#contact", label: "Liên hệ" },
];

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="font-bold text-2xl text-blue-600 tracking-wide select-none">TDCARE</div>
        <nav className="flex gap-5">
          {navLinks.map((link) => (
            <a
              href={link.href}
              key={link.label}
              className="font-medium text-gray-700 hover:text-blue-600 transition"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
