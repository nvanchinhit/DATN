'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Các đường dẫn không cần Header/Footer
  const noLayoutPaths = ['/admin', '/login', '/register', '/doctor', '/forgot-password','/reset-password'];

  // Kiểm tra nếu bất kỳ path nào trong danh sách là tiền tố của pathname
  const hideLayout = noLayoutPaths.some((path) => pathname.startsWith(path));

  // Tránh hydration mismatch bằng cách chỉ render sau khi component đã mount
  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {!hideLayout && <Header />}
      <main className="flex-1">{children}</main>
      {!hideLayout && <Footer />}
    </div>
  );
}
