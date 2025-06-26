// app/profile/address/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AddressPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [initialAddress, setInitialAddress] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!token || !user) {
      router.replace('/login');
      return;
    }

    const fetchProfile = async () => {
      setPageLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Không thể tải dữ liệu địa chỉ.');
        
        const result = await res.json();
        const userAddress = result.data.address || '';
        
        setInitialAddress(userAddress);
        setAddress(userAddress);

      } catch (error) {
        console.error(error);
        alert('Lỗi tải dữ liệu.');
      } finally {
        setPageLoading(false);
      }
    };

    fetchProfile();
  }, [authLoading, user, token, router]);

  const handleSave = async () => {
    if (address === initialAddress) {
        setIsEditing(false);
        return;
    }
    setIsSaving(true);
    try {
        const res = await fetch(`${API_URL}/api/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ address: address })
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Cập nhật địa chỉ thất bại.');
        
        alert('Cập nhật địa chỉ thành công!');
        setInitialAddress(address);
        setIsEditing(false);
    } catch (err: any) {
        alert(`Lỗi: ${err.message}`);
    } finally {
        setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setAddress(initialAddress || '');
    setIsEditing(false);
  };

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
            <div className="space-y-4">
                 <label htmlFor="address-input" className="block text-gray-600 font-medium">Địa chỉ của bạn</label>
                 <textarea
                    id="address-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2 border rounded-md h-24 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Nhập địa chỉ của bạn..."
                 />
                 <div className="flex gap-4">
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                    </button>
                     <button onClick={handleCancel} className="border px-6 py-2 rounded-md hover:bg-gray-100">Hủy</button>
                 </div>
            </div>
        ) : (
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