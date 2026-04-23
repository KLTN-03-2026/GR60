import React, { useEffect, useState, useRef } from 'react';
import RoomCard from './RoomCard';

const RoomSection = ({ title, fetchUrl }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Lazy load: chỉ đánh dấu visible khi section xuất hiện trên viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Chỉ cần observe 1 lần
        }
      },
      { rootMargin: '200px' } // Pre-fetch trước 200px để trải nghiệm mượt hơn
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Fetch data chỉ khi section đã visible
  useEffect(() => {
    if (!isVisible) return;

    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error(`Lỗi ${response.status}: Không thể tải dữ liệu phòng`);
        }
        const text = await response.text();
        const data = text ? JSON.parse(text) : [];
        setRooms(data);
      } catch (err) {
        console.error(`Lỗi khi tải danh sách phòng (${title}):`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [isVisible, fetchUrl, title]);

  // Check scroll state for nav arrows
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 10);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollPosition();
    container.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [rooms]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = 340;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Loading skeleton
  if (loading) {
    return (
      <section ref={sectionRef} className="mb-16">
        <div className="flex items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-serif text-dark mr-8 whitespace-nowrap">
            {title}
          </h2>
          <div className="w-full h-px bg-gray-200" />
        </div>
        <div className="flex gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[300px] md:w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
            >
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
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section ref={sectionRef} className="mb-16">
        <div className="flex items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-serif text-dark mr-8 whitespace-nowrap">
            {title}
          </h2>
          <div className="w-full h-px bg-gray-200" />
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <svg className="w-12 h-12 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-red-600 font-semibold mb-1">Không thể tải danh sách phòng</p>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </section>
    );
  }

  // Empty state
  if (rooms.length === 0) {
    return (
      <section ref={sectionRef} className="mb-16">
        <div className="flex items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-serif text-dark mr-8 whitespace-nowrap">
            {title}
          </h2>
          <div className="w-full h-px bg-gray-200" />
        </div>
        <div className="bg-gray-50 rounded-2xl p-10 text-center">
          <p className="text-gray-light text-sm">Hiện chưa có phòng nào trong danh mục này.</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="mb-16">
      {/* Section header */}
      <div className="flex items-center mb-8">
        <h2 className="text-3xl md:text-4xl font-serif text-dark mr-8 whitespace-nowrap">
          {title}
        </h2>
        <div className="w-full h-px bg-gray-200" />

        {/* Navigation arrows */}
        <div className="hidden md:flex items-center gap-2 ml-6 shrink-0">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center 
                       text-dark hover:bg-primary hover:text-white hover:border-primary
                       transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent 
                       disabled:hover:text-dark disabled:hover:border-gray-200 disabled:cursor-not-allowed"
            aria-label="Cuộn trái"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center 
                       text-dark hover:bg-primary hover:text-white hover:border-primary
                       transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent 
                       disabled:hover:text-dark disabled:hover:border-gray-200 disabled:cursor-not-allowed"
            aria-label="Cuộn phải"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable room list */}
      <div className="relative">
        {/* Left fade gradient */}
        {canScrollLeft && (
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#F9F8F6] to-transparent z-10 pointer-events-none" />
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 -mb-4"
          style={{ scrollPaddingLeft: '4px' }}
        >
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} className="flex-shrink-0 w-[300px] md:w-[320px]" />
          ))}
        </div>

        {/* Right fade gradient */}
        {canScrollRight && (
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#F9F8F6] to-transparent z-10 pointer-events-none" />
        )}
      </div>
    </section>
  );
};

export default RoomSection;
