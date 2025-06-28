'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DoctorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const res = await fetch('http://localhost:5000/api/doctors/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsg(data.msg || 'Đăng nhập thất bại!');
      } else {
        localStorage.setItem('doctorToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.doctor)); 

        setMsg('Đăng nhập thành công! Đang chuyển hướng...');

        setTimeout(() => {
          const doctorStatus = data.doctor.account_status;

          if (doctorStatus === 'active') {
            router.push('/doctor/dashboard');
          } else {
            // Bao gồm cả 'inactive' và 'pending'
            router.push('/doctor/complete-profile');
          }
        }, 1000);
      }
    } catch (err) {
      setMsg('Lỗi kết nối máy chủ!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Đăng nhập Bác sĩ</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition-colors"
          disabled={loading}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
      {msg && <p className={`mt-4 text-center text-sm ${msg.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
    </div>
  );
}