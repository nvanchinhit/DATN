'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false); // Kiểm tra trạng thái tài khoản

  useEffect(() => {
    console.log('DoctorLayout useEffect triggered, pathname:', pathname);
    
    const checkStatus = async () => {
      try {
        console.log('Checking user status...');
        const user = localStorage.getItem('user');
        console.log('User from localStorage:', user);
        
        if (!user) {
          console.log('No user found, redirecting to login');
          router.replace('/doctor/login');
          setChecked(true); // Set checked để tránh stuck
          return;
        }

        const parsed = JSON.parse(user);
        const doctorId = parsed.id;
        console.log('Doctor ID:', doctorId);

        console.log('Fetching doctor status...');
        const res = await fetch(`http://localhost:5000/api/doctors/${doctorId}`);
        console.log('Response status:', res.status);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Doctor data:', data);
        const status = data.account_status;
        console.log('Account status:', status);

        if (status === 'pending' && pathname !== '/doctor/complete-profile') {
          console.log('Status pending, redirecting to complete-profile');
          router.replace('/doctor/complete-profile');
          setChecked(true);
          return;
        }

        if (status === 'active' && pathname === '/doctor/complete-profile') {
          console.log('Status active, redirecting to profile');
          router.replace('/doctor/profile');
          setChecked(true);
          return;
        }

        console.log('Status check completed, allowing render');
        setChecked(true);
      } catch (err) {
        console.error('Lỗi khi kiểm tra trạng thái tài khoản:', err);
        setChecked(true); // Cho phép render nếu gặp lỗi
      }
    };

    // Thêm timeout để tránh infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Timeout reached, forcing checked to true');
      setChecked(true);
    }, 5000); // 5 giây timeout

    checkStatus().finally(() => {
      clearTimeout(timeoutId);
    });

    return () => clearTimeout(timeoutId);
  }, [pathname, router]);

  if (!checked) {
    return <div className="p-6">⏳ Đang kiểm tra trạng thái tài khoản...</div>;
  }

  return <>{children}</>;
} 