'use client';

import { useEffect, useState } from 'react';

interface Rating {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  doctor_name: string;
  doctor_img?: string;
  specialization_name: string;
  slot_date: string;
  start_time: string;
  customer_name: string;
}

export default function AdminRatingsPage() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterStar, setFilterStar] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');

  // Fetch all ratings
  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/ratings/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Lỗi khi lấy danh sách bình luận');
        const data = await res.json();
        setRatings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, []);

  // Xóa bình luận
  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/ratings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Lỗi khi xóa bình luận');
      setRatings(ratings.filter(r => r.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Mở modal sửa
  const openEditModal = (rating: Rating) => {
    setEditId(rating.id);
    setEditComment(rating.comment || '');
    setEditRating(rating.rating);
    setModalOpen(true);
  };

  // Sửa bình luận
  const handleEdit = async () => {
    if (!editId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/ratings/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: editRating, comment: editComment })
      });
      if (!res.ok) throw new Error('Lỗi khi cập nhật bình luận');
      setRatings(ratings.map(r => r.id === editId ? { ...r, rating: editRating, comment: editComment } : r));
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Lọc và tìm kiếm
  const filteredRatings = ratings.filter(r => {
    const matchStar = filterStar ? r.rating === filterStar : true;
    const matchText = searchText.trim() === '' ? true : (
      r.comment.toLowerCase().includes(searchText.toLowerCase()) ||
      r.customer_name.toLowerCase().includes(searchText.toLowerCase()) ||
      r.doctor_name.toLowerCase().includes(searchText.toLowerCase())
    );
    return matchStar && matchText;
  });

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Quản lý bình luận/đánh giá người dùng</h1>
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <label className="flex items-center gap-2">
          <span>Lọc theo số sao:</span>
          <select value={filterStar ?? ''} onChange={e => setFilterStar(e.target.value ? Number(e.target.value) : null)} className="border p-1 rounded">
            <option value="">Tất cả</option>
            {[1,2,3,4,5].map(star => <option key={star} value={star}>{star} ⭐</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span>Tìm kiếm:</span>
          <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Nhập từ khóa..." className="border p-1 rounded" />
        </label>
        {(filterStar || searchText) && (
          <button className="ml-2 px-3 py-1 bg-gray-200 rounded" onClick={() => { setFilterStar(null); setSearchText(''); }}>Xóa lọc</button>
        )}
      </div>
      {loading ? <p>Đang tải...</p> : error ? <p className="text-red-500">{error}</p> : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Người dùng</th>
              <th className="border px-2 py-1">Bác sĩ</th>
              <th className="border px-2 py-1">Chuyên khoa</th>
              <th className="border px-2 py-1">Ngày khám</th>
              <th className="border px-2 py-1">Số sao</th>
              <th className="border px-2 py-1">Bình luận</th>
              <th className="border px-2 py-1">Thời gian</th>
              <th className="border px-2 py-1">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredRatings.map(r => (
              <tr key={r.id}>
                <td className="border px-2 py-1">{r.id}</td>
                <td className="border px-2 py-1">{r.customer_name}</td>
                <td className="border px-2 py-1">{r.doctor_name}</td>
                <td className="border px-2 py-1">{r.specialization_name}</td>
                <td className="border px-2 py-1">{r.slot_date} {r.start_time}</td>
                <td className="border px-2 py-1">{r.rating} ⭐</td>
                <td className="border px-2 py-1">{r.comment}</td>
                <td className="border px-2 py-1">{new Date(r.created_at).toLocaleString()}</td>
                <td className="border px-2 py-1">
                  <button className="text-blue-600 mr-2 underline" onClick={() => openEditModal(r)}>Sửa</button>
                  <button className="text-red-600 underline" onClick={() => handleDelete(r.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Modal sửa bình luận */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Sửa bình luận</h2>
            <label className="block mb-2">Số sao:
              <input type="number" min={1} max={5} value={editRating} onChange={e => setEditRating(Number(e.target.value))} className="border p-1 ml-2 w-16" />
            </label>
            <label className="block mb-2">Bình luận:
              <textarea value={editComment} onChange={e => setEditComment(e.target.value)} className="border p-2 w-full mt-1" rows={3} />
            </label>
            <div className="flex justify-end space-x-2 mt-4">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setModalOpen(false)}>Hủy</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleEdit}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}