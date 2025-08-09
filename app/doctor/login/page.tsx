'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/app/contexts/page';
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DoctorLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/doctors/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg || 'Đăng nhập thất bại!');
      } else {
        // Sử dụng AuthContext để lưu token thống nhất
        login(data.token, data.doctor);
        
        // Chuyển hướng ngay lập tức
        const doctorStatus = data.doctor.account_status;
        if (doctorStatus === 'active') {
          router.push('/doctor/dashboard');
        } else {
          router.push('/doctor/complete-profile');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Cột Trái - Hình ảnh */}
      <div className="hidden lg:block relative">
        <img
          src="https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Bác sĩ đang làm việc"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-10 left-10 text-white">
          <h2 className="text-4xl font-bold">TDCARE for Doctors</h2>
          <p className="mt-2 text-lg max-w-md">Nền tảng kết nối và quản lý công việc chuyên nghiệp, giúp bạn tập trung vào điều quan trọng nhất: chăm sóc bệnh nhân.</p>
        </div>
      </div>
      
      {/* Cột Phải - Form Đăng nhập */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-8 bg-gray-50">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div>
            <Link href="/" className="inline-block">
                <img
                    className="mx-auto h-12 w-auto"
                    src="/logo.png" // Thay bằng logo của bạn
                    alt="TDCARE Logo"
                />
            </Link>
            <h2 className="mt-6 text-center text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Đăng nhập tài khoản Bác sĩ
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Hoặc{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                đăng nhập với tư cách người dùng
              </Link>
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span className="text-sm">{error}</span>
                </div>
            )}
            
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 py-3 pl-10 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password"className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 py-3 pl-10 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading && (
                    <Loader2 className="animate-spin h-5 w-5 mr-3"/>
                )}
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}