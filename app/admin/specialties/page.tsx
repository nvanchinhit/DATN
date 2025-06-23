'use client';

import { useEffect, useState, FormEvent } from 'react';
import { PlusCircle, Edit, Trash2, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface Specialization {
  id: number;
  name: string;
  image: string;
}

const API_BASE_URL = 'http://localhost:5000';

export default function SpecialtiesAdminPage() {
  const [specialties, setSpecialties] = useState<Specialization[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formIsLoading, setFormIsLoading] = useState(false);
  const [currentSpecialization, setCurrentSpecialization] = useState<Partial<Specialization> | null>(null);

  const fetchSpecialties = async (term: string) => {
    setLoading(true);
    try {
      const url = term
        ? `${API_BASE_URL}/api/specializations?search=${encodeURIComponent(term)}`
        : `${API_BASE_URL}/api/specializations`;
      const res = await fetch(url);
      const data = await res.json();
      setSpecialties(data);
    } catch (err) {
      console.error('Lỗi fetch:', err);
      setSpecialties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties('');
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchSpecialties(searchTerm);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleOpenModal = (sp: Partial<Specialization> | null = null) => {
    setCurrentSpecialization(sp || {});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSpecialization(null);
  };

  const handleSubmitForm = async (formData: FormData) => {
    setFormIsLoading(true);
    const isEdit = !!currentSpecialization?.id;
    const url = isEdit
      ? `${API_BASE_URL}/api/specializations/${currentSpecialization.id}`
      : `${API_BASE_URL}/api/specializations`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Thao tác thất bại.');
      }
      alert('✅ Thao tác thành công!');
      handleCloseModal();
      fetchSpecialties(searchTerm);
    } catch (err: any) {
      alert(`❌ Lỗi: ${err.message}`);
    } finally {
      setFormIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa chuyên khoa này không?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/specializations/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Xóa thất bại.');
      }
      alert('🗑️ Xóa thành công!');
      fetchSpecialties(searchTerm);
    } catch (err: any) {
      alert(`❌ Lỗi: ${err.message}`);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">🩺 Quản lý chuyên khoa</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} />
          Thêm mới
        </button>
      </div>

      <div className="relative w-full max-w-sm mb-6">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Tìm kiếm chuyên khoa..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-blue-500">Đang tải dữ liệu...</p>
      ) : specialties.length === 0 ? (
        <p className="text-gray-500">Không tìm thấy chuyên khoa nào.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Tên</th>
              <th className="px-4 py-2 text-left">Ảnh</th>
              <th className="px-4 py-2 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {specialties.map((sp) => (
              <tr key={sp.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-2">{sp.id}</td>
                <td className="px-4 py-2 font-semibold text-gray-800">{sp.name}</td>
                <td className="px-4 py-2">
                  <img
                    src={`${API_BASE_URL}${sp.image}`}
                    alt={sp.name}
                    className="w-20 h-12 object-cover rounded border"
                  />
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => handleOpenModal(sp)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(sp.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <SpecializationForm
          initialData={currentSpecialization!}
          onSubmit={handleSubmitForm}
          onCancel={handleCloseModal}
          isLoading={formIsLoading}
        />
      )}
    </div>
  );
}

// =========================== FORM =============================
function SpecializationForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: {
  initialData: Partial<Specialization>;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState(initialData.name || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initialData.image ? `${API_BASE_URL}${initialData.image}` : null
  );

  useEffect(() => {
    if (!selectedFile) return;
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || (!selectedFile && !initialData.id)) {
      alert('Vui lòng nhập tên và chọn ảnh.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData.id ? 'Sửa chuyên khoa' : 'Thêm chuyên khoa'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Tên chuyên khoa</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Hình ảnh</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
              className="w-full"
            />
            {preview && (
              <img src={preview} alt="Xem trước" className="mt-2 w-full h-32 object-cover rounded border" />
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onCancel} disabled={isLoading} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
              Hủy
            </button>
            <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
