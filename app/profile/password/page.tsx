// app/profile/password/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ChangePasswordPage() {
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authLoading && !token) {
    router.replace('/login');
    return null; 
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ các trường.');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu mới và mật khẩu xác nhận không khớp.');
      return;
    }
    if (formData.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (formData.newPassword === formData.currentPassword) {
      setError('Mật khẩu mới không được trùng với mật khẩu hiện tại.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
        }),
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
      }

      setSuccess('Đổi mật khẩu thành công!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Đổi Mật Khẩu</h1>
        <p className="text-gray-500 mt-1">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
      </div>

      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8 items-start">
          
          <label htmlFor="currentPassword" className="md:col-span-1 text-right text-gray-500 pt-2">Mật khẩu hiện tại</label>
          <div className="md:col-span-2">
            <input 
              id="currentPassword"
              type="password" 
              name="currentPassword" 
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full md:w-2/3 p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent" 
              required
            />
          </div>

          <label htmlFor="newPassword" className="md:col-span-1 text-right text-gray-500 pt-2">Mật khẩu mới</label>
          <div className="md:col-span-2">
            <input 
              id="newPassword"
              type="password" 
              name="newPassword" 
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full md:w-2/3 p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent" 
              required
            />
          </div>

          <label htmlFor="confirmPassword" className="md:col-span-1 text-right text-gray-500 pt-2">Xác nhận mật khẩu mới</label>
          <div className="md:col-span-2">
            <input 
              id="confirmPassword"
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full md:w-2/3 p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent" 
              required
            />
          </div>
          
          <div className="md:col-span-1"></div>
          <div className="md:col-span-2">
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-10 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}