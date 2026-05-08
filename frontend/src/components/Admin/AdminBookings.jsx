import React, { useState, useEffect } from 'react';
import MainLayout from '../Layout/MainLayout';
import AdminLayout from './AdminLayout';
import { 
  Calendar, Clock, CheckCircle2, XCircle, Filter, 
  ChevronLeft, ChevronRight, Search, 
  Eye, Edit2, Trash2, Download, CalendarDays, Loader2, RotateCcw, AlertCircle
} from 'lucide-react';
import { apiGetBookings, apiUpdateBookingStatus, apiDeleteBooking } from '../../services/adminBookingService';
import { showToast } from '../Common/Notification';

const AdminBookings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');

  // Modal State
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await apiGetBookings();
      setBookings(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Không thể tải danh sách đặt phòng.');
      showToast('Không thể tải danh sách đặt phòng.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'da_hoan_thanh':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'dang_xu_ly':
        return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'da_huy':
        return 'text-rose-600 bg-rose-50 border-rose-100';
      default:
        return 'text-gray-400 bg-gray-50 border-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'da_hoan_thanh': return 'Đã hoàn thành';
      case 'dang_xu_ly': return 'Đang xử lý';
      case 'da_huy': return 'Đã hủy';
      default: return status || 'Không xác định';
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedBooking) return;
    
    try {
      setStatusLoading(true);
      await apiUpdateBookingStatus(selectedBooking.id_Booking, newStatus);
      showToast('Cập nhật trạng thái đặt phòng thành công.', 'success');
      setShowStatusModal(false);
      fetchData(); // Refresh list
    } catch (err) {
      console.error('Error updating status:', err);
      showToast(err.message || 'Lỗi khi cập nhật trạng thái đặt phòng.', 'error');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDeleteBooking = async (booking) => {
    // Nếu đã xóa rồi thì không cho thao tác nữa
    if (booking.isDelete === "True" || booking.isDelete === true) return;

    if (!window.confirm(`Bạn có chắc chắn muốn xóa đơn đặt phòng #${booking.id_Booking}?`)) return;

    try {
      await apiDeleteBooking(booking.id_Booking);
      showToast('Xóa đơn đặt phòng thành công.', 'success');
      fetchData(); // Refresh list
    } catch (err) {
      console.error('Error deleting booking:', err);
      showToast(err.message || 'Lỗi khi xóa đơn đặt phòng.', 'error');
    }
  };

  // Filter Logic
  const filteredBookings = bookings.filter(item => {
    const matchesSearch = 
      (item.user_Name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.room_Name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.id_Booking || '').toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'Tất cả trạng thái' || getStatusText(item.trang_Thai) === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Stats Calculation
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.trang_Thai === 'dang_xu_ly').length;
  const completedBookings = bookings.filter(b => b.trang_Thai === 'da_hoan_thanh').length;
  const cancelledBookings = bookings.filter(b => b.trang_Thai === 'da_huy').length;

  const stats = [
    {
      title: 'Tổng đặt phòng',
      value: totalBookings.toLocaleString(),
      badge: 'Tổng số',
      badgeColor: 'text-gray-600',
      bgBadge: 'bg-gray-50',
      icon: <Calendar className="w-5 h-5" />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      title: 'Đang xử lý',
      value: pendingBookings.toLocaleString(),
      badge: 'Cần duyệt',
      badgeColor: 'text-amber-600',
      bgBadge: 'bg-amber-50',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      title: 'Đã hoàn thành',
      value: completedBookings.toLocaleString(),
      badge: 'Thành công',
      badgeColor: 'text-blue-600',
      bgBadge: 'bg-blue-50',
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Đã hủy',
      value: cancelledBookings.toLocaleString(),
      badge: 'Đã hủy',
      badgeColor: 'text-rose-600',
      bgBadge: 'bg-rose-50',
      icon: <XCircle className="w-5 h-5" />,
      color: 'text-rose-600',
      bg: 'bg-rose-50'
    },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString.startsWith('0001')) return '---';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <MainLayout forceScrolled={true} requireAuth={true} hideFooter={true}>
      <AdminLayout>
        <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 pb-24 text-[#1A251F]">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight">Quản lý đặt phòng</h1>
                </div>
                <p className="text-gray-500 font-medium">Theo dõi và quản lý các yêu cầu đặt phòng hiện tại của homestay.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={fetchData}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#2E5C44] text-white rounded-xl font-bold hover:bg-[#244835] transition-all shadow-lg shadow-emerald-900/10 active:scale-95"
                >
                  <RotateCcw size={18} />
                  Làm mới dữ liệu
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-100 flex items-center gap-5">
                  <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-0.5">{stat.title}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${stat.bgBadge} ${stat.badgeColor}`}>
                        {stat.badge}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="relative flex-1 max-w-md w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Tìm mã đơn, tên khách hoặc phòng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold text-gray-600 outline-none"
                  >
                    <option>Tất cả trạng thái</option>
                    <option>Đã hoàn thành</option>
                    <option>Đang xử lý</option>
                    <option>Đã hủy</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto min-h-[400px]">
                {loading ? (
                  <div className="py-32 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                    <p className="text-gray-400 font-bold animate-pulse text-xs uppercase tracking-widest">Đang tải dữ liệu...</p>
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="py-32 flex flex-col items-center justify-center text-center">
                    <Calendar size={48} className="text-gray-200 mb-4" />
                    <p className="text-gray-400 font-medium">Không tìm thấy dữ liệu đặt phòng.</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Khách hàng</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phòng / Số khách</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thời gian lưu trú</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tổng tiền</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trạng thái</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Xóa</th>
                        <th className="px-8 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id_Booking} className={`transition-colors group ${
                          (booking.isDelete === "True" || booking.isDelete === true) 
                            ? 'bg-rose-50/30' 
                            : 'hover:bg-gray-50/30'
                        }`}>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#2D3E35] flex items-center justify-center text-xs font-bold text-white shadow-inner uppercase">
                                {booking.user_Name?.substring(0, 2) || '??'}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-bold text-gray-900 leading-none">{booking.user_Name}</p>
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium tracking-tight">Ngày đặt: {formatDate(booking.ngay_Tao)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-sm font-bold text-gray-700">{booking.room_Name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{booking.so_Nguoi} khách</p>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                              {formatDate(booking.ngay_Nhan_Phong)} - {formatDate(booking.ngay_Tra_Phong)}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-base font-black text-[#1A251F]">{formatPrice(booking.tong_Tien)}</p>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(booking.trang_Thai)}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                booking.trang_Thai === 'da_hoan_thanh' ? 'bg-emerald-500' : 
                                booking.trang_Thai === 'da_huy' ? 'bg-rose-500' : 'bg-amber-500'
                              }`}></div>
                              {getStatusText(booking.trang_Thai)}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            {(booking.isDelete === "True" || booking.isDelete === true) ? (
                              <span className="inline-flex items-center px-2 py-1 bg-rose-100 text-rose-600 text-[9px] font-black rounded-lg uppercase tracking-wider border border-rose-200">
                                Đã xóa
                              </span>
                            ) : (
                              <input 
                                type="checkbox" 
                                checked={false}
                                onChange={() => handleDeleteBooking(booking)}
                                className="w-5 h-5 rounded-lg border-gray-200 text-[#2E5C44] focus:ring-[#2E5C44] cursor-pointer transition-all hover:border-emerald-500" 
                              />
                            )}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => { setSelectedBooking(booking); setShowStatusModal(true); }}
                                className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm active:scale-95 group/btn" 
                                title="Cập nhật trạng thái"
                              >
                                <Edit2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                              </button>
                              <button 
                                onClick={() => handleDeleteBooking(booking)}
                                disabled={booking.isDelete === "True" || booking.isDelete === true}
                                className={`p-2.5 bg-gray-50 rounded-xl transition-all shadow-sm active:scale-95 group/btn ${
                                  (booking.isDelete === "True" || booking.isDelete === true) 
                                    ? 'text-gray-200 cursor-not-allowed' 
                                    : 'text-gray-400 hover:text-rose-600 hover:bg-rose-50'
                                }`}
                                title={booking.isDelete === "True" || booking.isDelete === true ? "Đơn đã bị xóa" : "Xóa đơn đặt phòng"}
                              >
                                <Trash2 size={18} className={(booking.isDelete === "True" || booking.isDelete === true) ? "" : "group-hover/btn:scale-110 transition-transform"} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              <div className="p-8 bg-gray-50/30 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Hiển thị <span className="text-gray-900 font-black">{filteredBookings.length}</span> / <span className="text-gray-900 font-black">{totalBookings}</span> đặt phòng
                </p>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm disabled:opacity-30">
                    <ChevronLeft size={18} />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all shadow-sm bg-[#2E5C44] text-white">1</button>
                  <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Update Status Modal */}
        {showStatusModal && selectedBooking && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => !statusLoading && setShowStatusModal(false)}></div>
            <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <Edit2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Cập nhật trạng thái</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Đơn hàng: #{selectedBooking.id_Booking}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowStatusModal(false)}
                  disabled={statusLoading}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-0"
                >
                  <RotateCcw className="rotate-45" size={24} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-600">Chọn trạng thái mới cho khách hàng <span className="font-bold text-gray-900">{selectedBooking.user_Name}</span>:</p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'dang_xu_ly', label: 'Đang xử lý', color: 'amber', icon: <Clock size={18} /> },
                      { id: 'da_hoan_thanh', label: 'Đã hoàn thành', color: 'emerald', icon: <CheckCircle2 size={18} /> },
                      { id: 'da_huy', label: 'Đã hủy', color: 'rose', icon: <XCircle size={18} /> }
                    ].map((status) => (
                      <button
                        key={status.id}
                        onClick={() => handleUpdateStatus(status.id)}
                        disabled={statusLoading}
                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                          selectedBooking.trang_Thai === status.id 
                            ? `border-${status.color}-500 bg-${status.color}-50 text-${status.color}-700`
                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 font-bold">
                          {status.icon}
                          {status.label}
                        </div>
                        {selectedBooking.trang_Thai === status.id && (
                          <div className={`w-2 h-2 rounded-full bg-${status.color}-500 animate-pulse`}></div>
                        )}
                        {statusLoading && <Loader2 className="animate-spin text-gray-400" size={18} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                  <AlertCircle className="text-blue-500 shrink-0" size={20} />
                  <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                    Lưu ý: Việc thay đổi trạng thái sẽ ảnh hưởng đến báo cáo thống kê và thông báo gửi tới khách hàng.
                  </p>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => setShowStatusModal(false)}
                    disabled={statusLoading}
                    className="px-8 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                  >
                    Đóng
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

export default AdminBookings;
