import React from 'react';

const GuestRow = ({ title, subtitle, count, onUpdate, subtitleClass="text-gray-500", disabledMinus = false, disabledPlus = false }) => (
  <div className="flex items-center justify-between">
    <div>
      <div className="text-lg font-semibold text-gray-900">{title}</div>
      <div className={`text-sm mt-0.5 ${subtitleClass}`}>{subtitle}</div>
    </div>
    <div className="flex items-center space-x-4">
      <button 
        onClick={(e) => { e.preventDefault(); onUpdate(-1); }} 
        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition disabled:opacity-40 disabled:hover:bg-gray-100 disabled:cursor-not-allowed" 
        disabled={disabledMinus || count <= 0}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
      </button>
      <span className="w-6 text-center font-medium text-xl">{count}</span>
      <button 
        onClick={(e) => { e.preventDefault(); onUpdate(1); }} 
        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition disabled:opacity-40 disabled:hover:bg-gray-100 disabled:cursor-not-allowed"
        disabled={disabledPlus}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
      </button>
    </div>
  </div>
);

export default GuestRow;
