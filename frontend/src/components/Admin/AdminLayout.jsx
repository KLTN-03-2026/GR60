import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MessageSquare, Star, Home, Box, CreditCard, 
  Cpu, BarChart2, Bell, Settings, BedDouble, CalendarDays, Users, Menu, X, Gift
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Thống kê', icon: <BarChart2 size={18} />, path: '/admin/stats' },
    { name: 'Thông tin Homestay', icon: <Home size={18} />, path: '/admin/info' },
    { name: 'Phòng', icon: <BedDouble size={18} />, path: '/admin/rooms' },
    { name: 'Đánh giá', icon: <Star size={18} />, path: '/admin/reviews' },
    { name: 'Tiện nghi phòng', icon: <Box size={18} />, path: '/admin/amenities' },
    { name: 'AI Dự đoán giá', icon: <Cpu size={18} />, path: '/admin/ai' },
    { name: 'Booking', icon: <CalendarDays size={18} />, path: '/admin/bookings' },
    { name: 'Thanh toán', icon: <CreditCard size={18} />, path: '/admin/payments' },
    { name: 'Khách Hàng', icon: <Users size={18} />, path: '/admin/customers' },
    { name: 'Ngày lễ', icon: <Gift size={18} />, path: '/admin/holidays' },
    { name: 'Chat', icon: <MessageSquare size={18} />, path: '/admin/chat' },
  ];

  const isActive = (path) => {
    if (path === '/admin/chat') {
      return location.pathname === '/admin' || location.pathname === '/admin/chat';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-1 w-full h-full bg-[#FDFBF7] font-sans overflow-hidden border-t border-gray-200 relative min-h-0">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-[260px] bg-[#EAE6DF] flex-col flex-shrink-0 transition-transform duration-300 lg:flex lg:relative lg:translate-x-0 lg:h-full lg:z-10 ${isMobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 flex translate-x-0' : 'hidden lg:flex -translate-x-full lg:translate-x-0'}`}>
        {/* Logo Area */}
        <div className="p-6 pt-10 pb-6 flex items-center justify-between">
          <Link to="/admin" className="block" onClick={() => setIsMobileMenuOpen(false)}>
            <h1 className="font-serif text-2xl text-[#1A251F] font-bold tracking-tight">
              60 HOMES
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">
              Khu vực Quản trị
            </p>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-200 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-full transition-all duration-300 font-medium ${
                isActive(item.path)
                  ? 'bg-[#2D3E35] text-white shadow-lg'
                  : 'text-gray-700 hover:bg-[#DCD8D0]'
              }`}
            >
              {item.icon}
              <span className="text-[15px]">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#FDFBF7]">
        {/* Topbar */}
        <header className="h-[80px] px-4 lg:px-8 flex items-center justify-between border-b border-gray-200/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-[#1A251F]">Tổng quan</h2>
          </div>
          
          <div className="flex items-center gap-6 text-gray-600">
            <button className="hover:text-[#1A251F] transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#FDFBF7]"></span>
            </button>
            <button className="hover:text-[#1A251F] transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto relative min-h-0 scrollbar-thin scrollbar-thumb-gray-200">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
