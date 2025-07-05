'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebardoctor';
import {
  Mail, Phone, Stethoscope, GraduationCap, FileText,
  UserCheck, Edit, Loader2, AlertTriangle, ImageOff
} from 'lucide-react';

const getFullImageUrl = (filename: string | null | undefined): string => {
  if (!filename) return '/default-doctor.jpg';
  return `http://localhost:5000/uploads/${filename}`;
};

interface ImageFile {
  id: number;
  filename: string;
  gpa?: string;
  university?: string;
  graduation_date?: string;
  degree_type?: string;
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

    const fetchDoctor = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/doctors/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Không tìm thấy hồ sơ của bạn.");
          throw new Error("Không thể tải hồ sơ. Vui lòng thử lại.");
        }

        const data = await res.json();

        // ✅ Xử lý nhiều ảnh chứng chỉ từ chuỗi certificate_image
        const certificateFilenames = data.certificate_image
          ? data.certificate_image.split('|')
          : [];

        const certificateSources = data.certificate_source
          ? data.certificate_source.split('|')
          : [];

        const certificates = certificateFilenames.map((filename: string, index: number) => ({
          id: index + 1,
          filename,
          source: certificateSources[index] || 'Không rõ nơi cấp',
    }));


        // ✅ Gom thông tin bằng cấp vào mảng Degrees
        const degrees = data.degree_image
          ? [
              {
                id: 1,
                filename: data.degree_image,
                gpa: data.gpa,
                university: data.university,
                graduation_date: data.graduation_date,
                degree_type: data.degree_type,
              },
            ]
          : [];

        setDoctor({ ...data, Certificates: certificates, Degrees: degrees });

        localStorage.setItem(
          'user',
          JSON.stringify({ id: data.id, name: data.name, img: data.img })
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [router]);

  useEffect(() => {
    if (doctor?.account_status === 'pending' || doctor?.account_status === 'inactive') {
      router.replace('/doctor/complete-profile');
    }
  }, [doctor, router]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
          <p className="mt-4">Đang tải hồ sơ...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-600 bg-red-50 p-8 rounded-lg">
          <AlertTriangle className="h-12 w-12" />
          <p className="mt-4 font-semibold">{error}</p>
        </div>
      );
    }

    if (!doctor) return null;

    const specializationName = doctor.specialization_name || 'Chưa cập nhật';
    const avatarImage = getFullImageUrl(doctor.img);
    const degrees: ImageFile[] = doctor.Degrees || [];
    const certificates: ImageFile[] = doctor.Certificates || [];

    return (
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 rounded-2xl shadow-2xl">
          <div className="absolute top-4 right-4">
            <Link
              href="/doctor/update-profile"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 backdrop-blur-sm"
            >
              <Edit size={16} /> Chỉnh sửa
            </Link>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              <img
                src={avatarImage}
                alt="Avatar"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-doctor.jpg';
                }}
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
              <div
                className="absolute -bottom-1 -right-1 bg-green-500 text-white p-2 rounded-full border-2 border-blue-700"
                title="Đã xác thực"
              >
                <UserCheck size={18} />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{doctor.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-blue-100">
                <span className="flex items-center gap-1.5">
                  <Stethoscope size={16} /> {specializationName}
                </span>
                <span className="hidden sm:inline">|</span>
                <span className="flex items-center gap-1.5">
                  <Mail size={16} /> {doctor.email}
                </span>
              </div>
              <p className="mt-1 text-blue-200 flex items-center justify-center md:justify-start gap-1.5">
                <Phone size={16} /> {doctor.phone || 'Chưa cập nhật SĐT'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white p-6 rounded-b-2xl shadow-lg mt-0">
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6">
              <button
                onClick={() => setActiveTab('info')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'info'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Giới thiệu & Kinh nghiệm
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Tài liệu & Chứng chỉ
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Giới thiệu bản thân</h3>
                <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {doctor.introduction || 'Chưa có thông tin giới thiệu.'}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Quá trình công tác & Kinh nghiệm</h3>
                <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {doctor.experience || 'Chưa có thông tin kinh nghiệm.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Degrees */}
              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <GraduationCap size={20} /> Bằng cấp chuyên môn
                </h4>
                {degrees.length > 0 ? (
                  <div className="space-y-4">
                    {degrees.map((deg) => (
                      <div key={deg.id} className="p-3 bg-white border rounded-md shadow-sm">
                        <img
                          src={getFullImageUrl(deg.filename)}
                          alt="Bằng cấp"
                          className="w-full h-48 object-contain rounded-md mb-2"
                        />
                        <div className="text-sm text-gray-700 space-y-1">
                          <p><strong>Trường:</strong> {deg.university || 'N/A'}</p>
                          <p><strong>GPA:</strong> {deg.gpa || 'N/A'}</p>
                          <p><strong>Ngày TN:</strong> {deg.graduation_date || 'N/A'}</p>
                          <p><strong>Loại bằng:</strong> {deg.degree_type || 'N/A'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-gray-400 bg-gray-100 rounded-md">
                    <ImageOff size={32} />
                    <p className="mt-2 text-sm">Chưa cung cấp</p>
                  </div>
                )}
              </div>

              {/* Certificates */}
              <div className="p-4 border rounded-lg bg-gray-50">
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FileText size={20} /> Chứng chỉ hành nghề
              </h4>

              {certificates.length > 0 ? (
              <div className="flex flex-col gap-4">
                {certificates.map((cert) => (
              <div key={cert.id} className="p-3 bg-white rounded-md border shadow-sm">
              <img
                   src={getFullImageUrl(cert.filename)}
                   alt="Chứng chỉ"
                  className="w-full max-h-[500px] object-contain rounded-md mb-2"
              />
              <p className="text-sm text-gray-600">
                <strong>Nơi cấp:</strong> {cert.source || 'Không rõ'}
              </p>
              </div>
               ))}
              </div>
               ) : (
              <div className="h-40 flex flex-col items-center justify-center text-gray-400 bg-gray-100 rounded-md">
              <ImageOff size={32} />
              <p className="mt-2 text-sm">Chưa cung cấp</p>
              </div>
              )}
            </div>

            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}
