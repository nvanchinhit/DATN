'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/page';
import { FaStar, FaCheckCircle, FaTimesCircle, FaClock, FaEye, FaTrash } from 'react-icons/fa';

interface Rating {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  doctor_name: string;
  doctor_img: string | null;
  specialization_name: string;
  slot_date: string;
  start_time: string;
  customer_name: string;
  customer_email: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// Component hiển thị các ngôi sao đánh giá
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

// Component hiển thị trạng thái đánh giá
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    pending: { text: 'Chờ duyệt', color: 'bg-yellow-500', icon: FaClock },
    approved: { text: 'Đã duyệt', color: 'bg-green-500', icon: FaCheckCircle },
    rejected: { text: 'Bị từ chối', color: 'bg-red-500', icon: FaTimesCircle }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold text-white rounded-full ${config.color}`}>
      <Icon className="mr-1" />
      {config.text}
    </span>
  );
};

// Component modal xem chi tiết đánh giá
const RatingDetailModal: React.FC<{
  rating: Rating | null;
  onClose: () => void;
}> = ({ rating, onClose }) => {
  if (!rating) return null;

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const formatReviewDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Chi tiết đánh giá</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimesCircle className="text-xl" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Thông tin bác sĩ */}
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
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

          {/* Thông tin lịch hẹn */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Thông tin lịch hẹn:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium">Ngày khám:</span> {formatDate(rating.slot_date)}</div>
              <div><span className="font-medium">Giờ khám:</span> {rating.start_time.substring(0, 5)}</div>
            </div>
          </div>

          {/* Thông tin khách hàng */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Thông tin khách hàng:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium">Tên:</span> {rating.customer_name}</div>
              <div><span className="font-medium">Email:</span> {rating.customer_email}</div>
            </div>
          </div>

          {/* Đánh giá */}
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Đánh giá:</h4>
            <div className="mb-3">
              <StarRatingDisplay rating={rating.rating} />
            </div>
            {rating.comment && (
              <div>
                <p className="font-medium text-gray-700 mb-1">Bình luận:</p>
                <p className="text-gray-600 italic bg-white p-3 rounded border">"{rating.comment}"</p>
              </div>
            )}
          </div>

          {/* Thông tin hệ thống */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Thông tin hệ thống:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium">Trạng thái:</span> <StatusBadge status={rating.status} /></div>
              <div><span className="font-medium">Ngày đánh giá:</span> {formatReviewDate(rating.created_at)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminRatingsPage() {
  const { token, loading: authLoading } = useAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    if (!authLoading && token) {
      fetchRatings();
    }
  }, [token, authLoading]);

  const fetchRatings = async () => {
    if (!token) {
      setIsLoading(false);
      setError("Bạn cần đăng nhập để xem danh sách đánh giá.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/ratings/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
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

  const handleApproveRating = async (ratingId: number, status: 'approved' | 'rejected') => {
    if (!token) {
      alert("Phiên đăng nhập đã hết hạn.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/ratings/${ratingId}/approve`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Cập nhật trạng thái thất bại.');
      }

      const data = await response.json();
      alert(data.message);
      
      // Cập nhật state
      setRatings(prev => 
        prev.map(rating => 
          rating.id === ratingId 
            ? { ...rating, status } 
            : rating
        )
      );
    } catch (error: any) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  const handleDeleteRating = async (ratingId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) return;
    if (!token) {
      alert("Phiên đăng nhập đã hết hạn.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/ratings/${ratingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Xóa đánh giá thất bại.');
      }

      alert("Đã xóa đánh giá thành công.");
      
      // Cập nhật state
      setRatings(prev => prev.filter(rating => rating.id !== ratingId));
    } catch (error: any) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  const handleViewDetail = (rating: Rating) => {
    setSelectedRating(rating);
    setIsDetailModalOpen(true);
  };

  const filteredRatings = ratings.filter(rating => {
    if (filterStatus === 'all') return true;
    return rating.status === filterStatus;
  });

  const renderContent = () => {
    if (isLoading || authLoading) {
      return <p className="text-center p-8 text-gray-600">Đang tải danh sách đánh giá...</p>;
    }
    
    if (error) {
      return <p className="text-red-500 text-center p-8">Lỗi: {error}</p>;
    }
    
    if (filteredRatings.length === 0) {
      return (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <FaStar className="mx-auto text-4xl text-gray-300 mb-4" />
          <p className="text-gray-500">Không có đánh giá nào trong mục này.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bác sĩ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đánh giá</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xét duyệt</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRatings.map((rating) => (
              <tr key={rating.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{rating.customer_name}</div>
                    <div className="text-sm text-gray-500">{rating.customer_email}</div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={rating.doctor_img ? `${API_BASE_URL}${rating.doctor_img}` : 'https://via.placeholder.com/150/007BFF/FFFFFF?text=Dr'}
                      alt={rating.doctor_name}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150/007BFF/FFFFFF?text=Dr'; }}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rating.doctor_name}</div>
                      <div className="text-sm text-gray-500">{rating.specialization_name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div>
                    <StarRatingDisplay rating={rating.rating} />
                    {rating.comment && (
                      <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                        "{rating.comment}"
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusBadge status={rating.status} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(rating.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  {rating.status === 'pending' ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveRating(rating.id, 'approved')}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                        title="Duyệt"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleApproveRating(rating.id, 'rejected')}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                        title="Từ chối"
                      >
                        Từ chối
                      </button>
                    </div>
                  ) : (
                    <span className={`px-2 py-1 text-xs rounded ${
                      rating.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {rating.status === 'approved' ? 'Đã duyệt' : 'Đã từ chối'}
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetail(rating)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Xem chi tiết"
                    >
                      <FaEye />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteRating(rating.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Xóa"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Quản lý đánh giá</h1>
        <button
          onClick={fetchRatings}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Làm mới
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {[
            { value: 'all', label: 'Tất cả' },
            { value: 'pending', label: 'Chờ duyệt' },
            { value: 'approved', label: 'Đã duyệt' },
            { value: 'rejected', label: 'Bị từ chối' }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value as any)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === filter.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Nội dung */}
      {renderContent()}

      {/* Modal chi tiết */}
      <RatingDetailModal
        rating={selectedRating}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRating(null);
        }}
      />
    </div>
  );
}