'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Stethoscope, GraduationCap, FileText, BadgeInfo, 
  ImageOff, Star, Calendar, Clock, MapPin, Phone, Mail, 
  Loader2, AlertTriangle, ChevronRight, ChevronLeft, Heart
} from 'lucide-react';
import { Doctor, Specialization } from '@/types';

// Giả định API_URL được cấu hình trong environment variables
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// Các interface (giữ nguyên)
interface DoctorDetails extends Doctor {
  phone?: string;
  email?: string;
  room_number?: string;
  experience?: string;
  specialization_id?: number;
  Certificates?: Array<{
    id: number;
    filename: string;
    source: string;
  }>;
  Degrees?: Array<{
    id: number;
    filename: string;
    gpa: string;
    university: string;
    graduation_date: string;
    degree_type: string;
  }>;
}

interface Rating {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  customer_name: string;
  customer_email?: string;
}

// Các hàm tiện ích (giữ nguyên)
const getImageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads/')) {
    return `${API_URL}${path}`;
  }
  return `${API_URL}/uploads/${path}`;
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.id as string;
  
  const [doctor, setDoctor] = useState<DoctorDetails | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('info');
  const [currentRatingPage, setCurrentRatingPage] = useState(1);
  const ratingsPerPage = 5;

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (!doctorId) return;

      try {
        setLoading(true);
        setError(null);
        
        // Fetch doctor details
        const doctorRes = await fetch(`${API_URL}/api/doctors/${doctorId}`);
        if (!doctorRes.ok) {
          throw new Error('Không thể tải thông tin bác sĩ');
        }
        const doctorData = await doctorRes.json();
        setDoctor(doctorData);

        // Fetch doctor ratings
        const ratingsRes = await fetch(`${API_URL}/api/ratings/doctor/${doctorId}`);
        if (ratingsRes.ok) {
          const ratingsData = await ratingsRes.json();
          setRatings(ratingsData);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  // Phần Loading và Error (giữ nguyên thiết kế đẹp)
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-8"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-gray-700 text-2xl font-semibold">Đang tải thông tin bác sĩ...</p>
          <p className="text-gray-500 text-lg mt-2">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto p-10">
          <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <AlertTriangle className="h-16 w-16 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Không thể tải thông tin</h2>
          <p className="text-red-600 font-semibold text-lg mb-8">{error || 'Không tìm thấy bác sĩ'}</p>
          <button 
            onClick={() => router.back()} 
            className="px-10 py-5 bg-white text-gray-900 font-bold text-lg rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border border-gray-200"
          >
            <ArrowLeft className="inline mr-3 h-6 w-6" />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Các biến và tính toán (giữ nguyên)
  const avatarUrl = getImageUrl(doctor.img) || '/default-avatar.png';
  const degreeUrl = getImageUrl(doctor.degree_image);
  const certificateUrl = getImageUrl(doctor.certificate_image);
  
  const totalRatingPages = Math.ceil(ratings.length / ratingsPerPage);
  const paginatedRatings = ratings.slice(
    (currentRatingPage - 1) * ratingsPerPage,
    currentRatingPage * ratingsPerPage
  );

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="relative max-w-6xl mx-auto px-4 py-8 sm:py-12">
        
        {/* === NÚT QUAY LẠI ĐÃ ĐƯỢC THIẾT KẾ LẠI === */}
        <motion.button 
          onClick={() => router.back()}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="absolute top-8 left-8 z-10 flex items-center bg-white/50 backdrop-blur-lg text-gray-800 hover:bg-white/80 transition-all duration-300 group px-5 py-3 rounded-full shadow-lg border border-white/30"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-semibold text-base">Quay lại</span>
        </motion.button>
        
        {/* Doctor Header Card (giữ nguyên thiết kế đẹp) */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border-0 mt-12 sm:mt-0">
          {/* Hero Section */}
          <div className="relative">
            <div className="relative h-80 md:h-[400px] overflow-hidden">
              <img 
                src={avatarUrl} 
                alt={doctor.name} 
                className="w-full h-full object-cover object-center"
                onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
              
              {/* Floating rating badge */}
              {averageRating > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute top-6 right-6 bg-white/25 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-2xl border border-white/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className={`${i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-white/60'}`} />
                      ))}
                    </div>
                    <div className="text-center text-white">
                      <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
                      <div className="text-xs opacity-90 font-medium">({ratings.length} đánh giá)</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Doctor info overlay */}
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                  className="space-y-3"
                >
                  <motion.span 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg"
                  >
                    {doctor.specialty_name}
                  </motion.span>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold drop-shadow-lg"
                  >
                    {doctor.name}
                  </motion.h1>
                  {doctor.introduction && (
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0, duration: 0.6 }}
                      className="text-lg text-blue-100 max-w-2xl leading-relaxed opacity-95"
                    >
                      {doctor.introduction}
                    </motion.p>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Contact info section */}
          <div className="p-8 bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {doctor.room_number && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="group bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <MapPin className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Phòng khám</p>
                      <p className="text-lg font-bold text-gray-900">{doctor.room_number}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              {doctor.phone && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="group bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl border border-gray-100 hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Phone className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Điện thoại</p>
                      <p className="text-lg font-bold text-gray-900">{doctor.phone}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              {doctor.email && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="group bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl border border-gray-100 hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <Mail className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Email</p>
                      <p className="text-lg font-bold text-gray-900">{doctor.email}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs (giữ nguyên thiết kế đẹp) */}
        <div className="bg-white rounded-3xl shadow-2xl mb-8 border-0 overflow-hidden">
          <div className="bg-slate-50 border-b border-gray-200">
            <nav className="flex space-x-2 p-3">
              {[
                { id: 'info', label: 'Thông tin', icon: BadgeInfo, color: 'blue' },
                { id: 'education', label: 'Học vấn', icon: GraduationCap, color: 'green' },
                { id: 'certificates', label: 'Chứng chỉ', icon: FileText, color: 'purple' },
                { id: 'reviews', label: 'Đánh giá', icon: Star, color: 'yellow' }
              ].map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 py-4 px-3 sm:px-6 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 relative ${
                    activeTab === id
                      ? `text-${color}-600`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
                  }`}
                >
                  {activeTab === id && (
                    <motion.div
                      layoutId="active-tab-indicator"
                      className={`absolute inset-0 bg-white shadow-md rounded-2xl border-2 border-${color}-100`}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon size={18} />
                    {label}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* === NỘI DUNG CÁC TAB (giữ nguyên, không thay đổi) === */}

                {/* Info Tab */}
                {activeTab === 'info' && (
                   <div className="space-y-6">
                     <motion.div 
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: 0.1, duration: 0.5 }}
                       className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-100 shadow-lg"
                     >
                       <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                         <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                           <BadgeInfo className="text-white" size={24} />
                         </div>
                         Giới thiệu
                       </h3>
                       <p className="text-gray-700 leading-relaxed text-base">
                         {doctor.introduction || 'Bác sĩ chưa cập nhật thông tin giới thiệu.'}
                       </p>
                     </motion.div>
                     
                     {doctor.experience && (
                       <motion.div 
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.2, duration: 0.5 }}
                         className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 border border-green-100 shadow-lg"
                       >
                         <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                           <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                             <Stethoscope className="text-white" size={24} />
                           </div>
                           Kinh nghiệm
                         </h3>
                         <p className="text-gray-700 leading-relaxed text-base">{doctor.experience}</p>
                       </motion.div>
                     )}
                   </div>
                 )}

                {/* Education Tab */}
                {activeTab === 'education' && (
                  <div className="space-y-8">
                    {doctor.Degrees && doctor.Degrees.length > 0 ? (
                      doctor.Degrees.map((degree, index) => (
                        <motion.div 
                          key={degree.id} 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="bg-gradient-to-r from-green-50 to-teal-50 rounded-3xl p-6 sm:p-8 border border-green-100 shadow-lg"
                        >
                          <div className="flex flex-col lg:flex-row items-start gap-8">
                            {degreeUrl && (
                              <div className="flex-shrink-0">
                                <img 
                                  src={degreeUrl} 
                                  alt="Bằng cấp" 
                                  className="w-full lg:w-40 h-48 object-cover rounded-2xl border-4 border-white shadow-xl"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                  <GraduationCap className="text-white" size={28} />
                                </div>
                                {degree.degree_type}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/70 rounded-xl p-4">
                                  <p className="text-sm text-gray-500 font-medium mb-1">Trường đại học</p>
                                  <p className="text-gray-900 font-semibold text-base">{degree.university}</p>
                                </div>
                                <div className="bg-white/70 rounded-xl p-4">
                                  <p className="text-sm text-gray-500 font-medium mb-1">Ngày tốt nghiệp</p>
                                  <p className="text-gray-900 font-semibold text-base">{formatDate(degree.graduation_date)}</p>
                                </div>
                                {degree.gpa && (
                                  <div className="bg-white/70 rounded-xl p-4 md:col-span-2">
                                    <p className="text-sm text-gray-500 font-medium mb-1">GPA</p>
                                    <p className="text-gray-900 font-semibold text-base">{degree.gpa}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <GraduationCap className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Chưa có thông tin học vấn</h3>
                        <p className="text-gray-400">Bác sĩ chưa cập nhật thông tin bằng cấp.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Certificates Tab */}
                {activeTab === 'certificates' && (
                  <div className="space-y-8">
                    {doctor.Certificates && doctor.Certificates.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {doctor.Certificates.map((cert, index) => (
                          <motion.div 
                            key={cert.id} 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-gradient-to-r from-purple-50 to-rose-50 rounded-3xl p-6 border border-purple-100 shadow-lg"
                          >
                            {certificateUrl && (
                              <div className="mb-4">
                                <img 
                                  src={certificateUrl} 
                                  alt="Chứng chỉ" 
                                  className="w-full h-64 object-cover rounded-2xl border-4 border-white shadow-xl"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              </div>
                            )}
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                                  <FileText className="text-white" size={24} />
                                </div>
                                Chứng chỉ
                              </h4>
                              <p className="text-gray-700 text-base">{cert.source}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FileText className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Chưa có chứng chỉ</h3>
                        <p className="text-gray-400">Bác sĩ chưa cập nhật thông tin chứng chỉ.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                   <div className="space-y-8">
                    {ratings.length > 0 ? (
                      <>
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1, duration: 0.5 }}
                          className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-3xl p-6 sm:p-8 border border-yellow-100 shadow-lg"
                        >
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <Star className="text-white fill-current" size={32} />
                              </div>
                              <div>
                                <div className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)} / 5</div>
                                <div className="text-gray-600">Dựa trên {ratings.length} đánh giá</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={24} 
                                  className={`${i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>

                        <div className="space-y-6">
                          {paginatedRatings.map((rating, index) => (
                            <motion.div 
                              key={rating.id} 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.5 }}
                              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                                    {rating.customer_name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900">{rating.customer_name}</p>
                                    <p className="text-gray-500 text-sm">{formatDate(rating.created_at)}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      size={16} 
                                      className={`${i < rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              {rating.comment && (
                                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                                  <p className="text-gray-700 italic">"{rating.comment}"</p>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>

                        {/* Pagination */}
                        {totalRatingPages > 1 && (
                          <div className="flex items-center justify-center gap-2 mt-8">
                            <button 
                              onClick={() => setCurrentRatingPage(p => Math.max(1, p - 1))}
                              disabled={currentRatingPage === 1}
                              className="p-3 rounded-full hover:bg-gray-100 disabled:opacity-50"
                            >
                              <ChevronLeft size={20} />
                            </button>
                            
                            {Array.from({ length: totalRatingPages }, (_, i) => i + 1).map(page => (
                              <button
                                key={page}
                                onClick={() => setCurrentRatingPage(page)}
                                className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                                  currentRatingPage === page 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'hover:bg-gray-100 text-gray-700'
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                            
                            <button 
                              onClick={() => setCurrentRatingPage(p => Math.min(totalRatingPages, p + 1))}
                              disabled={currentRatingPage === totalRatingPages}
                              className="p-3 rounded-full hover:bg-gray-100 disabled:opacity-50"
                            >
                              <ChevronRight size={20} />
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Star className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Chưa có đánh giá nào</h3>
                        <p className="text-gray-400">Hãy là người đầu tiên đánh giá bác sĩ này.</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Action Buttons (giữ nguyên thiết kế đẹp) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button 
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            onClick={() => router.push(`/bookingdoctor?specialization=${doctor.specialization_id}`)}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <Calendar size={24} />
            Đặt lịch khám ngay
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="px-8 py-4 bg-white text-gray-800 font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center gap-3"
          >
            <Heart size={24} className="text-pink-500" />
            Thêm vào yêu thích
          </motion.button>
        </div>
      </div>
    </div>
  );
}