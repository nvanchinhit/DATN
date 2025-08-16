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

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

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

const getImageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  // Xử lý đường dẫn ảnh từ backend
  if (path.startsWith('/uploads/')) {
    return `${API_URL}${path}`;
  }
  return `${API_URL}/uploads/${path}`;
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('vi-VN');
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
      try {
        setLoading(true);
        setError(null);
        
        // Fetch doctor details
        const doctorRes = await fetch(`${API_URL}/api/doctors/${doctorId}`);
        if (!doctorRes.ok) {
          throw new Error('Không thể tải thông tin bác sĩ');
        }
        const doctorData = await doctorRes.json();
        console.log('Doctor data:', doctorData); // Debug log
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

    if (doctorId) {
      fetchDoctorDetails();
    }
  }, [doctorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Đang tải thông tin bác sĩ...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không thể tải thông tin</h2>
          <p className="text-red-600 font-medium mb-6">{error || 'Không tìm thấy bác sĩ'}</p>
          <button 
            onClick={() => router.back()} 
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="inline mr-2 h-5 w-5" />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header với gradient đẹp */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-blue-100 hover:text-white transition-colors duration-200 mb-4 group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Quay lại</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Doctor Header Card với thiết kế mới */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-gray-100">
          <div className="relative h-80 md:h-96">
            <img 
              src={avatarUrl} 
              alt={doctor.name} 
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                e.currentTarget.src = '/default-avatar.png';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            {/* Floating rating badge */}
            {averageRating > 0 && (
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={18} 
                        className={`${star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">({ratings.length} đánh giá)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Doctor info overlay */}
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <div className="mb-4">
                <span className="inline-block bg-blue-500/90 backdrop-blur-sm text-blue-100 px-4 py-2 rounded-full text-sm font-medium mb-3">
                  {doctor.specialty_name}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">{doctor.name}</h1>
              {doctor.introduction && (
                <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
                  {doctor.introduction}
                </p>
              )}
            </div>
          </div>
          
          {/* Contact info section */}
          <div className="p-8 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {doctor.room_number && (
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Phòng khám</p>
                    <p className="text-lg font-semibold text-gray-900">{doctor.room_number}</p>
                  </div>
                </div>
              )}
              {doctor.phone && (
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Điện thoại</p>
                    <p className="text-lg font-semibold text-gray-900">{doctor.phone}</p>
                  </div>
                </div>
              )}
              {doctor.email && (
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Mail className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <p className="text-lg font-semibold text-gray-900">{doctor.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs với thiết kế mới */}
        <div className="bg-white rounded-3xl shadow-xl mb-8 border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <nav className="flex space-x-1 p-2">
              {[
                { id: 'info', label: 'Thông tin', icon: BadgeInfo, color: 'blue' },
                { id: 'education', label: 'Học vấn', icon: GraduationCap, color: 'green' },
                { id: 'certificates', label: 'Chứng chỉ', icon: FileText, color: 'purple' },
                { id: 'reviews', label: 'Đánh giá', icon: Star, color: 'yellow' }
              ].map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 py-4 px-6 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                    activeTab === id
                      ? `bg-white text-${color}-600 shadow-lg border border-${color}-200`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Info Tab */}
                {activeTab === 'info' && (
                  <div className="space-y-8">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                        <BadgeInfo className="text-blue-600" size={24} />
                        Giới thiệu
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {doctor.introduction || 'Bác sĩ chưa cập nhật thông tin giới thiệu.'}
                      </p>
                    </div>
                    
                    {doctor.experience && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                          <Stethoscope className="text-green-600" size={24} />
                          Kinh nghiệm
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-lg">{doctor.experience}</p>
                      </div>
                    )}

                    {doctor.price && doctor.price > 0 && (
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                          <Calendar className="text-emerald-600" size={24} />
                          Phí khám
                        </h3>
                        <div className="text-center">
                          <p className="text-4xl font-bold text-emerald-600 mb-2">
                            {doctor.price.toLocaleString('vi-VN')} VNĐ
                          </p>
                          <p className="text-gray-600 text-lg">/lần khám</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Education Tab */}
                {activeTab === 'education' && (
                  <div className="space-y-6">
                    {doctor.Degrees && doctor.Degrees.length > 0 ? (
                      doctor.Degrees.map((degree, index) => (
                        <div key={degree.id} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                          <div className="flex flex-col lg:flex-row items-start gap-6">
                            {degreeUrl && (
                              <div className="flex-shrink-0">
                                <img 
                                  src={degreeUrl} 
                                  alt="Bằng cấp" 
                                  className="w-32 h-40 object-cover rounded-xl border-4 border-white shadow-lg"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <GraduationCap className="text-green-600" size={28} />
                                {degree.degree_type}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/70 rounded-xl p-4">
                                  <p className="text-sm text-gray-500 font-medium mb-1">Trường đại học</p>
                                  <p className="text-gray-900 font-semibold">{degree.university}</p>
                                </div>
                                <div className="bg-white/70 rounded-xl p-4">
                                  <p className="text-sm text-gray-500 font-medium mb-1">Ngày tốt nghiệp</p>
                                  <p className="text-gray-900 font-semibold">{formatDate(degree.graduation_date)}</p>
                                </div>
                                {degree.gpa && (
                                  <div className="bg-white/70 rounded-xl p-4">
                                    <p className="text-sm text-gray-500 font-medium mb-1">GPA</p>
                                    <p className="text-gray-900 font-semibold">{degree.gpa}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16 text-gray-500">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <GraduationCap className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Chưa có thông tin học vấn</h3>
                        <p className="text-gray-400">Bác sĩ chưa cập nhật thông tin bằng cấp</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Certificates Tab */}
                {activeTab === 'certificates' && (
                  <div className="space-y-6">
                    {doctor.Certificates && doctor.Certificates.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {doctor.Certificates.map((cert) => (
                          <div key={cert.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                            {certificateUrl && (
                              <div className="mb-4">
                                <img 
                                  src={certificateUrl} 
                                  alt="Chứng chỉ" 
                                  className="w-full h-64 object-cover rounded-xl border-4 border-white shadow-lg"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                                <FileText className="text-purple-600" size={24} />
                                Chứng chỉ
                              </h4>
                              <p className="text-gray-700">{cert.source}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 text-gray-500">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FileText className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Chưa có chứng chỉ</h3>
                        <p className="text-gray-400">Bác sĩ chưa cập nhật thông tin chứng chỉ</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {ratings.length > 0 ? (
                      <>
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Star className="text-yellow-600 fill-current" size={32} />
                              </div>
                              <div>
                                <div className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                                <div className="text-gray-600">({ratings.length} đánh giá)</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500 mb-1">Đánh giá trung bình</div>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    size={20} 
                                    className={`${star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {paginatedRatings.map((rating) => (
                            <div key={rating.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {rating.customer_name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900 text-lg">{rating.customer_name}</p>
                                    <p className="text-gray-500">{formatDate(rating.created_at)}</p>
                                  </div>
                                </div>
                                <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-full">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      size={16} 
                                      className={`${star <= rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    />
                                  ))}
                                  <span className="ml-2 text-sm font-semibold text-gray-700">{rating.rating}/5</span>
                                </div>
                              </div>
                              {rating.comment && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                  <p className="text-gray-700 leading-relaxed italic">"{rating.comment}"</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Pagination với thiết kế mới */}
                        {totalRatingPages > 1 && (
                          <div className="flex items-center justify-center gap-2 mt-8">
                            <button 
                              onClick={() => setCurrentRatingPage(p => Math.max(1, p - 1))}
                              disabled={currentRatingPage === 1}
                              className="p-3 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              <ChevronLeft size={20} />
                            </button>
                            
                            {Array.from({ length: totalRatingPages }, (_, i) => i + 1).map(page => (
                              <button
                                key={page}
                                onClick={() => setCurrentRatingPage(page)}
                                className={`w-12 h-12 rounded-xl text-sm font-medium transition-all duration-200 ${
                                  currentRatingPage === page 
                                    ? 'bg-blue-600 text-white shadow-lg scale-110' 
                                    : 'hover:bg-gray-100 text-gray-700'
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                            
                            <button 
                              onClick={() => setCurrentRatingPage(p => Math.min(totalRatingPages, p + 1))}
                              disabled={currentRatingPage === totalRatingPages}
                              className="p-3 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              <ChevronRight size={20} />
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-16 text-gray-500">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Star className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Chưa có đánh giá nào</h3>
                        <p className="text-gray-400">Hãy là người đầu tiên đánh giá bác sĩ này</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Action Buttons với thiết kế mới */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => router.push(`/bookingdoctor?specialization=${doctor.specialization_id}`)}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <Calendar size={24} />
            Đặt lịch khám ngay
          </button>
          <button 
            className="px-10 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg rounded-2xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <Heart size={24} />
            Thêm vào yêu thích
          </button>
        </div>
      </div>
    </div>
  );
}
