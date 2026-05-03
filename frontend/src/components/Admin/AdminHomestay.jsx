import React, { useState, useEffect } from 'react';
import MainLayout from '../Layout/MainLayout';
import AdminLayout from './AdminLayout';
import { apiGetAdminHomeStayManager, apiUpdateAdminHomeStayManager } from '../../services/adminHomeService';
import { Save, Image as ImageIcon, MapPin, AlignLeft, Smartphone, Mail, Hash, CreditCard, Loader2 } from 'lucide-react';

const AdminHomestay = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    ten_Home: '',
    dia_Chi: '',
    sdt: '',
    email_Home: '',
    mo_Ta: '',
    anh: '',
    qR_Code: '',
    moMo: ''
  });

  const [previewImages, setPreviewImages] = useState({
    anh: '',
    qR_Code: '',
    moMo: ''
  });

  const [imageFiles, setImageFiles] = useState({
    anh: null,
    qR_Code: null,
    moMo: null
  });

  useEffect(() => {
    fetchHomestayInfo();
  }, []);

  const fetchHomestayInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGetAdminHomeStayManager();
      
      setFormData({
        ten_Home: data.ten_Home || '',
        dia_Chi: data.dia_Chi || '',
        sdt: data.sdt || '',
        email_Home: data.email_Home || '',
        mo_Ta: data.mo_Ta || '',
        anh: data.anh || '',
        qR_Code: data.qR_Code || '',
        moMo: data.moMo || ''
      });

      setPreviewImages({
        anh: data.anh || '',
        qR_Code: data.qR_Code || '',
        moMo: data.moMo || ''
      });
      
    } catch (err) {
      setError(err.message || 'Lỗi khi tải thông tin Homestay');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImages(prev => ({ ...prev, [type]: url }));
      setImageFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const urlToFile = async (url, filename) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      return new File([blob], filename, { type: blob.type || 'image/jpeg' });
    } catch (e) {
      console.error("Lỗi khi tải ảnh cũ:", e);
      return null;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('Ten_Home', formData.ten_Home || '');
      fd.append('Dia_Chi', formData.dia_Chi || '');
      fd.append('SDT', formData.sdt || '');
      fd.append('Email_Home', formData.email_Home || '');
      fd.append('Mo_Ta', formData.mo_Ta || '');
      
      // Xử lý Ảnh chính: lấy ảnh mới hoặc tải lại ảnh cũ từ URL
      let anhFile = imageFiles.anh;
      if (!anhFile && previewImages.anh) {
        anhFile = await urlToFile(previewImages.anh, 'anh_cu.jpg');
      }
      if (anhFile) fd.append('Anh', anhFile);

      // Xử lý QR Code
      let qrFile = imageFiles.qR_Code;
      if (!qrFile && previewImages.qR_Code) {
        qrFile = await urlToFile(previewImages.qR_Code, 'qr_cu.jpg');
      }
      if (qrFile) fd.append('QR_Code', qrFile);

      // Xử lý MoMo
      let momoFile = imageFiles.moMo;
      if (!momoFile && previewImages.moMo) {
        momoFile = await urlToFile(previewImages.moMo, 'momo_cu.jpg');
      }
      if (momoFile) fd.append('MoMo', momoFile);

      await apiUpdateAdminHomeStayManager(fd);
      
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: 'Cập nhật thông tin Homestay thành công!', type: 'success' } 
      }));
      
      setImageFiles({ anh: null, qR_Code: null, moMo: null });
      fetchHomestayInfo();
    } catch (err) {
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: err.message || 'Lỗi khi lưu thông tin', type: 'error' } 
      }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout forceScrolled={true} requireAuth={true} hideFooter={true}>
      <AdminLayout>
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1A251F]">Quản lý thông tin Homestay</h2>
              <p className="text-gray-500 text-sm mt-1">Cập nhật chi tiết về thông tin liên hệ và giới thiệu của 60 Homes.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-[#2D3E35] text-white rounded-lg font-medium hover:bg-[#1A251F] transition-colors shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Lưu thông tin
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="animate-pulse flex flex-col gap-6">
               <div className="h-64 bg-gray-200 rounded-xl"></div>
               <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Cột trái: Thông tin cơ bản */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                    <AlignLeft className="text-[#2D3E35]" size={20} />
                    <h3 className="text-lg font-bold text-[#1A251F]">Thông tin cơ bản</h3>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tên Homestay</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <Hash size={16} className="text-gray-400" />
                        </div>
                        <input 
                          type="text" 
                          name="ten_Home"
                          value={formData.ten_Home}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-[#1A251F] focus:bg-white focus:border-[#2D3E35] focus:ring-1 focus:ring-[#2D3E35] outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Khu vực / Thành phố</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin size={16} className="text-gray-400" />
                          </div>
                          <input 
                            type="text" 
                            name="dia_Chi"
                            value={formData.dia_Chi}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-[#1A251F] focus:bg-white focus:border-[#2D3E35] focus:ring-1 focus:ring-[#2D3E35] outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại liên hệ</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Smartphone size={16} className="text-gray-400" />
                          </div>
                          <input 
                            type="text" 
                            name="sdt"
                            value={formData.sdt}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-[#1A251F] focus:bg-white focus:border-[#2D3E35] focus:ring-1 focus:ring-[#2D3E35] outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email liên hệ</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={16} className="text-gray-400" />
                        </div>
                        <input 
                          type="email" 
                          name="email_Home"
                          value={formData.email_Home}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-[#1A251F] focus:bg-white focus:border-[#2D3E35] focus:ring-1 focus:ring-[#2D3E35] outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả dài</label>
                      <textarea 
                        name="mo_Ta"
                        value={formData.mo_Ta}
                        onChange={handleChange}
                        rows="8"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-[#1A251F] focus:bg-white focus:border-[#2D3E35] focus:ring-1 focus:ring-[#2D3E35] outline-none transition-all leading-relaxed resize-y"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cột phải: Hình ảnh & Thanh toán */}
              <div className="space-y-6">
                
                {/* Ảnh đại diện Homestay */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="text-[#2D3E35]" size={20} />
                      <h3 className="text-lg font-bold text-[#1A251F]">Ảnh đại diện</h3>
                    </div>
                  </div>
                  
                  <div className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-video mb-4 bg-gray-50">
                    {previewImages.anh ? (
                      <img src={previewImages.anh} alt="Homestay" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <ImageIcon size={40} className="mb-2 opacity-50" />
                        <span className="text-sm">Chưa có ảnh</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
                          Thay đổi ảnh
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'anh')} />
                       </label>
                    </div>
                  </div>
                </div>

                {/* Mã QR Thanh toán */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-4">
                    <CreditCard className="text-[#2D3E35]" size={20} />
                    <h3 className="text-lg font-bold text-[#1A251F]">Thông tin Thanh toán</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* QR Ngân hàng */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2 text-center">QR Ngân hàng</p>
                      <div className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                        {previewImages.qR_Code ? (
                          <img src={previewImages.qR_Code} alt="QR Bank" className="w-full h-full object-contain p-2" />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <span className="text-xs">Chưa có QR</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <label className="cursor-pointer bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
                              <ImageIcon size={18} />
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'qR_Code')} />
                           </label>
                        </div>
                      </div>
                    </div>

                    {/* QR MoMo */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2 text-center">QR MoMo</p>
                      <div className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                        {previewImages.moMo ? (
                          <img src={previewImages.moMo} alt="QR MoMo" className="w-full h-full object-contain p-2" />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <span className="text-xs">Chưa có QR</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <label className="cursor-pointer bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
                              <ImageIcon size={18} />
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'moMo')} />
                           </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>
      </AdminLayout>
    </MainLayout>
  );
};

export default AdminHomestay;
