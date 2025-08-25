'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Phone, Mail, ChevronDown, User as UserIcon } from 'lucide-react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener("userChanged", loadUser);
      }
    };
  }, []);
  
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Trang chủ" },
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
            <a href="mailto:support@healthfirst.vn" className="hidden sm:flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <Mail size={14} />
              <span>support@healthfirst.vn</span>
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
            <div className="flex items-center gap-2">
                {/* Mobile menu toggle */}
                <button aria-label="Toggle menu" className="p-2 rounded-md hover:bg-gray-100 transition-colors lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                  {mobileOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
                </button>
 
 
                 {user ? (
                   <Link href="/profile" className="flex items-center gap-2">
                     <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                       {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={20}/>} 
                     </div>
                     <div className="hidden md:block text-left">
                        <p className="text-xs text-gray-500">Xin chào,</p>
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                     </div>
                   </Link>
                 ) : (
                   <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                     Đăng nhập
                   </Link>
                 )}
            </div>
         </div>
         {/* Mobile Nav */}
         <div className={`lg:hidden px-2 pb-4 ${mobileOpen ? 'block' : 'hidden'}`}>
           <nav className="flex flex-col gap-1 bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
             {navLinks.map(link => (
               <Link key={link.href} href={link.href} className={`px-4 py-3 text-sm font-medium transition-colors ${pathname === link.href ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                 {link.label}
               </Link>
             ))}
             <div className="h-px bg-gray-100" />
             {user ? (
               <Link href="/profile" className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                 <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                   {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={18}/>} 
                 </div>
                 <span>Hồ sơ của tôi</span>
               </Link>
             ) : (
               <Link href="/login" className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">Đăng nhập</Link>
             )}
           </nav>
         </div>
      </div>
    </header>
  );
}