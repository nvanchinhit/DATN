'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Giả sử Sidebar được import từ đúng đường dẫn
import Sidebar from '@/components/layout/Sidebardoctor'; 
import { Mail, Phone, Stethoscope, GraduationCap, FileText, UserCheck, Edit, Loader2, AlertTriangle, ImageOff } from 'lucide-react';

const getFullImageUrl = (filename: string | null | undefined): string | null => {
    if (!filename) return null;
    return `http://localhost:5000/uploads/${filename}`;
}

export default function DoctorProfilePage() {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('info');
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.replace('/login');
      return;
    }
    const { id } = JSON.parse(user);

    fetch(`http://localhost:5000/api/doctors/${id}`) 
      .then(res => {
        if (!res.ok) {
            if(res.status === 404) throw new Error("Không tìm thấy hồ sơ của bạn.");
            throw new Error("Không thể tải hồ sơ. Vui lòng thử lại.");
        }
        return res.json();
      })
      .then(data => {
        if (data.account_status === 'pending' || data.account_status === 'inactive') {
          router.replace('/doctor/complete-profile');
        } else {
          setDoctor(data);

          // <<< SỬA #2: CẬP NHẬT LOCALSTORAGE VỚI DỮ LIỆU MỚI NHẤT >>>
          // Khi lấy được dữ liệu mới từ API, ta cập nhật lại 'user' trong localStorage
          // để Sidebar và các component khác có thể sử dụng thông tin mới này.
          const updatedUserForStorage = {
            id: data.id,
            name: data.name,
            img: data.img, // Lấy ảnh mới nhất từ API
          };
          localStorage.setItem('user', JSON.stringify(updatedUserForStorage));
          // <<< KẾT THÚC SỬA #2 >>>
        }
      })
      .catch(err => {
        console.error('❌ Lỗi khi tải hồ sơ:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [router]);

  // ... (phần code render không thay đổi)
  const renderContent = () => {
    if (loading) return <div className="flex flex-col items-center justify-center h-full text-gray-500"><Loader2 className="animate-spin h-12 w-12 text-blue-600" /><p className="mt-4">Đang tải hồ sơ...</p></div>;
    if (error) return <div className="flex flex-col items-center justify-center h-full text-red-600 bg-red-50 p-8 rounded-lg"><AlertTriangle className="h-12 w-12" /><p className="mt-4 font-semibold">{error}</p></div>;
    if (!doctor) return null;

    const specializationName = doctor.specialization_name || 'Chưa cập nhật';
    const degreeImage = getFullImageUrl(doctor.degree_image);
    const certificateImage = getFullImageUrl(doctor.certificate_image);
    const avatarImage = getFullImageUrl(doctor.img) || '/default-doctor.jpg';
    
    return (
        <div className="max-w-5xl mx-auto">
            {/* --- Profile Header Card --- */}
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 rounded-2xl shadow-2xl">
                <div className="absolute top-4 right-4">
                    <Link href="/doctor/update-profile" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 backdrop-blur-sm">
                        <Edit size={16} /> Chỉnh sửa
                    </Link>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative flex-shrink-0">
                        <img
                            src={avatarImage}
                            alt="Avatar"
                            className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-2 rounded-full border-2 border-blue-700" title="Đã xác thực">
                            <UserCheck size={18} />
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold">{doctor.name}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-blue-100">
                            <span className="flex items-center gap-1.5"><Stethoscope size={16}/> {specializationName}</span>
                            <span className="hidden sm:inline">|</span>
                            <span className="flex items-center gap-1.5"><Mail size={16}/> {doctor.email}</span>
                        </div>
                        <p className="mt-1 text-blue-200 flex items-center justify-center md:justify-start gap-1.5"><Phone size={16}/> {doctor.phone || 'Chưa cập nhật SĐT'}</p>
                    </div>
                </div>
            </div>

            {/* --- Profile Details with Tabs --- */}
            <div className="bg-white p-6 rounded-b-2xl shadow-lg mt-0">
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-6">
                        <button onClick={() => setActiveTab('info')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'info' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Giới thiệu & Kinh nghiệm</button>
                        <button onClick={() => setActiveTab('documents')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'documents' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Tài liệu & Chứng chỉ</button>
                    </nav>
                </div>

                <div>
                    {activeTab === 'info' && (
                        <div className="space-y-6">
                             <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Giới thiệu bản thân</h3>
                                <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{doctor.introduction || 'Chưa có thông tin giới thiệu.'}</p>
                            </div>
                             <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Quá trình công tác & Kinh nghiệm</h3>
                                <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{doctor.experience || 'Chưa có thông tin kinh nghiệm.'}</p>
                            </div>
                        </div>
                    )}
                    {activeTab === 'documents' && (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-4 border rounded-lg bg-gray-50">
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><GraduationCap size={20}/> Bằng cấp chuyên môn</h4>
                                    {degreeImage ? <a href={degreeImage} target='_blank' rel='noopener noreferrer'><img src={degreeImage} alt="Bằng cấp" className="w-full h-auto object-contain rounded-lg shadow-sm border" /></a> : <div className="h-40 flex flex-col items-center justify-center text-gray-400 bg-gray-100 rounded-md"><ImageOff size={32}/><p className="mt-2 text-sm">Chưa cung cấp</p></div>}
                                </div>
                                <div className="p-4 border rounded-lg bg-gray-50">
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><FileText size={20}/> Chứng chỉ hành nghề</h4>
                                    {certificateImage ? <a href={certificateImage} target='_blank' rel='noopener noreferrer'><img src={certificateImage} alt="Chứng chỉ" className="w-full h-auto object-contain rounded-lg shadow-sm border" /></a> : <div className="h-40 flex flex-col items-center justify-center text-gray-400 bg-gray-100 rounded-md"><ImageOff size={32}/><p className="mt-2 text-sm">Chưa cung cấp</p></div>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}