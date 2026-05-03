import React, { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, Calendar, Loader2 } from 'lucide-react';
import { apiUpdateProfile } from '../../services/authService';

const UpdateProfile = ({ user, isOpen, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    sdt: '',
    diachi: '',
    ngaySinh: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cập nhật formData khi user hoặc isOpen thay đổi
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || '',
        sdt: user.sdt || '',
        diachi: user.diachi || '',
        ngaySinh: user.ngaySinh ? new Date(user.ngaySinh).toISOString().split('T')[0] : '',
      });
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Ưu tiên iduser theo đặc tả của bạn
      const idUser = user.iduser || user.idUser || user.id || user.Id || user.IdUser;
      if (!idUser) throw new Error('Không tìm thấy ID người dùng.');

      const result = await apiUpdateProfile(idUser, {
        name: formData.name,
        email: user.email || user.Email, // Vẫn gửi email hiện tại để thỏa mãn yêu cầu API
        sdt: formData.sdt,
        diachi: formData.diachi,
        ngaySinh: formData.ngaySinh ? `${formData.ngaySinh}T00:00:00` : null
      });

      // Cập nhật dữ liệu vào localStorage để UI đồng bộ
      const stored = JSON.parse(localStorage.getItem('homestayUser'));
      const newUserData = { ...stored, ...formData };
      localStorage.setItem('homestayUser', JSON.stringify(newUserData));

      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: result.message || 'Thay Đổi thông tin thành công', type: 'success' } 
      }));

      onUpdateSuccess(newUserData);
      onClose();
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.25)] overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A251F] to-[#2D3E35] px-12 py-10 text-white flex justify-between items-center">
          <div>
            <h3 className="text-3xl font-serif font-bold">Cập nhật hồ sơ</h3>
            <p className="text-white/50 text-sm mt-2 font-light tracking-wider">THÔNG TIN CÁ NHÂN</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-12 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Họ tên */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Họ và tên</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <User className="w-7 h-7" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập họ tên"
                  className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[20px] outline-none transition-all text-base font-medium text-dark"
                  required
                />
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Số điện thoại</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Phone className="w-6 h-6" />
                </div>
                <input
                  type="tel"
                  name="sdt"
                  value={formData.sdt}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[20px] outline-none transition-all text-base font-medium text-dark"
                  required
                />
              </div>
            </div>

            {/* Ngày sinh */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Ngày sinh</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Calendar className="w-6 h-6" />
                </div>
                <input
                  type="date"
                  name="ngaySinh"
                  value={formData.ngaySinh}
                  onChange={handleChange}
                  className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[20px] outline-none transition-all text-base font-medium text-dark"
                />
              </div>
            </div>

            {/* Địa chỉ */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Địa chỉ</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <MapPin className="w-6 h-6" />
                </div>
                <input
                  type="text"
                  name="diachi"
                  value={formData.diachi}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ của bạn"
                  className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[20px] outline-none transition-all text-base font-medium text-dark"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-6 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-6 rounded-[24px] bg-gray-100 text-gray-600 text-xl font-bold hover:bg-gray-200 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-6 rounded-[24px] bg-amber-500 text-white text-xl font-bold hover:bg-amber-600 shadow-xl shadow-amber-200 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-7 h-7 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Lưu thay đổi'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
