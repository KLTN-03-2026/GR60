import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Save, CheckCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiResetPassword } from '../../services/authService';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy token và email từ state được truyền sang từ trang ForgotPassword
  const token = location.state?.token;
  const email = location.state?.email;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Nếu không có token, quay lại trang quên mật khẩu
  React.useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không trùng với mật khẩu');
      return;
    }

    setIsLoading(true);

    try {
      const responseMessage = await apiResetPassword(token, newPassword, confirmPassword);
      setSuccessMessage(responseMessage || 'Mật khẩu của bạn đã được thay đổi thành công!');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex justify-center items-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-[500px] bg-[#FEF9F5] rounded-tl-[16px] rounded-tr-[16px] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Top Image Section */}
        <div className="relative h-[200px] sm:h-[230px] w-full bg-slate-200">
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop" 
            alt="Secure Home"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 flex flex-col justify-end p-8 sm:p-10 pb-10">
            <p className="text-white/80 text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase mb-1.5 drop-shadow-md">
              Bảo mật tài khoản
            </p>
            <h1 className="text-white text-[24px] sm:text-[28px] font-bold leading-[1.2] drop-shadow-lg pr-4">
              Thiết lập mật khẩu mới.<br/>Giữ tài khoản luôn an toàn.
            </h1>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-8 sm:px-12 py-10 rounded-b-[16px]">
          
          <div className="mb-8">
            <h2 className="text-[26px] font-bold text-[#1E1E1E] mb-2 tracking-tight">
              Mật khẩu mới
            </h2>
            <p className="text-[#555555] text-[15px] leading-relaxed">
              Vui lòng nhập mật khẩu mới và xác nhận lại để hoàn tất quá trình khôi phục.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleResetPassword}>
            
            {/* Messages */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-center">
                <p className="text-[13px] text-red-600 font-semibold">{errorMessage}</p>
              </div>
            )}
            
            {successMessage && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-100 text-center">
                <p className="text-[13px] text-green-600 font-semibold flex items-center justify-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {successMessage}
                </p>
              </div>
            )}

            {/* New Password */}
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-[11px] font-bold text-[#7A6A63] tracking-wider uppercase">
                Mật khẩu mới
              </label>
              <div className="relative text-gray-500">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pl-[46px] pr-12 py-3.5 bg-[#EFECE8] border-none rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#BA5D42] focus:bg-white text-[15px] text-[#222222] font-medium transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-[#BA5D42] transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-[11px] font-bold text-[#7A6A63] tracking-wider uppercase">
                Xác nhận mật khẩu
              </label>
              <div className="relative text-gray-500">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-[46px] pr-12 py-3.5 bg-[#EFECE8] border-none rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#BA5D42] focus:bg-white text-[15px] text-[#222222] font-medium transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading || successMessage}
                className="w-full flex justify-center py-[14px] px-4 border border-transparent text-[16px] font-bold rounded-full text-white bg-[#C4674A] hover:bg-[#B3583C] shadow-[0_6px_14px_-2px_rgba(196,103,74,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4674A] transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang lưu...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="mr-2 h-5 w-5" />
                    Lưu mật khẩu
                  </span>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
