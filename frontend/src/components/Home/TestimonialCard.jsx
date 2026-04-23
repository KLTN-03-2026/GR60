import React from 'react';

export const avatarColors = ['bg-[#D9E2D5]', 'bg-[#E8DFD5]', 'bg-[#D5E2DF]', 'bg-[#E2D5D9]', 'bg-[#D5D9E2]', 'bg-[#E2E0D5]'];

const TestimonialCard = ({ name, date, text, soSao, avatarColor }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center mb-6">
        <div className={`w-12 h-12 rounded-full ${avatarColor} text-gray-800 flex items-center justify-center font-bold mr-4 text-lg`}>
          {initial}
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{date}</p>
        </div>
      </div>
      <div className="flex text-sm mb-4 space-x-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < soSao ? 'text-yellow-400' : 'text-gray-300'}>★</span>
        ))}
      </div>
      <p className="text-gray-600 text-sm leading-relaxed italic">"{text}"</p>
    </div>
  );
};

export default TestimonialCard;
