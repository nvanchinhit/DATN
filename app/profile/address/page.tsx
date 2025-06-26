// app/profile/address/page.tsx
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useAuth } from '@/app/contexts/page';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const PROVINCE_API_URL = 'https://provinces.open-api.vn/api';

interface Province { name: string; code: number; }
interface District { name: string; code: number; }
interface Ward { name: string; code: number; }

export default function AddressPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [initialAddress, setInitialAddress] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState('');

  // <<< THÊM MỚI (1): State để quản lý lỗi của trường địa chỉ cụ thể
  const [addressError, setAddressError] = useState('');

  // ... (useEffect fetchInitialData không thay đổi)
  useEffect(() => {
    if (authLoading) return;
    if (!token || !user) {
      router.replace('/login');
      return;
    }

    const fetchInitialData = async () => {
      setPageLoading(true);
      try {
        const profileRes = await fetch(`${API_URL}/api/users/profile`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!profileRes.ok) throw new Error('Không thể tải dữ liệu địa chỉ.');
        const profileResult = await profileRes.json();
        const userAddress = profileResult.data.address || '';
        setInitialAddress(userAddress);
        
        const provincesRes = await fetch(`${PROVINCE_API_URL}/p/`);
        if (!provincesRes.ok) throw new Error('Không thể tải danh sách tỉnh/thành phố.');
        const provincesData = await provincesRes.json();
        setProvinces(provincesData);
        
      } catch (error) {
        console.error(error);
        alert('Lỗi tải dữ liệu.');
      } finally {
        setPageLoading(false);
      }
    };
    fetchInitialData();
  }, [authLoading, user, token, router]);
  
  // ... (useEffect fetchDistricts và fetchWards không thay đổi)
  useEffect(() => {
    if (!selectedProvince) { setDistricts([]); setSelectedDistrict(''); return; }
    const fetchDistricts = async () => {
        const res = await fetch(`${PROVINCE_API_URL}/p/${selectedProvince}?depth=2`);
        const data = await res.json();
        setDistricts(data.districts || []);
    };
    fetchDistricts();
  }, [selectedProvince]);

  useEffect(() => {
    if (!selectedDistrict) { setWards([]); setSelectedWard(''); return; }
    const fetchWards = async () => {
        const res = await fetch(`${PROVINCE_API_URL}/d/${selectedDistrict}?depth=2`);
        const data = await res.json();
        setWards(data.wards || []);
    };
    fetchWards();
  }, [selectedDistrict]);

  // <<< THÊM MỚI (2): Hàm xử lý thay đổi và validation cho địa chỉ cụ thể
  const handleStreetAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStreetAddress(value);

    if (value.trim().length > 0 && value.trim().length < 10) {
        setAddressError('Địa chỉ cụ thể phải có ít nhất 10 ký tự.');
    } else {
        setAddressError(''); // Xóa lỗi nếu hợp lệ
    }
  }

  const handleSave = async () => {
    // Chạy validation lần cuối trước khi lưu
    if (streetAddress.trim().length < 10) {
        setAddressError('Địa chỉ cụ thể phải có ít nhất 10 ký tự.');
        alert('Vui lòng điền đầy đủ thông tin địa chỉ.');
        return;
    }
    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      alert('Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện, và Phường/Xã.');
      return;
    }

    const provinceName = provinces.find(p => p.code === Number(selectedProvince))?.name;
    const districtName = districts.find(d => d.code === Number(selectedDistrict))?.name;
    const wardName = wards.find(w => w.code === Number(selectedWard))?.name;

    const fullAddress = `${streetAddress.trim()}, ${wardName}, ${districtName}, ${provinceName}`;
    if (fullAddress === initialAddress) { setIsEditing(false); return; }

    setIsSaving(true);
    try {
        const res = await fetch(`${API_URL}/api/users/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ address: fullAddress })
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Cập nhật địa chỉ thất bại.');
        
        alert('Cập nhật địa chỉ thành công!');
        setInitialAddress(fullAddress);
        setIsEditing(false);
    } catch (err: any) {
        alert(`Lỗi: ${err.message}`);
    } finally {
        setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedWard('');
    setStreetAddress('');
    setAddressError(''); // Reset lỗi khi hủy
    setIsEditing(false);
  };
  
  // <<< CẬP NHẬT (3): Điều kiện để form hợp lệ giờ đây bao gồm cả độ dài địa chỉ
  const isFormValid = selectedProvince && selectedDistrict && selectedWard && streetAddress.trim().length >= 10;

  if (pageLoading) {
    return <p>Đang tải địa chỉ...</p>;
  }

  return (
    <div>
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Địa Chỉ Của Tôi</h1>
        <p className="text-gray-500 mt-1">Quản lý địa chỉ của bạn</p>
      </div>
      
      <div className="mt-6">
        {isEditing ? (
            <div className="space-y-4 max-w-xl">
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* ... (3 dropdowns không thay đổi) ... */}
                    <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} className="w-full p-2 border rounded-md">
                        <option value="">Chọn Tỉnh/Thành phố</option>
                        {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                    </select>
                    <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedProvince} className="w-full p-2 border rounded-md disabled:bg-gray-100">
                        <option value="">Chọn Quận/Huyện</option>
                        {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                    </select>
                    <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} disabled={!selectedDistrict} className="w-full p-2 border rounded-md disabled:bg-gray-100">
                        <option value="">Chọn Phường/Xã</option>
                        {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                    </select>
                 </div>
                 <div>
                    {/* <<< CẬP NHẬT (4): Thêm hiển thị lỗi và viền đỏ cho input */}
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={handleStreetAddressChange} // Dùng hàm xử lý riêng
                      className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent ${addressError ? 'border-red-500' : ''}`}
                      placeholder="Địa chỉ cụ thể (Số nhà, tên đường...)"
                    />
                    {addressError && <p className="text-red-500 text-sm mt-1">{addressError}</p>}
                 </div>
                 <div className="flex gap-4 pt-2">
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving || !isFormValid} // Dùng biến isFormValid đã được cập nhật
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                    </button>
                     <button onClick={handleCancel} className="border px-6 py-2 rounded-md hover:bg-gray-100">Hủy</button>
                 </div>
            </div>
        ) : (
             // ... (phần hiển thị địa chỉ không thay đổi) ...
            <div className="flex justify-between items-start border p-4 rounded-md">
                <div>
                    <p className="font-semibold">Địa chỉ mặc định</p>
                    <p className="text-gray-600 mt-1">
                        {initialAddress || 'Bạn chưa cập nhật địa chỉ.'}
                    </p>
                </div>
                <button 
                    onClick={() => setIsEditing(true)} 
                    className="text-sm text-blue-600 hover:underline flex-shrink-0"
                >
                    {initialAddress ? 'Thay đổi' : 'Thêm địa chỉ'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
}