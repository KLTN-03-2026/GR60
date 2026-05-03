import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../Layout/MainLayout';
import { Calendar, ChevronRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { apiGetBookingHistory } from '../../services/roomService';

const BookingHistory = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const stored = localStorage.getItem('homestayUser');
        if (stored) {
          const user = JSON.parse(stored);
          const userId = user.id || user.Id;
          const data = await apiGetBookingHistory(userId);
          
          // Map API data to UI structure
          const mappedData = data.map(item => ({
            id: item.id_Booking,
            roomName: item.ten_Phong,
            date: formatBookingDate(item.ngay_Nhan_Phong, item.ngay_Tra_Phong),
            price: formatCurrency(item.tong_Tien),
            status: mapStatus(item.trang_Thai),
            image: item.url_Anh,
            ...getStatusStyles(item.trang_Thai)
          }));
          
          setBookings(mappedData);
        }
      } catch (err) {
        console.error('Lỗi khi tải lịch sử đặt phòng:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const formatBookingDate = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const months = ['Th01', 'Th02', 'Th03', 'Th04', 'Th05', 'Th06', 'Th07', 'Th08', 'Th09', 'Th10', 'Th11', 'Th12'];
    
    const startStr = `${s.getDate()} ${months[s.getMonth()]}`;
    const endStr = `${e.getDate()} ${months[e.getMonth()]}, ${e.getFullYear()}`;
    
    return `${startStr} – ${endStr}`;
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

  const getStatusStyles = (status) => {
    switch (status) {
      case 'da_hoan_thanh':
        return {
          statusColor: 'bg-green-100 text-green-800 border border-green-200',
          icon: <CheckCircle2 size={16} className="mr-2" />
        };
      case 'da_huy':
        return {
          statusColor: 'bg-red-50 text-red-700 border border-red-100',
          icon: <XCircle size={16} className="mr-2" />
        };
      case 'dang_xu_ly':
      default:
        return {
          statusColor: 'bg-dark text-white',
          icon: <Clock size={16} className="mr-2" />
        };
    }
  };

  const filters = ['Tất cả', 'Đã hoàn thành', 'Đang xử lý', 'Đã hủy'];

  const filteredBookings = activeFilter === 'Tất cả' 
    ? bookings 
    : bookings.filter(b => b.status === activeFilter);

  // Pagination Logic
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <MainLayout forceScrolled={true} requireAuth={true}>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-serif text-dark mb-4 tracking-tight">
            Lịch sử đặt phòng
          </h1>
          <p className="text-gray-light text-lg max-w-2xl leading-relaxed">
            Xem lại thông tin những khách sạn và hành trình của bạn tại 60 Homes
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer
                ${activeFilter === filter 
                  ? 'bg-dark text-white shadow-lg transform scale-105' 
                  : 'bg-white text-dark border border-gray-200 hover:border-dark hover:bg-gray-50'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Booking List */}
        <div className="space-y-6">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-32 bg-gray-200 rounded-xl"></div>
                <div className="flex-grow space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : currentBookings.length > 0 ? (
            currentBookings.map((booking) => (
              <div 
                key={booking.id} 
                className="group bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row gap-6 items-center"
              >
                {/* Image Container */}
                <div className="w-full md:w-48 h-40 md:h-32 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50">
                  <img 
                    src={booking.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop'} 
                    alt={booking.roomName} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop';
                    }}
                  />
                </div>

                {/* Content Container */}
                <div className="flex-grow w-full">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                    <div className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider mb-2 md:mb-0 ${booking.statusColor}`}>
                      {booking.icon}
                      {booking.status}
                    </div>
                    <div className="text-xl md:text-2xl font-serif text-dark font-semibold">
                      {booking.price}
                    </div>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-serif text-dark mb-2 group-hover:text-primary transition-colors">
                    {booking.roomName}
                  </h3>
                  
                  <div className="flex items-center text-gray-light text-sm mb-5">
                    <Calendar size={16} className="mr-2" />
                    {booking.date}
                  </div>

                  <button 
                    onClick={() => navigate(`/booking-detail?id=${booking.id}`)}
                    className="inline-flex items-center px-6 py-2 border border-gray-200 rounded-lg text-xs font-bold text-dark hover:bg-dark hover:text-white hover:border-dark transition-all duration-300 uppercase tracking-widest cursor-pointer group/btn"
                  >
                    Xem chi tiết
                    <ChevronRight size={14} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-light text-lg">Bạn chưa có đơn đặt phòng nào.</p>
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {!loading && totalPages > 1 && (
          <div className="mt-16 flex flex-col items-center">
            <div className="flex items-center gap-2">
              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 cursor-pointer
                    ${currentPage === pageNum 
                      ? 'bg-dark text-white shadow-md scale-110' 
                      : 'text-gray-400 hover:text-dark hover:bg-gray-100'
                    }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* Next Button */}
              {currentPage < totalPages && (
                <button
                  onClick={() => {
                    setCurrentPage(prev => prev + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="ml-4 text-primary font-bold text-sm uppercase tracking-widest hover:translate-x-1 transition-transform cursor-pointer flex items-center"
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </button>
              )}
            </div>
            
            <p className="mt-8 text-gray-light text-[11px] uppercase tracking-widest">
              Trang {currentPage} / {totalPages}
            </p>
          </div>
        )}

        {/* Footer Info */}
        {!loading && (
          <div className="mt-10 text-center">
            <p className="text-gray-light text-xs italic">
              Hiển thị {currentBookings.length} trên tổng số {filteredBookings.length} đơn đặt phòng
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BookingHistory;
