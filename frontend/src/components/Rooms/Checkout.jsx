import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../Layout/MainLayout';
import { showToast } from '../Common/Notification';
import { ShieldCheck, UploadCloud, Landmark, Wallet, Calendar, Users } from 'lucide-react';
import { apiGetHomeStayInfo } from '../../services/roomService';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy dữ liệu từ state do RoomDetail truyền sang
  const bookingData = location.state || {};
  const { room, checkIn, checkOut, guests, total, nights } = bookingData;

  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [proofFile, setProofFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoTen, setHoTen] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');
  const [email, setEmail] = useState('');
  const [homeInfo, setHomeInfo] = useState(null);

  useEffect(() => {
    // Nếu không có thông tin phòng, quay lại trang chủ
    if (!room || !checkIn || !checkOut) {
      navigate('/');
      return;
    }
    
    try {
      const stored = localStorage.getItem('homestayUser');
      if (stored) {
        const user = JSON.parse(stored);
        setHoTen(user.name || user.HoTen || user.hoTen || '');
        setSoDienThoai(user.sdt || user.SoDienThoai || '');
        setEmail(user.email || user.Email || '');
      }
    } catch (e) {
      console.error(e);
    }

    const fetchHomeInfo = async () => {
      const data = await apiGetHomeStayInfo();
      if (data) setHomeInfo(data);
    };
    fetchHomeInfo();
  }, [room, checkIn, checkOut, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  const fmt = (n) => {
    if (!n) return '0';
    return n.toLocaleString('vi-VN');
  };

  const checkInDate = checkIn ? new Date(checkIn) : new Date();
  const checkOutDate = checkOut ? new Date(checkOut) : new Date();

  const handleConfirmPayment = async () => {
    if (!proofFile) {
      showToast('Vui lòng tải lên minh chứng giao dịch trước khi thanh toán!', 'error');
      return;
    }

    const stored = localStorage.getItem('homestayUser');
    if (!stored) {
      showToast('Vui lòng đăng nhập để tiếp tục!', 'error');
      navigate('/login');
      return;
    }
    const currentUser = JSON.parse(stored);

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('Phuong_Thuc', paymentMethod === 'wallet' ? 'MOMO' : 'QR');
      formData.append('Hinh_Anh_Minh_Chung', proofFile);
      formData.append('So_Tien', total);
      formData.append('Id_User', currentUser.id || currentUser.Id);
      formData.append('Id_Room', room.id || room.Id);
      
      const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      };

      formData.append('Ngay_Nhan_Phong', formatDate(checkInDate));
      formData.append('Ngay_Tra_Phong', formatDate(checkOutDate));
      formData.append('So_Nguoi', (guests?.adults || 0) + (guests?.children || 0));
      formData.append('Tong_Tien', total);

      const fetchOptions = {
        method: 'POST',
        body: formData,
        credentials: 'include',
      };

      const token = currentUser?.token || currentUser?.Token;
      if (token) {
        fetchOptions.headers = { 'Authorization': `Bearer ${token}` };
      }

      const response = await fetch('https://localhost:7092/api/payments/checkout', fetchOptions);

      if (!response.ok) {
        if (response.status === 401) {
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          throw new Error('Phiên đăng nhập đã hết hạn');
        }
        throw new Error('Có lỗi xảy ra khi thanh toán');
      }

      showToast('Đặt phòng và gửi minh chứng thành công!', 'success');
      navigate('/booking-history');
    } catch (error) {
      console.error('Payment error:', error);
      showToast(error.message || 'Đặt phòng thất bại. Vui lòng thử lại sau.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout forceScrolled={true} requireAuth={true}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 flex-1 w-full">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-2">Xác nhận và Thanh toán</h1>
          <p className="text-gray-600">60 Homes – Nơi mỗi khoảnh khắc là một câu chuyện.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="flex-[2] w-full space-y-8">
            {/* Box Thông tin khách hàng */}
            <div className="bg-[#EFEBE4] p-6 md:p-8 rounded-2xl border border-gray-200/50 shadow-sm">
              <h2 className="text-2xl font-serif text-gray-900 mb-6">Thông tin khách hàng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Họ và tên</label>
                  <input 
                    type="text" 
                    value={hoTen}
                    onChange={(e) => setHoTen(e.target.value)}
                    className="w-full bg-transparent border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Số điện thoại</label>
                  <input 
                    type="tel" 
                    value={soDienThoai}
                    onChange={(e) => setSoDienThoai(e.target.value)}
                    className="w-full bg-transparent border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                />
              </div>
            </div>

            {/* Box Phương thức thanh toán */}
            <div className="bg-[#EFEBE4] p-6 md:p-8 rounded-2xl border border-gray-200/50 shadow-sm">
              <h2 className="text-2xl font-serif text-gray-900 mb-6">Phương thức thanh toán</h2>
              
              <div className="space-y-4">
                <label className={`block border rounded-xl p-4 cursor-pointer transition-colors ${paymentMethod === 'bank' ? 'border-[#364132] bg-white/50' : 'border-gray-300 hover:border-gray-400'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" name="payment" value="bank" checked={paymentMethod === 'bank'}
                        onChange={() => { setPaymentMethod('bank'); setProofFile(null); }}
                        className="w-5 h-5 text-[#364132] focus:ring-[#364132] border-gray-300"
                      />
                      <span className="font-medium text-gray-900">Chuyển khoản ngân hàng</span>
                    </div>
                    <Landmark className="w-6 h-6 text-gray-500" />
                  </div>
                </label>

                {paymentMethod === 'bank' && (
                  <div className="mt-4 space-y-4">
                    <div className="flex justify-center">
                      <img 
                        src={homeInfo?.qR_Code?.replace(/\\/g, '/') || '/MBBank.png'} 
                        alt="MBBank QR" 
                        className="w-48 md:w-64 object-contain rounded-xl shadow-sm border border-gray-200" 
                      />
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-white/30 transition-colors hover:bg-white/50">
                      <UploadCloud className="w-8 h-8 text-gray-500 mb-3" />
                      <p className="text-sm font-bold text-gray-900 mb-1">MINH CHỨNG CHUYỂN KHOẢN</p>
                      <input 
                        type="file" id="proof-upload" className="hidden" accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="proof-upload" className="px-6 py-2 border border-gray-900 text-gray-900 rounded cursor-pointer hover:bg-gray-900 hover:text-white transition-colors text-sm font-medium">
                        CHỌN TỆP TIN
                      </label>
                      {proofFile && (
                        <div className="mt-4 flex flex-col items-center">
                          <img src={URL.createObjectURL(proofFile)} alt="Minh chứng" className="h-32 object-contain rounded mb-2 border border-gray-200" />
                          <p className="text-sm text-green-600 font-medium">{proofFile.name}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <label className={`block border rounded-xl p-4 cursor-pointer transition-colors ${paymentMethod === 'wallet' ? 'border-[#364132] bg-white/50' : 'border-gray-300 hover:border-gray-400'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" name="payment" value="wallet" checked={paymentMethod === 'wallet'}
                        onChange={() => { setPaymentMethod('wallet'); setProofFile(null); }}
                        className="w-5 h-5 text-[#364132] focus:ring-[#364132] border-gray-300"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">Ví điện tử</span>
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Momo, ZaloPay</span>
                      </div>
                    </div>
                    <Wallet className="w-6 h-6 text-gray-500" />
                  </div>
                </label>

                {paymentMethod === 'wallet' && (
                  <div className="mt-4 space-y-4">
                    <div className="flex justify-center">
                      <img 
                        src={homeInfo?.moMo?.replace(/\\/g, '/') || '/MOMO.png'} 
                        alt="Momo QR" 
                        className="w-48 md:w-64 object-contain rounded-xl shadow-sm border border-gray-200" 
                      />
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-white/30 transition-colors hover:bg-white/50">
                      <UploadCloud className="w-8 h-8 text-gray-500 mb-3" />
                      <p className="text-sm font-bold text-gray-900 mb-1">MINH CHỨNG CHUYỂN KHOẢN</p>
                      <input 
                        type="file" id="proof-upload-wallet" className="hidden" accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="proof-upload-wallet" className="px-6 py-2 border border-gray-900 text-gray-900 rounded cursor-pointer hover:bg-gray-900 hover:text-white transition-colors text-sm font-medium">
                        CHỌN TỆP TIN
                      </label>
                      {proofFile && (
                        <div className="mt-4 flex flex-col items-center">
                          <img src={URL.createObjectURL(proofFile)} alt="Minh chứng" className="h-32 object-contain rounded mb-2 border border-gray-200" />
                          <p className="text-sm text-green-600 font-medium">{proofFile.name}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cột phải: Summary */}
          <div className="flex-1 w-full lg:sticky lg:top-24">
            <div className="bg-[#EFEBE4] rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
              <div className="w-full h-48 bg-gray-200">
                <img src={room?.dsAnh?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600&auto=format&fit=crop'} alt={room?.tenPhong} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-serif text-gray-900 mb-6">Chi tiết đặt phòng</h3>
                <div className="space-y-6 mb-8 text-sm">
                  <div className="flex gap-4 items-start">
                    <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <p className="font-bold text-gray-500 uppercase tracking-widest text-[10px] mb-1">Nhận phòng</p>
                      <p className="text-gray-900 font-medium">{checkInDate.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <p className="font-bold text-gray-500 uppercase tracking-widest text-[10px] mb-1">Trả phòng</p>
                      <p className="text-gray-900 font-medium">{checkOutDate.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <Users className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <p className="font-bold text-gray-500 uppercase tracking-widest text-[10px] mb-1">Lưu trú</p>
                      <p className="text-gray-900 font-medium">{nights || 1} đêm, {(guests?.adults || 1) + (guests?.children || 0)} khách</p>
                    </div>
                  </div>
                </div>
                <div className="h-[1px] bg-gray-300 w-full mb-6"></div>
                <div className="space-y-3 mb-6 text-base">
                  <div className="flex justify-between"><span>Giá phòng</span><span>đ{fmt(total ? total * 0.9 : 0)}</span></div>
                  <div className="flex justify-between"><span>Phí & Thuế</span><span>đ{fmt(total ? total * 0.1 : 0)}</span></div>
                  <div className="flex justify-between font-bold text-lg pt-3"><span>Tổng cộng</span><span>đ{fmt(total || 0)}</span></div>
                </div>
                <button 
                  onClick={handleConfirmPayment} disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-medium transition-colors shadow-md ${isSubmitting ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#364132] text-white hover:bg-[#283125]'}`}
                >
                  {isSubmitting ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN VÀ THANH TOÁN'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
