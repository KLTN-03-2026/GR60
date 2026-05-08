import React from 'react';
import { avatarColors } from './TestimonialCard';

const ReviewsModal = ({ isOpen, onClose, reviews }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal content */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-2xl font-serif text-dark">Tất cả đánh giá</h3>
            <p className="text-gray-light text-sm mt-1">{reviews.length} đánh giá từ khách hàng</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal body - scrollable */}
        <div className="overflow-y-auto px-8 py-6 space-y-5 custom-scrollbar">
          {reviews.map((review, idx) => (
            <div key={idx} className="flex gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100/80 transition-colors">
              {/* Avatar */}
              <div className={`w-11 h-11 rounded-full ${avatarColors[idx % avatarColors.length]} text-gray-800 flex items-center justify-center font-bold text-sm shrink-0`}>
                {review.ho_Ten ? review.ho_Ten.charAt(0).toUpperCase() : '?'}
              </div>
              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-dark text-sm truncate">{review.ho_Ten}</h4>
                  <span className="text-xs text-gray-light shrink-0 ml-3">{new Date(review.thoi_Gian).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex space-x-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={`text-xs ${i < review.so_Sao ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                    ))}
                  </div>
                  {review.trang_Thai && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        review.trang_Thai === 'tich_cuc' ? 'bg-green-100 text-green-700' :
                        review.trang_Thai === 'tieu_cuc' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                    }`}>
                        {review.trang_Thai === 'tich_cuc' ? 'Tích cực' : review.trang_Thai === 'tieu_cuc' ? 'Tiêu cực' : 'Trung lập'}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{review.noi_dung}</p>
                
                {review.noi_dung_Phan_Hoi && (
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mt-2">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#364132] text-white flex items-center justify-center text-[10px] font-bold">
                                {(review.ho_Ten_Phan_Hoi || 'A').charAt(0).toUpperCase()}
                            </div>
                            <h5 className="font-bold text-gray-800 text-sm">
                                {review.ho_Ten_Phan_Hoi || 'Quản trị viên'}
                            </h5>
                        </div>
                        {review.thoi_Gian_Phan_Hoi && (
                            <span className="text-xs text-gray-400">
                                {new Date(review.thoi_Gian_Phan_Hoi).toLocaleDateString('vi-VN')}
                            </span>
                        )}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed pl-8">
                        "{review.noi_dung_Phan_Hoi}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;
