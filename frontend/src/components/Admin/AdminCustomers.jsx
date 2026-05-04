import React, { useState, useEffect } from 'react';
import MainLayout from '../Layout/MainLayout';
import AdminLayout from './AdminLayout';
import { 
  Plus, Search, Loader2, X, MoreVertical, 
  Users, UserCheck, ShieldCheck, UserX, 
  Trash2, Eye, Filter, Download, 
  ChevronLeft, ChevronRight,
  Mail, Phone, MapPin, Calendar, Lock
} from 'lucide-react';
import { 
  apiGetAdminUsers, 
  apiAddAdminUser, 
  apiDeleteAdminUser 
} from '../../services/adminUserService';

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // States cho Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: '',
    email: '',
    sdt: '',
    matkhau: '',
    vaitro: 'user'
  });

  // States cho Detail Modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGetAdminUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi lấy danh sách người dùng');
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: 'Lỗi tải dữ liệu người dùng', type: 'error' } 
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await apiAddAdminUser(addFormData);
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: 'Thêm người dùng thành công', type: 'success' } 
      }));
      setIsAddModalOpen(false);
      setAddFormData({ name: '', email: '', sdt: '', matkhau: '', vaitro: 'user' });
      fetchUsers();
    } catch (err) {
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: err.message || 'Lỗi khi thêm người dùng', type: 'error' } 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await apiDeleteAdminUser(id);
        window.dispatchEvent(new CustomEvent('show-notification', { 
          detail: { message: 'Đã xóa người dùng thành công', type: 'success' } 
        }));
        fetchUsers();
      } catch (err) {
        window.dispatchEvent(new CustomEvent('show-notification', { 
          detail: { message: err.message || 'Lỗi khi xóa người dùng', type: 'error' } 
        }));
      }
    }
  };

  const handleViewDetail = (id) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setSelectedUser(user);
      setIsDetailModalOpen(true);
    } else {
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: 'Không tìm thấy thông tin người dùng', type: 'error' } 
      }));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'All' || user.vaitro?.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Stats calculation
  const stats = {
    total: users.length,
    active: users.filter(u => u.isDelete === 'active').length,
    admins: users.filter(u => u.vaitro?.toLowerCase() === 'admin').length,
    deleted: users.filter(u => u.isDelete === 'delete').length
  };

  const getRoleBadge = (role) => {
    if (!role) return 'bg-gray-100 text-gray-600';
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-blue-600 text-white';
      case 'manager': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    // Xử lý đường dẫn từ backend (vẩn còn dấu \\)
    const normalizedPath = path.replace(/\\/g, '/');
    return `https://localhost:7092/${normalizedPath}`;
  };

  return (
    <MainLayout forceScrolled={true} requireAuth={true} hideFooter={true}>
      <AdminLayout>
        <div className="p-6 lg:p-8 max-w-[1400px] mx-auto font-sans bg-[#FAFBFD] pb-20">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#1A251F]">Quản lý Người dùng</h2>
              <p className="text-gray-500 text-sm mt-1">Quản lý danh tính và phân quyền truy cập hệ thống.</p>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-[#003580] text-white rounded-lg font-bold hover:bg-[#002252] transition-all shadow-md flex items-center gap-2"
            >
              <Plus size={20} />
              Thêm người dùng mới
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'TỔNG NGƯỜI DÙNG', value: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+4% tháng này' },
              { label: 'ĐANG HOẠT ĐỘNG', value: stats.active, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', status: true },
              { label: 'QUẢN TRỊ VIÊN', value: stats.admins, icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'ĐÃ VÔ HIỆU HÓA', value: stats.deleted, icon: UserX, color: 'text-rose-600', bg: 'bg-rose-50' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  {stat.trend && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{stat.trend}</span>}
                  {stat.status && <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center shadow-sm gap-4">
            <div className="flex flex-1 gap-4 w-full sm:w-auto">
              <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Tìm tên hoặc email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50"
                />
              </div>
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">Tất cả vai trò</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="p-2.5 text-gray-400 hover:text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"><Filter size={20}/></button>
              <button className="p-2.5 text-gray-400 hover:text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"><Download size={20}/></button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Người dùng</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Vai trò</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="py-20 text-center">
                        <Loader2 className="animate-spin mx-auto text-blue-600 mb-2" size={32} />
                        <span className="text-gray-500 font-medium">Đang tải dữ liệu...</span>
                      </td>
                    </tr>
                  ) : paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 px-6 text-sm font-semibold text-gray-500 uppercase tracking-tighter">
                          USR-{user.id?.toString().padStart(3, '0')}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold overflow-hidden">
                              {user.anhdaidien ? (
                                <img src={getAvatarUrl(user.anhdaidien)} className="w-full h-full object-cover" alt="" />
                              ) : (
                                user.name?.charAt(0) || '?'
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{user.name || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{user.vaitro === 'admin' ? 'Phòng Công nghệ' : 'Khách hàng'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">{user.sdt && user.sdt.trim() ? user.sdt : '---'}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getRoleBadge(user.vaitro)}`}>
                            {user.vaitro}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {user.isDelete === 'delete' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                              Đã xóa
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                              Hoạt động
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button 
                              onClick={() => handleViewDetail(user.id)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Xóa người dùng"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-20 text-center text-gray-500">Không tìm thấy người dùng nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Hiển thị <span className="font-bold text-gray-700">{Math.min(startIndex + 1, filteredUsers.length)}-{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</span> của <span className="font-bold text-gray-700">{filteredUsers.length}</span> người dùng
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-[#003580] text-white shadow-md' : 'hover:bg-white text-gray-600 border border-transparent hover:border-gray-200'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Thêm người dùng mới</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X size={20}/></button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Họ và tên</label>
                  <input 
                    type="text" 
                    required
                    value={addFormData.name}
                    onChange={(e) => setAddFormData({...addFormData, name: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email</label>
                  <input 
                    type="email" 
                    required
                    value={addFormData.email}
                    onChange={(e) => setAddFormData({...addFormData, email: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Số điện thoại</label>
                    <input 
                      type="text" 
                      value={addFormData.sdt}
                      onChange={(e) => setAddFormData({...addFormData, sdt: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="09xx..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Vai trò</label>
                    <select 
                      value={addFormData.vaitro}
                      onChange={(e) => setAddFormData({...addFormData, vaitro: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Mật khẩu</label>
                  <input 
                    type="password" 
                    required
                    value={addFormData.matkhau}
                    onChange={(e) => setAddFormData({...addFormData, matkhau: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="********"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#003580] text-white font-bold hover:bg-[#002252] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Thêm người dùng'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail Modal - Upgraded Version */}
        {isDetailModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-300">
              {/* Header Profile Section */}
              <div className="relative h-32 bg-gradient-to-r from-[#003580] to-[#0052cc] rounded-t-3xl">
                <button 
                  onClick={() => setIsDetailModalOpen(false)} 
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all z-10"
                >
                  <X size={20}/>
                </button>
              </div>

              <div className="px-8 pb-8">
                {/* Avatar & Name Section */}
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end gap-5 -mt-16 mb-10">
                  <div className="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-xl flex-shrink-0">
                    <div className="w-full h-full rounded-2xl bg-blue-50 flex items-center justify-center text-4xl font-bold text-blue-700 overflow-hidden border border-gray-100">
                      {selectedUser?.anhdaidien ? (
                        <img src={getAvatarUrl(selectedUser.anhdaidien)} className="w-full h-full object-cover" alt="" />
                      ) : (
                        selectedUser?.name?.charAt(0) || '?'
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 pb-2">
                    <h4 className="text-2xl font-black text-gray-900 tracking-tight truncate">{selectedUser?.name || 'N/A'}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getRoleBadge(selectedUser?.vaitro)}`}>
                        {selectedUser?.vaitro}
                      </span>
                      <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedUser?.isDelete === 'delete' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedUser?.isDelete === 'delete' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                        {selectedUser?.isDelete === 'delete' ? 'Vô hiệu hóa' : 'Đang hoạt động'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Basic Info */}
                  <div className="space-y-6">
                    <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                      <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Thông tin cơ bản</h5>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm"><Users size={18}/></div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">ID Người dùng</p>
                            <p className="text-sm font-bold text-gray-800">USR-{selectedUser?.id?.toString().padStart(4, '0')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm"><Calendar size={18}/></div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Ngày sinh</p>
                            <p className="text-sm font-bold text-gray-800">
                              {selectedUser?.ngaySinh && selectedUser.ngaySinh !== '0001-01-01T00:00:00' 
                                ? new Date(selectedUser.ngaySinh).toLocaleDateString('vi-VN', {day: '2-digit', month: 'long', year: 'numeric'}) 
                                : 'Chưa cập nhật'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm"><MapPin size={18}/></div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Địa chỉ</p>
                            <p className="text-sm font-bold text-gray-800">{selectedUser?.diachi || 'Chưa cập nhật'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Contact & Security */}
                  <div className="space-y-6">
                    <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                      <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Liên hệ & Bảo mật</h5>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm"><Mail size={18}/></div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Email liên hệ</p>
                            <p className="text-sm font-bold text-gray-800 truncate">{selectedUser?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm"><Phone size={18}/></div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Số điện thoại</p>
                            <p className="text-sm font-bold text-gray-800">{selectedUser?.sdt && selectedUser.sdt.trim() ? selectedUser.sdt : 'Chưa xác thực'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm"><Lock size={18}/></div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Mật khẩu tài khoản</p>
                            <p className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{selectedUser?.matkhau || '********'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gia nhập hệ thống vào lúc</p>
                    <p className="text-xs font-semibold text-gray-600 mt-1">
                      {selectedUser?.ngaytao && selectedUser.ngaytao !== '0001-01-01T00:00:00' 
                        ? new Date(selectedUser.ngaytao).toLocaleString('vi-VN') 
                        : 'Không rõ thời điểm'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </MainLayout>
  );
};

export default AdminCustomers;
