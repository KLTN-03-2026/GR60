import React, { useState } from 'react';
import { Mail, Phone, ArrowLeft, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiForgotPassword } from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      // API trả về token chuỗi
      const token = await apiForgotPassword(email, phone);
      setSuccessMessage('Xác thực thành công! Đang chuyển hướng thiết lập mật khẩu mới...');
      
      // Chuyển hướng sang trang ResetPassword kèm theo token trong state hoặc URL
      setTimeout(() => {
        navigate('/reset-password', { state: { token, email } });
      }, 1500);
    } catch (error) {
      setErrorMessage(error.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
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
            alt="Nature/Home cabin"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 flex flex-col justify-end p-8 sm:p-10 pb-10">
            <p className="text-white/80 text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase mb-1.5 drop-shadow-md">
              Hỗ trợ tài khoản
            </p>
            <h1 className="text-white text-[24px] sm:text-[28px] font-bold leading-[1.2] drop-shadow-lg pr-4">
              Khôi phục mật khẩu.<br/>Trở lại với hành trình của bạn.
            </h1>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-8 sm:px-12 py-10 rounded-b-[16px]">
          
          <div className="mb-8">
            <h2 className="text-[26px] font-bold text-[#1E1E1E] mb-2 tracking-tight">
              Quên mật khẩu?
            </h2>
            <p className="text-[#555555] text-[15px] leading-relaxed">
              Đừng lo lắng, hãy nhập thông tin bên dưới để chúng tôi giúp bạn lấy lại quyền truy cập.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleForgotPassword}>
            
            {/* Messages */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-center">
                <p className="text-[13px] text-red-600 font-semibold">{errorMessage}</p>
              </div>
            )}
            
            {successMessage && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-100 text-center">
                <p className="text-[13px] text-green-600 font-semibold">{successMessage}</p>
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
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-[46px] pr-4 py-3.5 bg-[#EFECE8] border-none rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#BA5D42] focus:bg-white text-[15px] text-[#222222] font-medium transition-all"
                  placeholder="ten@vidu.com"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-[11px] font-bold text-[#7A6A63] tracking-wider uppercase">
                Số điện thoại
              </label>
              <div className="relative text-gray-500">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-[46px] pr-4 py-3.5 bg-[#EFECE8] border-none rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#BA5D42] focus:bg-white text-[15px] text-[#222222] font-medium transition-all"
                  placeholder="09xx xxx xxx"
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
                    Đang gửi...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="mr-2 h-5 w-5" />
                    Xác nhận
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Footer Back Prompt */}
          <div className="text-center mt-8">
            <Link to="/login" className="inline-flex items-center text-[14px] font-bold text-[#BA5D42] hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại đăng nhập
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
