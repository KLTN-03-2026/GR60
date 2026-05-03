import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MainLayout from '../Layout/MainLayout';
import { ArrowLeft, Calendar, User, CreditCard, MapPin, Receipt, ShieldCheck } from 'lucide-react';
import { apiGetBookingDetail } from '../../services/roomService';

const BookingDetail = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('id');
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!bookingId) return;
      try {
        setLoading(true);
        const data = await apiGetBookingDetail(bookingId);
        if (data) {
          setBooking(data);
        }
      } catch (err) {
        console.error('Lỗi khi tải chi tiết đặt phòng:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [bookingId]);

  const formatFullDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(amount)
      .replace('₫', 'đ');
  };

  const mapStatus = (status) => {
    switch (status) {
      case 'da_hoan_thanh': return 'Đã hoàn thành';
      case 'dang_xu_ly': return 'Đang xử lý';
      case 'da_huy': return 'Đã hủy';
      default: return 'Đang xử lý';
    }
  };

  if (loading) {
    return (
      <MainLayout forceScrolled={true} requireAuth={true}>
        <div className="container mx-auto px-4 py-16 max-w-6xl animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 h-[600px] bg-gray-200 rounded-[2rem]"></div>
                <div className="h-[400px] bg-gray-200 rounded-[2rem]"></div>
            </div>
        </div>
      </MainLayout>
    );
  }

  if (!booking) {
    return (
      <MainLayout forceScrolled={true} requireAuth={true}>
        <div className="container mx-auto px-4 py-32 text-center">
            <h1 className="text-3xl font-serif text-dark mb-4">Không tìm thấy thông tin đơn hàng</h1>
            <button onClick={() => navigate('/booking-history')} className="text-primary font-bold uppercase tracking-widest text-sm">Quay lại lịch sử</button>
        </div>
      </MainLayout>
    );
  }

  // Caculate derived values
  const nights = Math.round((new Date(booking.ngay_Tra_Phong) - new Date(booking.ngay_Nhan_Phong)) / (1000 * 60 * 60 * 24)) || 1;
  const serviceFee = Math.round(booking.tong_Tien * 0.1);
  const roomSubtotal = booking.tong_Tien - serviceFee;

  return (
    <MainLayout forceScrolled={true} requireAuth={true}>
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/booking-history')}
          className="flex items-center text-gray-light hover:text-dark transition-colors mb-10 group cursor-pointer text-lg"
        >
          <ArrowLeft size={24} className="mr-3 group-hover:-translate-x-1 transition-transform" />
          Quay lại lịch sử
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Header Info */}
            <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-serif text-dark mb-2">Chi tiết đặt phòng</h1>
                  <p className="text-gray-light text-base font-medium tracking-wider">MÃ ĐƠN: #{booking.id_Booking}</p>
                </div>
                <span className="px-6 py-2 bg-dark text-white text-sm font-bold uppercase tracking-widest rounded-full">
                  {mapStatus(booking.trang_Thai)}
                </span>
              </div>
              
              <div className="relative h-80 md:h-[28rem] rounded-3xl overflow-hidden mb-10 shadow-inner bg-gray-50">
                <img 
                    src={booking.url_Anh || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop'} 
                    alt={booking.ten_Phong} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <h2 className="text-3xl md:text-4xl font-serif">{booking.ten_Phong}</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-dark shrink-0">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold text-gray-light tracking-widest mb-2">Thời gian lưu trú</p>
                    <p className="text-dark font-medium text-lg">{formatFullDate(booking.ngay_Nhan_Phong)} — {formatFullDate(booking.ngay_Tra_Phong)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-dark shrink-0">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold text-gray-light tracking-widest mb-2">Số lượng khách</p>
                    <p className="text-dark font-medium text-lg">{booking.so_Nguoi_Lon} Người lớn, {booking.so_Tre_em} Trẻ em</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-dark shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold text-gray-light tracking-widest mb-2">Địa điểm</p>
                    <p className="text-dark font-medium text-lg leading-relaxed">{booking.dia_chi}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-dark shrink-0">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold text-gray-light tracking-widest mb-2">Đánh giá trung bình</p>
                    <p className="text-dark font-medium text-lg flex items-center gap-1">
                        ★ {booking.so_Sao} <span className="text-gray-light text-sm font-normal">(Rating phòng)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Policies Section */}
            <div className="bg-[#F9F7F2] rounded-[2rem] p-10 border border-[#E8E1D3]">
              <h3 className="text-2xl font-serif text-dark mb-8 flex items-center gap-3">
                <ShieldCheck className="text-primary" size={28} />
                Chính sách lưu trú
              </h3>
              <ul className="space-y-6 text-base text-gray-600 leading-relaxed">
                <li className="flex gap-4">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2.5 shrink-0"></span>
                  Nhận phòng từ 14:00 và trả phòng trước 12:00.
                </li>
                <li className="flex gap-4">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2.5 shrink-0"></span>
                  Miễn phí hủy phòng trước 48 giờ kể từ lúc đặt phòng.
                </li>
                <li className="flex gap-4">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2.5 shrink-0"></span>
                  Vui lòng mang theo căn cước công dân hoặc hộ chiếu khi làm thủ tục.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Billing */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 sticky top-32">
              <h3 className="text-2xl font-serif text-dark mb-8 flex items-center gap-3">
                <Receipt className="text-dark" size={24} />
                Chi tiết hóa đơn
              </h3>
              
              <div className="space-y-5 mb-10">
                <div className="flex justify-between text-base">
                  <span className="text-gray-light italic">Ngày đặt đơn</span>
                  <span className="text-dark font-medium">{formatFullDate(booking.ngay_Tao)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-light">Giá phòng ({nights} đêm)</span>
                  <span className="text-dark font-medium">{formatCurrency(roomSubtotal)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-light">Phí dịch vụ (10%)</span>
                  <span className="text-dark font-medium">{formatCurrency(serviceFee)}</span>
                </div>
                <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xl font-serif text-dark">Tổng tiền</span>
                  <span className="text-3xl font-serif text-dark font-bold">{formatCurrency(booking.tong_Tien)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => navigate(`/room-detail?id=${booking.idPhong}`)}
                  className="w-full py-5 bg-dark text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-[#333] transition-all shadow-xl shadow-gray-200 cursor-pointer"
                >
                  Đánh giá phòng
                </button>
                <button 
                  onClick={() => navigate(`/room-detail?id=${booking.idPhong}`)}
                  className="w-full py-5 bg-white text-dark border-2 border-dark rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Đặt phòng lại
                </button>
              </div>
              
              <p className="text-xs text-center text-gray-light mt-8 leading-relaxed">
                Hóa đơn này được tạo tự động bởi hệ thống 60 Homes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookingDetail;
