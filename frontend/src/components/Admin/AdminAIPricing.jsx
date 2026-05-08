import React, { useState, useEffect } from 'react';
import MainLayout from '../Layout/MainLayout';
import AdminLayout from './AdminLayout';
import { 
  Cpu, Search, Download, Printer, Edit2, 
  RotateCcw, Info, TrendingUp, TrendingDown,
  Calendar, DollarSign, BarChart3, Loader2,
  Filter, CheckCircle2, AlertCircle, Eye, Check, Trash2
} from 'lucide-react';
import { apiGetAppliedPricing, apiGetPredictionHistory, apiRunPrediction, apiApprovePrediction, apiDeletePrediction } from '../../services/adminAIPricingService';
import { showToast } from '../Common/Notification';

const AdminAIPricing = () => {
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);
  
  const [appliedPricing, setAppliedPricing] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermHistory, setSearchTermHistory] = useState('');

  // Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  // Run Predict Modal State
  const [showPredictModal, setShowPredictModal] = useState(false);
  const [predictRoomId, setPredictRoomId] = useState('');
  const [predictStartDate, setPredictStartDate] = useState('');
  const [predictEndDate, setPredictEndDate] = useState('');
  const [predictLoading, setPredictLoading] = useState(false);
  
  // Approve Modal State
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedForApprove, setSelectedForApprove] = useState(null);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [customPrice, setCustomPrice] = useState('');
  const [approveLoading, setApproveLoading] = useState(false);

  // Today's date for min-date in pickers
  const today = new Date().toISOString().split('T')[0];

  // Pagination Table 1
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Pagination Table 2
  const [currentPageHistory, setCurrentPageHistory] = useState(1);
  const [sortOrderHistory, setSortOrderHistory] = useState('desc');
  const itemsPerPageHistory = 6;

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await apiGetAppliedPricing();
      setAppliedPricing(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching applied pricing:', err);
      setError('Không thể tải dữ liệu giá áp dụng.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await apiGetPredictionHistory();
      setHistoryData(data || []);
    } catch (err) {
      console.error('Error fetching prediction history:', err);
      showToast('Không thể tải lịch sử dự đoán.', 'error');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleRunPrediction = async (e) => {
    e.preventDefault();
    if (!predictRoomId || !predictStartDate || !predictEndDate) {
      showToast('Vui lòng điền đầy đủ thông tin', 'warning');
      return;
    }

    try {
      setPredictLoading(true);
      const data = {
        Ngay_Bat_Dau_Du_doan: predictStartDate,
        Ngay_Ket_Thuc_Du_doan: predictEndDate
      };
      await apiRunPrediction(predictRoomId, data);
      showToast('Đã gửi yêu cầu dự đoán AI thành công!', 'success');
      setShowPredictModal(false);
      // Reset form
      setPredictRoomId('');
      setPredictStartDate('');
      setPredictEndDate('');
      // Refresh history
      fetchHistory();
    } catch (err) {
      console.error('Error running prediction:', err);
      showToast(err.message || 'Lỗi khi chạy dự đoán', 'error');
    } finally {
      setPredictLoading(false);
    }
  };

  const handleApprovePrice = (prediction) => {
    setSelectedForApprove(prediction);
    setCustomPrice(prediction.gia_De_Xuat);
    setIsEditingPrice(false);
    setShowApproveModal(true);
  };

  const confirmApprove = async () => {
    if (!selectedForApprove) return;
    
    const priceToApply = isEditingPrice ? parseInt(customPrice) : selectedForApprove.gia_De_Xuat;
    
    if (isNaN(priceToApply) || priceToApply <= 0) {
      showToast('Vui lòng nhập giá hợp lệ', 'warning');
      return;
    }

    try {
      setApproveLoading(true);
      const stored = localStorage.getItem('homestayUser');
      const currentUser = stored ? JSON.parse(stored) : null;
      const idUser = currentUser?.iduser || currentUser?.idUser || currentUser?.id || currentUser?.Id || currentUser?.IdUser || 1;
      
      const payload = {
        IdDuDoanGia: selectedForApprove.idGiaDuDoan,
        GiaApDung: priceToApply,
        IdUser: idUser,
        ThoiGianTao: new Date().toISOString()
      };

      await apiApprovePrediction(selectedForApprove.idRoom, payload);
      showToast(isEditingPrice ? 'Đã duyệt với giá tùy chỉnh thành công!' : 'Đã duyệt và áp dụng giá AI thành công!', 'success');
      
      setShowApproveModal(false);
      fetchData();
      fetchHistory();
    } catch (err) {
      console.error('Error approving price:', err);
      showToast(err.message || 'Lỗi khi duyệt giá', 'error');
    } finally {
      setApproveLoading(false);
    }
  };
  const handleDeletePrediction = async (idDuDoanGia) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bản ghi lịch sử dự đoán này không?')) {
      return;
    }

    try {
      await apiDeletePrediction(idDuDoanGia);
      showToast('Đã xóa lịch sử dự đoán thành công!', 'success');
      fetchHistory(); // Refresh history table
    } catch (err) {
      console.error('Error deleting prediction:', err);
      showToast(err.message || 'Lỗi khi xóa lịch sử dự đoán', 'error');
    }
  };

  useEffect(() => {
    fetchData();
    fetchHistory();
  }, []);

  // Reset page when searching
  useEffect(() => setCurrentPage(1), [searchTerm]);
  useEffect(() => setCurrentPageHistory(1), [searchTermHistory]);

  // Table 1 Logic
  const filteredPricing = appliedPricing.filter(item => 
    (item.ten_Phong || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.idRoom || '').toString().includes(searchTerm)
  );
  const totalPages = Math.ceil(filteredPricing.length / itemsPerPage);
  const paginatedPricing = filteredPricing.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Table 2 Logic
  const filteredHistory = historyData
    .filter(item => 
      (item.idRoom || '').toString().includes(searchTermHistory) ||
      (item.model_Name || '').toLowerCase().includes(searchTermHistory.toLowerCase()) ||
      (item.ly_Do_Du_Doan || '').toLowerCase().includes(searchTermHistory.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.thoi_Gian_Tao);
      const dateB = new Date(b.thoi_Gian_Tao);
      return sortOrderHistory === 'desc' ? dateB - dateA : dateA - dateB;
    });
  
  const totalPagesHistory = Math.ceil(filteredHistory.length / itemsPerPageHistory);
  const paginatedHistory = filteredHistory.slice((currentPageHistory - 1) * itemsPerPageHistory, currentPageHistory * itemsPerPageHistory);

  // Stats Calculations
  const pendingApprovalCount = historyData.filter(item => item.trang_Thai === 'cho_duyet').length;
  const activeRoomsCount = appliedPricing.filter(item => item.trang_Thai === 'dang_hoat_dong').length;
  const avgAppliedPrice = appliedPricing.length > 0 
    ? Math.round(appliedPricing.reduce((acc, curr) => acc + (curr.gia_Ap_Dung || 0), 0) / appliedPricing.length) 
    : 0;

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
                    <Cpu size={24} />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight">AI Dự đoán giá</h1>
                </div>
                <p className="text-gray-500 font-medium">Phân tích và tối ưu hóa giá phòng dựa trên công nghệ học máy.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => { fetchData(); fetchHistory(); }}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                >
                  <RotateCcw size={18} />
                  Cập nhật dữ liệu
                </button>
                <button 
                  onClick={() => setShowPredictModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-[#2E5C44] text-white rounded-2xl font-bold hover:bg-[#244835] transition-all shadow-xl shadow-emerald-900/10 active:scale-95"
                >
                  <TrendingUp size={18} />
                  Chạy dự đoán mới
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Phòng chờ duyệt', value: pendingApprovalCount, color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: 'Tổng lượt dự đoán', value: historyData.length, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Tổng phòng áp dụng', value: appliedPricing.length, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: 'Giá TB áp dụng', value: `${avgAppliedPrice.toLocaleString()} đ`, color: 'text-indigo-500', bg: 'bg-indigo-50' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-100 flex items-center gap-5">
                  <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl`}>
                    {i === 0 ? <AlertCircle size={24} /> : i === 1 ? <TrendingUp size={24} /> : i === 2 ? <CheckCircle2 size={24} /> : <DollarSign size={24} />}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-0.5">{stat.label}</p>
                    <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Table 1: Applied Pricing */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h2 className="text-xl font-bold">Giá đang áp dụng</h2>
                  <p className="text-sm text-gray-500 mt-1">Danh sách giá phòng thực tế sau khi tối ưu.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Tìm mã hoặc tên phòng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto min-h-[400px]">
                {loading ? (
                  <div className="py-32 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                    <p className="text-gray-400 font-bold animate-pulse text-xs uppercase tracking-widest">Đang tải dữ liệu...</p>
                  </div>
                ) : appliedPricing.length === 0 ? (
                  <div className="py-32 flex flex-col items-center justify-center text-center">
                    <BarChart3 size={48} className="text-gray-200 mb-4" />
                    <p className="text-gray-400 font-medium">Không tìm thấy dữ liệu giá áp dụng.</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phòng</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Giá gốc</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Giá áp dụng</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ngày áp dụng</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paginatedPricing.map((item) => (
                        <tr key={item.idRoom} className="hover:bg-gray-50/30 transition-colors group">
                          <td className="px-8 py-6">
                            <p className="font-bold text-gray-900">{item.ten_Phong}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">ID: {item.idRoom}</p>
                          </td>
                          <td className="px-8 py-6 text-sm font-medium text-gray-500">
                            {item.gia_goc?.toLocaleString()} đ
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-lg font-black text-blue-600">
                              {item.gia_Ap_Dung > 0 ? `${item.gia_Ap_Dung.toLocaleString()} đ` : '---'}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                            {item.ngay_Ap_Dung && item.ngay_Ap_Dung !== "0001-01-01T00:00:00" 
                              ? new Date(item.ngay_Ap_Dung).toLocaleDateString('vi-VN') 
                              : 'Chưa cập nhật'}
                          </td>
                          <td className="px-8 py-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              item.trang_Thai === 'dang_hoat_dong' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${item.trang_Thai === 'dang_hoat_dong' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                              {item.trang_Thai === 'dang_hoat_dong' ? 'Hoạt động' : 'Bảo trì'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination 1 */}
              {totalPages > 1 && (
                <div className="p-6 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trang {currentPage} / {totalPages}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2.5 bg-white border border-gray-100 rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
                    >
                      <TrendingDown size={18} className="rotate-90" />
                    </button>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2.5 bg-white border border-gray-100 rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
                    >
                      <TrendingUp size={18} className="-rotate-90" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Table 2: History */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h2 className="text-xl font-bold">Bảng giá dự đoán AI</h2>
                  <p className="text-sm text-gray-500 mt-1">Các phiên dự báo từ hệ thống trí tuệ nhân tạo.</p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                  <select 
                    value={sortOrderHistory}
                    onChange={(e) => setSortOrderHistory(e.target.value)}
                    className="px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold text-gray-600 outline-none"
                  >
                    <option value="desc">Mới nhất</option>
                    <option value="asc">Cũ nhất</option>
                  </select>
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Tìm theo ID, Model, Lý do..."
                      value={searchTermHistory}
                      onChange={(e) => setSearchTermHistory(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                    />
                  </div>
                  <button onClick={fetchHistory} className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-all" title="Làm mới">
                    <RotateCcw size={20} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto min-h-[400px]">
                {loadingHistory ? (
                  <div className="py-32 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                    <p className="text-gray-400 font-bold animate-pulse text-xs uppercase tracking-widest">Đang tải lịch sử...</p>
                  </div>
                ) : historyData.length === 0 ? (
                  <div className="py-32 flex flex-col items-center justify-center text-center">
                    <BarChart3 size={48} className="text-gray-200 mb-4" />
                    <p className="text-gray-400 font-medium">Chưa có lịch sử dự đoán.</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phòng / Model</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Giá đề xuất</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thời gian tạo</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Khoảng áp dụng</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trạng thái</th>
                        <th className="px-8 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paginatedHistory.map((item) => (
                        <tr key={item.idGiaDuDoan} className="hover:bg-gray-50/30 transition-colors group">
                          <td className="px-8 py-6">
                            <p className="font-bold text-gray-900 leading-none mb-1.5">ID: {item.idRoom}</p>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-tight truncate max-w-[150px] inline-block">
                              {item.model_Name}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-lg font-black text-gray-900">{item.gia_De_Xuat?.toLocaleString()} đ</span>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-sm text-gray-500 font-medium">{new Date(item.thoi_Gian_Tao).toLocaleString('vi-VN')}</p>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-[10px] font-bold text-gray-500 space-y-0.5">
                              <p className="text-gray-300 font-medium">Bắt đầu:</p>
                              <p>{item.ngay_Bat_Dau_Du_Doan && item.ngay_Bat_Dau_Du_Doan !== "0001-01-01T00:00:00" ? new Date(item.ngay_Bat_Dau_Du_Doan).toLocaleDateString('vi-VN') : '---'}</p>
                              <p className="text-gray-300 font-medium">Kết thúc:</p>
                              <p>{item.ngay_Ket_Thuc_Du_Doan && item.ngay_Ket_Thuc_Du_Doan !== "0001-01-01T00:00:00" ? new Date(item.ngay_Ket_Thuc_Du_Doan).toLocaleDateString('vi-VN') : '---'}</p>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              item.trang_Thai === 'cho_duyet' ? 'bg-amber-50 text-amber-600' : 
                              item.trang_Thai === 'da_duyet' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {item.trang_Thai === 'cho_duyet' ? 'Chờ duyệt' : item.trang_Thai === 'da_duyet' ? 'Đã duyệt' : 'Từ chối'}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {item.trang_Thai === 'cho_duyet' && (
                                <button 
                                  onClick={() => handleApprovePrice(item)}
                                  className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all shadow-sm active:scale-95 group/btn"
                                  title="Duyệt và áp dụng giá"
                                >
                                  <Check size={18} className="group-hover/btn:scale-110 transition-transform" />
                                </button>
                              )}
                              <button 
                                onClick={() => { setSelectedPrediction(item); setShowDetailModal(true); }}
                                className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm active:scale-95 group/btn"
                                title="Xem chi tiết"
                              >
                                <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
                              </button>
                              <button 
                                onClick={() => handleDeletePrediction(item.idGiaDuDoan)}
                                className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm active:scale-95 group/btn"
                                title="Xóa lịch sử"
                              >
                                <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination 2 */}
              {totalPagesHistory > 1 && (
                <div className="p-6 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trang {currentPageHistory} / {totalPagesHistory}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentPageHistory(p => Math.max(1, p - 1))}
                      disabled={currentPageHistory === 1}
                      className="p-2.5 bg-white border border-gray-100 rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
                    >
                      <TrendingDown size={18} className="rotate-90" />
                    </button>
                    <button 
                      onClick={() => setCurrentPageHistory(p => Math.min(totalPagesHistory, p + 1))}
                      disabled={currentPageHistory === totalPagesHistory}
                      className="p-2.5 bg-white border border-gray-100 rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
                    >
                      <TrendingUp size={18} className="-rotate-90" />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Prediction Detail Modal */}
        {showDetailModal && selectedPrediction && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}></div>
            <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <Info size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Chi tiết dự đoán AI</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mã phiên: #{selectedPrediction.idGiaDuDoan}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <RotateCcw className="rotate-45" size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Reason Section */}
                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-3">Lý do dự đoán từ AI</p>
                  <p className="text-gray-700 leading-relaxed font-medium italic">
                    "{selectedPrediction.ly_Do_Du_Doan}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Model sử dụng</p>
                    <p className="font-bold text-gray-900">{selectedPrediction.model_Name}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Giá đề xuất</p>
                    <p className="text-2xl font-black text-emerald-600">{selectedPrediction.gia_De_Xuat?.toLocaleString()} đ</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 flex justify-end gap-3">
                  <button 
                    onClick={() => setShowDetailModal(false)}
                    className="px-8 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                  >
                    Đóng
                  </button>
                  <button className="px-8 py-3 bg-[#2E5C44] text-white rounded-2xl font-bold hover:bg-[#244835] transition-all shadow-lg shadow-emerald-900/10 active:scale-95">
                    Áp dụng mức giá này
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Run Prediction Modal */}
        {showPredictModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => !predictLoading && setShowPredictModal(false)}></div>
            <div className="relative bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-emerald-50/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Chạy dự đoán mới</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Khởi tạo phiên AI phân tích giá</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPredictModal(false)}
                  disabled={predictLoading}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-0"
                >
                  <RotateCcw className="rotate-45" size={24} />
                </button>
              </div>

              <form onSubmit={handleRunPrediction} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Chọn phòng dự đoán</label>
                    <select 
                      value={predictRoomId}
                      onChange={(e) => setPredictRoomId(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 font-bold text-gray-700"
                      required
                    >
                      <option value="">-- Chọn phòng --</option>
                      {appliedPricing.map(room => (
                        <option key={room.idRoom} value={room.idRoom}>
                          {room.ten_Phong} (ID: {room.idRoom})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Ngày bắt đầu</label>
                      <input 
                        type="date"
                        min={today}
                        value={predictStartDate}
                        onChange={(e) => setPredictStartDate(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 font-bold text-gray-700"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Ngày kết thúc</label>
                      <input 
                        type="date"
                        min={predictStartDate || today}
                        value={predictEndDate}
                        onChange={(e) => setPredictEndDate(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 font-bold text-gray-700"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                  <AlertCircle className="text-amber-500 shrink-0" size={20} />
                  <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                    Hệ thống AI sẽ mất vài phút để phân tích dữ liệu lịch sử và đưa ra đề xuất. Bạn có thể theo dõi kết quả tại bảng Lịch sử dự đoán.
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-50 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowPredictModal(false)}
                    disabled={predictLoading}
                    className="px-8 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit"
                    disabled={predictLoading}
                    className="px-8 py-3 bg-[#2E5C44] text-white rounded-2xl font-bold hover:bg-[#244835] transition-all shadow-lg shadow-emerald-900/10 active:scale-95 flex items-center gap-2"
                  >
                    {predictLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <TrendingUp size={18} />
                        Bắt đầu dự đoán
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Approve Price Modal */}
        {showApproveModal && selectedForApprove && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => !approveLoading && setShowApproveModal(false)}></div>
            <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-blue-50/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Phê duyệt giá phòng</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phòng ID: {selectedForApprove.idRoom}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowApproveModal(false)}
                  disabled={approveLoading}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-0"
                >
                  <RotateCcw className="rotate-45" size={24} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                {!isEditingPrice ? (
                  <div className="space-y-6 text-center">
                    <div className="p-6 bg-gray-50 rounded-[24px] border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Giá AI đề xuất</p>
                      <p className="text-4xl font-black text-[#2E5C44]">{selectedForApprove.gia_De_Xuat?.toLocaleString()} đ</p>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={confirmApprove}
                        disabled={approveLoading}
                        className="w-full py-4 bg-[#2E5C44] text-white rounded-2xl font-bold hover:bg-[#244835] transition-all shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2"
                      >
                        {approveLoading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                        Phê duyệt ngay
                      </button>
                      <button 
                        onClick={() => setIsEditingPrice(true)}
                        disabled={approveLoading}
                        className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                      >
                        <Edit2 size={18} />
                        Chỉnh sửa giá
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block px-1">Giá áp dụng tùy chỉnh (đ)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                          type="number" 
                          value={customPrice}
                          onChange={(e) => setCustomPrice(e.target.value)}
                          className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 font-black text-2xl text-blue-600"
                          placeholder="Nhập giá mới..."
                          autoFocus
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium px-1 mt-2">
                        * Bạn đang thay đổi mức giá đề xuất {selectedForApprove.gia_De_Xuat?.toLocaleString()} đ của AI.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => setIsEditingPrice(false)}
                        disabled={approveLoading}
                        className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                      >
                        Quay lại
                      </button>
                      <button 
                        onClick={confirmApprove}
                        disabled={approveLoading}
                        className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
                      >
                        {approveLoading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                        Xác nhận & Duyệt
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </MainLayout>
  );
};

export default AdminAIPricing;
