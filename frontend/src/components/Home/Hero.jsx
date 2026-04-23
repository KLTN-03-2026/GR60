import React from 'react';
import GuestRow from '../Common/GuestRow';

const Hero = ({
  searchAddress,
  setSearchAddress,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  guestData,
  totalGuests,
  isGuestOpen,
  setIsGuestOpen,
  guestDropdownRef,
  updateGuestCount,
  selectedRating,
  ratingOptions,
  isRatingOpen,
  setIsRatingOpen,
  ratingRef,
  setSelectedRating,
  handleSearch
}) => {
  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax effect */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Luxury Resort" 
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl w-full px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
          Lumière Stay
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-12 font-light tracking-wide max-w-2xl mx-auto drop-shadow-md">
          Tìm nơi bình yên của bạn
        </p>

        {/* Search Bar Container */}
        <div className="bg-white/95 backdrop-blur-md p-2 rounded-[32px] shadow-[0_24px_80px_rgba(0,0,0,0.3)] max-w-5xl mx-auto flex flex-col md:flex-row items-stretch gap-1 border border-white/20">
          
          {/* Địa điểm */}
          <div className="flex-[1.4] p-4 md:p-5 md:border-r border-gray-200 hover:bg-gray-50/50 rounded-xl transition-colors">
            <label className="block text-[11px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Địa chỉ</label>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2.5 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <input 
                type="text" 
                placeholder="Bạn muốn đi đâu?" 
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="w-full outline-none bg-transparent text-base font-medium text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Mức giá */}
          <div className="flex-[1.3] p-4 md:p-5 md:border-r border-gray-200 hover:bg-gray-50/50 rounded-xl transition-colors">
            <label className="block text-[11px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Mức giá</label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                placeholder="Từ..." 
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full outline-none bg-transparent text-base font-medium text-gray-800 placeholder-gray-400"
              />
              <span className="text-gray-300 font-light">-</span>
              <input 
                type="number" 
                placeholder="Đến..." 
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full outline-none bg-transparent text-base font-medium text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Số người (Interactive Dropdown) */}
          <div className="flex-[1.1] p-4 md:p-5 md:border-r border-gray-200 relative hover:bg-gray-50/50 rounded-xl transition-colors" ref={guestDropdownRef}>
            <label className="block text-[11px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Người</label>
            <div 
              className="flex items-center justify-between text-base font-medium text-gray-800 cursor-pointer select-none"
              onClick={() => setIsGuestOpen(!isGuestOpen)}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2.5 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                {totalGuests > 0 ? `${totalGuests} khách` : 'Thêm khách'}
              </div>
            </div>
            
            {/* Guest Popover */}
            {isGuestOpen && (
              <div className="absolute top-[110%] md:top-full left-0 md:left-auto md:-right-10 w-[380px] bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] p-7 z-50 border border-gray-100 cursor-default">
                <GuestRow 
                  title="Người lớn" 
                  subtitle="Từ 13 tuổi trở lên" 
                  count={guestData.adults} 
                  onUpdate={(delta) => updateGuestCount('adults', delta)} 
                  disabledMinus={guestData.adults <= 1 && guestData.children > 0}
                />
                <div className="h-[1px] w-full bg-gray-100 my-6"></div>
                <GuestRow 
                  title="Trẻ em" 
                  subtitle="Độ tuổi 0 – 12" 
                  count={guestData.children} 
                  onUpdate={(delta) => updateGuestCount('children', delta)} 
                />
              </div>
            )}
          </div>

          {/* Đánh giá */}
          <div className="flex-[0.9] p-4 md:p-5 hover:bg-gray-50/50 rounded-xl transition-colors relative" ref={ratingRef}>
            <label className="block text-[11px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Đánh giá</label>
            <div 
              className="flex items-center justify-between text-base font-medium text-gray-800 cursor-pointer select-none"
              onClick={() => setIsRatingOpen(!isRatingOpen)}
            >
              <span>{selectedRating.label}</span>
              <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isRatingOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
            </div>

            {/* Rating Dropdown */}
            {isRatingOpen && (
              <div className="absolute top-[110%] left-0 w-full bg-white rounded-2xl shadow-2xl py-3 z-50 border border-gray-100 animate-in">
                {ratingOptions.map((opt) => (
                  <div 
                    key={opt.value}
                    onClick={() => { setSelectedRating(opt); setIsRatingOpen(false); }}
                    className={`px-5 py-2.5 text-sm cursor-pointer transition-colors ${selectedRating.value === opt.value ? 'bg-gray-50 text-dark font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="p-2 md:p-2.5 flex items-center">
            <button 
              onClick={handleSearch}
              className="w-full h-full bg-[#2A3B32] hover:bg-[#3D5347] text-white px-8 md:px-10 py-4 md:py-0 rounded-[24px] font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#2A3B32]/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <span>Tìm kiếm</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
