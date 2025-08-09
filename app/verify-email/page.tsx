'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState('Đang xác thực tài khoản...');

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/api/auth/verify-email?token=${token}`)
        .then(res => res.json())
        .then(data => setMessage(data.msg || 'Xác thực thành công!'))
        .catch(() => setMessage('Xác thực thất bại hoặc link đã hết hạn.'));
    }
  }, [token]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">{message}</h1>
      </div>
    </div>
  );
}
