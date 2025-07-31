'use client';

import { useEffect, useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/page';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Save, 
  Camera, 
  ShieldCheck, 
  X,
  Crown,
  Stethoscope,
  UserCheck,
  Edit3,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Customer {
  id: number;
  email: string | null;
  name: string;
  phone: string | null;
  gender: 'Nam' | 'Nữ' | 'Khác' | null;
  birthday: string | null;
  avatar: string | null;
  address: string | null;
  role_id: number;
}

const getRoleInfo = (roleId: number) => {
  switch (roleId) {
    case 1:
      return { name: 'Quản trị viên', icon: Crown, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' };
    case 2:
      return { name: 'Khách hàng', icon: UserCheck, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    case 3:
      return { name: 'Bác sĩ', icon: Stethoscope, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    default:
      return { name: 'Người dùng', icon: User, color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
  }
};

// Component cho mỗi dòng thông tin, giúp code gọn hơn
const ProfileField = ({ 
  label, 
  children, 
  icon: Icon,
  isVerified = false,
  isRequired = false 
}: { 
  label: string, 
  children: React.ReactNode, 
  icon?: any,
  isVerified?: boolean,
  isRequired?: boolean 
}) => (
  <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
    {Icon && (
      <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
        <Icon size={20} className="text-blue-600" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        {isRequired && <span className="text-red-500">*</span>}
        {isVerified && (
          <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <CheckCircle size={12} />
            Đã xác thực
          </span>
        )}
      </div>
      <div className="text-gray-900">{children}</div>
    </div>
  </div>
);

export default function ProfilePage() {
  const { user: authUser, token, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [profileData, setProfileData] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!token || !authUser) { router.replace('/login'); return; }
    
    const fetchData = async () => {
      try {
        setError(null); setPageLoading(true);
        const res = await fetch(`${API_URL}/api/users/profile`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) { alert("Phiên đăng nhập đã hết hạn."); logout(); }
          throw new Error('Không thể tải dữ liệu hồ sơ.');
        }
        const result = await res.json();
        const data: Customer = result.data;
        
        setProfileData(data);
        setFormData({ ...data, birthday: data.birthday ? data.birthday.split('T')[0] : null });
      } catch (err: any) { setError(err.message); } finally { setPageLoading(false); }
    };
    fetchData();
  }, [authLoading, authUser, token, router, logout]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profileData) return;

    const dataToUpdate = new FormData();
    const originalProfile = profileData as Customer;

    Object.keys(formData).forEach(key => {
      const formKey = key as keyof Customer;
      const currentValue = formData[formKey] ?? '';
      const originalValue = originalProfile[formKey] ?? '';
      
      if(String(currentValue) !== String(originalValue)) {
        dataToUpdate.append(formKey, String(currentValue));
      }
    });

    if (avatarFile) {
      dataToUpdate.append('avatar', avatarFile);
    }

    if (Array.from(dataToUpdate.keys()).length === 0) {
      alert('Không có thông tin nào thay đổi.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`${API_URL}/api/users/profile`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }, body: dataToUpdate });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Cập nhật thất bại.');
      alert('Cập nhật thành công!');
      window.dispatchEvent(new Event("userChanged"));
      window.location.reload();
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDateForDisplay = (yyyy_mm_dd: string | null | undefined): string => {
    if (!yyyy_mm_dd) return 'Chưa thiết lập';
    const date = new Date(yyyy_mm_dd);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  if (pageLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải thông tin...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-10">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <p className="text-red-500 text-lg">{error}</p>
    </div>
  );
  
  if (!profileData) return (
    <div className="text-center py-10">
      <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-500 text-lg">Không thể hiển thị thông tin người dùng.</p>
    </div>
  );

  const displayAvatar = avatarPreview || (profileData.avatar ? `${API_URL}${profileData.avatar}` : 'https://jbagy.me/wp-content/uploads/2025/03/hinh-anh-cute-avatar-vo-tri-3.jpg');
  const roleInfo = getRoleInfo(profileData.role_id);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Cá Nhân</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin cá nhân và bảo mật tài khoản của bạn</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit3 size={16} />
          {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa'}
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Profile Overview Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <img 
                src={displayAvatar} 
                alt="Avatar" 
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                onError={(e) => { e.currentTarget.src = 'https://jbagy.me/wp-content/uploads/2025/03/hinh-anh-cute-avatar-vo-tri-3.jpg'; }}
              />
              {isEditing && (
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center border-4 border-white hover:bg-blue-700 transition shadow-lg"
                  aria-label="Thay đổi ảnh đại diện"
                >
                  <Camera size={16} />
                </button>
              )}
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" />
            </div>
            
            {/* User Info */}
            <div className="text-center lg:text-left flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{profileData.name}</h2>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-3">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${roleInfo.bgColor} ${roleInfo.color} ${roleInfo.borderColor} border`}>
                  <RoleIcon size={16} />
                  {roleInfo.name}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-600 border border-green-200">
                  <CheckCircle size={16} />
                  Tài khoản hoạt động
                </div>
              </div>
              <p className="text-gray-600">{profileData.email}</p>
            </div>
          </div>
        </div>
        
        {/* Form Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileField label="Họ và Tên" icon={User} isRequired>
            {isEditing ? (
              <input 
                name="name" 
                value={formData.name || ''} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                placeholder="Nhập họ và tên"
              />
            ) : (
              <p className="text-lg font-medium">{profileData.name}</p>
            )}
          </ProfileField>

          <ProfileField label="Email" icon={Mail} isVerified>
            <div className="flex items-center gap-3">
              <p className="text-lg font-medium">{profileData.email}</p>
              <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ShieldCheck size={12} />
                Đã xác thực
              </span>
            </div>
          </ProfileField>

          <ProfileField label="Số điện thoại" icon={Phone}>
            {isEditing ? (
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone || ''} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                placeholder="Nhập số điện thoại"
              />
            ) : (
              <p className="text-lg">{profileData.phone || 'Chưa thiết lập'}</p>
            )}
          </ProfileField>

          <ProfileField label="Giới tính" icon={User}>
            {isEditing ? (
              <div className="flex gap-6">
                {['Nam', 'Nữ', 'Khác'].map(option => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="gender" 
                      value={option} 
                      checked={formData.gender === option} 
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(p => ({...p, gender: e.target.value as any}))} 
                      className="form-radio text-blue-600 h-4 w-4 focus:ring-blue-500"
                    />
                    <span className="text-lg">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-lg">{profileData.gender || 'Chưa thiết lập'}</p>
            )}
          </ProfileField>

          <ProfileField label="Ngày sinh" icon={Calendar}>
            {isEditing ? (
              <input 
                type="date" 
                name="birthday" 
                value={formData.birthday || ''} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            ) : (
              <p className="text-lg">{formatDateForDisplay(profileData.birthday)}</p>
            )}
          </ProfileField>
        </div>

        {/* Submit Button */}
        {isEditing && (
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}