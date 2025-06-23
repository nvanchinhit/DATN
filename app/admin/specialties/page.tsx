// File: app/admin/specialties/page.tsx

'use client';

import { useState, useEffect, FormEvent, useCallback } from 'react';
import { PlusCircle, Edit, Trash2, X, Image as ImageIcon, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000'; 

interface Specialization {
  id: number;
  name: string;
  image: string;
}

// -----------------------------------------------------------------------------
// Component Form
// -----------------------------------------------------------------------------
const SpecializationForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: {
  initialData: Partial<Specialization>;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [name, setName] = useState(initialData.name || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialData.image ? `${API_BASE_URL}${initialData.image}` : null);

  useEffect(() => {
    if (!selectedFile) return;
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (!name || (!selectedFile && !initialData.id)) {
      alert('Vui lòng nhập tên chuyên khoa và chọn một hình ảnh.');
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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md animate-fade-in-up">
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{initialData.id ? 'Sửa Chuyên khoa' : 'Thêm Chuyên khoa mới'}</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-800 transition-colors">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên chuyên khoa</label>
            <input
              id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
            <input
              id="image" type="file" accept="image/png, image/jpeg, image/webp"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {preview && <img src={preview} alt="Xem trước" className="mt-4 h-32 w-auto object-cover rounded-md border"/>}
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onCancel} disabled={isLoading} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50">Hủy</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Component trang quản lý chính
// -----------------------------------------------------------------------------
export default function ManageSpecializationsPage() {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formIsLoading, setFormIsLoading] = useState(false);
  const [currentSpecialization, setCurrentSpecialization] = useState<Partial<Specialization> | null>(null);

  const fetchSpecializations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/specializations`);
      if (!response.ok) throw new Error('Không thể tải dữ liệu chuyên khoa.');
      const data: Specialization[] = await response.json();
      setSpecializations(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpecializations();
  }, [fetchSpecializations]);

  const handleOpenModal = (spec: Partial<Specialization> | null = null) => {
    setCurrentSpecialization(spec || {});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentSpecialization(null);
    setIsModalOpen(false);
  };

  const handleSubmitForm = async (formData: FormData) => {
    setFormIsLoading(true);
    const isEditing = !!currentSpecialization?.id;
    const url = isEditing
      ? `${API_BASE_URL}/api/specializations/${currentSpecialization.id}`
      : `${API_BASE_URL}/api/specializations`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Thao tác thất bại.');
      }
      
      alert(`Thao tác thành công!`);
      handleCloseModal();
      await fetchSpecializations();
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    } finally {
      setFormIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chuyên khoa này?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/specializations/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Xóa thất bại.');
      }
      alert('Xóa thành công!');
      await fetchSpecializations();
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    }
  };


  if (loading) return <div className="p-8 text-center text-lg">Đang tải danh sách chuyên khoa...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Lỗi: {error}</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Chuyên khoa</h1>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={20} />
            Thêm mới
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hình ảnh</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tên chuyên khoa</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {specializations.length > 0 ? (
                specializations.map((spec) => (
                  <tr key={spec.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{spec.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {spec.image ? (
                          <img src={`${API_BASE_URL}${spec.image}`} alt={spec.name} className="w-24 h-14 object-cover rounded-md bg-gray-100"/>
                      ) : (
                          <div className="w-24 h-14 bg-gray-100 flex items-center justify-center rounded-md"><ImageIcon size={24} className="text-gray-400"/></div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{spec.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleOpenModal(spec)} className="text-indigo-600 hover:text-indigo-900 mr-4" title="Sửa"><Edit size={18}/></button>
                      <button onClick={() => handleDelete(spec.id)} className="text-red-600 hover:text-red-900" title="Xóa"><Trash2 size={18}/></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Không có chuyên khoa nào. Hãy thêm một chuyên khoa mới.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && <SpecializationForm initialData={currentSpecialization!} onSubmit={handleSubmitForm} onCancel={handleCloseModal} isLoading={formIsLoading} />}
    </div>
  );
}