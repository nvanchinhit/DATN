'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Pencil, Trash2, PlusCircle, Search, X, Loader2, AlertTriangle, ShieldCheck, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// --- Interfaces và các hàm helper không đổi ---
interface UserFromAPI {
  id: number; name: string; email: string | null; phone: string | null; gender: 'Nam' | 'Nữ' | 'Khác' | null;
  birthday: string | null; address: string | null; avatar: string | null; is_verified: 0 | 1;
  created_at: string; role_id: number; role_name?: string;
}
interface User {
  id: number; name: string; email: string; phone: string; gender: string; birthday: string;
  address: string; avatar: string; isVerified: boolean; createdAt: string; role: string;
}
const getAvatarUrl = (path: string | null): string => {
  if (!path) return '/default-avatar.jpg';
  try { new URL(path); return path; } catch (_) { return `${API_URL}${path}`; }
};
const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  try { return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }); } catch { return 'N/A'; }
};


export default function AccountsAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // --- State mới cho Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchUsers = useCallback(async () => {
    setLoading(true); setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
        setError("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn.");
        setLoading(false);
        return;
    }
    try {
      const response = await fetch(`${API_URL}/api/admin`, { headers: { 'Authorization': `Bearer ${token}` } }); 
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) throw new Error('Phiên đăng nhập không hợp lệ hoặc bạn không có quyền truy cập.');
        throw new Error('Không thể tải danh sách tài khoản.');
      }
      const data: UserFromAPI[] = await response.json();
      const mappedUsers: User[] = data.map(user => ({
        id: user.id, name: user.name, email: user.email || 'Chưa cập nhật', phone: user.phone || 'Chưa cập nhật',
        gender: user.gender || 'Chưa cập nhật', birthday: formatDate(user.birthday), address: user.address || 'Chưa cập nhật',
        avatar: getAvatarUrl(user.avatar), isVerified: user.is_verified === 1, createdAt: formatDate(user.created_at),
        role: user.role_name || (user.role_id === 1 ? 'Admin' : (user.role_id === 2 ? 'Người Dùng' : 'User')),
      }));
      setUsers(mappedUsers);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users
      .filter(user => filterRole === 'all' || user.role === filterRole)
      .filter(user => filterStatus === 'all' || (filterStatus === 'verified' ? user.isVerified : !user.isVerified))
      .filter(user => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term) || user.phone.includes(term));
      });
  }, [users, searchTerm, filterRole, filterStatus]);

  // --- Logic Pagination ---
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);


  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Người dùng hệ thống</h1>
            <p className="text-gray-500 mt-1">Quản lý, xem và chỉnh sửa thông tin người dùng.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition self-start sm:self-center">
            <PlusCircle size={18} /> Thêm người dùng
          </button>
        </div>

        {/* --- Panel chính --- */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Tìm theo tên, email, SĐT..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 transition">
                <option value="all">Tất cả vai trò</option>
                <option value="Admin">Admin</option>
                <option value="Doctor">Bác sĩ</option>
                <option value="User">Người dùng</option>
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 transition">
                <option value="all">Tất cả trạng thái</option>
                <option value="verified">Đã xác thực</option>
                <option value="unverified">Chưa xác thực</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-16"><Loader2 className="mx-auto h-8 w-8 text-blue-600 animate-spin" /></td></tr>
                ) : error ? (
                   <tr><td colSpan={5} className="text-center py-16 text-red-500"><div className="flex flex-col items-center justify-center gap-2"><AlertTriangle size={32} /> <p className="font-medium">{error}</p></div></td></tr>
                ) : paginatedUsers.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-16 text-gray-500">Không tìm thấy người dùng nào.</td></tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-full object-cover shadow-sm border border-gray-200" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className={`inline-block px-2 py-1 text-xs font-medium rounded-md ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : user.role === 'Doctor' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{user.role}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{user.isVerified ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}{user.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.createdAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => setSelectedUser(user)} className="text-gray-500 hover:text-blue-600 p-2 rounded-md transition" title="Xem chi tiết"><Eye size={18} /></button>
                        <button className="text-gray-500 hover:text-indigo-600 p-2 rounded-md transition" title="Chỉnh sửa"><Pencil size={18} /></button>
                        <button className="text-gray-500 hover:text-red-600 p-2 rounded-md transition" title="Xóa"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
            
          {/* --- Pagination Controls --- */}
           <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> 
                    - <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> 
                    trên <span className="font-medium">{filteredUsers.length}</span> kết quả
                </p>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"><ChevronLeft size={20}/></button>
                    <span className="text-sm font-medium">{currentPage} / {totalPages > 0 ? totalPages : 1}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"><ChevronRight size={20}/></button>
                </div>
           </div>
        </div>
      </div>
      
      {/* --- Modal xem chi tiết (thiết kế lại) --- */}
      <AnimatePresence>
        {selectedUser && (
           <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedUser(null)}>
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative" onClick={e => e.stopPropagation()}>
               <div className="p-6 border-b flex justify-between items-center">
                 <h2 className="text-xl font-bold text-gray-800">Chi tiết Người dùng</h2>
                 <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
               </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 flex flex-col items-center text-center">
                        <img src={selectedUser.avatar} alt={selectedUser.name} className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg" />
                        <h3 className="mt-4 text-lg font-bold text-gray-900">{selectedUser.name}</h3>
                        <p className="text-sm text-gray-500">{selectedUser.email}</p>
                        <div className={`mt-2 inline-block px-3 py-1 text-xs font-medium rounded-md ${selectedUser.role === 'Admin' ? 'bg-purple-100 text-purple-800' : selectedUser.role === 'Doctor' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{selectedUser.role}</div>
                    </div>
                    <div className="md:col-span-2 space-y-3 border-t md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0">
                         <div className='grid grid-cols-3 gap-2'><dt className="text-sm text-gray-500 col-span-1">SĐT</dt><dd className="text-sm text-gray-800 font-medium col-span-2">{selectedUser.phone}</dd></div>
                         <div className='grid grid-cols-3 gap-2'><dt className="text-sm text-gray-500 col-span-1">Giới tính</dt><dd className="text-sm text-gray-800 font-medium col-span-2">{selectedUser.gender}</dd></div>
                         <div className='grid grid-cols-3 gap-2'><dt className="text-sm text-gray-500 col-span-1">Ngày sinh</dt><dd className="text-sm text-gray-800 font-medium col-span-2">{selectedUser.birthday}</dd></div>
                         <div className='grid grid-cols-3 gap-2'><dt className="text-sm text-gray-500 col-span-1">Ngày tham gia</dt><dd className="text-sm text-gray-800 font-medium col-span-2">{selectedUser.createdAt}</dd></div>
                         <div className='grid grid-cols-3 gap-2'><dt className="text-sm text-gray-500 col-span-1">Trạng thái</dt><dd className="text-sm text-gray-800 font-medium col-span-2"><span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-full ${selectedUser.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{selectedUser.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}</span></dd></div>
                         <div className='grid grid-cols-3 gap-2'><dt className="text-sm text-gray-500 col-span-1">Địa chỉ</dt><dd className="text-sm text-gray-800 font-medium col-span-2">{selectedUser.address}</dd></div>
                    </div>
                </div>
               <div className="p-4 bg-gray-50 border-t flex justify-end">
                 <button onClick={() => setSelectedUser(null)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition">Đóng</button>
               </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}