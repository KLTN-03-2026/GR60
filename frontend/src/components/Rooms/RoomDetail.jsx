import React, { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DateRangePicker from '../Common/DateRangePicker';
import GuestRow from '../Common/GuestRow';
import { apiGetRoomById, apiGetBookedDates, apiGetRoomPrice } from '../../services/roomService';
import { apiGetRoomReviews } from '../../services/reviewService';
import ReviewsModal from '../Home/ReviewsModal';
import Header from '../Layout/Header';

const PRICE_PER_NIGHT = 3200000; // Giá mặc định nếu API trả về 0

const RoomDetail = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('id') || 1;

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const guestRef = useRef(null);

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookedDates, setBookedDates] = useState([]);
  const [priceData, setPriceData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);

  // User auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('homestayUser');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      localStorage.removeItem('homestayUser');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('homestayUser');
    setCurrentUser(null);
    setIsUserMenuOpen(false);
  };

  const getUserInitial = () => {
    if (!currentUser) return '?';
    const name = currentUser.hoTen || currentUser.HoTen || currentUser.email || '';
    return name.charAt(0).toUpperCase();
  };

  // Fetch data
  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      const [data, bookedData, reviewData] = await Promise.all([
        apiGetRoomById(roomId),
        apiGetBookedDates(roomId),
        apiGetRoomReviews(roomId)
      ]);
      if (data) {
        setRoom(data);
      }
      if (bookedData) {
        const mappedDates = bookedData.map(b => ({
          start: new Date(b.ngay_Nhan_Phong),
          end: new Date(b.ngay_Tra_Phong)
        }));
        setBookedDates(mappedDates);
      }
      if (reviewData) {
        setReviews(reviewData);
      }
      setLoading(false);
    };
    fetchRoom();
  }, [roomId]);

  // Fetch price when dates change
  useEffect(() => {
    const fetchPrice = async () => {
      if (checkIn && checkOut) {
        const data = await apiGetRoomPrice(roomId, checkIn, checkOut);
        if (data && typeof data.gia !== 'undefined') {
          setPriceData(data);
        } else {
          setPriceData(null);
        }
      } else {
        setPriceData(null);
      }
    };
    fetchPrice();
  }, [roomId, checkIn, checkOut]);

  // Đóng dropdown khách khi click ra ngoài
  useEffect(() => {
    const handler = (e) => {
      if (guestRef.current && !guestRef.current.contains(e.target)) setIsGuestOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const updateGuest = (type, delta) => {
    setGuests(prev => {
      let newCount = Math.max(0, prev[type] + delta);
      
      // Giới hạn số lượng tối đa theo sức chứa của phòng
      if (room) {
        if (type === 'adults') newCount = Math.min(newCount, room.soNguoiLon);
        if (type === 'children') newCount = Math.min(newCount, room.soTreEm);
      }

      let newAdults = prev.adults;
      if (type === 'adults') newCount = Math.max(1, newCount);
      if (type === 'adults' && delta < 0 && newCount === 0 && prev.children > 0) newCount = 1;
      return {
        ...prev,
        [type]: newCount,
        adults: type === 'children' ? newAdults : (type === 'adults' ? newCount : prev.adults)
      };
    });
  };

  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0 ? (reviews.reduce((acc, r) => acc + r.so_Sao, 0) / reviewCount).toFixed(1) : "0.0";
  const displayReviews = reviews.slice(0, 4);

  const guestText = `${guests.adults} Người lớn${guests.children > 0 ? `, ${guests.children} Trẻ em` : ''}`;

  const price = room?.gia && room.gia > 0 ? room.gia : PRICE_PER_NIGHT;
  const nights = checkIn && checkOut ? Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24)) : 3;

  // Xử lý giá ưu đãi đặt lịch sớm (check-in > 60 ngày)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = checkIn ? Math.ceil((checkIn.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const isEarlyBooking = diffDays > 60;

  const originalSubtotal = priceData ? priceData.gia : price * nights;
  const subtotal = (priceData && isEarlyBooking && priceData.giaDatLichSom) ? priceData.giaDatLichSom : originalSubtotal;

  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;

  const fmt = (n) => n.toLocaleString('vi-VN');

  // Loading Skeleton
  if (loading) {
    return (
      <div className="font-sans text-gray-800 bg-[#F7F5F0] min-h-screen">
        <header className="w-full py-6 px-6 md:px-10 flex items-center justify-between border-b border-gray-200/50">
           <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </header>
        <main className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-20">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-[2] w-full">
              <div className="w-full h-[400px] md:h-[500px] bg-gray-200 rounded-2xl animate-pulse mb-10"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2 animate-pulse mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <div className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
              <div className="h-32 bg-gray-200 rounded-xl animate-pulse mb-10"></div>
            </div>
            <div className="flex-1 w-full">
               <div className="h-[400px] bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Fallback nếu không có dữ liệu
  if (!room) {
    return <div className="text-center py-20">Không tìm thấy thông tin phòng!</div>;
  }

  return (
    <div className="font-sans text-gray-800 bg-[#F7F5F0] min-h-screen selection:bg-[#364132] selection:text-white">
      
      {/* Header */}
      <Header 
        isScrolled={true}
        currentUser={currentUser}
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        userMenuRef={userMenuRef}
        handleLogout={handleLogout}
        getUserInitial={getUserInitial}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-20">
        
        {/* Gallery (Phong cách Airbnb) Toàn trang */}
        <div className="mb-10 relative">
          <div className="flex flex-col md:flex-row gap-2 h-[385px] md:h-[495px] lg:h-[550px] rounded-2xl overflow-hidden shadow-sm">
            <div className="flex-1 w-full h-full relative group cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
              <img 
                src={room.dsAnh?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop'} 
                alt="Main Room" 
                className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-300" 
              />
            </div>
            <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 flex-1 w-full h-full">
              {room.dsAnh?.slice(1, 5).map((img, idx) => (
                <div key={idx} className="relative group cursor-pointer h-full w-full" onClick={() => setIsImageModalOpen(true)}>
                   <img 
                     src={img} 
                     alt={`Detail ${idx + 1}`} 
                     className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-300" 
                   />
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setIsImageModalOpen(true)}
            className="absolute bottom-6 right-6 bg-white border border-gray-900 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-gray-100 transition flex items-center gap-2 z-10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            Hiển thị tất cả {room.dsAnh?.length || 0} ảnh
          </button>
        </div>
        
        {/* Layout 2 cột */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Cột trái (Chi tiết) */}
          <div className="flex-[2] w-full">
            
            {/* Thông tin phòng */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1 text-yellow-500">
                  {[...Array(room.soSao || 5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  <span className="text-gray-600 text-base ml-2 font-medium">{avgRating} ({reviewCount} Đánh giá)</span>
                </div>
                <span className="px-3 py-1 bg-[#364132] text-[#F7F5F0] text-sm font-bold uppercase tracking-widest rounded-full shadow-sm">
                  {room.loaiPhong}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">{room.tenPhong}</h1>
              
              {/* Thẻ tóm tắt sức chứa */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <div className="bg-[#EFEBE4] p-5 rounded-xl border border-gray-200/50 flex flex-col items-center justify-center text-center">
                  <svg className="w-6 h-6 text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">Người lớn</h3>
                  <p className="text-base text-gray-600">{room.soNguoiLon} Khách</p>
                </div>
                <div className="bg-[#EFEBE4] p-5 rounded-xl border border-gray-200/50 flex flex-col items-center justify-center text-center">
                  <svg className="w-6 h-6 text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">Trẻ em</h3>
                  <p className="text-base text-gray-600">{room.soTreEm} Khách</p>
                </div>
                <div className="bg-[#EFEBE4] p-5 rounded-xl border border-gray-200/50 flex flex-col items-center justify-center text-center">
                  <svg className="w-6 h-6 text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">Giường ngủ</h3>
                  <p className="text-base text-gray-600">{room.soGiuong} Giường</p>
                </div>
              </div>

              {/* Mô tả */}
              <div className="prose prose-gray max-w-none mb-10">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-justify text-lg">
                  {room.mota}
                </p>
              </div>

              <hr className="border-gray-200 mb-10" />

              {/* Tiện nghi phòng nghỉ */}
              <div>
                <h2 className="text-2xl font-serif text-gray-900 mb-6">Tiện nghi phòng nghỉ</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                  {room.dsTienNghi?.slice(0, 9).map((tienNghi, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <svg className="w-6 h-6 mr-3 text-[#364132]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      <span className="text-base font-medium">{tienNghi.trim()}</span>
                    </div>
                  ))}
                </div>
                {room.dsTienNghi?.length > 9 && (
                  <div className="mt-8">
                    <button 
                      onClick={() => setIsAmenitiesModalOpen(true)}
                      className="px-6 py-3 border border-gray-900 rounded-lg text-base font-bold text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      Hiển thị tất cả {room.dsTienNghi.length} tiện nghi
                    </button>
                  </div>
                )}
              </div>

              <hr className="border-gray-200 my-10" />

              {/* Đánh giá */}
              <div>
                 <div className="flex items-center mb-8">
                    <h2 className="text-3xl font-serif text-gray-900 mr-4">Đánh giá từ khách hàng</h2>
                 </div>
                 <div className="flex items-center space-x-2 mb-8">
                    <span className="text-5xl font-serif text-gray-900">{avgRating}</span>
                    <div>
                        <div className="flex text-yellow-500 text-base">
                            {[...Array(Math.round(parseFloat(avgRating) || 0))].map((_, i) => (
                                <span key={i}>★</span>
                            ))}
                        </div>
                        <span className="text-base text-gray-500">Dựa trên {reviewCount} đánh giá</span>
                    </div>
                 </div>

                 {reviewCount > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {displayReviews.map((review, idx) => {
                          const initial = review.ho_Ten ? review.ho_Ten.charAt(0).toUpperCase() : '?';
                          const colors = ['text-[#364132] bg-[#EFEBE4]', 'text-blue-800 bg-blue-100', 'text-green-800 bg-green-100', 'text-amber-800 bg-amber-100'];
                          const colorClass = colors[idx % colors.length];
                          return (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center">
                                        <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center mr-3 ${colorClass}`}>{initial}</div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-base">{review.ho_Ten}</h4>
                                            <p className="text-sm text-gray-500">{new Date(review.thoi_Gian).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-500 text-sm">
                                        {[...Array(review.so_Sao || 5)].map((_, i) => (
                                            <span key={i}>★</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-base leading-relaxed line-clamp-3">
                                    "{review.noi_dung}"
                                </p>
                            </div>
                          );
                      })}
                   </div>
                 ) : (
                   <div className="text-gray-500 italic mb-8">Chưa có đánh giá nào cho phòng này.</div>
                 )}

                 {reviewCount > 4 && (
                   <button 
                     onClick={() => setIsReviewsModalOpen(true)}
                     className="border border-gray-900 text-gray-900 px-6 py-2.5 rounded-sm text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors"
                   >
                      Hiển thị tất cả {reviewCount} đánh giá
                   </button>
                 )}
              </div>

            </div>
          </div>

          {/* Cột phải (Thanh bên đặt phòng) */}
          <div className="flex-1 w-full lg:sticky lg:top-24">
            <div className="bg-[#EFEBE4] rounded-2xl p-6 md:p-8 border border-gray-200/50 shadow-sm">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-3xl font-serif text-gray-900">Thêm ngày để xem giá!</span>
                </div>
              </div>

              {/* Form chọn ngày/khách */}
              <div className="bg-transparent border border-gray-300 rounded-xl mb-6">
                <DateRangePicker
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onDatesChange={(ci, co) => { setCheckIn(ci); setCheckOut(co); }}
                  isOpen={isCalendarOpen}
                  onClose={() => setIsCalendarOpen(false)}
                  onOpen={() => setIsCalendarOpen(true)}
                  bookedDates={bookedDates}
                />
                <div className="relative" ref={guestRef}>
                  <div onClick={() => setIsGuestOpen(!isGuestOpen)} className="p-4 relative cursor-pointer hover:bg-gray-50/50 transition bg-white/50">
                    <label className="block text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Số lượng khách</label>
                    <div className="text-base font-medium text-gray-900">{guestText}</div>
                    <svg className="w-5 h-5 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  </div>
                  {isGuestOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] p-6 z-50 border border-gray-100">
                      <GuestRow 
                        title="Người lớn" 
                        subtitle="Từ 13 tuổi trở lên" 
                        count={guests.adults} 
                        onUpdate={(d) => updateGuest('adults', d)} 
                        disabledMinus={guests.adults <= 1 && guests.children > 0} 
                        disabledPlus={room && guests.adults >= room.soNguoiLon}
                      />
                      <div className="h-[1px] w-full bg-gray-100 my-5"></div>
                      <GuestRow 
                        title="Trẻ em" 
                        subtitle="Độ tuổi 2 – 12" 
                        count={guests.children} 
                        onUpdate={(d) => updateGuest('children', d)} 
                        disabledPlus={room && guests.children >= room.soTreEm}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Tính toán giá - Chỉ hiển thị khi đã chọn đủ 2 ngày */}
              {checkIn && checkOut && (
                <>
                  <div className="space-y-3 mb-6 border-b border-gray-300 pb-6">
                    <div className="flex justify-between text-base text-gray-700">
                      <span className="underline decoration-gray-400 decoration-dashed underline-offset-4">
                        {priceData !== null ? `Giá cho ${nights} đêm` : `đ${fmt(price)} x ${nights} đêm`}
                      </span>
                      {isEarlyBooking && priceData && priceData.giaDatLichSom ? (
                        <div className="flex items-center gap-2 text-lg">
                          <span className="line-through decoration-2 text-gray-500 font-medium">đ{fmt(originalSubtotal)}</span>
                          <span className="font-bold text-gray-900 border-b-2 border-gray-900 pb-[1px]">đ{fmt(subtotal)}</span>
                        </div>
                      ) : (
                        <span>đ{fmt(subtotal)}</span>
                      )}
                    </div>
                    {isEarlyBooking && priceData && priceData.giaDatLichSom && (
                      <div className="flex justify-between text-base font-medium text-emerald-700">
                        <span>Ưu đãi đặt lịch sớm (hơn 60 ngày)</span>
                        <span>-10%</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base text-gray-700">
                      <span className="underline decoration-gray-400 decoration-dashed underline-offset-4">Phí dịch vụ & Thuế</span>
                      <span>đ{fmt(serviceFee)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between font-bold text-gray-900 mb-6 text-xl">
                    <span>Tổng cộng</span>
                    <span>đ{fmt(total)}</span>
                  </div>
                </>
              )}

              <button className="w-full bg-[#364132] text-white py-4 rounded-xl font-medium hover:bg-[#283125] transition-colors shadow-md">
                Đặt phòng ngay
              </button>

              <p className="text-center text-[11px] text-gray-500 mt-4 italic leading-relaxed px-4">
                Miễn phí hủy phòng trước 48 giờ. Không thu phí thanh toán trước.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#364132] text-[#F7F5F0] py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1">
            <img src="/logo.png" alt="Lumière Stay Logo" className="h-12 mb-6 w-auto object-contain rounded" />
            <p className="text-sm text-white/70 leading-relaxed pr-4">
              Nơi tìm thấy sự tĩnh lặng giữa thiên nhiên hùng vĩ.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-widest mb-6 text-white/60">Khám Phá</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li><Link to="#" className="hover:text-white transition">Về chúng tôi</Link></li>
              <li><Link to="#" className="hover:text-white transition">Phòng nghỉ</Link></li>
              <li><Link to="#" className="hover:text-white transition">Dịch vụ</Link></li>
              <li><Link to="#" className="hover:text-white transition">Bền vững</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-widest mb-6 text-white/60">Hỗ Trợ</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li><Link to="#" className="hover:text-white transition">Điều khoản</Link></li>
              <li><Link to="#" className="hover:text-white transition">Bảo mật</Link></li>
              <li><Link to="#" className="hover:text-white transition">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-widest mb-6 text-white/60">Bản Tin</h4>
            <p className="text-sm text-white/80 mb-4">
              Đăng ký để nhận thông tin ưu đãi mới nhất.
            </p>
            <div className="flex items-stretch w-full max-w-sm">
              <input 
                type="email" 
                placeholder="Email của bạn" 
                className="bg-[#283125] text-white text-sm px-4 py-2.5 outline-none w-full placeholder-white/40 border border-[#283125] focus:border-white/30 transition-colors"
              />
              <button className="bg-[#D1C2A5] text-[#364132] font-bold text-xs px-6 tracking-widest hover:bg-[#c4b391] transition-colors">
                GỬI
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-[11px] text-white/50">
          <p>© 2024 Lumière Stay. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <button className="hover:text-white transition flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
            </button>
            <button className="hover:text-white transition flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
            </button>
          </div>
        </div>
      </footer>

      {/* Reviews Modal */}
      <ReviewsModal 
        isOpen={isReviewsModalOpen} 
        onClose={() => setIsReviewsModalOpen(false)} 
        reviews={reviews} 
      />
      {/* Amenities Modal */}
      {isAmenitiesModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAmenitiesModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-3xl font-serif text-gray-900">Tất cả tiện nghi</h3>
              <button 
                onClick={() => setIsAmenitiesModalOpen(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                {room.dsTienNghi?.map((tienNghi, index) => (
                  <div key={index} className="flex items-center text-gray-700 py-3 border-b border-gray-50 last:border-0">
                    <svg className="w-6 h-6 mr-4 text-[#364132]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-lg font-medium">{tienNghi.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col overflow-hidden animate-in fade-in duration-200">
          <div className="p-4 md:p-6 flex justify-between items-center border-b border-gray-200">
            <button 
              onClick={() => setIsImageModalOpen(false)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h3 className="font-serif text-xl">{room.tenPhong} - Tất cả ảnh</h3>
            <div className="w-10"></div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar">
            <div className="max-w-4xl mx-auto flex flex-col gap-6 md:gap-10">
              {room.dsAnh?.map((img, idx) => (
                <div key={idx} className="w-full">
                  <img src={img} alt={`Hình ảnh ${idx + 1}`} className="w-full h-auto rounded-lg shadow-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetail;
