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
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminRatingsPage() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStar, setFilterStar] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');

  // Fetch all ratings
  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/ratings/all`, {
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
      const res = await fetch(`${API_URL}/api/ratings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Lỗi khi xóa bình luận');
      setRatings(ratings.filter(r => r.id !== id));
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
                  <button className="text-red-600 underline" onClick={() => handleDelete(r.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}