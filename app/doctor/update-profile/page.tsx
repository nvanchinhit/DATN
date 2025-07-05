'use client';

import React, { useEffect, useState, useMemo, ChangeEvent, FormEvent, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebardoctor';
import { UploadCloud, Trash2, Save, Loader2, AlertCircle, User, Mail, Stethoscope } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

interface ImageFile { id: number; filename: string; }

const ImageUploadArea = ({ 
    title, existingImages, newPreviews, onDeleteExisting, onDeleteNew, onFileChange, type 
}: {
    title: string; existingImages: ImageFile[]; newPreviews: string[];
    onDeleteExisting: (id: number, type: 'degree' | 'certificate') => void;
    onDeleteNew: (index: number, type: 'degree' | 'certificate') => void;
    onFileChange: (files: FileList, type: 'degree' | 'certificate') => void;
    type: 'degree' | 'certificate';
}) => {
    const isDegree = type === 'degree';
    const [isDragging, setIsDragging] = useState(false);
    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileChange(e.dataTransfer.files, type);
            e.dataTransfer.clearData();
        }
    };
    return (
        <div className="p-4 border rounded-lg bg-gray-50">
            <h4 className="font-semibold text-gray-700 mb-3">{title}</h4>
            <div onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                <UploadCloud className="w-10 h-10 text-gray-400" />
                <label htmlFor={`${type}-file-upload`} className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                    {isDegree ? 'Chọn một tệp' : 'Chọn tệp'} <span className="text-gray-500 font-normal">hoặc kéo và thả</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF {isDegree ? '' : 'nhiều ảnh'} lên đến 2MB</p>
                <input id={`${type}-file-upload`} type="file" multiple={!isDegree} onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.files && onFileChange(e.target.files, type)} className="hidden" accept="image/*" />
            </div>
            {(existingImages.length > 0 || newPreviews.length > 0) && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {existingImages.map((img) => (
                        <div key={img.id} className="relative group aspect-square">
                            <img src={`${API_URL}${img.filename}`} alt={title} className="w-full h-full object-cover rounded-md shadow-sm" />
                            <button type="button" onClick={() => onDeleteExisting(img.id, type)} className="absolute top-1 right-1 bg-red-600/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                        </div>
                    ))}
                    {newPreviews.map((src, index) => (
                        <div key={src} className="relative group aspect-square">
                            <img src={src} alt="Preview" className="w-full h-full object-cover rounded-md shadow-sm" />
                            <button type="button" onClick={() => onDeleteNew(index, type)} className="absolute top-1 right-1 bg-red-600/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function UpdateProfilePage() {
    const router = useRouter();
    const [initialLoading, setInitialLoading] = useState(true);
    const [doctor, setDoctor] = useState<any>(null);

    const [formData, setFormData] = useState({ introduction: '', experience: '' });
    const [existingDegrees, setExistingDegrees] = useState<ImageFile[]>([]);
    const [newDegrees, setNewDegrees] = useState<File[]>([]);
    const [degreesToDelete, setDegreesToDelete] = useState<number[]>([]);
    const [existingCertificates, setExistingCertificates] = useState<ImageFile[]>([]);
    const [newCertificates, setNewCertificates] = useState<File[]>([]);
    const [certificatesToDelete, setCertificatesToDelete] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [degreesData, setDegreesData] = useState([{ gpa: '', university: '', graduation_date: '', degree_type: '' }]);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) { router.replace('/login'); return; }
        const { id } = JSON.parse(user);

        fetch(`${API_URL}/api/doctors/${id}`).then(res => res.json())
        .then(doctorData => {
            setDoctor(doctorData);
            setFormData({ introduction: doctorData.introduction || '', experience: doctorData.experience || '' });
            setExistingDegrees(doctorData.Degrees || []);
            setExistingCertificates(doctorData.Certificates || []);
            setInitialLoading(false);
        }).catch(() => {
            alert("Không thể tải dữ liệu hồ sơ.");
            router.back();
        });
    }, [router]);

    const newDegreePreviews = useMemo(() => newDegrees.map(file => URL.createObjectURL(file)), [newDegrees]);
    const newCertificatePreviews = useMemo(() => newCertificates.map(file => URL.createObjectURL(file)), [newCertificates]);
    useEffect(() => { return () => { newDegreePreviews.forEach(URL.revokeObjectURL); newCertificatePreviews.forEach(URL.revokeObjectURL); }}, [newDegreePreviews, newCertificatePreviews]);

    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFileChange = (files: FileList, type: 'degree' | 'certificate') => {
        if (!files) return;
        const fileArray = Array.from(files);
        if (type === 'degree') setNewDegrees(fileArray.slice(0, 1));
        if (type === 'certificate') setNewCertificates(prev => [...prev, ...fileArray]);
    };

    const handleDeleteExisting = (id: number, type: 'degree' | 'certificate') => {
        if (type === 'degree') {
            setDegreesToDelete(prev => [...prev, id]);
            setExistingDegrees(prev => prev.filter(img => img.id !== id));
        } else {
            setCertificatesToDelete(prev => [...prev, id]);
            setExistingCertificates(prev => prev.filter(img => img.id !== id));
        }
    };

    const handleDeleteNew = (index: number, type: 'degree' | 'certificate') => {
        if (type === 'degree') setNewDegrees([]);
        if (type === 'certificate') setNewCertificates(prev => prev.filter((_, i) => i !== index));
    };

    const handleDegreeChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDegreesData(prev => {
            const updated = [...prev];
            updated[index][name as keyof typeof updated[0]] = value;
            return updated;
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault(); if (!doctor) return;
        setIsSubmitting(true);
        const apiFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => apiFormData.append(key, value));
        newDegrees.forEach(file => apiFormData.append('degree_images', file));
        newCertificates.forEach(file => apiFormData.append('certificate_images', file));
        apiFormData.append('degreesToDelete', JSON.stringify(degreesToDelete));
        apiFormData.append('certificatesToDelete', JSON.stringify(certificatesToDelete));
        degreesData.forEach((degree, i) => {
            apiFormData.append(`degrees[${i}][gpa]`, degree.gpa);
            apiFormData.append(`degrees[${i}][university]`, degree.university);
            apiFormData.append(`degrees[${i}][graduation_date]`, degree.graduation_date);
            apiFormData.append(`degrees[${i}][degree_type]`, degree.degree_type);
        });

        try {
            const res = await fetch(`${API_URL}/api/doctors/${doctor.id}/profile`, { method: 'PUT', body: apiFormData });
            const resultData = await res.json();
            if (!res.ok) throw new Error(resultData.msg || "Lỗi không xác định");
            alert("Cập nhật hồ sơ thành công!");
            router.push('/doctor/complete-profile');
        } catch (err: any) {
            alert("Lỗi khi cập nhật: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 p-4 sm:p-6 lg:p-10">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Chỉnh sửa Hồ sơ Chuyên môn</h1>
                        <p className="mt-1 text-gray-500">Cập nhật thông tin và tài liệu của bạn để hiển thị trên hệ thống.</p>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-50 border mb-8">
                        <h3 className="font-semibold text-gray-800 mb-3">Thông tin tài khoản</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <User size={16} className="text-gray-500"/>
                                <span className="text-gray-600">Họ và tên:</span>
                                <span className="font-medium text-gray-800">{doctor?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={16} className="text-gray-500"/>
                                <span className="text-gray-600">Email:</span>
                                <span className="font-medium text-gray-800">{doctor?.email}</span>
                            </div>
                             <div className="flex items-center gap-2 col-span-full">
                                <Stethoscope size={16} className="text-gray-500"/>
                                <span className="text-gray-600">Chuyên khoa hiện tại:</span>
                                <span className="font-medium text-blue-600">{doctor?.specialization_name || 'Chưa có'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="introduction" className="block text-sm font-medium text-gray-700">Giới thiệu bản thân</label>
                                <textarea id="introduction" name="introduction" value={formData.introduction} onChange={handleTextChange} rows={4} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5"/>
                            </div>
                            <div>
                                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Kinh nghiệm làm việc</label>
                                <textarea id="experience" name="experience" value={formData.experience} onChange={handleTextChange} rows={4} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5"/>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin bằng cấp</h3>
                            {degreesData.map((degree, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">GPA</label>
                                        <input type="text" name="gpa" value={degree.gpa} onChange={(e) => handleDegreeChange(index, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Trường tốt nghiệp</label>
                                        <input type="text" name="university" value={degree.university} onChange={(e) => handleDegreeChange(index, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ngày tốt nghiệp</label>
                                        <input type="date" name="graduation_date" value={degree.graduation_date} onChange={(e) => handleDegreeChange(index, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Loại bằng</label>
                                        <input type="text" name="degree_type" value={degree.degree_type} onChange={(e) => handleDegreeChange(index, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"/>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-gray-200">
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-r-lg mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0"><AlertCircle className="h-5 w-5 text-yellow-500" /></div>
                                    <div className="ml-3"><p className="text-sm"><strong>Lưu ý:</strong> Mọi thay đổi về hình ảnh bằng cấp/chứng chỉ sẽ yêu cầu Quản trị viên duyệt lại hồ sơ của bạn.</p></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <ImageUploadArea title="🎓 Bằng cấp chuyên môn" existingImages={existingDegrees} newPreviews={newDegreePreviews} onDeleteExisting={handleDeleteExisting} onDeleteNew={(index) => handleDeleteNew(index, 'degree')} onFileChange={handleFileChange} type="degree" />
                                <ImageUploadArea title="📄 Chứng chỉ hành nghề" existingImages={existingCertificates} newPreviews={newCertificatePreviews} onDeleteExisting={handleDeleteExisting} onDeleteNew={(index) => handleDeleteNew(index, 'certificate')} onFileChange={handleFileChange} type="certificate" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
                        <button type="button" onClick={() => router.back()} className="bg-gray-200 text-gray-800 font-semibold py-2.5 px-5 rounded-lg hover:bg-gray-300 transition">Hủy</button>
                        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2">
                            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5"/> : <Save className="h-5 w-5"/>}
                            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
