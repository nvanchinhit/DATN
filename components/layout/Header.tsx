'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Phone, Mail, ChevronDown, Search, User as UserIcon, LogOut, LayoutDashboard, MessageCircle } from 'lucide-react';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const loadUser = () => {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      }
    };

    loadUser();
    if (typeof window !== 'undefined') {
      window.addEventListener("userChanged", loadUser);
    }
    
    // Đóng dropdown khi click ra ngoài
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener("userChanged", loadUser);
      }
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setUser(null);
    setDropdownOpen(false);
    router.push("/login");
  };

  const navLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/shop", label: "Sản phẩm" },
    { href: "/specialty", label: "Chuyên khoa" },
    { href: "/staff", label: "Bác Sĩ"},
    { href: "/about-us", label: "Về chúng tôi" },
    { href: "/contact", label: "Liên hệ" },
  ];

  // Tránh hydration mismatch bằng cách chỉ render sau khi component đã mount
  if (!mounted) {
    return <div suppressHydrationWarning className="w-full bg-white shadow-md sticky top-0 z-50" />;
  }

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-100 text-gray-600 text-xs py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="tel:19008888" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <Phone size={14} />
              <span>1900-8888</span>
            </a>
            <a href="mailto:support@tdcare.vn" className="hidden sm:flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <Mail size={14} />
              <span>support@tdcare.vn</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
             <Link href="/faq" className="hover:text-blue-600 transition-colors">FAQs</Link>
             <div className="h-4 w-px bg-gray-300"></div>
             <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <span>VN</span>
                <ChevronDown size={14} />
             </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header px-4 sm:px-6 lg:px-8">
         <div className="max-w-7xl mx-auto flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <img
                  src="https://i.imgur.com/bUBPKF9.jpeg"
                  alt="TDCARE Logo"
                  className="h-20"
                />
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className={`font-medium text-gray-600 hover:text-blue-600 transition-colors relative ${pathname === link.href ? 'text-blue-600' : ''}`}>
                  {link.label}
                  {pathname === link.href && (
                     <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions & User */}
            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Search className="h-5 w-5 text-gray-600" />
                </button>


                {user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={20}/>}
                      </div>
                      <div className="hidden md:block text-left">
                         <p className="text-xs text-gray-500">Xin chào,</p>
                         <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      </div>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-10">
                        <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <LayoutDashboard size={16} />
                          Hồ sơ của tôi
                        </Link>
                        <Link href="/chat" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <MessageCircle size={16} />
                 Tin nhắn
                     </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                           <LogOut size={16} />
                           Đăng xuất
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                    Đăng nhập
                  </Link>
                )}
            </div>
         </div>
      </div>
    </header>
  );
}