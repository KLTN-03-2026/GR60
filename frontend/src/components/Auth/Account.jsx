import React, { useState } from 'react';
import MainLayout from '../Layout/MainLayout';
import { User, Mail, Phone, MapPin, Calendar, Edit3, ShieldCheck, Clock, AtSign } from 'lucide-react';
import UpdateProfile from './UpdateProfile';
import UpdateEmail from './UpdateEmail';
import UpdatePassword from './UpdatePassword';
import UpdateAvatar from './UpdateAvatar';

const Account = () => {
  // Lấy dữ liệu user từ localStorage và đưa vào state để UI cập nhật realtime
  const getStoredUser = () => {
    const stored = localStorage.getItem('homestayUser');
    return stored ? JSON.parse(stored) : null;
  };

  const [user, setUser] = useState(getStoredUser());
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleUpdateSuccess = (newUserData) => {
    setUser(newUserData);
  };

  if (!user) {
    return (
      <MainLayout requireAuth={true}>
        <div className="max-w-4xl mx-auto px-6 py-20 text-center text-gray-500 font-medium">
          Đang tải thông tin tài khoản...
        </div>
      </MainLayout>
    );
  }

  // Hàm định dạng ngày tháng
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Chưa cập nhật';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Hàm kiểm tra ảnh đại diện hợp lệ
  const isAvatarValid = (url) => {
    if (!url) return false;
    // Nếu chỉ là base URL thì coi như không hợp lệ
    if (url === 'https://localhost:7092' || url === 'https://localhost:7092/') return false;
    return true;
  };

  const userInfo = [
    { label: 'Họ và tên', value: user.name || 'Chưa cập nhật', icon: <User className="w-5 h-5" /> },
    { label: 'Email', value: user.email || 'Chưa cập nhật', icon: <Mail className="w-5 h-5" /> },
    { label: 'Số điện thoại', value: user.sdt || 'Chưa cập nhật', icon: <Phone className="w-5 h-5" /> },
    { label: 'Địa chỉ', value: user.diachi || 'Chưa cập nhật', icon: <MapPin className="w-5 h-5" /> },
    { label: 'Ngày sinh', value: formatDate(user.ngaySinh), icon: <Calendar className="w-5 h-5" /> },
    { label: 'Ngày tạo tài khoản', value: formatDate(user.ngaytao), icon: <Clock className="w-5 h-5" /> },
  ];

  return (
    <MainLayout forceScrolled={true}>
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
          
          {/* Header Profile */}
          <div className="bg-gradient-to-br from-[#1A251F] to-[#2D3E35] px-8 py-12 md:px-12 text-white relative">
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              {/* Avatar Container */}
              <div 
                className="relative group cursor-pointer"
                onClick={() => setShowAvatarModal(true)}
              >
                <div className="w-28 h-28 md:w-32 md:h-32 bg-white/10 backdrop-blur-md rounded-full overflow-hidden border-4 border-white/20 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                  {isAvatarValid(user.anhdaidien) ? (
                    <img 
                      src={user.anhdaidien} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-serif font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-amber-500 rounded-full border-4 border-[#1A251F] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUploadModal(true);
                  }}
                  title="Thay đổi ảnh đại diện"
                >
                  <Edit3 className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 tracking-tight">
                  {user.name}
                </h1>
                <p className="text-white/60 text-lg font-light tracking-wide">
                  {user.email}
                </p>
                <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase border border-white/10">
                    Thành viên
                  </span>
                </div>
              </div>
            </div>
            
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-[60px] ml-10 mb-10"></div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Info Section */}
              <div className="lg:col-span-3 space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  <h2 className="text-2xl font-serif font-bold text-dark">Thông tin chi tiết</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {userInfo.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-2 p-5 rounded-2xl bg-gray-50/50 border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-500 group">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary border border-gray-100 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        {item.icon}
                      </div>
                      <div className="mt-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-gray-800 font-bold text-sm truncate">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Section */}
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-6 bg-amber-400 rounded-full"></div>
                  <h2 className="text-2xl font-serif font-bold text-dark">Quản lý</h2>
                </div>

                <div className="space-y-4">
                  {/* Cập nhật hồ sơ */}
                  <button 
                    onClick={() => setShowUpdateModal(true)}
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-white border-2 border-gray-50 hover:border-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <Edit3 className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-dark text-sm">Cập nhật hồ sơ</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Sửa thông tin cá nhân</p>
                      </div>
                    </div>
                    <div className="text-gray-300 group-hover:text-primary transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  {/* Thay đổi Email */}
                  <button 
                    onClick={() => setShowEmailModal(true)}
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-white border-2 border-gray-50 hover:border-blue-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <AtSign className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-dark text-sm">Thay đổi Email</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Cập nhật địa chỉ email đăng nhập</p>
                      </div>
                    </div>
                    <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  {/* Bảo mật */}
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-white border-2 border-gray-50 hover:border-amber-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-dark text-sm">Bảo mật</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Đổi mật khẩu tài khoản</p>
                      </div>
                    </div>
                    <div className="text-gray-300 group-hover:text-amber-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>

                <div className="relative mt-10 overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50">
                  <div className="relative z-10">
                    <p className="text-[13px] text-blue-800 font-medium leading-relaxed">
                      "Hãy bảo vệ tài khoản của bạn bằng cách không chia sẻ thông tin đăng nhập với người khác."
                    </p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-200/20 rounded-full blur-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Viewer Modal */}
      {showAvatarModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setShowAvatarModal(false)}
        >
          <div className="relative max-w-2xl w-full flex flex-col items-center">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-primary transition-colors flex items-center gap-2 font-bold"
              onClick={() => setShowAvatarModal(false)}
            >
              Đóng <span className="text-2xl">×</span>
            </button>
            <div className="w-full aspect-square md:aspect-auto md:h-[70vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 animate-in zoom-in duration-500">
              {isAvatarValid(user.anhdaidien) ? (
                <img 
                  src={user.anhdaidien} 
                  alt={user.name} 
                  className="w-full h-full object-contain bg-black/50"
                />
              ) : (
                <div className="w-full h-full bg-white flex items-center justify-center text-[150px] font-serif font-bold text-dark">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="mt-6 text-white text-center flex flex-col items-center gap-4">
              <div>
                <h3 className="text-xl font-serif font-bold">{user.name}</h3>
                <p className="text-white/60 text-sm mt-1">Ảnh đại diện</p>
              </div>
              <button 
                onClick={() => {
                  setShowAvatarModal(false);
                  setShowUploadModal(true);
                }}
                className="px-6 py-2 bg-amber-500 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors"
              >
                Thay đổi ảnh
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Update Profile Modal */}
      <UpdateProfile 
        user={user}
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onUpdateSuccess={handleUpdateSuccess}
      />
      {/* Update Email Modal */}
      <UpdateEmail 
        user={user}
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onUpdateSuccess={handleUpdateSuccess}
      />
      {/* Update Password Modal */}
      <UpdatePassword 
        user={user}
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
      {/* Update Avatar Modal */}
      <UpdateAvatar 
        user={user}
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </MainLayout>

  );
};

export default Account;
