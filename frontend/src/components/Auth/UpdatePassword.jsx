import React, { useState } from 'react';
import { X, Lock, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { apiUpdatePassword } from '../../services/authService';

const UpdatePassword = ({ user, isOpen, onClose }) => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPass !== confirmPass) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);

    try {
      const idUser = user.iduser || user.idUser || user.id || user.Id || user.IdUser;
      if (!idUser) throw new Error('Không tìm thấy ID người dùng.');

      const result = await apiUpdatePassword(idUser, oldPass, newPass);

      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: result.message || 'Đổi mật khẩu thành công', type: 'success' } 
      }));

      // Reset form và đóng modal
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
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
            <h3 className="text-3xl font-serif font-bold">Đổi mật khẩu</h3>
            <p className="text-white/50 text-sm mt-2 font-light tracking-wider">BẢO MẬT</p>
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

          {/* Mật khẩu cũ */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Mật khẩu hiện tại</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                <Lock className="w-6 h-6" />
              </div>
              <input
                type={showOldPass ? "text" : "password"}
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="Nhập mật khẩu cũ"
                className="w-full pl-16 pr-14 py-5 bg-gray-50 border-2 border-transparent focus:border-amber-200 focus:bg-white rounded-[20px] outline-none transition-all text-base font-medium text-dark"
                required
              />
              <button
                type="button"
                onClick={() => setShowOldPass(!showOldPass)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition-colors"
              >
                {showOldPass ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-100 my-2"></div>

          {/* Mật khẩu mới */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <input
                type={showNewPass ? "text" : "password"}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Mật khẩu mới (8+ ký tự, A-Z, a-z, 0-9, @#...)"
                className="w-full pl-16 pr-14 py-5 bg-gray-50 border-2 border-transparent focus:border-amber-200 focus:bg-white rounded-[20px] outline-none transition-all text-base font-medium text-dark"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition-colors"
              >
                {showNewPass ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>
            <p className="text-[11px] text-gray-400 ml-1 mt-1 italic">
              * Ít nhất 8 ký tự có ít nhất một ký tự hoa, một ký tự thường, một ký tự số và một ký tự đặc biệt (@$!%*?&#)
            </p>
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Xác nhận mật khẩu mới</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-amber-200 focus:bg-white rounded-[20px] outline-none transition-all text-base font-medium text-dark"
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
                  Đang đổi...
                </>
              ) : (
                'Cập nhật'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
