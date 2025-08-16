'use client';

import { useState, useEffect, useMemo, useCallback, FormEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Edit, Trash2, X, Image as ImageIcon, Loader2, AlertTriangle, Search } from 'lucide-react';

// --- ĐÃ SỬA: Sử dụng đúng biến môi trường ---
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

interface Specialization {
  id: number;
  name: string;
  image: string;
  price: number;
}

// === Component Modal Thêm/Sửa Chuyên Khoa ===
const SpecialtyModal = ({
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
  const [price, setPrice] = useState(initialData.price?.toString() || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialData.image ? `${API_URL}${initialData.image}` : null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedFile) return;
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Vui lòng nhập tên chuyên khoa.');
      return;
    }
    if (!preview) {
        setError('Vui lòng chọn hình ảnh cho chuyên khoa.');
        return;
    }
    if (price && isNaN(parseFloat(price))) {
      setError('Giá khám phải là số hợp lệ.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price || '0');
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData.id ? 'Chỉnh sửa Chuyên khoa' : 'Thêm Chuyên khoa mới'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên chuyên khoa</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá khám (VNĐ)</label>
            <input
              type="number"
              min="0"
              step="1000"
              placeholder="Nhập giá khám..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hình ảnh</label>
            <div className="mt-2 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {preview ? (
                   <img src={preview} alt="Xem trước" className="mx-auto h-24 w-auto rounded-md object-cover" />
                ) : (
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Tải lên một tệp</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => { if (e.target.files) setSelectedFile(e.target.files[0]); }}/>
                  </label>
                  <p className="pl-1">hoặc kéo và thả</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 2MB</p>
              </div>
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onCancel} disabled={isLoading} className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-200 transition">Hủy</button>
            <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Lưu
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};


// === Component Modal Xác nhận Xóa ===
const DeleteConfirmationModal = ({ onConfirm, onCancel, isLoading }: { onConfirm: () => void; onCancel: () => void; isLoading: boolean; }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onCancel}>
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm"
            onClick={e => e.stopPropagation()}
        >
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mt-3">Xác nhận xóa</h3>
                <div className="mt-2">
                    <p className="text-sm text-gray-500">Bạn có chắc chắn muốn xóa chuyên khoa này? Hành động này không thể được hoàn tác.</p>
                </div>
            </div>
            <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3">
                <button type="button" onClick={onCancel} disabled={isLoading} className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50">Hủy</button>
                <button type="button" onClick={onConfirm} disabled={isLoading} className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700">
                   {isLoading ? <Loader2 className="h-5 w-5 animate-spin"/> : 'Xóa'}
                </button>
            </div>
        </motion.div>
    </div>
);

// === Component Trang Chính ===
export default function SpecialtiesAdminPage() {
  const [specialties, setSpecialties] = useState<Specialization[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formIsLoading, setFormIsLoading] = useState(false);
  const [currentSpecialization, setCurrentSpecialization] = useState<Partial<Specialization> | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchSpecialties = useCallback(async (term: string) => {
    setLoading(true);
    try {
      const url = term ? `${API_URL}/api/specializations?search=${encodeURIComponent(term)}` : `${API_URL}/api/specializations`;
      console.log('Fetching specialties from:', url);
      const res = await fetch(url);
      if(!res.ok) throw new Error("Lỗi mạng hoặc server.");
      const data = await res.json();
      console.log('Fetched specialties:', data);
      setSpecialties(data);
    } catch (err) {
      console.error('Lỗi fetch:', err);
      setSpecialties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSpecialties(''); }, [fetchSpecialties]);
  useEffect(() => { const delay = setTimeout(() => { fetchSpecialties(searchTerm); }, 300); return () => clearTimeout(delay); }, [searchTerm, fetchSpecialties]);

  const handleOpenModal = (sp: Partial<Specialization> | null = null) => {
    setCurrentSpecialization(sp || { name: '', image: '', price: 0 });
    setIsModalOpen(true);
  };
  const handleCloseModal = () => { setIsModalOpen(false); setCurrentSpecialization(null); };

  const handleOpenDeleteModal = (id: number) => { setDeletingId(id); setIsDeleteModalOpen(true); };
  const handleCloseDeleteModal = () => { setDeletingId(null); setIsDeleteModalOpen(false); };

  const handleSubmitForm = async (formData: FormData) => {
    setFormIsLoading(true);
    const isEdit = !!currentSpecialization?.id;
    const url = isEdit ? `${API_URL}/api/specializations/${currentSpecialization.id}` : `${API_URL}/api/specializations`;
    const method = isEdit ? 'PUT' : 'POST';
    try {
      console.log('Submitting form to:', url, 'Method:', method);
      console.log('Form data:', Object.fromEntries(formData.entries()));
      const res = await fetch(url, { method, body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Thao tác thất bại.');
      }
      const result = await res.json();
      console.log('Update result:', result);
      handleCloseModal();
      await fetchSpecialties(searchTerm);
    } catch (err: any) {
      console.error('Submit error:', err);
      alert(`❌ Lỗi: ${err.message}`);
    } finally {
      setFormIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setFormIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/specializations/${deletingId}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Xóa thất bại.');
      }
      handleCloseDeleteModal();
      await fetchSpecialties(searchTerm);
    } catch (err: any) {
      alert(`❌ Lỗi: ${err.message}`);
    } finally {
      setFormIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Chuyên khoa</h1>
          <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            <PlusCircle size={18} /> Thêm mới
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Tìm kiếm chuyên khoa..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="mt-4 overflow-x-auto">
                <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chuyên khoa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá khám</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {loading ? (
                       <tr><td colSpan={5} className="text-center py-10"><Loader2 className="mx-auto h-8 w-8 text-blue-600 animate-spin" /></td></tr>
                    ) : specialties.length === 0 ? (
                       <tr><td colSpan={5} className="text-center py-10 text-gray-500">Không tìm thấy chuyên khoa nào.</td></tr>
                    ) : (
                    specialties.map((sp) => (
                        <tr key={sp.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sp.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{sp.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           {sp.price !== null && sp.price !== undefined ? `${sp.price.toLocaleString('vi-VN')} VNĐ` : 'Chưa cập nhật'}
                        </td>
                        <td className="px-6 py-4">
                            <img src={`${API_URL}${sp.image}`} alt={sp.name} className="w-24 h-14 object-cover rounded-md border" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleOpenModal(sp)} className="text-indigo-600 hover:text-indigo-800 p-2" title="Chỉnh sửa"><Edit size={18} /></button>
                            <button onClick={() => handleOpenDeleteModal(sp.id)} className="text-red-600 hover:text-red-800 p-2" title="Xóa"><Trash2 size={18} /></button>
                        </td>
                        </tr>
                    )))}
                </tbody>
                </table>
            </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && <SpecialtyModal initialData={currentSpecialization!} onSubmit={handleSubmitForm} onCancel={handleCloseModal} isLoading={formIsLoading} />}
        {isDeleteModalOpen && <DeleteConfirmationModal onConfirm={handleDelete} onCancel={handleCloseDeleteModal} isLoading={formIsLoading} />}
      </AnimatePresence>
    </div>
  );
}