import React, { useState, useEffect } from 'react';
import MainLayout from '../Layout/MainLayout';
import AdminLayout from './AdminLayout';
import { 
  Smile, 
  Reply, 
  Flag, 
  Edit, 
  History, 
  ChevronLeft, 
  ChevronRight,
  Star,
  MessageSquare,
  Loader2,
  Frown,
  Meh,
  Search,
  X,
  Send,
  Trash2
} from 'lucide-react';
import { apiGetAdminReviews, apiReplyReview, apiDeleteReview, apiEditReply } from '../../services/adminReviewService';
import { showToast } from '../Common/Notification';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reply states
  const [replyModal, setReplyModal] = useState({ isOpen: false, review: null, noiDung: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter states
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await apiGetAdminReviews();
      // Sort by newest first
      data.sort((a, b) => new Date(b.thoi_Gian) - new Date(a.thoi_Gian));
      setReviews(data);
    } catch (error) {
      console.error(error);
      showToast('Lỗi khi tải danh sách đánh giá', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openReplyModal = (review) => {
    // If editing an existing reply, populate the text
    const initialText = review.id_Phan_Hoi > 0 ? review.noi_dung_Phan_Hoi : '';
    setReplyModal({ isOpen: true, review, noiDung: initialText });
  };

  const closeReplyModal = () => {
    setReplyModal({ isOpen: false, review: null, noiDung: '' });
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyModal.noiDung.trim()) {
      showToast('Vui lòng nhập nội dung phản hồi', 'error');
      return;
    }

    let idUser = 1; // Default
    const storedUser = localStorage.getItem('homestayUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        idUser = user.idUser || user.IdUser || 1; 
      } catch(e) {}
    }

    try {
      setIsSubmitting(true);
      
      if (replyModal.review.id_Phan_Hoi > 0) {
        // Mode: Sửa phản hồi
        await apiEditReply(replyModal.review.id_Phan_Hoi, replyModal.noiDung);
        showToast('Cập nhật phản hồi thành công!', 'success');
      } else {
        // Mode: Thêm phản hồi mới
        const payload = {
          IdUser: idUser,
          IdReview: replyModal.review.id_Danh_Gia,
          NoiDung: replyModal.noiDung
        };
        await apiReplyReview(payload);
        showToast('Gửi phản hồi thành công!', 'success');
      }

      closeReplyModal();
      fetchReviews(); // Reload data
    } catch (error) {
      showToast(error.message || 'Lỗi khi gửi phản hồi', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.')) {
      try {
        await apiDeleteReview(id);
        showToast('Xóa đánh giá thành công!', 'success');
        fetchReviews(); // Reload data
      } catch (error) {
        showToast(error.message || 'Lỗi khi xóa đánh giá', 'error');
      }
    }
  };

  // Helper to render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-200 fill-gray-200" />);
      }
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  // Compute stats
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((sum, r) => sum + r.so_Sao, 0) / totalReviews).toFixed(1)
    : 0;
  
  const repliedCount = reviews.filter(r => r.id_Phan_Hoi > 0).length;
  const replyRate = totalReviews > 0 ? Math.round((repliedCount / totalReviews) * 100) : 0;

  // AI Sentiment overall
  let dominantSentiment = 'Chưa có';
  let SentimentIcon = Meh;
  let sentimentColor = 'text-gray-500';
  let sentimentBg = 'bg-gray-50';

  if (totalReviews > 0) {
      const positiveCount = reviews.filter(r => r.trang_Thai === 'tich_cuc').length;
      const negativeCount = reviews.filter(r => r.trang_Thai === 'tieu_cuc').length;
      if (positiveCount >= negativeCount) {
          dominantSentiment = 'Tích cực';
          SentimentIcon = Smile;
          sentimentColor = 'text-emerald-600';
          sentimentBg = 'bg-emerald-50';
      } else {
          dominantSentiment = 'Tiêu cực';
          SentimentIcon = Frown;
          sentimentColor = 'text-red-600';
          sentimentBg = 'bg-red-50';
      }
  }

  // Lọc đánh giá
  const filteredReviews = reviews.filter(review => {
    const matchSearch = review.ho_Ten?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRating = ratingFilter === 'all' || review.so_Sao === Number(ratingFilter);
    const matchStatus = statusFilter === 'all' || review.trang_Thai === statusFilter;
    
    // Nếu trạng thái là trung lập nhưng API trả về rỗng hoặc null, giả định so_sao 3 hoặc 4
    if (statusFilter === 'trung_lap') {
        const isNeutral = review.trang_Thai === 'trung_lap' || (!review.trang_Thai && (review.so_Sao === 3 || review.so_Sao === 4));
        return matchSearch && matchRating && isNeutral;
    }
    
    return matchSearch && matchRating && matchStatus;
  });

  return (
    <MainLayout forceScrolled={true} requireAuth={true} hideFooter={true}>
      <AdminLayout>
        <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 pb-24">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Quản lý đánh giá</h1>
                    <p className="text-gray-500 mt-2 font-medium">Theo dõi và phản hồi cảm nhận của khách hàng.</p>
                </div>
                
                {/* Bộ Lọc */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                        <input 
                            type="text" 
                            placeholder="Nhập tên khách hàng..." 
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full pl-5 pr-12 py-3 bg-white border border-gray-200 rounded-[20px] shadow-sm text-sm focus:ring-2 focus:ring-[#2E5C44]/20 focus:border-[#2E5C44] outline-none font-medium text-gray-700 transition-all"
                        />
                        <button 
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-50 text-gray-400 hover:text-[#2E5C44] hover:bg-emerald-50 rounded-xl transition-colors"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </div>

                    <select 
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="px-5 py-3 bg-white border border-gray-200 rounded-[20px] shadow-sm text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#2E5C44]/20 focus:border-[#2E5C44] cursor-pointer appearance-none pr-10"
                        style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                    >
                        <option value="all">Tất cả số sao</option>
                        <option value="5">5 Sao (Tuyệt vời)</option>
                        <option value="4">4 Sao (Tốt)</option>
                        <option value="3">3 Sao (Khá)</option>
                        <option value="2">2 Sao (Kém)</option>
                        <option value="1">1 Sao (Tệ)</option>
                    </select>

                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-5 py-3 bg-white border border-gray-200 rounded-[20px] shadow-sm text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#2E5C44]/20 focus:border-[#2E5C44] cursor-pointer appearance-none pr-10"
                        style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="tich_cuc">Tích cực</option>
                        <option value="trung_lap">Trung lập</option>
                        <option value="tieu_cuc">Tiêu cực</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-100 flex flex-col justify-center">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Rating trung bình</p>
                    <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-black text-gray-900">{avgRating}</span>
                        {renderStars(Math.round(avgRating))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-100 flex flex-col justify-center">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Tổng đánh giá</p>
                    <div className="flex items-end gap-3">
                        <span className="text-4xl font-black text-gray-900">{totalReviews}</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-100 flex flex-col justify-center">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Tỷ lệ phản hồi</p>
                    <span className="text-4xl font-black text-gray-900">{replyRate}%</span>
                    <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
                        <div className="bg-[#2E5C44] h-2 rounded-full transition-all duration-500" style={{ width: `${replyRate}%` }}></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-100 flex flex-col justify-center">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Tâm trạng AI (Tổng quan)</p>
                    <div className="flex items-center gap-3 mt-1">
                        <div className={`w-12 h-12 ${sentimentBg} ${sentimentColor} rounded-2xl flex items-center justify-center`}>
                            <SentimentIcon size={28} />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">{dominantSentiment}</span>
                    </div>
                </div>
            </div>

            {/* Review Grid */}
            {loading ? (
               <div className="flex justify-center items-center py-20">
                 <Loader2 className="w-10 h-10 animate-spin text-[#2E5C44]" />
               </div>
            ) : filteredReviews.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[28px] border border-gray-100 shadow-sm">
                    <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">Không tìm thấy đánh giá nào</h3>
                    <p className="text-gray-500 mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    {filteredReviews.map((review) => {
                        const isReplied = review.id_Phan_Hoi > 0;
                        const isNegative = review.trang_Thai === 'tieu_cuc';
                        const isPositive = review.trang_Thai === 'tich_cuc';

                        return (
                            <div key={review.id_Danh_Gia} className={`border p-8 rounded-[28px] shadow-sm relative transition-all group ${
                                isNegative ? 'bg-red-50/50 border-red-100 border-l-4 border-l-red-500' : 'bg-white border-gray-100 hover:shadow-md'
                            }`}>
                                <div className="flex justify-between mb-6">
                                    <div className="flex gap-4">
                                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xl border-2 border-white shadow-sm shrink-0">
                                            {review.ho_Ten ? review.ho_Ten.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">{review.ho_Ten || 'Khách hàng'}</h4>
                                            <p className="text-sm font-medium text-gray-500 mt-0.5">{review.ten_Phong} • {new Date(review.thoi_Gian).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="mb-2 flex justify-end">{renderStars(review.so_Sao)}</div>
                                        {isPositive && <span className="text-[11px] bg-emerald-50 text-emerald-700 px-3 py-1 rounded-xl uppercase font-bold tracking-wider inline-block">Tích cực</span>}
                                        {isNegative && <span className="text-[11px] bg-red-100 text-red-600 px-3 py-1 rounded-xl uppercase font-bold tracking-wider inline-block">Tiêu cực</span>}
                                        {!isPositive && !isNegative && <span className="text-[11px] bg-gray-100 text-gray-600 px-3 py-1 rounded-xl uppercase font-bold tracking-wider inline-block">Trung lập</span>}
                                    </div>
                                </div>

                                <p className={`text-base leading-relaxed mb-6 font-medium ${isNegative ? 'text-gray-700' : 'text-gray-600'}`}>
                                    "{review.noi_dung}"
                                </p>

                                {isReplied && (
                                    <div className="bg-gray-50/80 p-4 rounded-2xl mb-6 border border-gray-200/60">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-sm text-gray-900">Phản hồi từ {review.ho_Ten_Phan_Hoi}:</span>
                                            <span className="text-xs text-gray-500 font-medium">{new Date(review.thoi_Gian_Phan_Hoi).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">"{review.noi_dung_Phan_Hoi}"</p>
                                    </div>
                                )}

                                <div className={`flex flex-wrap gap-4 pt-6 ${isNegative ? 'border-t border-red-100/50' : 'border-t border-gray-100'}`}>
                                    {isReplied ? (
                                        <>
                                            <button className="bg-emerald-50 text-emerald-700 px-6 py-2.5 rounded-[20px] text-sm font-bold flex items-center cursor-default"><MessageSquare className="w-4 h-4 mr-2" /> Đã phản hồi</button>
                                            <button 
                                                onClick={() => openReplyModal(review)}
                                                className="flex items-center text-gray-500 hover:text-gray-900 text-sm px-4 py-2.5 font-bold transition-colors"
                                            >
                                                <Edit className="w-4 h-4 mr-2" />Sửa phản hồi
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={() => openReplyModal(review)}
                                                className="bg-[#2E5C44] hover:bg-[#244835] text-white px-6 py-2.5 rounded-[20px] text-sm font-bold flex items-center transition-colors shadow-lg shadow-emerald-900/20 active:scale-95"
                                            >
                                                <Reply className="w-4 h-4 mr-2" />Phản hồi
                                            </button>
                                        </>
                                    )}
                                    
                                    {isNegative && (
                                        <button className="bg-red-100 hover:bg-red-200 transition-colors text-red-700 px-6 py-2.5 rounded-[20px] text-sm font-bold italic flex items-center">
                                            <Flag className="w-4 h-4 mr-2" />Ưu tiên xử lý
                                        </button>
                                    )}

                                    <button 
                                        onClick={() => handleDeleteReview(review.id_Danh_Gia)}
                                        className="flex items-center text-red-400 hover:text-red-600 text-sm px-4 py-2.5 font-bold transition-colors ml-auto"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />Xóa
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

          </div>
        </div>

        {/* Modal Phản hồi */}
        {replyModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-[28px] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#F8FAFC]">
                <h3 className="text-xl font-bold text-gray-900">
                  {replyModal.review?.id_Phan_Hoi > 0 ? 'Sửa phản hồi' : 'Phản hồi đánh giá'}
                </h3>
                <button 
                  onClick={closeReplyModal}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors shadow-sm"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-gray-50 p-4 rounded-2xl mb-6 border border-gray-100">
                  <div className="flex gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs shrink-0">
                      {replyModal.review?.ho_Ten ? replyModal.review.ho_Ten.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{replyModal.review?.ho_Ten}</p>
                      <div className="mt-0.5">{renderStars(replyModal.review?.so_Sao)}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">"{replyModal.review?.noi_dung}"</p>
                </div>

                <form onSubmit={handleReplySubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1 block mb-2">Nội dung phản hồi</label>
                      <textarea 
                        rows="4"
                        value={replyModal.noiDung}
                        onChange={(e) => setReplyModal({...replyModal, noiDung: e.target.value})}
                        placeholder="Nhập phản hồi của bạn để khách hàng nhìn thấy..."
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-[20px] focus:ring-2 focus:ring-[#2E5C44]/20 focus:border-[#2E5C44] transition-all font-medium text-gray-700 resize-none outline-none shadow-sm"
                        autoFocus
                      ></textarea>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button 
                        type="button"
                        onClick={closeReplyModal}
                        className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-600 rounded-[20px] font-bold hover:bg-gray-50 transition-colors"
                      >
                        Hủy
                      </button>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-[2] py-3.5 bg-[#2E5C44] text-white rounded-[20px] font-bold hover:bg-[#244835] transition-all shadow-lg shadow-emerald-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                        {isSubmitting ? 'Đang gửi...' : 'Gửi phản hồi'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </MainLayout>
  );
};

export default AdminReviews;
