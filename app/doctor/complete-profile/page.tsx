// complete-profile/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, LogOut } from 'lucide-react';

const PendingApprovalScreen = () => {
  // ... (Component này giữ nguyên, không cần thay đổi)
  const router = useRouter();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('doctorToken');
    router.push('/doctor/login'); // Sửa lại đường dẫn cho đúng
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-lg shadow-lg">
        <Clock className="mx-auto text-yellow-500 mb-4" size={48} />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Hồ sơ đang chờ duyệt</h1>
        <p className="text-gray-600 mb-6">
          Thông tin của bạn đã được gửi hoặc đang trong quá trình xét duyệt.
          Vui lòng quay lại sau.
        </p>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};


export default function CompleteProfilePage() {
  const [form, setForm] = useState<any | null>(null);
  const [files, setFiles] = useState<{ img?: File; certificate_image?: File; degree_image?: File }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      
      fetch(`http://localhost:5000/api/doctors/${parsed.id}`)
        .then(res => {
            if (!res.ok) throw new Error("Không thể tải thông tin bác sĩ.");
            return res.json();
        })
        .then(data => {
          setForm(data);
        })
        .catch(err => {
            console.error(err);
            alert("Có lỗi xảy ra khi tải dữ liệu. Đang chuyển hướng về trang đăng nhập.");
            router.push('/doctor/login');
        })
        .finally(() => {
            setIsLoading(false);
        });
    } else {
        setIsLoading(false);
        router.push('/doctor/login');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => (prev ? { ...prev, [name]: value } : { [name]: value }));
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles?.[0]) {
      setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form?.phone?.trim()) {
        newErrors.phone = 'Vui lòng nhập số điện thoại.';
    } else if (!/^\d{10,11}$/.test(form.phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ.';
    }

    if (!form?.introduction?.trim()) newErrors.introduction = 'Vui lòng nhập giới thiệu bản thân.';
    if (!form?.experience?.trim()) newErrors.experience = 'Vui lòng nhập kinh nghiệm làm việc.';

    // Kiểm tra file chỉ khi chưa có ảnh cũ
    if (!form.img && !files.img) newErrors.img = 'Vui lòng tải lên ảnh đại diện.';
    if (!form.degree_image && !files.degree_image) newErrors.degree_image = 'Vui lòng tải lên ảnh bằng cấp.';
    if (!form.certificate_image && !files.certificate_image) newErrors.certificate_image = 'Vui lòng tải lên ảnh chứng chỉ.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }


  const handleSubmit = async () => {
  if (!form?.id || isSubmitting) return;

  if (!validateForm()) {
    alert('Vui lòng điền đầy đủ các thông tin bắt buộc.');
    return;
  }

  setIsSubmitting(true);
  const formData = new FormData();

  // Các trường cơ bản
  ['phone', 'introduction', 'experience'].forEach((key) => {
    if (form[key]) formData.append(key, form[key]);
  });

  // ✅ Thêm các trường học vấn
  ['gpa', 'university', 'graduation_date', 'degree_type'].forEach((key) => {
    if (form[key]) formData.append(key, form[key]);
  });

  // Ảnh đại diện, chứng chỉ, bằng cấp
  Object.entries(files).forEach(([key, file]) => {
    if (file) formData.append(key, file);
  });

  try {
    const res = await fetch(`http://localhost:5000/api/doctors/${form.id}`, {
      method: 'PUT',
      body: formData,
    });

    if (res.ok) {
      const updatedDoctorProfile = await res.json();
      setForm(updatedDoctorProfile);
    } else {
      const errorData = await res.json().catch(() => ({}));
      alert(`Cập nhật thất bại: ${errorData.msg || 'Vui lòng kiểm tra lại thông tin.'}`);
    }
  } catch (err) {
    console.error(err);
    alert('Có lỗi xảy ra, không thể kết nối đến máy chủ.');
  } finally {
    setIsSubmitting(false);
  }
};


  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Đang tải dữ liệu...</div>;
  if (!form) return <div className="flex justify-center items-center min-h-screen">Không thể tải hồ sơ. Vui lòng đăng nhập lại.</div>;

  if (form.account_status === 'pending') return <PendingApprovalScreen />;
  if (form.account_status === 'active') {
    router.push('/doctor/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-700 mb-2 text-center">Hoàn thiện hồ sơ bác sĩ</h1>
        <p className="text-center text-gray-600 mb-6">
          Cung cấp thông tin dưới đây để quản trị viên có thể xét duyệt tài khoản của bạn.
        </p>

        <div className="space-y-4">
  {/* Thông tin cơ bản */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
      <input value={form.name || ''} disabled className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input value={form.email || ''} disabled className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed" />
    </div>
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên khoa</label>
    <input value={form.specialization_name || 'Đang tải...'} disabled className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed" />
  </div>

  {/* Thông tin liên hệ và giới thiệu */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
    <input name="phone" type="text" value={form.phone || ''} onChange={handleChange}
      className={`w-full border px-3 py-2 rounded focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} />
    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Giới thiệu bản thân</label>
    <textarea name="introduction" rows={4} value={form.introduction || ''} onChange={handleChange}
      className={`w-full border px-3 py-2 rounded focus:ring-blue-500 focus:border-blue-500 ${errors.introduction ? 'border-red-500' : 'border-gray-300'}`} />
    {errors.introduction && <p className="text-red-500 text-sm mt-1">{errors.introduction}</p>}
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Kinh nghiệm làm việc</label>
    <textarea name="experience" rows={4} value={form.experience || ''} onChange={handleChange}
      className={`w-full border px-3 py-2 rounded focus:ring-blue-500 focus:border-blue-500 ${errors.experience ? 'border-red-500' : 'border-gray-300'}`} />
    {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
  </div>

  {/* Thông tin bằng cấp */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
      <input name="gpa" type="text" value={form.gpa || ''} onChange={handleChange}
        className="w-full border px-3 py-2 rounded focus:ring-blue-500 focus:border-blue-500" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Trường tốt nghiệp</label>
      <input name="university" type="text" value={form.university || ''} onChange={handleChange}
        className="w-full border px-3 py-2 rounded focus:ring-blue-500 focus:border-blue-500" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tốt nghiệp</label>
      <input name="graduation_date" type="date" value={form.graduation_date?.split('T')[0] || ''} onChange={handleChange}
        className="w-full border px-3 py-2 rounded focus:ring-blue-500 focus:border-blue-500" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Loại bằng</label>
      <input name="degree_type" type="text" value={form.degree_type || ''} onChange={handleChange}
        className="w-full border px-3 py-2 rounded focus:ring-blue-500 focus:border-blue-500" />
    </div>
  </div>

  {/* Ảnh */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
      <input type="file" name="img" accept="image/*" onChange={handleFileChange}
        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      {errors.img && <p className="text-red-500 text-sm mt-1">{errors.img}</p>}
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh Bằng cấp</label>
      <input type="file" name="degree_image" accept="image/*" onChange={handleFileChange}
        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      {errors.degree_image && <p className="text-red-500 text-sm mt-1">{errors.degree_image}</p>}
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh Chứng chỉ</label>
      <input type="file" name="certificate_image" accept="image/*" onChange={handleFileChange}
        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      {errors.certificate_image && <p className="text-red-500 text-sm mt-1">{errors.certificate_image}</p>}
    </div>
  </div>
</div>


        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi thông tin xét duyệt'}
        </button>
      </div>
    </div>
  );
}