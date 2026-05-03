import React, { useState } from 'react';
import { X, Mail, Loader2, ArrowRight } from 'lucide-react';
import { apiUpdateEmail } from '../../services/authService';

const UpdateEmail = ({ user, isOpen, onClose, onUpdateSuccess }) => {
  const [email, setEmail] = useState(user?.email || user?.Email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const idUser = user.iduser || user.idUser || user.id || user.Id || user.IdUser;
      if (!idUser) throw new Error('Không tìm thấy ID người dùng.');

      const result = await apiUpdateEmail(idUser, email);

      // Cập nhật localStorage
      const stored = JSON.parse(localStorage.getItem('homestayUser'));
      const newUserData = { ...stored, email: email };
      localStorage.setItem('homestayUser', JSON.stringify(newUserData));

      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: result.message || 'Thay đổi thành công', type: 'success' } 
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
      <div className="relative w-full max-w-3xl bg-white rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.25)] overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A251F] to-[#2D3E35] px-12 py-10 text-white flex justify-between items-center">
          <div>
            <h3 className="text-3xl font-serif font-bold">Thay đổi Email</h3>
            <p className="text-white/50 text-sm mt-2 font-light tracking-wider">TÀI KHOẢN</p>
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
          <div className="p-6 bg-amber-50 border border-amber-100 rounded-[24px]">
            <p className="text-amber-800 text-sm leading-relaxed">
              <strong>Lưu ý:</strong> Email này sẽ được dùng để đăng nhập và nhận các thông báo quan trọng về đặt phòng của bạn.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Email mới</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <Mail className="w-7 h-7" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email mới của bạn"
                className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[20px] outline-none transition-all text-base font-medium text-dark"
                required
              />
            </div>
          </div>

          <div className="flex gap-6 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-6 rounded-[24px] bg-gray-100 text-gray-600 text-xl font-bold hover:bg-gray-200 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-6 rounded-[24px] bg-amber-500 text-white text-xl font-bold hover:bg-amber-600 shadow-xl shadow-amber-200 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-7 h-7 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  Xác nhận
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEmail;
