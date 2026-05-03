import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { apiLogout } from '../../services/authService';
import { showToast } from '../Common/Notification';
import ChatWidget from '../Common/ChatWidget';

const MainLayout = ({ children, forceScrolled = false, requireAuth = false, transparentHeader = false, hideFooter = false }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(forceScrolled);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(requireAuth);
  const userMenuRef = useRef(null);
  const hasShownAuthToast = useRef(false);

  // Load user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('homestayUser');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
        setIsCheckingAuth(false);
      } else if (requireAuth) {
        if (!hasShownAuthToast.current) {
          showToast('Vui lòng đăng nhập để truy cập trang này!', 'error');
          hasShownAuthToast.current = true;
        }
        navigate('/login');
      } else {
        setIsCheckingAuth(false);
      }
    } catch (e) {
      localStorage.removeItem('homestayUser');
      if (requireAuth) navigate('/login');
      setIsCheckingAuth(false);
    }
  }, [requireAuth, navigate]);

  // Handle scroll and click outside
  useEffect(() => {
    const handleScroll = () => {
      if (!forceScrolled) {
        setIsScrolled(window.scrollY > 50);
      }
    };

    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [forceScrolled]);

  const handleLogout = async () => {
    try {
      await apiLogout();
      showToast('Đăng xuất thành công!', 'success');
    } catch (e) {
      console.error('Lỗi khi đăng xuất:', e);
    }
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

  if (isCheckingAuth) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FDFBF7] items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col bg-[#FDFBF7] ${hideFooter ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Header 
        isScrolled={isScrolled}
        currentUser={currentUser}
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        userMenuRef={userMenuRef}
        handleLogout={handleLogout}
        getUserInitial={getUserInitial}
      />
      <main className={`flex-grow flex flex-col min-h-0 ${transparentHeader ? 'pt-0' : (forceScrolled ? 'pt-[72px]' : 'pt-24')}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
      {!hideFooter && <ChatWidget currentUser={currentUser} />}
    </div>
  );
};

export default MainLayout;
