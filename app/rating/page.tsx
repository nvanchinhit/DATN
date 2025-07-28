'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/page';
import { FaUserMd, FaCalendarAlt, FaClock, FaStar, FaCommentDots } from 'react-icons/fa';

// Định nghĩa kiểu dữ liệu cho một đánh giá
interface Rating {
  id: number;
  rating: number;
  comment: string;
  doctor_name: string;
  doctor_img: string | null;
  specialization_name: string;
  slot_date: string;
  start_time: string;
  created_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// Component để hiển thị các ngôi sao đánh giá (chỉ hiển thị)
const StarRatingDisplay: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`mr-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
      <span className="ml-2 text-sm font-semibold text-gray-600">({rating}/5)</span>
    </div>
  );
};


// Component card để hiển thị thông tin chi tiết một đánh giá
const RatingCard: React.FC<{ rating: Rating }> = ({ rating }) => {
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const formatReviewDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200">
      <div className="p-5">
        <div className="flex justify-between items-start flex-wrap gap-2 mb-4">
          <div className="flex items-center space-x-4">
            <img
              src={rating.doctor_img ? `${API_BASE_URL}${rating.doctor_img}` : 'https://via.placeholder.com/150/007BFF/FFFFFF?text=Dr'}
              alt={rating.doctor_name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150/007BFF/FFFFFF?text=Dr'; }}
            />
            <div>
              <h3 className="text-lg font-bold text-gray-800">{rating.doctor_name}</h3>
              <p className="text-sm text-gray-500">{rating.specialization_name}</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">Đã đánh giá ngày: {formatReviewDate(rating.created_at)}</span>
        </div>
        
        <div className="border-t pt-4 space-y-3">
          <div className="text-gray-600 space-y-2">
            <div className="flex items-center"><FaCalendarAlt className="mr-2 text-blue-500" /><span>Ngày khám: <strong>{formatDate(rating.slot_date)}</strong></span></div>
            <div className="flex items-center"><FaClock className="mr-2 text-blue-500" /><span>Giờ khám: <strong>{rating.start_time.substring(0, 5)}</strong></span></div>
          </div>
          
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold text-gray-700 mb-2">Đánh giá của bạn:</p>
            <StarRatingDisplay rating={rating.rating} />
            {rating.comment && (
              <div className="flex items-start mt-3">
                <FaCommentDots className="mr-2 mt-1 text-gray-400" />
                <p className="text-gray-600 italic">"{rating.comment}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// Component chính của trang
export default function MyRatingsPage() {
  const { token, loading: authLoading } = useAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Chỉ fetch dữ liệu khi đã có token. [1, 2, 4]
    const fetchRatings = async () => {
      if (!token) {
        setIsLoading(false);
        setError("Bạn cần đăng nhập để xem các đánh giá của mình.");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/ratings/my-ratings`, {
          headers: { 'Authorization': `Bearer ${token}` } // Gửi token để xác thực. [5, 11]
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || 'Không thể tải dữ liệu đánh giá.');
        }
        const data = await response.json();
        setRatings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchRatings();
    }
  }, [token, authLoading]);

  // Render nội dung dựa trên trạng thái loading, error, hoặc dữ liệu
  const renderContent = () => {
    if (isLoading || authLoading) {
      return <p className="text-center p-8 text-gray-600">Đang tải các đánh giá của bạn...</p>;
    }
    if (error) {
      return <p className="text-red-500 text-center p-8">Lỗi: {error}</p>;
    }
    if (ratings.length > 0) {
      return ratings.map(rating => <RatingCard key={rating.id} rating={rating} />);
    }
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <FaStar className="mx-auto text-4xl text-gray-300 mb-4" />
        <p className="text-gray-500">Bạn chưa có đánh giá nào.</p>
        <p className="text-sm text-gray-400 mt-2">Sau mỗi buổi khám, hãy quay lại để chia sẻ cảm nhận của bạn nhé!</p>
      </div>
    );
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Đánh giá của tôi</h1>
      <div className="space-y-0">
        {renderContent()}
      </div>
    </div>
  );
}