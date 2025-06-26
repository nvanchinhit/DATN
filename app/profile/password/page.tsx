// app/profile/password/page.tsx
'use client';

import { useState, FormEvent, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/contexts/page'; // Đảm bảo đúng đường dẫn
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  api?: string;
}

const InputField = ({ id, label, name, value, show, toggle, onChange, errorMsg }: any) => (
  <>
    <label htmlFor={id} className="md:col-span-1 text-right text-gray-500 pt-2">{label}</label>
    <div className="md:col-span-2 relative w-full md:w-2/3">
      <input
        id={id} type={show ? 'text' : 'password'} name={name} value={value}
        onChange={onChange}
        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-10 ${errorMsg ? 'border-red-500' : ''}`}
        required
      />
      <button type="button" onClick={toggle} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
      {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
    </div>
  </>
);

export default function ChangePasswordPage() {
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // <<< LOẠI BỎ (1): Xóa state isFormValid không cần thiết
  // const [isFormValid, setIsFormValid] = useState(false);

  if (!authLoading && !token) {
    router.replace('/login');
    return null;
  }
  
  const validate = useCallback(() => {
    const data = formData;
    const newErrors: FormErrors = {};

    if (!data.currentPassword) newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại.';
    
    if (!data.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới.';
    } else {
      const passwordErrors = [];
      if (data.newPassword.length < 6) passwordErrors.push('phải có ít nhất 6 ký tự');
      if (!specialCharRegex.test(data.newPassword)) passwordErrors.push('phải chứa 1 ký tự đặc biệt');
      if (data.newPassword === data.currentPassword) passwordErrors.push('không được trùng mật khẩu cũ');
      if (passwordErrors.length > 0) newErrors.newPassword = `Mật khẩu mới ${passwordErrors.join(', ')}.`;
    }

    if (!data.confirmPassword) {
        newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu.';
    } else if (data.newPassword && data.confirmPassword !== data.newPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }

    return newErrors;
  }, [formData]);
  
  // useEffect bây giờ chỉ có một nhiệm vụ: cập nhật lỗi
  useEffect(() => {
    const validationErrors = validate();
    setErrors(validationErrors);
  }, [validate]); // Phụ thuộc vào `validate` là đúng


  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSuccess('');
    if (errors.api) setErrors(prev => ({...prev, api: undefined}));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Vẫn validate lần cuối để hiển thị lỗi nếu người dùng submit form trống
    const finalErrors = validate();
    if (Object.keys(finalErrors).length > 0) {
        setErrors(finalErrors);
        return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/users/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Đổi mật khẩu thất bại.');

      setSuccess('Đổi mật khẩu thành công!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    } catch (err: any) {
      setErrors({ api: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // <<< TÍNH TOÁN TRỰC TIẾP (2): Tính toán isFormValid ngay trong lúc render
  // Giá trị này sẽ luôn luôn đúng mà không cần `useEffect` hay state riêng
  const allFieldsFilled = formData.currentPassword && formData.newPassword && formData.confirmPassword;
  const isFormValidForSubmission = Object.keys(errors).length === 0 && allFieldsFilled;

  return (
    <div>
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Đổi Mật Khẩu</h1>
        <p className="text-gray-500 mt-1">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
      </div>

      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8 items-start">
          <InputField id="currentPassword" label="Mật khẩu hiện tại" name="currentPassword" value={formData.currentPassword} show={showPassword.current} toggle={() => togglePasswordVisibility('current')} onChange={handleChange} errorMsg={errors.currentPassword} />
          <InputField id="newPassword" label="Mật khẩu mới" name="newPassword" value={formData.newPassword} show={showPassword.new} toggle={() => togglePasswordVisibility('new')} onChange={handleChange} errorMsg={errors.newPassword} />
          <InputField id="confirmPassword" label="Xác nhận mật khẩu mới" name="confirmPassword" value={formData.confirmPassword} show={showPassword.confirm} toggle={() => togglePasswordVisibility('confirm')} onChange={handleChange} errorMsg={errors.confirmPassword} />
          
          <div className="md:col-span-1"></div>
          <div className="md:col-span-2">
            {errors.api && <p className="text-red-500 text-sm mb-4">{errors.api}</p>}
            {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
            <button type="submit" 
                // <<< SỬ DỤNG (3): Dùng giá trị vừa tính toán
                disabled={!isFormValidForSubmission || isSubmitting}
                className="bg-blue-600 text-white px-10 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed">
              {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}