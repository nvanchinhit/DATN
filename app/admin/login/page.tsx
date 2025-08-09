'use client';

import { useState, FormEvent, useEffect } from 'react'; // Thêm useEffect
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react'; // Thêm CheckCircle
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // State để kiểm tra auth ban đầu

  // <<< THÊM MỚI: Kiểm tra trạng thái đăng nhập khi component được mount >>>
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
        try {
            const parsedUser = JSON.parse(user);
            // Kiểm tra xem có phải là admin không
            if (parsedUser.role_id === 1) {
                router.replace('/admin'); // Nếu đã đăng nhập, chuyển hướng ngay
                return;
            }
        } catch (e) {
            // Lỗi parse JSON, xóa thông tin cũ
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
    // Nếu không có token hoặc không phải admin, cho phép hiển thị trang login
    setIsCheckingAuth(false); 
  }, [router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg || 'Đăng nhập thất bại!');
      } else {
        localStorage.setItem('token', data.token);
        // <<< SỬA: Lấy đúng object `user` từ response của adminLogin >>>
        localStorage.setItem('user', JSON.stringify(data.user)); 
        
        // <<< THAY ĐỔI: Hiển thị thông báo thành công trước khi chuyển hướng >>>
        setMessage('Đăng nhập thành công! Đang chuyển hướng...');
        setIsError(false);
        
        setTimeout(() => {
          router.push('/admin');
        }, 1500); // Chờ 1.5 giây rồi chuyển hướng
      }
    } catch (err: any) {
      setMessage(err.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // Nếu đang kiểm tra auth, hiển thị một màn hình chờ
  if (isCheckingAuth) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
    );
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Cột Trái - Hình ảnh */}
      <div className="hidden lg:block relative">
        <img
          src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Quản lý hệ thống"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-10 left-10 text-white">
          <h2 className="text-4xl font-bold">Admin Control Panel</h2>
          <p className="mt-2 text-lg max-w-md">Quản lý toàn diện hệ thống, theo dõi hoạt động và phát triển nền tảng TDCARE.</p>
        </div>
      </div>
      
      {/* Cột Phải - Form Đăng nhập */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-8 bg-gray-50">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div>
            <Link href="/" className="inline-block">
                <img
                    className="mx-auto h-12 w-auto"
                    src="https://i.imgur.com/bUBPKF9.jpeg"
                    alt="TDCARE Logo"
                />
            </Link>
            <h2 className="mt-6 text-center text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Đăng nhập hệ thống Quản trị
            </h2>
             <p className="mt-2 text-center text-sm text-gray-600">
              Truy cập với quyền quản trị viên.
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* <<< THAY ĐỔI: Hiển thị thông báo động >>> */}
            {message && (
                <div className={`p-3 rounded-lg flex items-center gap-2 ${isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                    {isError ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                    <span className="text-sm">{message}</span>
                </div>
            )}
            
            <div className="space-y-4 rounded-md">
              {/* ... Các ô input không đổi ... */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email quản trị</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Mail className="h-5 w-5 text-gray-400" /></div>
                  <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-lg border border-gray-300 py-3 pl-10 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="admin@example.com" />
                </div>
              </div>
              <div>
                <label htmlFor="password"className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Lock className="h-5 w-5 text-gray-400" /></div>
                  <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-lg border border-gray-300 py-3 pl-10 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="••••••••"/>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Quên mật khẩu?</a>
              </div>
            </div>

            <div>
              <button type="submit" disabled={loading} className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
                {loading && (<Loader2 className="animate-spin h-5 w-5 mr-3"/>)}
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </div>
          </form>
           <p className="mt-8 text-center text-sm text-gray-500">
              Quay lại?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">Đăng nhập người dùng</Link>
            </p>
        </div>
      </div>
    </div>
  );
}