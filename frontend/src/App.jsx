import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Home from './components/Home/Home'
import RoomDetail from './components/Rooms/RoomDetail'
import Checkout from './components/Rooms/Checkout'

import Notification from './components/Common/Notification'

// Component xử lý xác thực và tự động đăng xuất
function AuthHandler({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Hàm xử lý đăng xuất khi hết hạn
    const handleUnauthorized = () => {
      const stored = localStorage.getItem('homestayUser');
      if (stored) {
        window.dispatchEvent(new CustomEvent('show-notification', { 
          detail: { message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!', type: 'error' } 
        }));
        localStorage.removeItem('homestayUser');
        navigate('/');
      }
    };

    // 2. Kiểm tra token hết hạn mỗi khi chuyển trang
    const checkAuth = () => {
      const stored = localStorage.getItem('homestayUser');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user.expiresAt && new Date().getTime() > user.expiresAt) {
            handleUnauthorized();
          }
        } catch (e) {
          // ignore
        }
      }
    };

    checkAuth();

    // 3. Lắng nghe sự kiện 401 từ các API calls
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [navigate, location.pathname]);

  return (
    <>
      <Notification />
      {children}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthHandler>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/room-detail" element={<RoomDetail />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </AuthHandler>
    </BrowserRouter>
  )
}

export default App
