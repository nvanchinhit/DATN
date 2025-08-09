'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DoctorPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard as this is the main doctor entry point
    router.replace('/doctor/dashboard');
  }, [router]);

  return (
    <div className="p-6">
      <div className="text-center">
        <p>⏳ Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
