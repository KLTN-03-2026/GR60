import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ 
  isScrolled, 
  currentUser, 
  isUserMenuOpen, 
  setIsUserMenuOpen, 
  userMenuRef, 
  handleLogout, 
  getUserInitial 
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const triggerLogout = () => {
    setIsUserMenuOpen(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    handleLogout();
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#2A3B32] shadow-md py-6' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-3 items-center">
          
          {/* LOGO (TRÁI) */}
          <div className="flex justify-start">
            <Link to="/" className={`font-serif text-2xl md:text-3xl tracking-wider transition-colors ${isScrolled ? 'text-white' : 'text-white'}`}>
              The Tactile Ethernet
            </Link>
          </div>
          
          {/* NAV (GIỮA) */}
          <nav className="hidden md:flex justify-center items-center space-x-12">
            <Link to="/" className="text-white text-lg font-medium tracking-wide border-b-2 border-white pb-1">Trang chủ</Link>
            <Link to="/contact" className="text-white/80 hover:text-white text-lg font-medium tracking-wide transition-colors">Liên hệ</Link>
          </nav>

          {/* AUTH (PHẢI) */}
          <div className="flex justify-end items-center space-x-6">
            {currentUser ? (
              /* === USER MENU (sau khi đăng nhập) === */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 group"
                >
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                    isScrolled 
                      ? 'bg-white text-[#2A3B32] group-hover:bg-gray-100' 
                      : 'bg-white/20 backdrop-blur-sm text-white border border-white/30 group-hover:bg-white/30'
                  }`}>
                    {getUserInitial()}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-[calc(100%+16px)] w-[280px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden z-50 animate-in">
                    {/* User info header */}
                    <div className="px-6 py-5 bg-gradient-to-r from-[#2A3B32] to-[#3D5347] text-white">
                      <p className="font-semibold text-base truncate">{currentUser.hoTen || currentUser.HoTen || 'Người dùng'}</p>
                      <p className="text-white/70 text-sm mt-1 truncate">{currentUser.email || currentUser.Email}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-2">
                      <Link
                        to="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-6 py-4 text-base text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Tài khoản của tôi
                      </Link>
                      <Link
                        to="/chat"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-6 py-4 text-base text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Chat
                      </Link>
                      <Link
                        to="/booking-history"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-6 py-4 text-base text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Lịch sử đặt phòng
                      </Link>
                      <div className="h-px bg-gray-100 my-2"></div>
                      <button
                        onClick={triggerLogout}
                        className="w-full flex items-center gap-3 px-6 py-4 text-base text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`text-lg font-medium tracking-wide transition-colors ${isScrolled ? 'text-white/80 hover:text-white' : 'text-white/80 hover:text-white'}`}
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register" 
                  className={`px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 ${
                    isScrolled 
                      ? 'bg-white text-[#2A3B32] hover:bg-gray-100 shadow-sm' 
                      : 'bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30'
                  }`}
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 className="text-xl font-serif text-center text-dark mb-2">Xác nhận đăng xuất</h3>
            <p className="text-gray-500 text-center text-sm mb-8 leading-relaxed">
              Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition-all"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
