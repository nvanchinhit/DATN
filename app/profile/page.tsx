// app/profile/page.tsx
'use client';

import { useEffect, useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
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

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingBirthday, setIsEditingBirthday] = useState(false);
  
  useEffect(() => {
    if (authLoading) return;
    if (!token || !authUser) {
      router.replace('/login');
      return;
    }
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
        setFormData(data);
      } catch (err: any) { setError(err.message); } finally { setPageLoading(false); }
    };
    fetchData();
  }, [authLoading, authUser, token, router, logout]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    setIsEditingEmail(false);
    setIsEditingPhone(false);
    setIsEditingBirthday(false);

    const dataToUpdate = new FormData();
    Object.keys(formData).forEach(key => {
      const formKey = key as keyof Customer;
      const currentValue = formData[formKey] ?? '';
      const originalValue = profileData[formKey] ?? '';
      if (currentValue !== originalValue) {
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
      window.location.reload(); 
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    }
  };
  
  const formatDateForDisplay = (yyyy_mm_dd: string | null | undefined): string => {
    if (!yyyy_mm_dd) return 'Chưa có';
    const dateParts = yyyy_mm_dd.split('-');
    if (dateParts.length !== 3) return '';
    const [year, month, day] = dateParts;
    return `${day}/${month}/${year}`;
  };
  
  if (pageLoading) return <p className="text-center text-lg">Đang tải hồ sơ...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!profileData) return <p className="text-center">Không thể hiển thị thông tin người dùng.</p>;

  const displayAvatar = avatarPreview || (profileData.avatar ? `${API_URL}${profileData.avatar}` : '/placeholder-avatar.png');

  return (
    <>
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Hồ Sơ Của Tôi</h1>
        <p className="text-gray-500 mt-1">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>
      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8 items-center">
              <div className="md:col-span-1 text-right text-gray-500">Tên đăng nhập</div>
              <div className="md:col-span-2">
                <p className="font-medium text-gray-800">{profileData.name}</p>
                <p className="text-xs text-gray-400 mt-1">Tên đăng nhập chỉ có thể thay đổi một lần.</p>
              </div>
              <div className="md:col-span-1 text-right text-gray-500">Tên</div>
              <div className="md:col-span-2">
                <input id="name" name="name" value={formData.name || ''} onChange={handleChange} className="w-full md:w-2/3 p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent" placeholder="Nhập tên của bạn"/>
              </div>
              <div className="md:col-span-1 text-right text-gray-500">Email</div>
              <div className="md:col-span-2 flex items-center gap-2">
                {isEditingEmail ? (<><input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full md:w-2/3 p-2 border rounded-md" placeholder="Nhập email mới"/><button type="button" onClick={() => setIsEditingEmail(false)} className="text-sm text-blue-600 hover:underline flex-shrink-0">Lưu</button></>) : (<><p className="font-medium text-gray-800">{formData.email || 'Chưa có'}</p><button type="button" onClick={() => setIsEditingEmail(true)} className="text-sm text-blue-600 hover:underline">Thay đổi</button></>)}
              </div>
              <div className="md:col-span-1 text-right text-gray-500">Số điện thoại</div>
              <div className="md:col-span-2 flex items-center gap-2">
                {isEditingPhone ? (<><input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full md:w-2/3 p-2 border rounded-md" placeholder="Nhập SĐT mới"/><button type="button" onClick={() => setIsEditingPhone(false)} className="text-sm text-blue-600 hover:underline flex-shrink-0">Lưu</button></>) : (<><p className="font-medium text-gray-800">{formData.phone ? `********${formData.phone.slice(-2)}` : 'Chưa có'}</p><button type="button" onClick={() => setIsEditingPhone(true)} className="text-sm text-blue-600 hover:underline">Thay đổi</button></>)}
              </div>
              <div className="md:col-span-1 text-right text-gray-500">Giới tính</div>
              <div className="md:col-span-2 flex gap-6 items-center">
                  {['Nam', 'Nữ', 'Khác'].map(option => (<label key={option} className="flex items-center gap-2 cursor-pointer"><input type="radio" name="gender" value={option} checked={formData.gender === option} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(p => ({...p, gender: e.target.value as any}))} className="form-radio text-blue-600 h-4 w-4"/>{option}</label>))}
              </div>
              <div className="md:col-span-1 text-right text-gray-500">Ngày sinh</div>
              <div className="md:col-span-2 flex items-center gap-2">
                {isEditingBirthday ? (<><input type="date" name="birthday" value={formData.birthday || ''} onChange={handleChange} className="p-2 border rounded-md w-full md:w-2/3"/><button type="button" onClick={() => setIsEditingBirthday(false)} className="text-sm text-blue-600 hover:underline flex-shrink-0">Lưu</button></>) : (<><p className="font-medium text-gray-800">{formatDateForDisplay(formData.birthday)}</p><button type="button" onClick={() => setIsEditingBirthday(true)} className="text-sm text-blue-600 hover:underline">Thay đổi</button></>)}
              </div>
              <div className="md:col-span-1 text-right text-gray-500">Chọn Ảnh</div>
              <div className="md:col-span-2 flex items-center gap-6">
                <img src={displayAvatar} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover border" onError={(e) => { e.currentTarget.src = '/placeholder-avatar.png'; }}/>
                <div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="border px-4 py-1.5 rounded-md text-sm hover:bg-gray-50">Chọn tệp</button>
                  <p className="text-xs text-gray-400 mt-2">Dung lượng tối đa 1MB. Định dạng: .JPEG, .PNG</p>
                </div>
              </div>
              <div className="md:col-span-1"></div>
              <div className="md:col-span-2">
                <button type="submit" className="bg-blue-600 text-white px-10 py-2 rounded-md hover:bg-blue-700 transition-colors">Lưu</button>
              </div>
        </div>
      </form>
    </>
  );
}