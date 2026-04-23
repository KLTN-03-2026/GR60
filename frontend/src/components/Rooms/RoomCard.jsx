import React from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({ room, className = '' }) => {
  const { id, tenPhong, dsAnh, gia, soNguoiLon, soTreEm, soSao } = room;

  // Format price to VND (VD: 800.000 VNĐ)
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' VNĐ';
  };

  // Rating display
  const hasRating = soSao && soSao > 0;

  // Render stars
  const renderStars = () => {
    if (!hasRating) {
      return (
        <span className="text-gray-light text-sm italic">Chưa có đánh giá</span>
      );
    }
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < soSao ? 'text-amber-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm font-semibold text-dark ml-1.5">{soSao.toFixed(1)}</span>
      </div>
    );
  };

  // Image URL
  const imageUrl = dsAnh && dsAnh.length > 0
    ? dsAnh[0]
    : 'https://placehold.co/600x400?text=No+Image';

  return (
    <Link 
      to={`/room-detail?id=${id}`}
      className={`group bg-white rounded-2xl overflow-hidden 
                 shadow-sm hover:shadow-xl transition-all duration-400 ease-out cursor-pointer 
                 snap-start border border-gray-100 hover:border-primary/20
                 transform hover:-translate-y-1 ${className}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-video bg-gray-100">
        <img
          src={imageUrl}
          alt={tenPhong}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          loading="lazy"
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Price badge */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md">
          <span className="text-primary font-bold text-[15px]">{formatPrice(gia)}</span>
          <span className="text-gray-light text-[11px] ml-0.5">/đêm</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Room name */}
        <h3 className="font-serif font-bold text-lg text-dark mb-2 truncate group-hover:text-primary transition-colors duration-300">
          {tenPhong}
        </h3>

        {/* Guest capacity */}
        <div className="flex items-center text-gray-light text-sm mb-3">
          {/* Adults icon */}
          <svg className="w-4 h-4 mr-1.5 text-dark/60" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{soNguoiLon} Người lớn</span>
          
          <span className="mx-2 text-gray-300">•</span>
          
          {/* Children icon */}
          <svg className="w-4 h-4 mr-1.5 text-dark/60" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3-1.12-3-2.5S10.343 3 12 3s3 1.12 3 2.5S13.657 8 12 8zM12 10a5 5 0 00-5 5v4h10v-4a5 5 0 00-5-5z" />
          </svg>
          <span>{soTreEm} Trẻ em</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-3" />

        {/* Stars */}
        {renderStars()}
      </div>
    </Link>
  );
};

export default RoomCard;
