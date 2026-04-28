import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { apiLogout } from '../../services/authService';
import { showToast } from '../Common/Notification';

const MainLayout = ({ children, forceScrolled = false }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(forceScrolled);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Load user from localStorage
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

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <Header 
        isScrolled={isScrolled}
        currentUser={currentUser}
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        userMenuRef={userMenuRef}
        handleLogout={handleLogout}
        getUserInitial={getUserInitial}
      />
      <main className="flex-grow pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
