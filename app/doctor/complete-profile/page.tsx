'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, LogOut, PlusCircle, Trash2, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';

// --- COMPONENT MÀN HÌNH CHỜ DUYỆT ---
const PendingApprovalScreen = () => {
  const router = useRouter();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('doctorToken');
    router.push('/doctor/login'); 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-lg shadow-lg">
        <Clock className="mx-auto text-yellow-500 mb-4" size={48} />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Hồ sơ đang chờ duyệt</h1>
        <p className="text-gray-600 mb-6">
          Thông tin của bạn đã được gửi và đang trong quá trình xét duyệt.
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

// --- KIỂU DỮ LIỆU ---
interface CertificateEntry {
  id: number;
  file: File | null;
  authority: string;
}

// --- COMPONENT CHÍNH CỦA TRANG ---
export default function CompleteProfilePage() {
  const [form, setForm] = useState<any | null>(null);
  const [files, setFiles] = useState<{ img?: File; degree_image?: File }>({});
  const [certificates, setCertificates] = useState<CertificateEntry[]>([
    { id: Date.now(), file: null, authority: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [errors, setErrors] = useState<{ [key: string]: string | any[] }>({});

  // --- LẤY DỮ LIỆU BAN ĐẦU ---
  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('doctorToken');

    if (user && token) {
      const parsedUser = JSON.parse(user);
      
      fetch(`http://localhost:5000/api/doctors/${parsedUser.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
          if (!res.ok) throw new Error("Không thể tải thông tin bác sĩ.");
          return res.json();
      })
      .then(data => {
        setForm(data);
      })
      .catch(err => {
          console.error("Lỗi khi fetch dữ liệu bác sĩ:", err);
          alert("Phiên đăng nhập đã hết hạn hoặc có lỗi xảy ra. Vui lòng đăng nhập lại.");
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

  // --- CÁC HÀM VALIDATE RIÊNG LẺ ---
  const validateField = useCallback((name: string, value: any) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    switch (name) {
      case 'phone':
        if (!value?.trim()) return 'Vui lòng nhập số điện thoại.';
        if (!/^(0\d{9})$/.test(value)) return 'Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0).';
        break;
      case 'introduction':
        if (!value?.trim()) return 'Vui lòng nhập giới thiệu bản thân.';
        break;
      case 'experience':
        if (!value?.trim()) return 'Vui lòng nhập kinh nghiệm làm việc.';
        break;
      case 'gpa':
        if (!value?.trim()) return 'Vui lòng nhập GPA.';
        if (isNaN(Number(value))) return 'GPA phải là một con số.';
        if (Number(value) < 0 || Number(value) > 10) return 'GPA không hợp lệ (phải từ 0 đến 10).';
        break;
      case 'university':
        if (!value?.trim()) return 'Vui lòng nhập trường tốt nghiệp.';
        break;
      case 'graduation_date':
        if (!value) return 'Vui lòng chọn ngày tốt nghiệp.';
        if (new Date(value) > today) return 'Ngày tốt nghiệp không thể là một ngày trong tương lai.';
        break;
      case 'degree_type':
        if (!value?.trim()) return 'Vui lòng nhập loại bằng.';
        if (/\d/.test(value)) return 'Loại bằng không được chứa số.';
        break;
      default:
        break;
    }
    return ''; // Không có lỗi
  }, []);

  // --- HÀM XỬ LÝ SỰ KIỆN BLUR ---
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // --- HÀM XỬ LÝ THAY ĐỔI DỮ LIỆU ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => (prev ? { ...prev, [name]: value } : { [name]: value }));
    if (errors[name]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;
    
    if (!selectedFiles?.[0]) {
      setFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[name as keyof typeof files];
        return newFiles;
      });
      if (!form?.[name]) {
        const label = name === 'img' ? 'ảnh đại diện' : 'ảnh bằng cấp';
        setErrors(prev => ({ ...prev, [name]: `Vui lòng tải lên ${label}.` }));
      }
      return;
    }

    const file = selectedFiles[0];
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, [name]: 'Vui lòng chỉ chọn file ảnh.' }));
      e.target.value = '';
      return;
    }

    if (file.size > MAX_SIZE) {
      setErrors(prev => ({ ...prev, [name]: 'File quá lớn, vui lòng chọn file nhỏ hơn 5MB.' }));
      e.target.value = '';
      return;
    }

    setFiles((prev) => ({ ...prev, [name]: file }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };
  
  const handleAddCertificate = () => {
    setCertificates(prev => [
        ...prev, 
        { id: Date.now(), file: null, authority: '' }
    ]);
  };

  const handleRemoveCertificate = (id: number) => {
    if (certificates.length > 1) {
        setCertificates(prev => prev.filter(cert => cert.id !== id));
    }
  };

  const handleCertificateChange = (id: number, field: 'file' | 'authority', value: File | string | null) => {
      setCertificates(prev => 
        prev.map(cert => 
            cert.id === id ? { ...cert, [field]: value } : cert
        )
      );
      if (errors.certificates) {
        setErrors(prev => ({ ...prev, certificates: [] }));
      }
  };

  // --- HÀM VALIDATE TỔNG THỂ KHI SUBMIT ---
  const validateOnSubmit = () => {
    const newErrors: { [key: string]: any } = {};
    
    const fieldsToValidate = ['phone', 'introduction', 'experience', 'gpa', 'university', 'graduation_date', 'degree_type'];
    fieldsToValidate.forEach(field => {
        const error = validateField(field, form?.[field]);
        if (error) newErrors[field] = error;
    });

    if (!form.img && !files.img) newErrors.img = 'Vui lòng tải lên ảnh đại diện.';
    if (!form.degree_image && !files.degree_image) newErrors.degree_image = 'Vui lòng tải lên ảnh bằng cấp.';

    const certificateErrors: any[] = [];
    let hasAtLeastOneValidCertificate = false;
    const isCertificateSectionTouched = certificates.some(c => c.file || c.authority.trim());

    if (isCertificateSectionTouched) {
        certificates.forEach((cert) => {
            if (cert.file || cert.authority.trim()) {
                const error: { id: number, file?: string, authority?: string } = { id: cert.id };
                if (!cert.file) error.file = 'Vui lòng chọn file ảnh.';
                if (!cert.authority.trim()) error.authority = 'Vui lòng nhập nơi cấp.';
                if (error.file || error.authority) {
                    certificateErrors.push(error);
                } else {
                    hasAtLeastOneValidCertificate = true;
                }
            }
        });
    }

    if (!hasAtLeastOneValidCertificate) {
        const firstCertId = certificates[0]?.id || Date.now();
        const existingError = certificateErrors.find(e => e.id === firstCertId);
        if (!existingError) {
             certificateErrors.push({ id: firstCertId, file: 'Vui lòng cung cấp ít nhất một chứng chỉ hợp lệ.'});
        }
    }
    
    if (certificateErrors.length > 0) {
        newErrors.certificates = certificateErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- HÀM SUBMIT FORM ---
  const handleSubmit = async () => {
    if (!form?.id || isSubmitting) return;

    if (!validateOnSubmit()) {
        alert('Vui lòng điền đầy đủ và chính xác các thông tin bắt buộc.');
        return;
    }

    const token = localStorage.getItem('doctorToken');
    if (!token) {
        alert("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
        router.push('/doctor/login');
        return;
    }

    setIsSubmitting(true);
    const formData = new FormData();

    ['phone', 'introduction', 'experience', 'gpa', 'university', 'graduation_date', 'degree_type'].forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
    });

    Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file as Blob);
    });

    certificates.forEach(cert => {
        if (cert.file && cert.authority) {
            formData.append('certificate_files', cert.file); 
            formData.append('certificate_authorities', cert.authority);
        }
    });

    try {
        // ✅ ĐÂY LÀ DÒNG CODE ĐÃ ĐƯỢC SỬA
        const res = await fetch(`http://localhost:5000/api/doctors/${form.id}/profile`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });

        if (res.ok) {
            alert("Cập nhật hồ sơ thành công! Hồ sơ của bạn sẽ được xét duyệt lại.");
            window.location.reload();
        } else {
            const errorData = await res.json().catch(() => ({ msg: 'Lỗi không xác định' }));
            alert(`Cập nhật thất bại: ${errorData.msg || 'Vui lòng kiểm tra lại thông tin.'}`);
        }
    } catch (err) {
        console.error("Lỗi khi gửi request:", err);
        alert('Có lỗi xảy ra, không thể kết nối đến máy chủ.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const getCertificateError = (id: number) => {
      if (!errors.certificates || !Array.isArray(errors.certificates)) return null;
      return errors.certificates.find(err => err.id === id);
  }

  // State để quản lý việc chuyển hướng
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // useEffect để xử lý chuyển hướng
  useEffect(() => {
    if (form?.account_status === 'active' && !shouldRedirect) {
      setShouldRedirect(true);
      setTimeout(() => {
        router.push('/doctor/dashboard');
      }, 2000); // Chờ 2 giây rồi chuyển hướng
    }
  }, [form?.account_status, shouldRedirect, router]);

  // --- LOGIC RENDER ---
  if (isLoading) return <div className="min-h-screen flex justify-center items-center text-lg font-semibold text-gray-600">Đang tải dữ liệu hồ sơ...</div>;
  if (!form) return <div className="min-h-screen flex justify-center items-center text-lg font-semibold text-red-600">Không thể tải hồ sơ. Vui lòng đăng nhập lại.</div>;

  if (form.account_status === 'pending') return <PendingApprovalScreen />;
  if (form.account_status === 'active') {
    return <div className="min-h-screen flex justify-center items-center text-lg font-semibold text-green-600">Hồ sơ đã được duyệt. Đang chuyển hướng...</div>;
  }

  // --- GIAO DIỆN FORM ---
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-2 text-center">Hoàn thiện hồ sơ bác sĩ</h1>
        <p className="text-center text-gray-600 mb-8">
          Cung cấp thông tin dưới đây để quản trị viên có thể xét duyệt tài khoản của bạn.
        </p>
        
        <div className="space-y-8">
          {/* Section: Thông tin cá nhân & Kinh nghiệm */}
          <div className="p-5 border rounded-lg bg-white shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Thông tin cá nhân & Kinh nghiệm</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                    <input value={form.name || ''} disabled className="w-full border px-3 py-2 rounded-md bg-gray-100 cursor-not-allowed" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input value={form.email || ''} disabled className="w-full border px-3 py-2 rounded-md bg-gray-100 cursor-not-allowed" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên khoa</label>
                    <input value={form.specialization_name || 'Đang tải...'} disabled className="w-full border px-3 py-2 rounded-md bg-gray-100 cursor-not-allowed" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <input name="phone" type="text" value={form.phone || ''} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full border px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone as string}</p>}
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giới thiệu bản thân</label>
                    <textarea name="introduction" rows={4} value={form.introduction || ''} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full border px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.introduction ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.introduction && <p className="text-red-500 text-xs mt-1">{errors.introduction as string}</p>}
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kinh nghiệm làm việc</label>
                    <textarea name="experience" rows={4} value={form.experience || ''} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full border px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.experience ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience as string}</p>}
                </div>
             </div>
          </div>
          
          {/* Section: Học vấn & Bằng cấp */}
          <div className="p-5 border rounded-lg bg-white shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Học vấn & Bằng cấp</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                    <input name="gpa" type="text" value={form.gpa || ''} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full border px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.gpa ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.gpa && <p className="text-red-500 text-xs mt-1">{errors.gpa as string}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trường tốt nghiệp</label>
                    <input name="university" type="text" value={form.university || ''} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full border px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.university ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.university && <p className="text-red-500 text-xs mt-1">{errors.university as string}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tốt nghiệp</label>
                    <input name="graduation_date" type="date" value={form.graduation_date?.split('T')[0] || ''} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full border px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.graduation_date ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.graduation_date && <p className="text-red-500 text-xs mt-1">{errors.graduation_date as string}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại bằng</label>
                    <input name="degree_type" type="text" value={form.degree_type || ''} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full border px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.degree_type ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.degree_type && <p className="text-red-500 text-xs mt-1">{errors.degree_type as string}</p>}
                </div>
                <div className="md:col-span-1">
                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><ImageIcon size={16}/>Ảnh đại diện</label>
                    <input type="file" name="img" accept="image/*" onChange={handleFileChange} className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    {errors.img && <p className="text-red-500 text-xs mt-1">{errors.img as string}</p>}
                </div>
                <div className="md:col-span-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><FileText size={16}/>Ảnh Bằng cấp</label>
                    <input type="file" name="degree_image" accept="image/*" onChange={handleFileChange} className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    {errors.degree_image && <p className="text-red-500 text-xs mt-1">{errors.degree_image as string}</p>}
                </div>
            </div>
          </div>
          
          {/* Section: Chứng chỉ hành nghề */}
          <div className="p-5 border rounded-lg bg-white shadow-sm">
             <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Chứng chỉ hành nghề</h2>
             <div className="space-y-4">
                {certificates.map((cert, index) => {
                    const certError = getCertificateError(cert.id);
                    return (
                        <div key={cert.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start p-3 bg-gray-50 rounded-lg border">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh chứng chỉ #{index + 1}</label>
                                    <input 
                                        type="file" 
                                        name={`certificate_file_${cert.id}`}
                                        accept="image/*" 
                                        onChange={(e) => handleCertificateChange(cert.id, 'file', e.target.files ? e.target.files[0] : null)}
                                        className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                    {certError?.file && <p className="text-red-500 text-xs mt-1">{certError.file}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nơi cấp</label>
                                    <input 
                                        type="text" 
                                        value={cert.authority}
                                        onChange={(e) => handleCertificateChange(cert.id, 'authority', e.target.value)}
                                        placeholder='VD: Bộ Y Tế'
                                        className={`w-full border px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm ${certError?.authority && !certError.file ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {certError?.authority && !certError.file && <p className="text-red-500 text-xs mt-1">{certError.authority}</p>}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                               {cert.file && (
                                 <img src={URL.createObjectURL(cert.file)} alt="Preview" className="w-28 h-28 object-cover rounded-md border bg-slate-100" />
                               )}
                               {certificates.length > 1 && (
                                   <button 
                                      onClick={() => handleRemoveCertificate(cert.id)}
                                      className="self-start text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                                      title="Xóa chứng chỉ này"
                                    >
                                        <Trash2 size={20} />
                                   </button>
                               )}
                            </div>
                        </div>
                    );
                })}
             </div>
             <button
                onClick={handleAddCertificate}
                className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors"
             >
                <PlusCircle size={18} />
                Thêm chứng chỉ khác
             </button>
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors text-lg"
        >
          {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
          {isSubmitting ? 'Đang gửi...' : 'Gửi thông tin xét duyệt'}
        </button>
      </div>
    </div>
  );
}