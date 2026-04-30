import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiLogin } from '../../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      // Gọi qua function ở authService.js
      const userData = await apiLogin(email, matKhau);
      
      // Thêm thời gian hết hạn (1 giờ) để tự động đăng xuất
      userData.expiresAt = new Date().getTime() + 1 * 60 * 60 * 1000;
      
      // Xử lý trường hợp ảnh đại diện chỉ trả về base URL
      if (userData.anhdaidien === 'https://localhost:7092' || userData.anhdaidien === 'https://localhost:7092/') {
        userData.anhdaidien = null;
      }

      console.log('Thành công! Thông tin user:', userData);
      localStorage.setItem('homestayUser', JSON.stringify(userData));
      navigate('/'); // Điều hướng về app chính

    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex justify-center items-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-[500px] bg-[#FEF9F5] rounded-tl-[16px] rounded-tr-[16px] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Top Image Section */}
        <div className="relative h-[250px] sm:h-[280px] w-full bg-slate-200">
          <img 
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop" 
            alt="Interior room"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 flex flex-col justify-end p-8 sm:p-10 pb-10">
            <p className="text-white/80 text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase mb-1.5 drop-shadow-md">
              Nâng tầm lòng hiếu khách
            </p>
            <h1 className="text-white text-[24px] sm:text-[28px] font-bold leading-[1.2] drop-shadow-lg pr-4">
              Mỗi kỳ nghỉ là một câu chuyện.<br/>Hãy tìm thấy câu chuyện của riêng bạn.
            </h1>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-8 sm:px-12 py-10 rounded-b-[16px]">
          
          {/* Titles */}
          <div className="text-center mb-8">
            <h2 className="text-[26px] font-bold text-[#1E1E1E] mb-2 tracking-tight">
              Chào mừng quay trở lại
            </h2>
            <p className="text-[#555555] text-[15px] leading-relaxed">
              Nhập thông tin của bạn để kết nối lại với những nơi lưu trú yêu thích trên toàn thế giới.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-center">
                <p className="text-[13px] text-red-600 font-semibold">{errorMessage}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[11px] font-bold text-[#7A6A63] tracking-wider uppercase">
                Địa chỉ Email
              </label>
              <div className="relative text-gray-500">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-[46px] pr-4 py-3.5 bg-[#EFECE8] border-none rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#BA5D42] focus:bg-white text-[15px] text-[#222222] font-medium transition-all"
                  placeholder="ten@vidu.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label htmlFor="password" className="block text-[11px] font-bold text-[#7A6A63] tracking-wider uppercase">
                  Mật khẩu
                </label>
                <Link to="/forgot-password" size="sm" className="text-[11px] font-bold text-[#BA5D42] hover:text-[#9A4C35] tracking-wider uppercase transition-colors">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative text-gray-500">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={matKhau}
                  onChange={(e) => setMatKhau(e.target.value)}
                  className="block w-full pl-[46px] pr-12 py-3.5 bg-[#EFECE8] border-none rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#BA5D42] focus:bg-white text-[15px] text-[#222222] font-medium transition-all tracking-[0.2em]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-[#BA5D42] transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-[14px] px-4 border border-transparent text-[16px] font-bold rounded-full text-white bg-[#C4674A] hover:bg-[#B3583C] shadow-[0_6px_14px_-2px_rgba(196,103,74,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4674A] transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </div>
          </form>

          {/* Footer Register Prompt */}
          <div className="text-center mt-8">
            <p className="text-[14px] text-gray-700">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-bold text-[#BA5D42] hover:underline">
                Đăng ký
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
