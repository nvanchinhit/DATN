'use client';

import { useEffect, useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

// Interface cho dữ liệu người dùng
interface Customer {
  id: number;
  email: string | null;
  name: string;
  phone: string | null;
  gender: 'Nam' | 'Nữ' | 'Khác' | null;
  dob: string | null; // Luôn ở định dạng YYYY-MM-DD
  avatar: string | null;
  address: string | null;
  cccd: string | null;
}

export default function ProfilePage() {
  // --- Phần 1: Khai báo State và Hooks ---
  const { user: authUser, token, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [profileData, setProfileData] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State quản lý chế độ sửa cho các trường
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingDob, setIsEditingDob] = useState(false);


  // --- Phần 2: Logic và các hàm xử lý ---

  // Fetch dữ liệu hồ sơ khi component được tải
  useEffect(() => {
    if (authLoading) return;
    if (!token || !authUser) {
      router.replace('/login');
      return;
    }
    const fetchData = async () => {
      try {
        setError(null); setPageLoading(true);
        const res = await fetch(`/api/users/profile`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) { alert("Phiên đăng nhập đã hết hạn."); logout(); }
          throw new Error('Không thể tải dữ liệu hồ sơ.');
        }
        const result = await res.json();
        const data: Customer = result.data;
        
        // SỬA LỖI 1: XỬ LÝ NGÀY SINH ĐÚNG CÁCH (TIMEZONE BUG)
        // Lấy chuỗi ngày tháng từ DB và chỉ lấy phần YYYY-MM-DD để tránh lỗi múi giờ.
        if (data.dob) {
          data.dob = data.dob.split('T')[0];
        }

        setProfileData(data);
        setFormData(data);
      } catch (err: any) { setError(err.message); } finally { setPageLoading(false); }
    };
    fetchData();
  }, [authLoading, authUser, token, router, logout]);

  // Xử lý thay đổi trên các ô input (dùng chung cho cả text và date)
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

  // Xử lý khi submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profileData) return;

    // Tắt tất cả các chế độ sửa
    setIsEditingEmail(false);
    setIsEditingPhone(false);
    setIsEditingDob(false);

    const dataToUpdate = new FormData();
    Object.keys(formData).forEach(key => {
      const formKey = key as keyof Customer;
      const currentValue = formData[formKey] ?? '';
      const originalValue = profileData[formKey] ?? '';
      // Chỉ gửi đi những trường có thay đổi
      if (currentValue !== originalValue) {
        dataToUpdate.append(formKey, String(currentValue));
      }
    });
    if (avatarFile) dataToUpdate.append('avatar', avatarFile);

    if (Array.from(dataToUpdate.keys()).length === 0) {
      alert('Không có thông tin nào thay đổi.');
      return;
    }

    try {
      const res = await fetch(`/api/users/profile`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }, body: dataToUpdate });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Cập nhật thất bại.');

      alert('Cập nhật thành công!');
      
      // Tải lại dữ liệu mới nhất
      const newRes = await fetch(`/api/users/profile`, { headers: { 'Authorization': `Bearer ${token}` } });
      const newResult = await newRes.json();
      const newData = newResult.data;
      if (newData.dob) newData.dob = newData.dob.split('T')[0];
      setProfileData(newData);
      setFormData(newData);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  // Hàm helper để hiển thị ngày tháng định dạng DD/MM/YYYY
  const formatDateForDisplay = (isoDate: string | null | undefined): string => {
    if (!isoDate) return 'Chưa có';
    const dateParts = isoDate.split('-');
    if (dateParts.length !== 3) return '';
    const [year, month, day] = dateParts;
    return `${day}/${month}/${year}`;
  };

  if (authLoading || pageLoading) return <p className="p-6 text-center text-lg">Đang tải trang hồ sơ...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;
  if (!profileData) return <p className="p-6 text-center">Không thể hiển thị thông tin người dùng.</p>;

  
  // --- Phần 3: Giao diện (JSX) ---
  const displayAvatar = avatarPreview || profileData.avatar;

  return (
    <div className="bg-gray-100 py-6 px-4">
      <div className="max-w-6xl mx-auto flex gap-8">
        {/* === Sidebar === */}
        <aside className="w-1/4 hidden lg:block">
          <div className="flex items-center gap-3 pb-4 border-b mb-4">
            <img src={displayAvatar ? displayAvatar : '/placeholder-avatar.png'} alt="Avatar" className="w-12 h-12 rounded-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder-avatar.png'; }} />
            <div>
              <p className="font-semibold truncate">{profileData.name}</p>
              <a href="#profile-form" className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
                Sửa Hồ Sơ
              </a>
            </div>
          </div>
          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 p-2 rounded text-gray-700 hover:bg-gray-200"><span>🔔</span> Thông Báo</a>
            <a href="#" className="flex items-center gap-3 p-2 rounded text-gray-700 hover:bg-gray-200"><span>📅</span> Đặt Lịch Khám</a>
            <div>
              <a href="#" className="flex items-center gap-3 p-2 rounded text-gray-700 hover:bg-gray-200"><span>👤</span> Tài Khoản Của Tôi</a>
              <div className="pl-8 mt-2 space-y-2 text-gray-600">
                <a href="/profile" className="block text-blue-600 font-semibold">Hồ Sơ</a>
                <a href="#" className="block hover:text-blue-600">Ngân Hàng</a>
                <a href="#" className="block hover:text-blue-600">Địa Chỉ</a>
                <a href="#" className="block hover:text-blue-600">Đổi Mật Khẩu</a>
              </div>
            </div>
          </nav>
        </aside>

        {/* === Main Content === */}
        <main id="profile-form" className="flex-1 bg-white p-6 rounded-lg shadow-sm">
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
              
              {/* SỬA LỖI 2: Cập nhật giao diện và logic cho Email */}
              <div className="md:col-span-1 text-right text-gray-500">Email</div>
              <div className="md:col-span-2 flex items-center gap-2">
                {isEditingEmail ? (
                  <>
                    <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full md:w-2/3 p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent" placeholder="Nhập email mới"/>
                    <button type="button" onClick={() => setIsEditingEmail(false)} className="text-sm text-blue-600 hover:underline flex-shrink-0">OK</button>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-gray-800">{formData.email || 'Chưa có'}</p>
                    <button type="button" onClick={() => setIsEditingEmail(true)} className="text-sm text-blue-600 hover:underline">Thay đổi</button>
                  </>
                )}
              </div>
              
              {/* SỬA LỖI 2: Cập nhật giao diện và logic cho Số điện thoại */}
              <div className="md:col-span-1 text-right text-gray-500">Số điện thoại</div>
              <div className="md:col-span-2 flex items-center gap-2">
                {isEditingPhone ? (
                   <>
                    <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full md:w-2/3 p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent" placeholder="Nhập SĐT mới"/>
                    <button type="button" onClick={() => setIsEditingPhone(false)} className="text-sm text-blue-600 hover:underline flex-shrink-0">OK</button>
                  </>
                ) : (
                   <>
                    <p className="font-medium text-gray-800">{formData.phone ? `********${formData.phone.slice(-2)}` : 'Chưa có'}</p>
                    <button type="button" onClick={() => setIsEditingPhone(true)} className="text-sm text-blue-600 hover:underline">Thay đổi</button>
                  </>
                )}
              </div>

              <div className="md:col-span-1 text-right text-gray-500">Giới tính</div>
              <div className="md:col-span-2 flex gap-6 items-center">
                  {['Nam', 'Nữ', 'Khác'].map(option => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" value={option} checked={formData.gender === option} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(p => ({...p, gender: e.target.value as any}))} className="form-radio text-blue-600 h-4 w-4"/>
                      {option}
                    </label>
                  ))}
              </div>

              {/* SỬA LỖI 2: Cập nhật giao diện và logic cho Ngày sinh */}
              <div className="md:col-span-1 text-right text-gray-500">Ngày sinh</div>
              <div className="md:col-span-2 flex items-center gap-2">
                {isEditingDob ? (
                  <>
                    <input type="date" name="dob" value={formData.dob || ''} onChange={handleChange} className="p-2 border rounded-md bg-white w-full md:w-2/3 focus:ring-2 focus:ring-blue-400 focus:border-transparent"/>
                    <button type="button" onClick={() => setIsEditingDob(false)} className="text-sm text-blue-600 hover:underline flex-shrink-0">OK</button>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-gray-800">{formatDateForDisplay(formData.dob)}</p>
                    <button type="button" onClick={() => setIsEditingDob(true)} className="text-sm text-blue-600 hover:underline">Thay đổi</button>
                  </>
                )}
              </div>

              <div className="md:col-span-1 text-right text-gray-500">Chọn Ảnh</div>
              <div className="md:col-span-2 flex flex-col items-start">
                  <img src={displayAvatar ? displayAvatar : '/placeholder-avatar.png'} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover mb-4 border" onError={(e) => { e.currentTarget.src = '/placeholder-avatar.png'; }}/>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="border px-4 py-1.5 rounded-md text-sm hover:bg-gray-50">Chọn tệp</button>
                  <p className="text-xs text-gray-400 mt-2">Dung lượng tối đa 1MB. Định dạng: .JPEG, .PNG</p>
              </div>
              
              <div className="md:col-span-1"></div>
              <div className="md:col-span-2">
                <button type="submit" className="bg-blue-600 text-white px-10 py-2 rounded-md hover:bg-blue-700 transition-colors">Lưu</button>
              </div>

            </div>
          </form>
        </main>
      </div>
    </div>
  );
}