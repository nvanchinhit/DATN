'use client';
import { useState, useEffect } from 'react';

export default function AddDoctorPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specializationId, setSpecializationId] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Lấy danh sách chuyên khoa
  useEffect(() => {
  fetch('http://localhost:5000/api/specializations')
    .then((res) => res.json())
    .then((data) => setSpecializations(data))
    .catch(() => setMsg('Không thể tải danh sách chuyên khoa.'));
}, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const res = await fetch('http://localhost:5000/api/doctors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, specialization_id: specializationId }),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg(data.msg);
        setName('');
        setEmail('');
        setSpecializationId('');
      } else {
        setMsg(data.msg || 'Có lỗi xảy ra.');
      }
    } catch (err) {
      setMsg('Lỗi kết nối server!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow p-6 rounded">
      <h2 className="text-xl font-bold mb-4">Thêm tài khoản bác sĩ</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Tên bác sĩ</label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 font-medium">Chuyên khoa</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={specializationId}
          onChange={(e) => setSpecializationId(e.target.value)}
          required
        >
          <option value="">-- Chọn chuyên khoa --</option>
          {specializations.map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
        </button>
      </form>
      {msg && <p className="mt-4 text-center text-sm text-green-600">{msg}</p>}
    </div>
  );
}
