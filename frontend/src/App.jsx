import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Home from './components/Home/Home'
import About from './components/Home/About'
import RoomDetail from './components/Rooms/RoomDetail'
import Checkout from './components/Rooms/Checkout'
import BookingHistory from './components/Rooms/BookingHistory'
import BookingDetail from './components/Rooms/BookingDetail'
import ForgotPassword from './components/Auth/ForgotPassword'
import ResetPassword from './components/Auth/ResetPassword'
import Account from './components/Auth/Account'
import AdminChat from './components/Admin/AdminChat'
import AdminRooms from './components/Admin/AdminRooms'
import AdminBookings from './components/Admin/AdminBookings'
import AdminCustomers from './components/Admin/AdminCustomers'
import AdminHomestay from './components/Admin/AdminHomestay'
import AdminHolidays from './components/Admin/AdminHolidays'
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
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/room-detail" element={<RoomDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/booking-detail" element={<BookingDetail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/account" element={<Account />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminChat />} />
          <Route path="/admin/chat" element={<AdminChat />} />
          <Route path="/admin/rooms" element={<AdminRooms />} />
          <Route path="/admin/info" element={<AdminHomestay />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/holidays" element={<AdminHolidays />} />
        </Routes>
      </AuthHandler>
    </BrowserRouter>
  )
}

export default App
