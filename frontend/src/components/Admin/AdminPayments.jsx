import React, { useState, useEffect } from 'react';
import MainLayout from '../Layout/MainLayout';
import AdminLayout from './AdminLayout';
import { 
  TrendingUp, ArrowRight, MoreVertical, Download, Plus, 
  Search, Filter, CreditCard, DollarSign, PieChart,
  Calendar, User, Home, Clock, CheckCircle2, XCircle, ChevronRight, Loader2,
  Edit2, Trash2, X, RotateCcw
} from 'lucide-react';
import { apiGetPayments, apiUpdatePaymentStatus, apiDeletePayment } from '../../services/adminPaymentService';
import { showToast } from '../Common/Notification';

const AdminPayments = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await apiGetPayments();
      setPayments(data || []);
      if (data && data.length > 0) {
        setSelectedPayment(data[0]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      showToast('Không thể tải dữ liệu thanh toán.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusSubmit = async (newStatus) => {
    if (!selectedPayment) return;
    
    try {
      setStatusLoading(true);
      await apiUpdatePaymentStatus(selectedPayment.id_Booking, newStatus);
      showToast('Cập nhật trạng thái thành công!', 'success');
      setShowStatusModal(false);
      fetchData();
    } catch (err) {
      showToast(err.message || 'Lỗi khi cập nhật trạng thái.', 'error');
    } finally {
      setStatusLoading(false);
    }
  };

  // Tính toán thống kê từ dữ liệu thật
  const totalRevenue = payments
    .filter(p => p.trang_Thai === 'da_hoan_thanh')
    .reduce((sum, p) => sum + (p.tong_Tien || 0), 0);

  const pendingPayments = payments.filter(p => p.trang_Thai === 'dang_xu_ly');
  const totalPendingAmount = pendingPayments.reduce((sum, p) => sum + (p.tong_Tien || 0), 0);

  // Phân bổ theo trạng thái
  const countCompleted = payments.filter(p => p.trang_Thai === 'da_hoan_thanh').length;
  const countPending = payments.filter(p => p.trang_Thai === 'dang_xu_ly').length;
  const countCancelled = payments.filter(p => p.trang_Thai === 'da_huy').length;
  const totalCount = payments.length;

  const completedPercentage = totalCount > 0 ? Math.round((countCompleted / totalCount) * 100) : 0;
  const pendingPercentage = totalCount > 0 ? Math.round((countPending / totalCount) * 100) : 0;

  // Xử lý lọc và tìm kiếm
  const filteredTransactions = payments
    .filter(p => {
      const matchSearch = p.user_Name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === 'all' || p.trang_Thai === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => new Date(b.thoi_Gian_Thanh_Toan) - new Date(a.thoi_Gian_Thanh_Toan));

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString.startsWith('0001')) return '---';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'da_hoan_thanh': return 'Hoàn thành';
      case 'dang_xu_ly': return 'Đang xử lý';
      case 'da_huy': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'da_hoan_thanh': return 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100';
      case 'dang_xu_ly': return 'text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100';
      case 'da_huy': return 'text-rose-600 bg-rose-50 border-rose-100 hover:bg-rose-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const handleDeletePayment = async (idPayment, idBooking) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dữ liệu thanh toán này?')) return;

    try {
      await apiDeletePayment(idPayment, idBooking);
      showToast('Xóa thanh toán thành công!', 'success');
      fetchData();
    } catch (err) {
      showToast(err.message || 'Lỗi khi xóa thanh toán.', 'error');
    }
  };

  if (loading) {
    return (
      <MainLayout forceScrolled={true} requireAuth={true} hideFooter={true}>
        <AdminLayout>
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-10 h-10 text-[#2D3E35] animate-spin" />
          </div>
        </AdminLayout>
      </MainLayout>
    );
  }

  return (
    <MainLayout forceScrolled={true} requireAuth={true} hideFooter={true}>
      <AdminLayout>
        <div className="min-h-screen bg-[#FDFBF7] p-6 lg:p-10 pb-24 text-[#1A251F]">
          <div className="max-w-[1600px] mx-auto space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-2">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#1A251F]">Quản lý thanh toán</h1>
                <p className="text-gray-500 font-medium">Theo dõi doanh thu, dòng tiền và lịch sử giao dịch.</p>
              </div>
              <div className="flex items-center gap-3">

              </div>
            </div>

            {/* Top Cards Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Total Revenue Card */}
              <div className="bg-[#1A251F] rounded-[32px] p-8 text-white shadow-xl flex flex-col justify-between border border-emerald-900/20">
                <div>
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">Tổng doanh thu hệ thống</p>
                  <h2 className="text-4xl font-black mb-4">
                    {totalRevenue.toLocaleString()} <span className="text-emerald-400 text-2xl">₫</span>
                  </h2>
                </div>
                <div className="flex items-center text-emerald-400 text-sm font-bold bg-emerald-400/10 self-start px-3 py-1.5 rounded-full">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Giao dịch hoàn thành
                </div>
              </div>

              {/* Pending Status Card */}
              <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-end mb-4">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Đang chờ xử lý</p>
                  <span className="text-3xl font-black text-amber-500">{countPending}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    style={{ width: `${pendingPercentage}%` }}
                  ></div>
                </div>
                <p className="text-gray-500 text-sm italic font-medium">
                  Tổng tiền đang treo: {totalPendingAmount.toLocaleString()} ₫
                </p>
              </div>

              {/* Status Overview Card */}
              <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Phân bổ trạng thái</p>
                <div className="flex items-center gap-8">
                  <div className="relative w-28 h-28 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      <path
                        className="text-gray-100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="text-emerald-500"
                        strokeDasharray={`${completedPercentage}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-[#1A251F]">{completedPercentage}%</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      <span className="text-xs font-bold text-gray-700">Hoàn thành ({countCompleted})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                      <span className="text-xs font-bold text-gray-700">Đang xử lý ({countPending})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                      <span className="text-xs font-bold text-gray-700">Đã hủy ({countCancelled})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Transactions Table Section */}
              <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30">
                  <h3 className="text-xl font-bold text-[#1A251F]">Giao dịch gần đây</h3>
                  
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    {/* Search Component */}
                    <div className="relative flex-1 sm:flex-none sm:min-w-[240px]">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text"
                        placeholder="Tìm theo tên khách..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>

                    {/* Filter Component */}
                    <div className="relative flex-1 sm:flex-none">
                      <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full pl-6 pr-12 py-3 bg-gray-50/50 border-none rounded-full text-base focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all appearance-none cursor-pointer font-bold text-[#374151]"
                      >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="da_hoan_thanh">Hoàn thành</option>
                        <option value="dang_xu_ly">Đang xử lý</option>
                        <option value="da_huy">Đã hủy</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" size={18} />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto min-h-[500px]">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mã thanh toán</th>
                        <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mã booking</th>
                        <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Khách hàng</th>
                        <th className="px-6 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Số tiền</th>
                        <th className="px-6 py-5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trạng thái</th>
                        <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thời gian</th>
                        <th className="px-6 py-5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">isDelete</th>
                        <th className="px-6 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredTransactions.map((payment) => (
                        <tr 
                          key={payment.id_Payment} 
                          onClick={() => setSelectedPayment(payment)}
                          className={`cursor-pointer transition-all ${
                            selectedPayment?.id_Payment === payment.id_Payment 
                              ? 'bg-emerald-50/40 border-l-4 border-emerald-500' 
                              : 'hover:bg-gray-50/50'
                          }`}
                        >
                          <td className="px-6 py-6">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-tighter">#PAY-{payment.id_Payment}</span>
                          </td>
                          <td className="px-6 py-6">
                            <span className="text-xs font-bold text-emerald-600">#BK-{payment.id_Booking}</span>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#2D3E35] flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                {payment.user_Name?.substring(0, 2) || '??'}
                              </div>
                              <span className="font-bold text-gray-700 text-sm truncate max-w-[120px]">{payment.user_Name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-right">
                            <span className="text-sm font-black text-[#1A251F]">{formatPrice(payment.tong_Tien)}</span>
                          </td>
                          <td className="px-6 py-6 text-center">
                            <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              payment.trang_Thai === 'da_hoan_thanh' 
                                ? 'bg-emerald-100 text-emerald-600' 
                                : payment.trang_Thai === 'da_huy'
                                ? 'bg-rose-100 text-rose-600'
                                : 'bg-amber-100 text-amber-600'
                            }`}>
                              {getStatusText(payment.trang_Thai)}
                            </span>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-gray-600">{formatDate(payment.thoi_Gian_Thanh_Toan)}</span>
                              <span className="text-[10px] text-gray-400">{new Date(payment.thoi_Gian_Thanh_Toan).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-center">
                            {(payment.isDelete === "True" || payment.isDelete === true) ? (
                              <span className="px-2 py-0.5 bg-rose-500 text-white text-[8px] font-black rounded uppercase tracking-tighter">True</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-[8px] font-black rounded uppercase tracking-tighter">False</span>
                            )}
                          </td>
                          <td className="px-6 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedPayment(payment); setShowStatusModal(true); }}
                                className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                                title="Cập nhật trạng thái"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDeletePayment(payment.id_Payment, payment.id_Booking); }}
                                className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-all"
                                title="Xóa thanh toán"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Invoice Detail Sidebar Section */}
              <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl p-8 sticky top-6 self-start">
                {selectedPayment ? (
                  <>
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Chi tiết thanh toán</h3>
                      <button className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">#PAY-{selectedPayment.id_Payment}</span>
                        <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded">#BK-{selectedPayment.id_Booking}</span>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-gray-200 my-6"></div>

                    <div className="space-y-4 text-sm font-medium">
                      <div className="flex justify-between">
                        <span className="text-gray-400 flex items-center gap-2"><User size={14}/> Khách hàng:</span>
                        <span className="text-[#1A251F] font-bold">{selectedPayment.user_Name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 flex items-center gap-2"><CreditCard size={14}/> Phương thức:</span>
                        <span className="text-[#1A251F] font-bold">{selectedPayment.phuong_Thuc || 'QR'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 flex items-center gap-2"><Calendar size={14}/> Thời gian:</span>
                        <span className="text-[#1A251F] font-bold">{formatDate(selectedPayment.thoi_Gian_Thanh_Toan)} {new Date(selectedPayment.thoi_Gian_Thanh_Toan).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 flex items-center gap-2"><CheckCircle2 size={14}/> Trạng thái:</span>
                        <span className={`font-bold ${
                          selectedPayment.trang_Thai === 'da_hoan_thanh' ? 'text-emerald-600' : selectedPayment.trang_Thai === 'da_huy' ? 'text-rose-600' : 'text-amber-600'
                        }`}>
                          {getStatusText(selectedPayment.trang_Thai)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-8">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Hình ảnh minh chứng</p>
                      <div className="relative group overflow-hidden rounded-[24px] border-2 border-dashed border-gray-100 aspect-[4/3] bg-gray-50 flex flex-col items-center justify-center transition-all hover:border-emerald-200">
                        {selectedPayment.img ? (
                          <img 
                            src={selectedPayment.img.replace(/\\/g, '/')} 
                            className="w-full h-full object-cover transition-opacity" 
                            alt="Minh chứng" 
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-300">
                            <Search size={32} />
                            <p className="text-[10px] mt-2">Không có ảnh</p>
                          </div>
                        )}
                        {selectedPayment.img && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:bg-black/5 transition-all">
                             <a 
                               href={selectedPayment.img.replace(/\\/g, '/')} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="px-4 py-2 bg-white/90 backdrop-blur-md shadow-lg rounded-xl text-xs font-bold text-[#1A251F] flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                             >
                               <Search size={14}/> Xem ảnh gốc
                             </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-10 mb-8 border-t border-dashed border-gray-200 pt-8">
                      <span className="text-lg font-bold text-[#1A251F]">Tổng cộng:</span>
                      <span className="text-2xl font-black text-emerald-600">{formatPrice(selectedPayment.tong_Tien)}</span>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                      <CreditCard size={32} />
                    </div>
                    <p className="text-gray-400 font-bold text-sm">Chọn một giao dịch để xem chi tiết hóa đơn</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>

      {/* Update Status Modal */}
      {showStatusModal && selectedPayment && (
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
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mã Booking: #{selectedPayment.id_Booking}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowStatusModal(false)}
                disabled={statusLoading}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-600">
                  Chọn trạng thái mới cho khách hàng <span className="font-bold text-gray-900">{selectedPayment.user_Name}</span>:
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'dang_xu_ly', label: 'Đang xử lý', color: 'amber', icon: Clock },
                    { id: 'da_hoan_thanh', label: 'Đã hoàn thành', color: 'emerald', icon: CheckCircle2 },
                    { id: 'da_huy', label: 'Đã hủy', color: 'rose', icon: XCircle }
                  ].map((status) => {
                    const StatusIcon = status.icon;
                    const isActive = selectedPayment.trang_Thai === status.id;
                    return (
                      <button
                        key={status.id}
                        onClick={() => handleStatusSubmit(status.id)}
                        disabled={statusLoading}
                        className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${
                          isActive 
                            ? `border-${status.color}-600 bg-${status.color}-50/50` 
                            : 'border-gray-50 hover:border-gray-100 bg-gray-50/30'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <StatusIcon className={`${isActive ? `text-${status.color}-600` : 'text-gray-400'}`} size={24} />
                          <span className={`text-lg font-bold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                            {status.label}
                          </span>
                        </div>
                        {isActive && (
                          <div className={`w-3 h-3 rounded-full bg-${status.color}-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]`}></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Alert Note */}
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                <div className="p-2 bg-white rounded-full h-fit shadow-sm">
                  <Clock className="text-blue-500" size={16} />
                </div>
                <p className="text-xs font-medium text-blue-700 leading-relaxed">
                  Lưu ý: Việc thay đổi trạng thái sẽ ảnh hưởng đến báo cáo thống kê và thông báo gửi tới khách hàng.
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-10 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                >
                  Đóng
                </button>
              </div>

              {statusLoading && (
                <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold animate-pulse">
                  <Loader2 className="animate-spin" size={18} />
                  Đang cập nhật...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default AdminPayments;
