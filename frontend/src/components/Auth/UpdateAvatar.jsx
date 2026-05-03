import React, { useState, useRef } from 'react';
import { X, Camera, Loader2, Upload, User } from 'lucide-react';
import { apiUpdateAvatar } from '../../services/authService';

const UpdateAvatar = ({ user, isOpen, onClose, onUpdateSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('Kích thước ảnh không được vượt quá 5MB.');
        return;
      }
      if (!selectedFile.type.startsWith('image/')) {
        setError('Vui lòng chọn file hình ảnh hợp lệ.');
        return;
      }

      setFile(selectedFile);
      setError('');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Vui lòng chọn một hình ảnh.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const idUser = user.iduser || user.idUser || user.id || user.Id || user.IdUser;
      const result = await apiUpdateAvatar(idUser, file);

      // Cập nhật lại user trong localStorage
      const stored = localStorage.getItem('homestayUser');
      if (stored) {
        const userData = JSON.parse(stored);
        const updatedUser = { 
          ...userData, 
          anhdaidien: result.data || result.url || result.avatarUrl || preview 
        };
        // Lưu ý: Tùy thuộc vào backend trả về gì, ở đây mình giả định result.data chứa URL ảnh mới
        // Nếu backend trả về object user mới thì gán luôn
        localStorage.setItem('homestayUser', JSON.stringify(updatedUser));
        onUpdateSuccess(updatedUser);
      }

      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: 'Cập nhật ảnh đại diện thành công', type: 'success' } 
      }));

      onClose();
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tải ảnh lên.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.25)] overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A251F] to-[#2D3E35] px-8 py-8 text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-serif font-bold">Ảnh đại diện</h3>
            <p className="text-white/50 text-[10px] mt-1 font-light tracking-widest uppercase">Cập nhật hình ảnh</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-10 space-y-8 text-center">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* Preview Circle */}
          <div className="relative mx-auto w-48 h-48 group">
            <div className="w-full h-full rounded-full border-4 border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center shadow-inner">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (user.anhdaidien && user.anhdaidien !== 'https://localhost:7092' && user.anhdaidien !== 'https://localhost:7092/') ? (
                <img src={user.anhdaidien} alt="Current" className="w-full h-full object-cover" />
              ) : (
                <User className="w-20 h-20 text-gray-200" />
              )}
            </div>
            
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-amber-600 hover:scale-110 transition-all duration-300"
            >
              <Camera className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="text-xl font-serif font-bold text-dark">
              {file ? file.name : 'Chọn ảnh từ thiết bị'}
            </h4>
            <p className="text-sm text-gray-400">Định dạng JPG, PNG hoặc WEBP. Tối đa 5MB.</p>
          </div>

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-[20px] bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 transition-all"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              className="flex-1 px-6 py-4 rounded-[20px] bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 shadow-xl shadow-amber-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang tải...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAvatar;
