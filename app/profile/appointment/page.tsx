// app/profile/appointment/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/page';
import { FaUserMd, FaCalendarAlt, FaClock, FaStar, FaCommentDots, FaExclamationTriangle } from 'react-icons/fa';

// 1. Giao diện (interface) được cập nhật để chứa thông tin đánh giá
interface Appointment {
  id: number;
  status: string;
  doctor_id: number;
  doctor_name: string;
  doctor_img: string | null;
  specialization_name: string;
  slot_date: string;
  start_time: string;
  // Các trường này có thể là null nếu lịch hẹn chưa được đánh giá
  rating?: number | null;
  comment?: string | null;
  rating_status?: 'pending' | 'approved' | 'rejected' | null;
}

// Định nghĩa kiểu dữ liệu cho dữ liệu đánh giá mới
interface ReviewData {
    rating: number;
    comment: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const STATUS_CONFIG: { [key: string]: { text: string; color: string } } = {
  'Chưa xác nhận': { text: 'Chưa xác nhận', color: 'bg-yellow-500' },
  'Đã xác nhận': { text: 'Đã xác nhận', color: 'bg-green-500' },
  'Đang khám': { text: 'Đang khám', color: 'bg-blue-500' },
  'Đã khám xong': { text: 'Đã khám xong', color: 'bg-gray-600' },
  'Đã hủy': { text: 'Đã hủy', color: 'bg-red-500' },
};

const TABS = ['Tất cả', 'Chưa xác nhận', 'Đã xác nhận', 'Đang khám', 'Đã khám xong', 'Đã hủy'];

// Component hiển thị các ngôi sao đánh giá (chỉ để xem)
const StarRatingDisplay: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`mr-1 text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

// 2. AppointmentCard được cập nhật để hiển thị đánh giá hoặc nút bấm
const AppointmentCard: React.FC<{
  appointment: Appointment;
  onReviewClick: (app: Appointment) => void;
  onCancelClick: (id: number) => void;
}> = ({ appointment, onReviewClick, onCancelClick }) => {
  const statusInfo = STATUS_CONFIG[appointment.status] || { text: appointment.status, color: 'bg-gray-400' };
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  const imageUrl = appointment.doctor_img ? `${API_BASE_URL}/uploads/${appointment.doctor_img}` : 'https://via.placeholder.com/150/007BFF/FFFFFF?text=Dr';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200">
      <div className="p-5">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div className="flex items-center space-x-4">
            <img src={imageUrl} alt={appointment.doctor_name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-200" onError={(e) => { 
              e.currentTarget.src = 'https://via.placeholder.com/150/007BFF/FFFFFF?text=Dr'; 
            }} />
            <div>
              <h3 className="text-lg font-bold text-gray-800">{appointment.doctor_name}</h3>
              <p className="text-sm text-gray-500">{appointment.specialization_name}</p>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${statusInfo.color}`}>{statusInfo.text}</span>
        </div>
        <div className="mt-4 border-t pt-4 space-y-2 text-gray-600">
          <div className="flex items-center"><FaCalendarAlt className="mr-2 text-blue-500" /><span>Ngày khám: <strong>{formatDate(appointment.slot_date)}</strong></span></div>
          <div className="flex items-center"><FaClock className="mr-2 text-blue-500" /><span>Giờ khám: <strong>{appointment.start_time.substring(0, 5)}</strong></span></div>
        </div>
        
        {/* --- LOGIC HIỂN THỊ CÓ ĐIỀU KIỆN --- */}
        <div className="mt-4 text-right space-x-3">
          {appointment.status === 'Chưa xác nhận' && (
            <button onClick={() => onCancelClick(appointment.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">Hủy lịch</button>
          )}
          {/* Chỉ hiển thị nút "Đánh giá" nếu lịch đã khám xong VÀ chưa có rating */}
          {appointment.status === 'Đã khám xong' && !appointment.rating && (
            <button onClick={() => onReviewClick(appointment)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Đánh giá</button>
          )}
        </div>
        
        {/* Hiển thị phần đánh giá nếu đã có `appointment.rating` */}
        {appointment.rating && (
          <div className="mt-4 border-t pt-4">
             <p className="font-semibold text-gray-700 mb-2">Đánh giá của bạn:</p>
             <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <StarRatingDisplay rating={appointment.rating} />
                {appointment.comment && (
                  <div className="flex items-start mt-3">
                    <FaCommentDots className="mr-2.5 mt-1 text-gray-400 flex-shrink-0" />
                    <p className="text-gray-700 italic">"{appointment.comment}"</p>
                  </div>
                )}
                
                {/* Hiển thị trạng thái duyệt */}
                {appointment.rating_status && (
                  <div className="mt-3">
                    {appointment.rating_status === 'pending' && (
                      <div className="flex items-center text-yellow-700 text-sm">
                        <FaClock className="mr-2" />
                        <span>Đang chờ admin duyệt</span>
                      </div>
                    )}
                    {appointment.rating_status === 'approved' && (
                      <div className="flex items-center text-green-700 text-sm">
                        <FaStar className="mr-2" />
                        <span>Đã được duyệt</span>
                      </div>
                    )}
                    {appointment.rating_status === 'rejected' && (
                      <div className="flex items-center text-red-700 text-sm">
                        <FaExclamationTriangle className="mr-2" />
                        <span>Bị từ chối - Vui lòng sửa lại</span>
                      </div>
                    )}
                  </div>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 3. ReviewModal được cập nhật để gọi callback `onSuccess` và xử lý lỗi từ ngữ thô tục
const ReviewModal: React.FC<{
  appointment: Appointment | null;
  onClose: () => void;
  onSuccess: (reviewData: ReviewData) => void;
  token: string | null;
  customerId: number | null;
}> = ({ appointment, onClose, onSuccess, token, customerId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profanityWords, setProfanityWords] = useState<string[]>([]);
  const [hasShownProfanityError, setHasShownProfanityError] = useState(false);

  // Hàm kiểm tra từ ngữ không phù hợp khi người dùng nhập
  const checkProfanityOnInput = (text: string) => {
    if (hasShownProfanityError) return; // Không kiểm tra nếu đã hiển thị lỗi
    
    // Danh sách từ ngữ không phù hợp (có thể mở rộng)
    const inappropriateWords = [
      'địt', 'đụ', 'đéo', 'đcm', 'đcmn', 'khốn', 'khốn nạn', 'đồ khốn', 'đồ chó', 'đồ chó má',
      'lồn', 'cặc', 'buồi', 'dái', 'đít', 'mẹ mày', 'cha mày', 'đồ ngu', 'đồ dốt'
    ];
    
    const foundWords = inappropriateWords.filter(word => 
      text.toLowerCase().includes(word.toLowerCase())
    );
    
    if (foundWords.length > 0 && !hasShownProfanityError) {
      setProfanityWords(foundWords);
      setError('Bình luận chứa từ ngữ không phù hợp. Vui lòng sửa lại.');
      setHasShownProfanityError(true);
    }
  };

  useEffect(() => { 
    if (appointment) { 
      setRating(0); 
      setComment(''); 
      setError(null);
      setProfanityWords([]);
      setHasShownProfanityError(false);
    } 
  }, [appointment]);
  
  if (!appointment) return null;

  const handleSubmit = async () => {
    if (rating === 0) { 
      setError('Vui lòng chọn số sao đánh giá.'); 
      return; 
    }
    if (!token || !customerId) { 
      setError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.'); 
      return; 
    }
    
    setIsSubmitting(true);
    setError(null);
    setProfanityWords([]);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ rating, comment, customer_id: customerId, doctor_id: appointment.doctor_id, appointment_id: appointment.id })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.errorType === 'profanity' && !hasShownProfanityError) {
          setProfanityWords(data.foundWords || []);
          setError(data.message || 'Bình luận chứa từ ngữ không phù hợp. Vui lòng sửa lại.');
          setHasShownProfanityError(true);
        } else if (data.errorType !== 'profanity') {
          setError(data.message || 'Gửi đánh giá thất bại.');
        }
        return;
      }
      
      alert('Cảm ơn bạn đã đánh giá! Đánh giá của bạn đang chờ admin duyệt.');
      onSuccess({ rating, comment });

    } catch (error: any) { 
      setError(`Lỗi: ${error.message}`);
    } finally { 
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Đánh giá buổi khám</h2>
        <p className="mb-2">Bác sĩ: <strong>{appointment.doctor_name}</strong></p>
        <p className="mb-4">Chuyên khoa: {appointment.specialization_name}</p>
        
        <div className="mb-4">
          <p className="font-semibold mb-2">Chất lượng dịch vụ:</p>
          <div className="flex space-x-2 text-3xl">
            {[1, 2, 3, 4, 5].map(star => (
              <FaStar 
                key={star} 
                className={`cursor-pointer ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`} 
                onClick={() => setRating(star)} 
              />
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="comment" className="block font-semibold mb-2">Chia sẻ cảm nhận:</label>
          <textarea 
            id="comment" 
            rows={4} 
            value={comment} 
            onChange={e => {
              const newValue = e.target.value;
              setComment(newValue);
              checkProfanityOnInput(newValue);
            }} 
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500" 
            placeholder="Bác sĩ nhiệt tình, dịch vụ tuyệt vời..." 
          />
        </div>

        {/* Hiển thị lỗi từ ngữ không phù hợp */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-red-700 text-sm font-medium">{error}</p>
                {profanityWords.length > 0 && (
                  <div className="mt-2">
                    <p className="text-red-600 text-xs font-semibold">Từ ngữ vi phạm:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profanityWords.map((word, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300" 
            disabled={isSubmitting}
          >
            Đóng
          </button>
          <button 
            onClick={handleSubmit} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. Component cha (AppointmentPage) quản lý state và xử lý cập nhật
export default function AppointmentPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const fetchAppointments = async () => {
    if (!token) { setIsLoading(false); setError("Bạn cần đăng nhập để xem lịch hẹn."); return; }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments/my-appointments`, { headers: { 'Authorization': `Bearer ${token}` } });
      
      if (!response.ok) { const err = await response.json(); throw new Error(err.message || 'Không thể tải dữ liệu.'); }
      const data = await response.json();
      
      setAllAppointments(data);
    } catch (err: any) { setError(err.message); } finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (!authLoading) { fetchAppointments(); }
  }, [token, authLoading]);

  const handleCancelAppointment = async (appointmentId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?")) return;
    if (!token) { alert("Phiên đăng nhập đã hết hạn."); return; }
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) { const err = await response.json(); throw new Error(err.message || "Hủy lịch hẹn thất bại."); }
      alert("Đã hủy lịch hẹn thành công.");
      setAllAppointments(prev => prev.map(app => app.id === appointmentId ? { ...app, status: 'Đã hủy' } : app));
    } catch (error: any) { alert(`Lỗi: ${error.message}`); }
  };

  const filteredAppointments = useMemo(() => {
    if (activeTab === 'Tất cả') return allAppointments;
    return allAppointments.filter(app => app.status === activeTab);
  }, [allAppointments, activeTab]);

  const handleReviewClick = (appointment: Appointment) => { setSelectedAppointment(appointment); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setSelectedAppointment(null); };

  // Hàm mới để xử lý việc cập nhật state sau khi đánh giá thành công
  const handleReviewSuccess = (reviewData: ReviewData) => {
    if (!selectedAppointment) return;

    // Cập nhật lại state `allAppointments`
    setAllAppointments(prevApps => 
      prevApps.map(app => 
        app.id === selectedAppointment.id 
          // Thêm thông tin đánh giá vào đúng lịch hẹn với trạng thái pending
          ? { ...app, rating: reviewData.rating, comment: reviewData.comment, rating_status: 'pending' } 
          : app
      )
    );
    
    // Đóng modal sau khi cập nhật thành công
    handleCloseModal();
  };

  const renderContent = () => {
    if (isLoading || authLoading) return <p className="text-center p-8 text-gray-600">Đang tải lịch khám...</p>;
    if (error) return <p className="text-red-500 text-center p-8">Lỗi: {error}</p>;
    if (filteredAppointments.length > 0) return filteredAppointments.map(app => <AppointmentCard key={app.id} appointment={app} onReviewClick={handleReviewClick} onCancelClick={handleCancelAppointment} />);
    return <div className="text-center py-10 bg-gray-50 rounded-lg"><p className="text-gray-500">Không có lịch hẹn nào trong mục này.</p></div>;
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Lịch khám của tôi</h1>
      <div className="mb-6 overflow-x-auto"><div className="flex border-b border-gray-200">{TABS.map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 md:px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>{tab}</button>))}</div></div>
      <div className="space-y-0">{renderContent()}</div>
      
      {/* Truyền hàm `handleReviewSuccess` vào `ReviewModal` qua prop `onSuccess` */}
      <ReviewModal 
        appointment={selectedAppointment} 
        onClose={handleCloseModal} 
        onSuccess={handleReviewSuccess}
        token={token} 
        customerId={user?.id ?? null} 
      />
    </div>
  );
}