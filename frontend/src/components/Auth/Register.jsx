import React, { useState } from 'react';
import { User, Mail, Lock, ShieldCheck, Eye, EyeOff, ArrowRight, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRegister } from '../../services/authService';

const Register = () => {
  const [hoTen, setHoTen] = useState('');
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState('');
  const [dongY, setDongY] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (matKhau !== xacNhanMatKhau) {
      setErrorMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (!dongY) {
      setErrorMessage('Bạn cần đồng ý với các Điều khoản & Chính sách.');
      return;
    }

    setIsLoading(true);

    try {
      const dataToSubmit = {
        Name: hoTen,
        Email: email,
        MatKhau: matKhau,
        MatKhauXacNhan: xacNhanMatKhau
      };
      
      const userData = await apiRegister(dataToSubmit);
      console.log('Đăng ký thành công! Thông tin trả về:', userData);
      
      // Thông báo thành công & điều hướng tự động
      setSuccessMessage(userData?.Message || 'Đăng ký thành công! Đang chuyển hướng...');
      
      // Clear form
      setHoTen('');
      setEmail('');
      setMatKhau('');
      setXacNhanMatKhau('');

      // Chuyển sang trang đăng nhập sau 1.5 giây
      setTimeout(() => navigate('/login'), 1500);
      
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAEF] flex justify-center items-center p-4 font-sans">
      <div className="w-full max-w-[420px] bg-[#F5F1E9] rounded-[32px] p-8 sm:p-10 shadow-lg relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-10 mt-4">
          <h2 className="text-[28px] font-extrabold text-[#A84A2A] mb-2 font-serif tracking-tight">
            Tạo tài khoản mới
          </h2>
          <p className="text-[#6C635B] text-[15px] px-4 font-medium">
            Chào mừng bạn đến với ốc đảo tĩnh lặng của chúng tôi.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleRegister}>
          
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 text-center border-l-4 border-red-500 shadow-sm">
              <p className="text-[13px] text-red-600 font-bold">{errorMessage}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 rounded-xl bg-green-50 text-center border-l-4 border-green-500 shadow-sm">
              <p className="text-[13px] text-green-700 font-bold">{successMessage}</p>
            </div>
          )}

          {/* Họ và Tên */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-[#6D5A50] tracking-[0.1em] uppercase ml-1">
              Họ và tên
            </label>
            <div className="relative text-[#6D5A50]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                required
                value={hoTen}
                onChange={(e) => setHoTen(e.target.value)}
                className="block w-full pl-12 pr-4 py-3.5 bg-white border-transparent rounded-[12px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BA5D42] text-[15px] font-medium placeholder-[#C9BDB7] text-[#3D312B] transition-all"
                placeholder="Nguyễn Văn A"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-[#6D5A50] tracking-[0.1em] uppercase ml-1">
              Email
            </label>
            <div className="relative text-[#6D5A50]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-12 pr-4 py-3.5 bg-white border-transparent rounded-[12px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BA5D42] text-[15px] font-medium placeholder-[#C9BDB7] text-[#3D312B] transition-all"
                placeholder="example@email.com"
              />
            </div>
          </div>

          {/* Mật khẩu */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-[#6D5A50] tracking-[0.1em] uppercase ml-1">
              Mật khẩu
            </label>
            <div className="relative text-[#6D5A50]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={matKhau}
                onChange={(e) => setMatKhau(e.target.value)}
                className="block w-full pl-12 pr-12 py-3.5 bg-white border-transparent rounded-[12px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BA5D42] text-[15px] font-medium placeholder-[#C9BDB7] text-[#3D312B] transition-all tracking-widest"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-[#A84A2A] transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-[#6D5A50] tracking-[0.1em] uppercase ml-1">
              Xác nhận mật khẩu
            </label>
            <div className="relative text-[#6D5A50]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <input
                type="password"
                required
                value={xacNhanMatKhau}
                onChange={(e) => setXacNhanMatKhau(e.target.value)}
                className="block w-full pl-12 pr-4 py-3.5 bg-white border-transparent rounded-[12px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BA5D42] text-[15px] font-medium placeholder-[#C9BDB7] text-[#3D312B] transition-all tracking-widest"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Điều khoản */}
          <div className="flex items-start pt-2 px-1">
            <div className="flex items-center h-5 mt-0.5">
              <input
                id="terms"
                type="checkbox"
                checked={dongY}
                onChange={(e) => setDongY(e.target.checked)}
                className="w-4 h-4 text-[#A84A2A] bg-white border-gray-300 rounded focus:ring-[#A84A2A] cursor-pointer"
              />
            </div>
            <div className="ml-3 text-[13px]">
              <label htmlFor="terms" className="font-medium text-[#6C635B] cursor-pointer">
                Tôi đồng ý với các{' '}
                <a href="#terms" className="text-[#A84A2A] hover:underline font-bold">
                  Điều khoản & Chính sách
                </a>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 pb-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-[15px] px-4 border border-transparent text-[16px] font-bold rounded-full text-white bg-gradient-to-r from-[#944D35] to-[#E3CBBF] shadow-[0_8px_16px_-4px_rgba(148,77,53,0.3)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#944D35] transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  Đăng ký
                  <ArrowRight className="h-5 w-5 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>

          {/* Login Prompt Component Footer */}
          <div className="text-center mt-6">
            <p className="text-[14px] text-[#6C635B] font-medium">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-bold text-[#944D35] hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
          
          <div className="flex items-center justify-center pt-8 pb-2 opacity-30">
            <hr className="w-12 border-[#A84A2A]" />
            <Moon className="h-5 w-5 text-[#A84A2A] mx-3 rotate-[20deg]" />
            <hr className="w-12 border-[#A84A2A]" />
          </div>

        </form>
      </div>
    </div>
  );
};

export default Register;
