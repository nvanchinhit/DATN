'use client';

import React, { useEffect, useState, ChangeEvent, FormEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebardoctor';
import { Save, Loader2, User, Mail, Stethoscope, GraduationCap, FileText, Image as ImageIcon, Trash2, PlusCircle, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// --- Interfaces ---
interface DoctorProfile {
    id: number;
    name: string;
    email: string;
    specialization_name: string;
    introduction: string | null;
    experience: string | null;
    phone: string | null;
    img: string | null;
    degree_image: string | null;
    certificate_image: string | null;
    certificate_source: string | null;
    gpa: string | null;
    university: string | null;
    graduation_date: string | null;
    degree_type: string | null;
}

interface ExistingCertificate {
    image: string;
    source: string;
}

interface NewCertificateEntry {
    id: number;
    file: File | null;
    authority: string;
}

// --- Helper Functions ---
const getFullUrl = (path: string | null): string | null => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const finalPath = path.startsWith('/') ? `/uploads${path}` : `/uploads/${path}`;
    try {
        return new URL(finalPath, API_URL).href;
    } catch (e) {
        return null;
    }
};

// === COMPONENT CHÍNH CỦA TRANG CHỈNH SỬA ===
export default function EditProfilePage() {
    const router = useRouter();
    const [initialLoading, setInitialLoading] = useState(true);
    const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
    
    const [formData, setFormData] = useState({
        introduction: '', experience: '', phone: '', gpa: '',
        university: '', graduation_date: '', degree_type: '',
    });

    const [newFiles, setNewFiles] = useState<{ img?: File; degree_image?: File; }>({});
    const [existingCertificates, setExistingCertificates] = useState<ExistingCertificate[]>([]);
    const [newCertificates, setNewCertificates] = useState<NewCertificateEntry[]>([{ id: Date.now(), file: null, authority: '' }]);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // --- LẤY DỮ LIỆU BAN ĐẦU ---
    useEffect(() => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (!user || !token) { router.replace('/doctor/login'); return; }
        const { id } = JSON.parse(user);

        fetch(`${API_URL}/api/doctors/${id}`, { headers: { 'Authorization': `Bearer ${token}` }})
        .then(res => res.ok ? res.json() : Promise.reject('Không thể tải dữ liệu'))
        .then(data => {
            setDoctor(data);
            setFormData({
                introduction: data.introduction || '', experience: data.experience || '',
                phone: data.phone || '', gpa: data.gpa || '', university: data.university || '',
                graduation_date: data.graduation_date?.split('T')[0] || '', degree_type: data.degree_type || '',
            });
            if (data.certificate_image && data.certificate_source) {
                const images = data.certificate_image.split(',').filter(Boolean);
                const sources = data.certificate_source.split(',').filter(Boolean);
                setExistingCertificates(images.map((img, i) => ({ image: img, source: sources[i] || '' })));
            }
        })
        .catch(() => { router.back(); })
        .finally(() => setInitialLoading(false));
    }, [router]);

    // --- CÁC HÀM VALIDATE ---
    const validateField = useCallback((name: string, value: any) => {
        // Validation tương tự trang complete-profile
        const today = new Date(); today.setHours(23, 59, 59, 999);
        switch (name) {
            case 'phone': if (value && !/^(0\d{9})$/.test(value)) return 'Số điện thoại không hợp lệ.'; break;
            case 'gpa': if (value && (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 10)) return 'GPA không hợp lệ.'; break;
            case 'graduation_date': if (value && new Date(value) > today) return 'Ngày tốt nghiệp không hợp lệ.'; break;
            case 'degree_type': if (value && /\d/.test(value)) return 'Loại bằng không được chứa số.'; break;
            default: break;
        }
        return '';
    }, []);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, files: selectedFiles } = e.target;
        if (!selectedFiles?.[0]) {
            setNewFiles(prev => { const newF = {...prev}; delete newF[name as keyof typeof newFiles]; return newF; });
            return;
        }
        const file = selectedFiles[0];
        if (!file.type.startsWith('image/')) {
            setErrors(prev => ({...prev, [name]: 'Vui lòng chỉ chọn file ảnh.'}));
            e.target.value = ''; return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
            setErrors(prev => ({...prev, [name]: 'File quá lớn (tối đa 5MB).'}));
            e.target.value = ''; return;
        }
        setNewFiles(prev => ({ ...prev, [name]: file }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // --- CÁC HÀM XỬ LÝ CHỨNG CHỈ ---
    const handleDeleteExistingCertificate = (imageNameToDelete: string) => {
        if(window.confirm('Bạn chắc chắn muốn xóa chứng chỉ này? Hành động này không thể hoàn tác.')) {
            setExistingCertificates(prev => prev.filter(cert => cert.image !== imageNameToDelete));
        }
    };
    const handleAddCertificate = () => setNewCertificates(prev => [...prev, { id: Date.now(), file: null, authority: '' }]);
    const handleCertificateChange = (id: number, field: 'file' | 'authority', value: File | string | null) => {
        setNewCertificates(prev => prev.map(cert => (cert.id === id ? { ...cert, [field]: value } : cert)));
    };

    // --- HÀM SUBMIT ---
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        // Kiểm tra lỗi trước khi submit
        const formValues = Object.entries(formData);
        for(const [key, value] of formValues) {
            if(validateField(key, value)) {
                alert('Vui lòng sửa các lỗi trong form.');
                return;
            }
        }
        if (Object.values(errors).some(err => err)) {
            alert('Vui lòng sửa các lỗi trong form.');
            return;
        }

        if (!doctor) return;
        const token = localStorage.getItem('token');
        if (!token) { router.push('/doctor/login'); return; }

        setIsSubmitting(true);
        const apiFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => apiFormData.append(key, value));
        apiFormData.append('existingCertificates', existingCertificates.map(c => c.image).join(','));
        apiFormData.append('existingCertSources', existingCertificates.map(c => c.source).join(','));
        Object.entries(newFiles).forEach(([key, file]) => { if (file) apiFormData.append(key, file); });
        newCertificates.forEach(cert => {
            if (cert.file && cert.authority) {
                apiFormData.append('certificate_files', cert.file);
                apiFormData.append('certificate_authorities', cert.authority);
            }
        });

        try {
            const res = await fetch(`${API_URL}/api/doctors/${doctor.id}/profile`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: apiFormData,
            });
            if (!res.ok) throw new Error((await res.json()).msg || "Lỗi cập nhật");
            alert("Cập nhật hồ sơ thành công! Hồ sơ của bạn sẽ được xét duyệt lại.");
            router.push('/doctor/dashboard');
        } catch (err: any) {
            alert("Lỗi: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (initialLoading) { /* ... */ }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 p-4 sm:p-6 lg:p-10">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg border">
                    <div className="border-b pb-6 mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa Hồ sơ</h1>
                        <p className="mt-1 text-gray-500">Cập nhật thông tin của bạn. Mọi thay đổi sẽ cần được duyệt lại.</p>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-50 border mb-8">
                        <div className="flex items-center space-x-4"><User className="text-gray-500" /><p><strong>Họ và tên:</strong> {doctor?.name}</p></div>
                        <div className="flex items-center space-x-4 mt-2"><Mail className="text-gray-500" /><p><strong>Email:</strong> {doctor?.email}</p></div>
                        <div className="flex items-center space-x-4 mt-2"><Stethoscope className="text-gray-500" /><p><strong>Chuyên khoa:</strong> {doctor?.specialization_name}</p></div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin chuyên môn</h3>
                            <div className="space-y-4">
                                <label className="block text-sm font-medium">Giới thiệu bản thân <textarea name="introduction" value={formData.introduction} onChange={handleTextChange} onBlur={handleBlur} rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" /></label>
                                <label className="block text-sm font-medium">Kinh nghiệm làm việc <textarea name="experience" value={formData.experience} onChange={handleTextChange} onBlur={handleBlur} rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" /></label>
                                <div>
                                  <label className="block text-sm font-medium">Số điện thoại</label>
                                  <input type="text" name="phone" value={formData.phone} onChange={handleTextChange} onBlur={handleBlur} className={`mt-1 block w-full rounded-md shadow-sm p-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} />
                                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin học vấn</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium">GPA</label>
                                  <input type="text" name="gpa" value={formData.gpa} onChange={handleTextChange} onBlur={handleBlur} className={`mt-1 block w-full rounded-md shadow-sm p-2 ${errors.gpa ? 'border-red-500' : 'border-gray-300'}`} />
                                  {errors.gpa && <p className="text-red-500 text-xs mt-1">{errors.gpa}</p>}
                                </div>
                                <div>
                                  <label className="block text-sm font-medium">Trường tốt nghiệp</label>
                                  <input type="text" name="university" value={formData.university} onChange={handleTextChange} onBlur={handleBlur} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium">Ngày tốt nghiệp</label>
                                  <input type="date" name="graduation_date" value={formData.graduation_date} onChange={handleTextChange} onBlur={handleBlur} className={`mt-1 block w-full rounded-md shadow-sm p-2 ${errors.graduation_date ? 'border-red-500' : 'border-gray-300'}`} />
                                  {errors.graduation_date && <p className="text-red-500 text-xs mt-1">{errors.graduation_date}</p>}
                                </div>
                                <div>
                                  <label className="block text-sm font-medium">Loại bằng</label>
                                  <input type="text" name="degree_type" value={formData.degree_type} onChange={handleTextChange} onBlur={handleBlur} className={`mt-1 block w-full rounded-md shadow-sm p-2 ${errors.degree_type ? 'border-red-500' : 'border-gray-300'}`} />
                                  {errors.degree_type && <p className="text-red-500 text-xs mt-1">{errors.degree_type}</p>}
                                </div>
                             </div>
                        </div>

                        <div className="pt-8 border-t">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tài liệu & Hình ảnh</h3>
                            <p className="text-sm text-gray-500 mb-4">Lưu ý: Upload ảnh mới sẽ **ghi đè** lên ảnh cũ sau khi được duyệt.</p>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="font-medium flex items-center gap-2"><ImageIcon size={16}/>Ảnh đại diện</label>
                                    {doctor?.img && <img src={getFullUrl(doctor.img) ?? ''} alt="Ảnh đại diện hiện tại" className="w-32 h-32 object-cover rounded-md border"/>}
                                    <input type="file" name="img" onChange={handleFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                                    {errors.img && <p className="text-red-500 text-xs mt-1">{errors.img}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="font-medium flex items-center gap-2"><GraduationCap size={16}/>Bằng cấp</label>
                                    {doctor?.degree_image && <img src={getFullUrl(doctor.degree_image) ?? ''} alt="Bằng cấp hiện tại" className="w-32 h-32 object-cover rounded-md border"/>}
                                    <input type="file" name="degree_image" onChange={handleFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                                    {errors.degree_image && <p className="text-red-500 text-xs mt-1">{errors.degree_image}</p>}
                                </div>
                            </div>
                            <div className="mt-8">
                                <label className="font-medium flex items-center gap-2 mb-2"><FileText size={16}/>Chứng chỉ hành nghề</label>
                                {existingCertificates.length > 0 && <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                    {existingCertificates.map((cert) => (
                                        <div key={cert.image} className="relative group">
                                            <img src={getFullUrl(cert.image) ?? ''} alt={cert.source} className="w-full h-24 object-cover rounded-md border"/>
                                            <button type="button" onClick={() => handleDeleteExistingCertificate(cert.image)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1" title="Xóa chứng chỉ này"><X size={12}/></button>
                                        </div>
                                    ))}
                                </div>}
                                <div className="space-y-4 mt-4">
                                    {newCertificates.map((cert, index) => (
                                        <div key={cert.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border">
                                            <div className="flex-1"><label className="block text-sm font-medium mb-1">Ảnh chứng chỉ mới #{index+1}</label><input type="file" onChange={(e) => handleCertificateChange(cert.id, 'file', e.target.files?.[0] ?? null)} className="text-sm w-full"/></div>
                                            <div className="flex-1"><label className="block text-sm font-medium mb-1">Nơi cấp</label><input type="text" placeholder="VD: Bộ Y Tế" value={cert.authority} onChange={(e) => handleCertificateChange(cert.id, 'authority', e.target.value)} className="w-full border-gray-300 rounded-md p-2 text-sm"/></div>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={handleAddCertificate} className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"><PlusCircle size={14}/>Thêm ô upload</button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t flex justify-end gap-4">
                        <button type="button" onClick={() => router.back()} className="bg-gray-200 text-gray-800 font-semibold py-2.5 px-5 rounded-lg">Hủy</button>
                        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2">
                            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5"/> : <Save className="h-5 w-5"/>}
                            {isSubmitting ? 'Đang lưu...' : 'Lưu & Gửi duyệt'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}