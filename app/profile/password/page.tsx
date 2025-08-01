// app/profile/password/page.tsx
'use client';

import { useState, FormEvent, useCallback, FocusEvent } from 'react';
import { useAuth } from '@/app/contexts/page'; 
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Shield, CheckCircle, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  api?: string;
}

// Component cho mỗi trường input với thiết kế đẹp hơn
const PasswordField = ({ 
  id, 
  name, 
  value, 
  show, 
  toggle, 
  onChange, 
  onBlur, 
  placeholder, 
  errorMsg, 
  isTouched,
  icon: Icon 
}: any) => (
  <div className="space-y-2">
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Icon size={20} />
      </div>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
          errorMsg && isTouched 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        required
      />
      <button 
        type="button" 
        onClick={toggle} 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
    {errorMsg && isTouched && (
      <div className="flex items-center gap-2 text-red-500 text-sm">
        <AlertCircle size={16} />
        {errorMsg}
      </div>
    )}
  </div>
);

// Component hiển thị yêu cầu mật khẩu
const PasswordRequirements = ({ password, currentPassword }: { password: string, currentPassword: string }) => {
  const requirements = [
    { 
      label: 'Ít nhất 6 ký tự', 
      met: password.length >= 6,
      icon: CheckCircle 
    },
    { 
      label: 'Có ký tự đặc biệt', 
      met: specialCharRegex.test(password),
      icon: CheckCircle 
    },
    { 
      label: 'Không trùng mật khẩu cũ', 
      met: password !== currentPassword && password.length > 0,
      icon: CheckCircle 
    }
  ];

  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Yêu cầu mật khẩu:</h4>
      {requirements.map((req, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <req.icon 
            size={16} 
            className={req.met ? 'text-green-500' : 'text-gray-400'} 
          />
          <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
            {req.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function ChangePasswordPage() {
  const { token, loading: authLoading, user: authUser } = useAuth();
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
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const validationErrors = validate();
    setErrors(validationErrors);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token');
      }

      // Decode token để lấy role_id
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const userRole = payload.role_id;

      console.log('Token payload:', payload);
      console.log('User role from token:', userRole);

      // Chọn API dựa trên role từ token
      let apiUrl = '';
      if (userRole === 3) { // Doctor
        apiUrl = `${API_URL}/api/doctors/change-password`;
      } else { // Customer hoặc Admin
        apiUrl = `${API_URL}/api/users/change-password`;
      }

      console.log('Calling API:', apiUrl);
      console.log('User role from token:', userRole);

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

      console.log('Response status:', response.status);

      // Kiểm tra content-type trước khi parse JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server trả về dữ liệu không hợp lệ');
      }

      const result = await response.json();
      console.log('Response body:', result);

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
      console.error('Error details:', error);
      setErrors({ api: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const allFieldsFilled = formData.currentPassword && formData.newPassword && formData.confirmPassword;
  const isFormValidForSubmission = Object.keys(validate()).length === 0 && allFieldsFilled;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Đổi Mật Khẩu</h1>
        <p className="text-gray-600">Bảo vệ tài khoản của bạn bằng mật khẩu mạnh và an toàn</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mật khẩu hiện tại */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Mật khẩu hiện tại
            </label>
            <PasswordField 
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
              icon={Lock}
            />
          </div>

          {/* Mật khẩu mới */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Mật khẩu mới
            </label>
            <PasswordField 
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
              icon={Lock}
            />
            
            {/* Hiển thị yêu cầu mật khẩu khi người dùng bắt đầu nhập */}
            {formData.newPassword && (
              <div className="mt-4">
                <PasswordRequirements 
                  password={formData.newPassword} 
                  currentPassword={formData.currentPassword}
                />
              </div>
            )}
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Xác nhận mật khẩu mới
            </label>
            <PasswordField 
              id="confirmPassword" 
              name="confirmPassword" 
              placeholder="Nhập lại mật khẩu mới"
              value={formData.confirmPassword} 
              show={showPassword.confirm} 
              toggle={() => togglePasswordVisibility('confirm')} 
              onChange={handleChange} 
              onBlur={handleBlur}
              errorMsg={errors.confirmPassword}
              isTouched={touched.confirmPassword}
              icon={Lock}
            />
          </div>

          {/* Thông báo lỗi/success */}
          {errors.api && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-600 text-sm">{errors.api}</p>
            </div>
          )}
          
          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          {/* Nút submit */}
          <button 
            type="submit" 
            disabled={isSubmitting || !isFormValidForSubmission}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Đang cập nhật...
              </div>
            ) : (
              'Cập Nhật Mật Khẩu'
            )}
          </button>
        </form>
      </div>

      {/* Footer note */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          💡 <strong>Mẹo:</strong> Sử dụng mật khẩu mạnh với ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
        </p>
      </div>
    </div>
  );
}