import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import Header from '../Layout/Header';
import Hero from './Hero';
import RoomSection from '../Rooms/RoomSection';
import RoomCard from '../Rooms/RoomCard';
import TestimonialCard, { avatarColors } from './TestimonialCard';
import ReviewsModal from './ReviewsModal';
import FadeInSection from '../Common/FadeInSection';
import Footer from '../Layout/Footer';

// Services
import { apiSearchRooms } from '../../services/roomService';
import { apiGetReviews } from '../../services/reviewService';
import { apiLogout } from '../../services/authService';

const Home = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // User auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Search State
  const [searchAddress, setSearchAddress] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [guestData, setGuestData] = useState({ adults: 2, children: 0 });
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const guestDropdownRef = useRef(null);

  const ratingOptions = [
    { value: '5', label: '5 Sao' },
    { value: '4', label: '4+ Sao' },
    { value: '3', label: '3+ Sao' },
    { value: '2', label: '2+ Sao' },
    { value: '1', label: '1+ Sao' },
    { value: 'all', label: 'Tất cả' },
  ];
  const [selectedRating, setSelectedRating] = useState(ratingOptions[5]);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const ratingRef = useRef(null);

  // Search results state
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const searchResultsRef = useRef(null);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  // Load user from localStorage on mount
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

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      const data = await apiGetReviews();
      setReviews(data);
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (event) => {
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target)) {
        setIsGuestOpen(false);
      }
      if (ratingRef.current && !ratingRef.current.contains(event.target)) {
        setIsRatingOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener("mousedown", handleClickOutside);
        document.documentElement.style.scrollBehavior = 'auto';
    }
  }, []);

  const totalGuests = guestData.adults + guestData.children;
  
  const updateGuestCount = (type, delta) => {
    setGuestData(prev => {
      let newCount = Math.max(0, prev[type] + delta);
      let newAdults = prev.adults;
      
      if (type === 'children' && delta > 0 && prev.adults === 0) {
        newAdults = 1; 
      }
      
      if (type === 'adults' && delta < 0 && newCount === 0 && prev.children > 0) {
        newCount = 1;
      }

      return {
        ...prev,
        [type]: newCount,
        adults: type === 'children' ? newAdults : (type === 'adults' ? newCount : prev.adults)
      };
    });
  };

  const handleSearch = async () => {
    try {
      setSearchLoading(true);
      setSearchError(null);

      const params = {
        DiaChi: searchAddress.trim(),
        MucGiaMin: priceMin,
        MucGiaMax: priceMax,
        SoSao: selectedRating.value,
        SoNguoiLon: guestData.adults,
        SoTreEm: guestData.children
      };

      const data = await apiSearchRooms(params);
      setSearchResults(data);
      
      if (data.length === 0) {
        setSearchError('Không tìm thấy phòng phù hợp');
      }

      setTimeout(() => {
        searchResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setSearchError('Lỗi kết nối máy chủ. Vui lòng thử lại.');
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchResults(null);
    setSearchError(null);
    setSearchAddress('');
    setPriceMin('');
    setPriceMax('');
    setGuestData({ adults: 2, children: 0 });
    setSelectedRating(ratingOptions[5]);
  };

  const handleLogout = async () => {
    await apiLogout();
    localStorage.removeItem('homestayUser');
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const getUserInitial = () => {
    if (!currentUser) return '?';
    const name = currentUser.hoTen || currentUser.HoTen || currentUser.name || '';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="font-sans text-gray-800 bg-[#F9F8F6] min-h-screen">
      <Header 
        isScrolled={isScrolled}
        currentUser={currentUser}
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        userMenuRef={userMenuRef}
        handleLogout={handleLogout}
        getUserInitial={getUserInitial}
      />

      <Hero 
        searchAddress={searchAddress}
        setSearchAddress={setSearchAddress}
        priceMin={priceMin}
        setPriceMin={setPriceMin}
        priceMax={priceMax}
        setPriceMax={setPriceMax}
        guestData={guestData}
        totalGuests={totalGuests}
        isGuestOpen={isGuestOpen}
        setIsGuestOpen={setIsGuestOpen}
        guestDropdownRef={guestDropdownRef}
        updateGuestCount={updateGuestCount}
        selectedRating={selectedRating}
        ratingOptions={ratingOptions}
        isRatingOpen={isRatingOpen}
        setIsRatingOpen={setIsRatingOpen}
        ratingRef={ratingRef}
        setSelectedRating={setSelectedRating}
        handleSearch={handleSearch}
      />

      <main className="max-w-7xl mx-auto px-6 py-20">
        {searchResults !== null ? (
          <div ref={searchResultsRef} className="pt-10 scroll-mt-24">
            <div className="flex items-center justify-between mb-10 border-b border-gray-200 pb-6">
              <h2 className="text-3xl font-serif text-dark tracking-tight">Kết quả tìm kiếm</h2>
              <button 
                onClick={clearSearch}
                className="shrink-0 ml-6 flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 text-sm font-medium text-dark hover:bg-dark hover:text-white transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Xóa tìm kiếm
              </button>
            </div>

            {searchError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <svg className="w-12 h-12 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-red-600 font-semibold mb-1">{searchError}</p>
              </div>
            )}

            {searchLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                    <div className="aspect-video bg-gray-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-px bg-gray-100" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!searchLoading && searchResults && (
              <>
                <p className="text-gray-light text-sm mb-6">
                  Tìm thấy <span className="font-bold text-dark">{searchResults.length}</span> phòng phù hợp
                </p>
                {searchResults.length === 0 ? (
                  <div className="bg-gray-50 rounded-2xl p-16 text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-5" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-dark font-serif text-xl mb-2">Không tìm thấy phòng nào</p>
                    <p className="text-gray-light text-sm">Hãy thử thay đổi tiêu chí tìm kiếm để có thêm kết quả.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in">
                    {searchResults.map((room) => (
                      <RoomCard key={room.id} room={room} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <>
            <FadeInSection>
              <RoomSection
                title="Phòng VIP"
                fetchUrl="https://localhost:7092/api/rooms?type=vip"
              />
            </FadeInSection>

            <FadeInSection>
              <RoomSection
                title="Phòng Gia Đình"
                fetchUrl="https://localhost:7092/api/rooms?type=family"
              />
            </FadeInSection>

            <FadeInSection>
              <RoomSection
                title="Phòng Standard"
                fetchUrl="https://localhost:7092/api/rooms?type=standard"
              />
            </FadeInSection>
          </>
        )}
      </main>

      <section className="bg-[#EBE8E1] py-20 px-6">
        <FadeInSection>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">Những trải nghiệm đáng nhớ</h2>
              <p className="text-gray-600">Chia sẻ từ những người bạn của Lumière Stay</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {reviews.slice(0, 3).map((review, idx) => (
                <TestimonialCard
                  key={idx}
                  name={review.ho_Ten}
                  date={new Date(review.thoi_Gian).toLocaleDateString('vi-VN')}
                  text={review.noi_dung}
                  soSao={review.so_Sao}
                  avatarColor={avatarColors[idx % avatarColors.length]}
                />
              ))}
              {reviews.length === 0 && (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500 text-sm">Đang tải đánh giá...</p>
                </div>
              )}
            </div>

            {reviews.length > 3 && (
              <div className="text-center">
                <button
                  onClick={() => setIsReviewsModalOpen(true)}
                  className="border border-gray-400 text-gray-700 px-8 py-3 rounded-sm text-sm font-medium hover:bg-white hover:border-transparent transition-all shadow-sm"
                >
                  Xem tất cả đánh giá ({reviews.length})
                </button>
              </div>
            )}
          </div>
        </FadeInSection>
      </section>

      <ReviewsModal 
        isOpen={isReviewsModalOpen} 
        onClose={() => setIsReviewsModalOpen(false)} 
        reviews={reviews} 
      />

      <Footer />
    </div>
  );
};

export default Home;
