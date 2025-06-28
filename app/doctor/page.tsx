'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false); // Kiểm tra trạng thái tài khoản

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) return;

    const parsed = JSON.parse(user);
    const doctorId = parsed.id;

    const checkStatus = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/doctors/${doctorId}`);
        const data = await res.json();
        const status = data.account_status;

        if (status === 'pending' && pathname !== '/doctor/complete-profile') {
          router.replace('/doctor/complete-profile');
          return; // Không setChecked => không render children
        }

        if (status === 'active' && pathname === '/doctor/complete-profile') {
          router.replace('/doctor/profile');
          return;
        }

        setChecked(true); // Cho phép render nếu status và path hợp lệ
      } catch (err) {
        console.error('Lỗi khi kiểm tra trạng thái tài khoản:', err);
        setChecked(true); // Cho phép render nếu gặp lỗi
      }
    };

    checkStatus();
  }, [pathname]);

  if (!checked) {
    return <div className="p-6">⏳ Đang kiểm tra trạng thái tài khoản...</div>;
  }

  return <>{children}</>;
}
