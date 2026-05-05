import React, { useState, useEffect } from 'react';
import MainLayout from '../Layout/MainLayout';
import AdminLayout from './AdminLayout';
import { 
  Plus, Search, Edit2, Trash2, X, 
  Info, Box, ChevronLeft, ChevronRight,
  MoreVertical, Check, AlertCircle, Loader2
} from 'lucide-react';
import { 
  apiGetAdminAmenities, 
  apiAddAdminAmenity, 
  apiUpdateAdminAmenity, 
  apiDeleteAdminAmenity 
} from '../../services/adminAmenityService';
import { showToast } from '../Common/Notification';

const AdminAmenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State cho Modal Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [formData, setFormData] = useState({
    Ten_Tien_Nghi: '',
    Mo_Ta: '',
    Trang_Thai: 'hoat_dong'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await apiGetAdminAmenities();
      console.log('Amenities Data:', data);
      
      // Hỗ trợ cả trường hợp trả về mảng trực tiếp hoặc bọc trong object (result hoặc data)
      const list = Array.isArray(data) ? data : (data.result || data.data || []);
      setAmenities(list);
      setError(null);
    } catch (err) {
      console.error('Error fetching amenities:', err);
      setError('Không thể tải danh sách tiện nghi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (amenity = null) => {
    if (amenity) {
      setEditingAmenity(amenity);
      setFormData({
        Ten_Tien_Nghi: amenity.ten_Tien_Nghi || '',
        Mo_Ta: amenity.mo_Ta || '',
        Trang_Thai: amenity.trang_Thai || 'hoat_dong'
      });
    } else {
      setEditingAmenity(null);
      setFormData({
        Ten_Tien_Nghi: '',
        Mo_Ta: '',
        Trang_Thai: 'hoat_dong'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAmenity(null);
    setFormData({
      Ten_Tien_Nghi: '',
      Mo_Ta: '',
      Trang_Thai: 'hoat_dong'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Ten_Tien_Nghi.trim()) {
      showToast('Vui lòng nhập tên tiện nghi', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Map form data to match backend expectation if needed (assuming same snake_case)
      const payload = { ...formData };

      if (editingAmenity) {
        await apiUpdateAdminAmenity(editingAmenity.idTienNghi, payload);
        showToast('Cập nhật tiện nghi thành công', 'success');
      } else {
        await apiAddAdminAmenity(payload);
        showToast('Thêm tiện nghi mới thành công', 'success');
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      showToast(err.message || 'Có lỗi xảy ra', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tiện nghi "${name}"? Thao tác này không thể hoàn tác.`)) {
      try {
        await apiDeleteAdminAmenity(id);
        showToast('Xóa tiện nghi thành công', 'success');
        fetchData();
      } catch (err) {
        showToast(err.message || 'Lỗi khi xóa tiện nghi', 'error');
      }
    }
  };

  // Filter & Pagination Logic
  const filteredAmenities = amenities.filter(item => {
    const name = item.ten_Tien_Nghi || '';
    const desc = item.mo_Ta || '';
    
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           desc.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredAmenities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAmenities = filteredAmenities.slice(startIndex, startIndex + itemsPerPage);

  return (
    <MainLayout forceScrolled={true} requireAuth={true} hideFooter={true}>
      <AdminLayout>
        <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 pb-24">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Quản lý tiện nghi</h1>
                <p className="text-gray-500 mt-2 font-medium">Danh mục các dịch vụ và tiện ích cung cấp cho phòng nghỉ.</p>
              </div>
              <button 
                onClick={() => handleOpenModal()}
                className="flex items-center gap-3 px-8 py-4 bg-[#2E5C44] text-white rounded-[20px] font-bold hover:bg-[#244835] transition-all shadow-xl shadow-emerald-900/10 active:scale-95"
              >
                <Plus size={20} />
                Thêm tiện nghi mới
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-100 flex items-center gap-5">
                <div className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center">
                  <Box size={28} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tổng tiện nghi</p>
                  <p className="text-2xl font-bold text-gray-900">{amenities.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-100 flex items-center gap-5">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Check size={28} />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Đang hoạt động</p>
                  <p className="text-2xl font-bold text-gray-900">{amenities.filter(a => a.trang_Thai === 'hoat_dong').length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-100 flex items-center gap-5">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-600 uppercase tracking-widest">Đang bảo trì</p>
                  <p className="text-2xl font-bold text-gray-900">{amenities.filter(a => a.trang_Thai === 'bao_tri').length}</p>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm theo tên hoặc mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-gray-700"
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-sm font-bold text-gray-400">Sắp xếp:</span>
                <select className="bg-transparent border-none focus:ring-0 font-bold text-gray-700 text-sm">
                  <option>Mới nhất</option>
                  <option>Tên A-Z</option>
                </select>
              </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="py-32 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                  <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">Đang tải dữ liệu...</p>
                </div>
              ) : error ? (
                <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Đã có lỗi xảy ra</h3>
                  <p className="text-gray-500 mb-8 max-w-sm">{error}</p>
                  <button onClick={fetchData} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold">Thử lại</button>
                </div>
              ) : filteredAmenities.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-6">
                    <Search size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy dữ liệu</h3>
                  <p className="text-gray-500 max-w-sm">Không tìm thấy tiện nghi nào khớp với tìm kiếm của bạn.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">ID</th>
                        <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Tiện nghi</th>
                        <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Mô tả</th>
                        <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Trạng thái</th>
                        <th className="px-8 py-6 text-right text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paginatedAmenities.map((item) => (
                        <tr key={item.idTienNghi} className="hover:bg-gray-50/30 transition-colors group">
                          <td className="px-8 py-6">
                            <span className="font-mono text-sm text-gray-400">#{item.idTienNghi}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="font-bold text-gray-900">{item.ten_Tien_Nghi}</span>
                          </td>
                          <td className="px-8 py-6 max-w-md">
                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                              {item.mo_Ta || 'Chưa có mô tả chi tiết cho tiện nghi này.'}
                            </p>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              item.trang_Thai === 'hoat_dong' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${item.trang_Thai === 'hoat_dong' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                              {item.trang_Thai === 'hoat_dong' ? 'Hoạt động' : 'Bảo trì'}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleOpenModal(item)}
                                className="p-3 bg-white border border-gray-100 text-blue-600 rounded-xl hover:bg-blue-50 transition-all shadow-sm"
                                title="Chỉnh sửa"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button 
                                onClick={() => handleDelete(item.idTienNghi, item.ten_Tien_Nghi)}
                                className="p-3 bg-white border border-gray-100 text-rose-600 rounded-xl hover:bg-rose-50 transition-all shadow-sm"
                                title="Xóa"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl bg-white border border-gray-100 disabled:opacity-30 shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-bold transition-all ${
                        currentPage === i + 1 
                        ? 'bg-gray-900 text-white shadow-lg' 
                        : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl bg-white border border-gray-100 disabled:opacity-30 shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Add/Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingAmenity ? 'Chỉnh sửa tiện nghi' : 'Thêm tiện nghi mới'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Vui lòng điền đầy đủ thông tin bên dưới.</p>
                </div>
                <button onClick={handleCloseModal} className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-gray-600 rounded-2xl transition-all shadow-sm">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Tên tiện nghi</label>
                  <input 
                    type="text" 
                    value={formData.Ten_Tien_Nghi}
                    onChange={(e) => setFormData({...formData, Ten_Tien_Nghi: e.target.value})}
                    placeholder="VD: Điều hòa nhiệt độ, Wifi miễn phí..."
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold text-gray-700"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Trạng thái</label>
                  <select 
                    value={formData.Trang_Thai}
                    onChange={(e) => setFormData({...formData, Trang_Thai: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold text-gray-700 appearance-none cursor-pointer"
                  >
                    <option value="hoat_dong">Đang hoạt động</option>
                    <option value="bao_tri">Đang bảo trì</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Mô tả chi tiết</label>
                  <textarea 
                    rows="4"
                    value={formData.Mo_Ta}
                    onChange={(e) => setFormData({...formData, Mo_Ta: e.target.value})}
                    placeholder="Nhập mô tả về tiện nghi này..."
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-gray-700 resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-4 border border-gray-200 text-gray-600 rounded-[20px] font-bold hover:bg-gray-50 transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-[2] py-4 bg-[#2E5C44] text-white rounded-[20px] font-bold hover:bg-[#244835] transition-all shadow-xl shadow-emerald-900/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    {editingAmenity ? 'Lưu thay đổi' : 'Xác nhận thêm'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AdminLayout>
    </MainLayout>
  );
};

export default AdminAmenities;
