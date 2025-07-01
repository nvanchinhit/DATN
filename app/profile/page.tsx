'use client';

import { useEffect, useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/page';
import { User, Mail, Phone, Calendar, Save, Camera, ShieldCheck, X } from 'lucide-react';

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
}

// Component cho mỗi dòng thông tin, giúp code gọn hơn
const ProfileField = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
    <label className="text-sm font-medium text-gray-500">{label}</label>
    <div className="md:col-span-2">{children}</div>
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
    // Chuyển đổi Partial<Customer> thành Customer để so sánh
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
      const res = await fetch(`${API_URL}/api/users/profile`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }, body: dataToUpdate });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Cập nhật thất bại.');
      alert('Cập nhật thành công!');
      window.dispatchEvent(new Event("userChanged")); // Bắn sự kiện để Header cập nhật
      window.location.reload();
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
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
  
  if (pageLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!profileData) return <p className="text-center py-10">Không thể hiển thị thông tin người dùng.</p>;

  const displayAvatar = avatarPreview || (profileData.avatar ? `${API_URL}${profileData.avatar}` : 'https://jbagy.me/wp-content/uploads/2025/03/hinh-anh-cute-avatar-vo-tri-3.jpg');

  return (
    <div className="bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Của Tôi</h1>
          <p className="text-gray-500 mt-1">Quản lý thông tin cá nhân và bảo mật tài khoản của bạn.</p>
        </div>
        
        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start" onSubmit={handleSubmit}>
          
          {/* --- Cột trái: Avatar & Tên --- */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md text-center">
            <div className="relative w-32 h-32 mx-auto">
                <img 
                    src={displayAvatar} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                    onError={(e) => { e.currentTarget.src = 'https://jbagy.me/wp-content/uploads/2025/03/hinh-anh-cute-avatar-vo-tri-3.jpg'; }}
                />
                <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white hover:bg-blue-700 transition"
                    aria-label="Thay đổi ảnh đại diện"
                >
                    <Camera size={16} />
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" />
            </div>
            <h2 className="text-xl font-bold mt-4 text-gray-800">{profileData.name}</h2>
            <p className="text-sm text-gray-500">{profileData.email}</p>
            <p className="text-xs text-gray-400 mt-4">Dung lượng tối đa 1MB. Định dạng: .JPEG, .PNG</p>
          </div>
          
          {/* --- Cột phải: Thông tin chi tiết --- */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Thông tin chi tiết</h3>
            
            <ProfileField label="Họ và Tên">
              <input 
                id="name" 
                name="name" 
                value={formData.name || ''} 
                onChange={handleChange} 
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" 
                placeholder="Nhập họ và tên"
              />
            </ProfileField>

            <ProfileField label="Email">
                <div className="flex items-center gap-4">
                    <p className="font-medium text-gray-800 flex-grow">{formData.email || 'Chưa thiết lập'}</p>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1"><ShieldCheck size={14}/> Đã xác thực</span>
                </div>
            </ProfileField>

            <ProfileField label="Số điện thoại">
                <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone || ''} 
                    onChange={handleChange} 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" 
                    placeholder="Nhập số điện thoại"
                />
            </ProfileField>

             <ProfileField label="Giới tính">
                <div className="flex gap-6 items-center">
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
                            {option}
                        </label>
                    ))}
                </div>
            </ProfileField>

            <ProfileField label="Ngày sinh">
                <input 
                    type="date" 
                    name="birthday" 
                    value={formData.birthday || ''} 
                    onChange={handleChange} 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                />
            </ProfileField>

            <div className="mt-8 flex justify-end">
              <button 
                type="submit" 
                className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Save size={18} />
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}