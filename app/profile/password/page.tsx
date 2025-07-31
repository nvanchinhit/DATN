// app/profile/password/page.tsx
'use client';

import { useState, FormEvent, useCallback, FocusEvent } from 'react';
import { useAuth } from '@/app/contexts/page'; 
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

// CẬP NHẬT (1): InputField giờ dùng placeholder, không dùng label và có thêm onBlur
const InputField = ({ id, name, value, show, toggle, onChange, onBlur, placeholder, errorMsg, isTouched }: any) => (
  <div className="relative w-full">
    <input
      id={id}
      type={show ? 'text' : 'password'}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur} // Kích hoạt khi người dùng rời khỏi input
      placeholder={placeholder}
      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-10 ${errorMsg && isTouched ? 'border-red-500' : 'border-gray-300'}`}
      required
    />
    <button type="button" onClick={toggle} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
      {show ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
    {/* Lỗi chỉ hiện khi có lỗi VÀ trường đó đã được "chạm" vào */}
    {errorMsg && isTouched && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
  </div>
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
  // THÊM MỚI (2): State để theo dõi các trường đã được tương tác (blur)
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authLoading && !token) {
    router.replace('/login');
    return null;
  }
  
  // Hàm validate vẫn giữ nguyên, rất hữu ích
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
  
  // CẬP NHẬT (3): Logic validation giờ được kích hoạt khi blur
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    // Đánh dấu trường này là đã được "chạm" vào
    setTouched(prev => ({ ...prev, [name]: true }));
    // Cập nhật lỗi cho toàn bộ form
    const validationErrors = validate();
    setErrors(validationErrors);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Khi người dùng gõ, ta có thể xóa lỗi ngay lập tức để UX tốt hơn
    if (errors[name as keyof FormErrors]) {
        const validationErrors = validate();
        setErrors(validationErrors);
    }
    setSuccess('');
    if (errors.api) setErrors(prev => ({...prev, api: undefined}));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSuccess('');
    setErrors({});

    try {
      // Lấy thông tin user từ localStorage để xác định role
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Chọn API dựa trên role
      let apiUrl = '';
      if (user.role_id === 3) { // Doctor
        apiUrl = `${API_URL}/api/doctors/change-password`;
      } else { // Customer hoặc Admin
        apiUrl = `${API_URL}/api/users/change-password`;
      }

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: formData.currentPassword,
          new_password: formData.newPassword
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Đổi mật khẩu thất bại');
      }

      setSuccess('Đổi mật khẩu thành công!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTouched({});
      
    } catch (error: any) {
      setErrors({ api: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const allFieldsFilled = formData.currentPassword && formData.newPassword && formData.confirmPassword;
  const isFormValidForSubmission = Object.keys(validate()).length === 0 && allFieldsFilled;

  return (
    <div>
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Đổi Mật Khẩu</h1>
        <p className="text-gray-500 mt-1">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
      </div>

      {/* CẬP NHẬT (4): Thay đổi layout của form */}
      <form className="mt-8 max-w-md mx-auto" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <InputField 
            id="currentPassword" 
            name="currentPassword" 
            placeholder="Nhập mật khẩu hiện tại"
            value={formData.currentPassword} 
            show={showPassword.current} 
            toggle={() => togglePasswordVisibility('current')} 
            onChange={handleChange} 
            onBlur={handleBlur}
            errorMsg={errors.currentPassword}
            isTouched={touched.currentPassword}
          />
          <InputField 
            id="newPassword" 
            name="newPassword" 
            placeholder="Nhập mật khẩu mới"
            value={formData.newPassword} 
            show={showPassword.new} 
            toggle={() => togglePasswordVisibility('new')} 
            onChange={handleChange} 
            onBlur={handleBlur}
            errorMsg={errors.newPassword}
            isTouched={touched.newPassword}
          />
          <InputField 
            id="confirmPassword" 
            name="confirmPassword" 
            placeholder="Xác nhận mật khẩu mới"
            value={formData.confirmPassword} 
            show={showPassword.confirm} 
            toggle={() => togglePasswordVisibility('confirm')} 
            onChange={handleChange} 
            onBlur={handleBlur}
            errorMsg={errors.confirmPassword}
            isTouched={touched.confirmPassword}
          />
          
          <div>
            {errors.api && <p className="text-red-500 text-sm mb-4 text-center">{errors.api}</p>}
            {success && <p className="text-green-600 text-sm mb-4 text-center">{success}</p>}
            <button type="submit" 
                disabled={isSubmitting} // Nút chỉ bị vô hiệu hóa khi đang gửi
                className="w-full bg-blue-600 text-white px-10 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed">
              {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}