import React, { useState, useEffect } from 'react';
import MainLayout from '../Layout/MainLayout';
import AdminLayout from './AdminLayout';
import { Plus, Edit2, Trash2, Calendar, Search, Loader2, X, CalendarCheck, Clock, Wallet, LayoutGrid, List as ListIcon, Info, AlertTriangle, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { apiGetAdminHolidays, apiAddAdminHoliday, apiUpdateAdminHoliday, apiDeleteAdminHoliday } from '../../services/adminHolidayService';

const AdminHolidays = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // States cho Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addFormData, setAddFormData] = useState({
    NameHoliday: '',
    HolidayStart: '',
    HolidayEnd: '',
    He_so: 1.0
  });

  // States cho Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    NameHoliday: '',
    HolidayStart: '',
    HolidayEnd: '',
    He_so: 1.0
  });

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGetAdminHolidays();
      setHolidays(data);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi lấy danh sách ngày lễ');
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: 'Lỗi tải dữ liệu ngày lễ', type: 'error' } 
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleAddHoliday = () => {
    setAddFormData({ NameHoliday: '', HolidayStart: '', HolidayEnd: '', He_so: 1.0 });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addFormData.NameHoliday || !addFormData.HolidayStart || !addFormData.HolidayEnd || !addFormData.He_so) {
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: 'Vui lòng điền đầy đủ thông tin', type: 'error' } 
      }));
      return;
    }
    
    // Validate dates
    if (new Date(addFormData.HolidayStart) > new Date(addFormData.HolidayEnd)) {
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu', type: 'error' } 
      }));
      return;
    }

    try {
      setIsSubmitting(true);
      await apiAddAdminHoliday(addFormData);
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: 'Thêm ngày lễ thành công', type: 'success' } 
      }));
      setIsAddModalOpen(false);
      fetchHolidays(); // Refresh data
    } catch (err) {
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: err.message || 'Lỗi khi thêm ngày lễ', type: 'error' } 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditHoliday = (holiday) => {
    setEditingId(holiday.id);
    
    // Format dates to YYYY-MM-DD for input type="date"
    const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    setEditFormData({
      NameHoliday: holiday.nameHoliday || '',
      HolidayStart: formatDateForInput(holiday.holidayStart),
      HolidayEnd: formatDateForInput(holiday.holidayEnd),
      He_so: holiday.he_so || 1.0
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.NameHoliday || !editFormData.HolidayStart || !editFormData.HolidayEnd || !editFormData.He_so) {
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: 'Vui lòng điền đầy đủ thông tin', type: 'error' } 
      }));
      return;
    }
    
    // Validate dates
    if (new Date(editFormData.HolidayStart) > new Date(editFormData.HolidayEnd)) {
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu', type: 'error' } 
      }));
      return;
    }

    try {
      setIsSubmitting(true);
      await apiUpdateAdminHoliday(editingId, editFormData);
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: 'Sửa ngày lễ thành công', type: 'success' } 
      }));
      setIsEditModalOpen(false);
      fetchHolidays(); // Refresh data
    } catch (err) {
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: err.message || 'Lỗi khi sửa ngày lễ', type: 'error' } 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteHoliday = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ngày lễ này?')) {
      try {
        setLoading(true);
        await apiDeleteAdminHoliday(id);
        window.dispatchEvent(new CustomEvent('show-notification', { 
          detail: { message: 'Đã xóa ngày lễ thành công', type: 'success' } 
        }));
        fetchHolidays(); // Refresh data
      } catch (err) {
        window.dispatchEvent(new CustomEvent('show-notification', { 
          detail: { message: err.message || 'Lỗi khi xóa ngày lễ', type: 'error' } 
        }));
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  };

  const getStatusInfo = (endDateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(endDateString);
    endDate.setHours(0, 0, 0, 0);

    if (endDate >= today) {
      return { label: 'Sắp tới', dotColor: 'bg-green-500', textColor: 'text-green-600' };
    }
    return { label: 'Đã qua', dotColor: 'bg-gray-400', textColor: 'text-gray-500' };
  };

  const filteredHolidays = holidays.filter(holiday => 
    holiday.nameHoliday && holiday.nameHoliday.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredHolidays.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHolidays = filteredHolidays.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const upcomingCount = holidays.filter(h => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(h.holidayEnd);
    end.setHours(0, 0, 0, 0);
    return end >= today;
  }).length;

  return (
    <MainLayout forceScrolled={true} requireAuth={true} hideFooter={true}>
      <AdminLayout>
        <div className="p-6 lg:p-8 max-w-[1400px] mx-auto font-sans bg-[#FAFBFD] pb-20">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1A251F]">Quản lý Ngày Lễ</h2>
              <p className="text-gray-500 text-sm mt-1">Danh sách các ngày nghỉ lễ và sự kiện trong năm</p>
            </div>
            <button 
              onClick={handleAddHoliday}
              className="px-5 py-2.5 bg-[#1546A0] text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-sm flex items-center gap-2 h-fit text-sm"
            >
              <Plus size={18} />
              Thêm ngày lễ mới
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-5 rounded-xl border border-gray-100 flex items-center gap-5 shadow-sm">
              <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CalendarCheck size={26} strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tổng ngày lễ năm nay</p>
                <p className="text-2xl font-bold text-[#1A251F]">{holidays.length < 10 ? `0${holidays.length}` : holidays.length}</p>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-gray-100 flex items-center gap-5 shadow-sm">
              <div className="w-14 h-14 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                <Clock size={26} strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Ngày lễ sắp tới</p>
                <p className="text-2xl font-bold text-[#1A251F]">{upcomingCount < 10 ? `0${upcomingCount}` : upcomingCount}</p>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-3 rounded-xl border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center shadow-sm gap-4">
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80 min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm text-gray-700 outline-none bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2.5 text-gray-400 hover:text-gray-800 rounded-lg transition-colors"><LayoutGrid size={20}/></button>
              <button className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><ListIcon size={20}/></button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            {error && <div className="p-4 bg-red-50 text-red-600 text-sm">{error}</div>}
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Mã ngày lễ</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Tên ngày lễ</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày bắt đầu</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày kết thúc</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Loại (Phụ thu)</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="py-16 text-center text-gray-500"><Loader2 size={32} className="animate-spin mx-auto text-[#1546A0] mb-4" />Đang tải dữ liệu...</td>
                    </tr>
                  ) : paginatedHolidays.length > 0 ? (
                    paginatedHolidays.map((holiday, index) => {
                      const status = getStatusInfo(holiday.holidayEnd);
                      const idStr = holiday.id.toString().padStart(3, '0');
                      const holidayCode = `HOL-2026-${idStr}`;
                      
                      return (
                        <tr key={holiday.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="py-4 px-6 font-semibold text-[#1A251F] text-sm whitespace-nowrap">{holidayCode}</td>
                          <td className="py-4 px-6 font-semibold text-gray-800 text-sm">{holiday.nameHoliday}</td>
                          <td className="py-4 px-6 text-gray-600 text-sm">{formatDate(holiday.holidayStart)}</td>
                          <td className="py-4 px-6 text-gray-600 text-sm">{formatDate(holiday.holidayEnd)}</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-600">
                              x{holiday.he_so.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`flex items-center gap-2 text-xs font-bold ${status.textColor}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`}></div>
                              {status.label}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditHoliday(holiday)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><Edit2 size={16} /></button>
                              <button onClick={() => handleDeleteHoliday(holiday.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan="7" className="py-12 text-center text-gray-500">Không tìm thấy ngày lễ nào.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500 italic font-medium">
                Hiển thị {Math.min(startIndex + 1, filteredHolidays.length)}-{Math.min(startIndex + itemsPerPage, filteredHolidays.length)} trên tổng số {filteredHolidays.length} ngày lễ
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16}/>
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded text-sm font-bold transition-all ${
                      currentPage === i + 1 
                        ? 'bg-[#1546A0] text-white shadow-md' 
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16}/>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Notes */}
          <div className="mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm max-w-2xl">
              <h3 className="text-lg font-bold text-[#1A251F] mb-4">Ghi chú quan trọng</h3>
              <div className="space-y-4">
                <div className="flex gap-3 bg-gray-50/80 p-4 rounded-lg border-l-4 border-blue-500">
                  <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    Các ngày nghỉ lễ quốc gia sẽ được hệ thống tự động đồng bộ dựa trên lịch Nhà nước ban hành hàng năm.
                  </p>
                </div>
                <div className="flex gap-3 bg-gray-50/80 p-4 rounded-lg border-l-4 border-red-500">
                  <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    Mọi thay đổi đối với lịch nghỉ lễ cần được phê duyệt bởi Ban Giám đốc trước khi công bố rộng rãi cho nhân viên.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-[#1A251F]">Thêm ngày lễ mới</h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tên ngày lễ</label>
                  <input 
                    type="text" 
                    value={addFormData.NameHoliday}
                    onChange={(e) => setAddFormData({...addFormData, NameHoliday: e.target.value})}
                    placeholder="VD: Tết Dương Lịch 2026"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-[#1A251F] focus:bg-white focus:border-[#2D3E35] focus:ring-1 focus:ring-[#2D3E35] outline-none transition-all"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày bắt đầu</label>
                    <input 
                      type="date" 
                      value={addFormData.HolidayStart}
                      onChange={(e) => setAddFormData({...addFormData, HolidayStart: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-[#1A251F] focus:bg-white focus:border-[#2D3E35] focus:ring-1 focus:ring-[#2D3E35] outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày kết thúc</label>
                    <input 
                      type="date" 
                      value={addFormData.HolidayEnd}
                      onChange={(e) => setAddFormData({...addFormData, HolidayEnd: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-[#1A251F] focus:bg-white focus:border-[#2D3E35] focus:ring-1 focus:ring-[#2D3E35] outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hệ số phụ thu</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="1.0"
                    value={addFormData.He_so}
                    onChange={(e) => setAddFormData({...addFormData, He_so: parseFloat(e.target.value) || 1.0})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-[#1A251F] focus:bg-white focus:border-[#2D3E35] focus:ring-1 focus:ring-[#2D3E35] outline-none transition-all"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">Ví dụ: 1.5 nghĩa là tăng 50% giá phòng ngày thường.</p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-[#2D3E35] text-white rounded-lg font-medium hover:bg-[#1A251F] transition-colors shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <><Loader2 size={18} className="animate-spin" /> Đang lưu...</>
                    ) : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-[#1A251F]">Chỉnh sửa ngày lễ</h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tên ngày lễ</label>
                  <input 
                    type="text" 
                    value={editFormData.NameHoliday}
                    onChange={(e) => setEditFormData({...editFormData, NameHoliday: e.target.value})}
                    placeholder="VD: Tết Dương Lịch 2026"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-[#1A251F] focus:bg-white focus:border-[#2D3E35] focus:ring-1 focus:ring-[#2D3E35] outline-none transition-all"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày bắt đầu</label>
                    <input 
                      type="date" 
                      value={editFormData.HolidayStart}
                      onChange={(e) => setEditFormData({...editFormData, HolidayStart: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-[#1A251F] focus:bg-white focus:border-[#2D3E35] focus:ring-1 focus:ring-[#2D3E35] outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày kết thúc</label>
                    <input 
                      type="date" 
                      value={editFormData.HolidayEnd}
                      onChange={(e) => setEditFormData({...editFormData, HolidayEnd: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-[#1A251F] focus:bg-white focus:border-[#2D3E35] focus:ring-1 focus:ring-[#2D3E35] outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hệ số phụ thu</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="1.0"
                    value={editFormData.He_so}
                    onChange={(e) => setEditFormData({...editFormData, He_so: parseFloat(e.target.value) || 1.0})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-[#1A251F] focus:bg-white focus:border-[#2D3E35] focus:ring-1 focus:ring-[#2D3E35] outline-none transition-all"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">Ví dụ: 1.5 nghĩa là tăng 50% giá phòng ngày thường.</p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-[#1546A0] text-white rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <><Loader2 size={18} className="animate-spin" /> Đang lưu...</>
                    ) : 'Cập nhật'}
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

export default AdminHolidays;
