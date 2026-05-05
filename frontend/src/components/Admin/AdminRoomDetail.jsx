import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../Layout/MainLayout';
import AdminLayout from './AdminLayout';
import { 
  apiGetAdminRoomById, 
  apiGetAdminRoomAmenities, 
  apiAddAmenityToRoom, 
  apiGetAdminRoomImages,
  apiUpdateAdminRoom,
  apiAddRoomImage,
  apiRemoveRoomImage,
  apiRemoveAmenityFromRoom
} from '../../services/adminRoomService';
import { apiGetAdminAmenities } from '../../services/adminAmenityService';
import { apiGetBookedDates } from '../../services/roomService';
import { showToast } from '../Common/Notification';

const AdminRoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [allAmenities, setAllAmenities] = useState([]); // Danh sách toàn bộ tiện nghi hệ thống
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomImages, setRoomImages] = useState([]); // Danh sách ảnh từ endpoint mới
  
  // State cho việc thêm tiện nghi
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAmenityId, setSelectedAmenityId] = useState('');
  const [amenityQuantity, setAmenityQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [viewDate, setViewDate] = useState(new Date());
  
  // State cho quản lý ảnh
  const [showImageModal, setShowImageModal] = useState(false);
  const [tempImages, setTempImages] = useState([]); // Ảnh hiện có
  const [newImageFiles, setNewImageFiles] = useState([]); // File mới thêm
  const [isUpdatingImages, setIsUpdatingImages] = useState(false);

  // State cho chỉnh sửa phòng
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdatingRoom, setIsUpdatingRoom] = useState(false);
  const [editRoomData, setEditRoomData] = useState({
    TenPhong: '',
    DiaChi: '',
    MoTa: '',
    LoaiPhong: '',
    TrangThai: '',
    GiaGoc: 0,
    SoNguoiLon: 0,
    SoTreEm: 0,
    SoGiuong: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomData, dates, amenitiesData, allAmenitiesData, imagesData] = await Promise.all([
        apiGetAdminRoomById(id),
        apiGetBookedDates(id),
        apiGetAdminRoomAmenities(id),
        apiGetAdminAmenities(),
        apiGetAdminRoomImages(id)
      ]);
      
      setRoom(roomData);
      setBookedDates(dates || []);
      setAmenities(amenitiesData || []);
      setAllAmenities(allAmenitiesData || []);
      setRoomImages(imagesData || []);
      setTempImages(imagesData || []); // Khởi tạo ảnh tạm bằng danh sách object
      setError(null);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err);
      setError(err.message || 'Không thể tải thông tin phòng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleAddAmenity = async (e) => {
    e.preventDefault();
    if (!selectedAmenityId) {
      showToast('Vui lòng chọn một tiện nghi', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await apiAddAmenityToRoom(id, {
        IdTienNghi: parseInt(selectedAmenityId),
        Soluong: parseInt(amenityQuantity)
      });
      showToast('Đã thêm tiện nghi vào phòng', 'success');
      setShowAddModal(false);
      setSelectedAmenityId('');
      setAmenityQuantity(1);
      
      // Tải lại danh sách tiện nghi
      const newAmenities = await apiGetAdminRoomAmenities(id);
      setAmenities(newAmenities);
    } catch (err) {
      showToast(err.message || 'Lỗi khi thêm tiện nghi', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveAmenity = async (amenityId, amenityName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tiện nghi "${amenityName}" khỏi phòng này không?`)) {
      return;
    }

    try {
      await apiRemoveAmenityFromRoom(id, amenityId);
      showToast('Đã xóa tiện nghi khỏi phòng', 'success');
      
      // Tải lại danh sách tiện nghi
      const newAmenities = await apiGetAdminRoomAmenities(id);
      setAmenities(newAmenities);
    } catch (err) {
      showToast(err.message || 'Lỗi khi xóa tiện nghi', 'error');
    }
  };

  // --- LOGIC QUẢN LÝ ẢNH ---
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImageFiles(prev => [...prev, ...files]);
  };

  const handleRemoveTempImage = async (idx, idImgRoom) => {
    if (!idImgRoom) return;
    
    if (!window.confirm('Bạn có chắc chắn muốn xóa ảnh này vĩnh viễn không?')) {
      return;
    }

    try {
      await apiRemoveRoomImage(id, idImgRoom);
      showToast('Đã xóa ảnh thành công', 'success');
      
      // Cập nhật lại UI tại chỗ
      setTempImages(prev => prev.filter((_, i) => i !== idx));
      setRoomImages(prev => prev.filter((_, i) => i !== idx));
    } catch (err) {
      showToast(err.message || 'Lỗi khi xóa ảnh', 'error');
    }
  };

  const handleRemoveNewFile = (idx) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveImages = async () => {
    try {
      setIsUpdatingImages(true);
      
      // Upload từng file mới một cách tuần tự
      for (const file of newImageFiles) {
        await apiAddRoomImage(id, file);
      }

      showToast('Cập nhật bộ sưu tập ảnh thành công!', 'success');
      setShowImageModal(false);
      setNewImageFiles([]);
      fetchData(); // Tải lại toàn bộ dữ liệu (bao gồm cả danh sách ảnh mới từ endpoint GET)
    } catch (err) {
      showToast(err.message || 'Lỗi khi cập nhật ảnh', 'error');
    } finally {
      setIsUpdatingImages(false);
    }
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      setIsUpdatingRoom(true);
      
      const submitData = {
        ...editRoomData,
        GiaGoc: parseInt(editRoomData.GiaGoc),
        SoNguoiLon: parseInt(editRoomData.SoNguoiLon),
        SoTreEm: parseInt(editRoomData.SoTreEm),
        SoGiuong: parseInt(editRoomData.SoGiuong)
      };

      await apiUpdateAdminRoom(id, submitData);
      showToast('Cập nhật thông tin phòng thành công!', 'success');
      setShowEditModal(false);
      fetchData(); // Tải lại dữ liệu mới nhất
    } catch (err) {
      showToast(err.message || 'Lỗi khi cập nhật phòng', 'error');
    } finally {
      setIsUpdatingRoom(false);
    }
  };

  const openEditModal = () => {
    setEditRoomData({
      TenPhong: room.tenPhong || '',
      DiaChi: room.diaChi || '',
      MoTa: room.mota || '',
      LoaiPhong: room.loaiPhong || 'Standard',
      TrangThai: room.trangThai || 'dang_hoat_dong',
      GiaGoc: room.gia || 0,
      SoNguoiLon: room.soNguoiLon || 1,
      SoTreEm: room.soTreEm || 0,
      SoGiuong: room.soGiuong || 1
    });
    setShowEditModal(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = (date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const firstDay = new Date(year, month, 1);
    const days = [];
    const firstDayIndex = firstDay.getDay(); 
    for (let i = 0; i < firstDayIndex; i++) days.push(null);
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) days.push(new Date(year, month, i));
    return days;
  };

  const isDateBooked = (date) => {
    if (!date || !bookedDates || bookedDates.length === 0) return false;
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return bookedDates.some(range => {
      const start = new Date(range.ngay_Nhan_Phong);
      const end = new Date(range.ngay_Tra_Phong);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return checkDate >= start && checkDate < end;
    });
  };

  const isPastDate = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const calendarDays = getDaysInMonth(viewDate);
  const monthName = new Intl.DateTimeFormat('vi-VN', { month: 'long', year: 'numeric' }).format(viewDate);

  if (loading) {
    return (
      <MainLayout forceScrolled={true} requireAuth={true} hideFooter={true}>
        <AdminLayout>
          <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium animate-pulse">Đang đồng bộ dữ liệu hệ thống...</p>
            </div>
          </div>
        </AdminLayout>
      </MainLayout>
    );
  }

  if (error || !room) {
    return (
      <MainLayout forceScrolled={true} requireAuth={true} hideFooter={true}>
        <AdminLayout>
          <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-8">
            <div className="max-w-md w-full bg-white p-10 rounded-[32px] shadow-sm border border-red-100 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Đã có lỗi xảy ra</h2>
              <p className="text-gray-500 mb-8">{error || 'Không tìm thấy thông tin phòng này.'}</p>
              <button onClick={() => navigate('/admin/rooms')} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all">Quay lại danh sách</button>
            </div>
          </div>
        </AdminLayout>
      </MainLayout>
    );
  }

  return (
    <MainLayout forceScrolled={true} requireAuth={true} hideFooter={true}>
      <AdminLayout>
        <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-gray-800 pb-20">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">{room.tenPhong}</h1>
                  <span className={`px-3 py-1 ${room.trangThai === 'dang_hoat_dong' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'} text-sm font-medium rounded-full flex items-center gap-2`}>
                    <span className={`w-2 h-2 rounded-full ${room.trangThai === 'dang_hoat_dong' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                    {room.trangThai === 'dang_hoat_dong' ? 'Sẵn sàng' : 'Đang bảo trì'}
                  </span>
                </div>
                <p className="text-gray-500 mt-1 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {room.diaChi || 'Chưa cập nhật địa chỉ'} • Mã phòng: #{room.id}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => navigate(`/room-detail?id=${room.id}`)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  Xem mẫu hiển thị
                </button>
                <button 
                  onClick={openEditModal}
                  className="px-4 py-2 bg-[#2E5C44] text-white rounded-lg font-medium hover:bg-[#244835] flex items-center gap-2 transition-colors shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  Chỉnh sửa chi tiết
                </button>
              </div>
            </div>

            {/* Photo Gallery Grid */}
            <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[450px]">
              <div 
                className="col-span-2 row-span-2 bg-gray-100 rounded-xl overflow-hidden shadow-sm cursor-pointer group"
                onClick={() => setShowImageModal(true)}
              >
                <img src={roomImages[0]?.img || 'https://via.placeholder.com/800x600?text=No+Image'} alt="Main" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div 
                className="col-span-2 bg-gray-100 rounded-xl overflow-hidden shadow-sm cursor-pointer group"
                onClick={() => setShowImageModal(true)}
              >
                <img src={roomImages[1]?.img || 'https://via.placeholder.com/400x300?text=No+Image'} alt="Sub 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div 
                className="bg-gray-100 rounded-xl overflow-hidden shadow-sm cursor-pointer group"
                onClick={() => setShowImageModal(true)}
              >
                <img src={roomImages[2]?.img || 'https://via.placeholder.com/300x300?text=No+Image'} alt="Sub 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div 
                className="bg-gray-800 rounded-xl overflow-hidden relative group cursor-pointer shadow-sm"
                onClick={() => setShowImageModal(true)}
              >
                <img src={roomImages[3]?.img || 'https://via.placeholder.com/300x300?text=No+Image'} alt="Sub 3" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                  <span className="font-semibold">Quản lý {roomImages.length || 0} ảnh</span>
                </div>
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Description Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Mô tả phòng</h2>
                  <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-line text-justify">{room.mota || 'Chưa có mô tả cho phòng này.'}</p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Người lớn</p>
                      <p className="text-gray-900 font-medium flex items-center gap-2">{room.soNguoiLon || 0} Người</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Trẻ em</p>
                      <p className="text-gray-900 font-medium flex items-center gap-2">{room.soTreEm || 0} Trẻ em</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Số giường</p>
                      <p className="text-gray-900 font-medium flex items-center gap-2">{room.soGiuong || 0} Giường</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Hạng phòng</p>
                      <p className="text-gray-900 font-medium flex items-center gap-2">{(room.loaiPhong || 'Standard').toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Trạng thái xóa</p>
                      <p className={`font-medium flex items-center gap-2 ${room.isDelete === "True" ? 'text-red-600' : 'text-green-600'}`}>{room.isDelete === "True" ? 'Đã xóa' : 'Chưa xóa'}</p>
                    </div>
                  </div>
                </div>

                {/* Amenities Card with Management */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Tiện nghi phòng nghỉ</h2>
                    <button 
                      onClick={() => setShowAddModal(true)}
                      className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold hover:bg-emerald-100 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                      Thêm tiện nghi
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                    {amenities && amenities.length > 0 ? (
                      amenities.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#2E5C44]">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-gray-900">{item.tenTienNghi}</span>
                              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Số lượng: {item.soluong}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleRemoveAmenity(item.idTienNghi, item.tenTienNghi)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="Xóa khỏi phòng"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">Phòng này chưa có tiện nghi nào.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-2">Giá gốc</p>
                  <div className="flex items-end gap-1 mb-8">
                    <span className="text-3xl font-bold text-[#2E5C44]">{formatPrice(room.gia || 0)}</span>
                    <span className="text-gray-500 mb-1 text-sm">/ đêm</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900">Tình trạng phòng</h3>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <button onClick={handlePrevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">&lt;</button>
                      <span className="capitalize w-32 text-center">{monthName}</span>
                      <button onClick={handleNextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">&gt;</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4">
                    {['CN','T2','T3','T4','T5','T6','T7'].map(day => <div key={day} className="text-gray-400 font-semibold py-1">{day}</div>)}
                    {calendarDays.map((date, idx) => {
                      if (!date) return <div key={`empty-${idx}`} className="py-2"></div>;
                      const booked = isDateBooked(date);
                      const past = isPastDate(date);
                      return (
                        <div key={idx} className={`py-2 rounded-full font-medium transition-all relative ${past ? 'opacity-30 text-gray-400' : (booked ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100')}`}>
                          {date.getDate()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Thêm Tiện Nghi */}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-50/30">
                <h3 className="text-xl font-bold text-gray-900">Thêm tiện nghi mới</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <form onSubmit={handleAddAmenity} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Chọn tiện nghi</label>
                  <select 
                    value={selectedAmenityId}
                    onChange={(e) => setSelectedAmenityId(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    required
                  >
                    <option value="">-- Chọn tiện nghi từ hệ thống --</option>
                    {allAmenities
                      .filter(a => !amenities.find(existing => existing.idTienNghi === a.idTienNghi))
                      .map(a => (
                        <option key={a.idTienNghi} value={a.idTienNghi}>
                          {a.ten_Tien_Nghi} {a.mo_Ta ? `(${a.mo_Ta})` : ''}
                        </option>
                      ))
                    }

                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Số lượng trong phòng</label>
                  <input 
                    type="number" 
                    min="1"
                    value={amenityQuantity}
                    onChange={(e) => setAmenityQuantity(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all">Hủy</button>
                  <button type="submit" disabled={isSubmitting} className="flex-[2] px-6 py-3 bg-[#2E5C44] text-white rounded-2xl font-bold hover:bg-[#244835] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20">
                    {isSubmitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Thêm vào phòng'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Modal Quản Lý Ảnh */}
        {showImageModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Quản lý ảnh phòng</h3>
                  <p className="text-sm text-gray-500 mt-1">Thêm hoặc xóa ảnh hiển thị của phòng nghỉ.</p>
                </div>
                <button onClick={() => setShowImageModal(false)} className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-gray-600 rounded-2xl transition-all shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {/* Nút thêm ảnh */}
                  <label className="aspect-square rounded-[24px] border-2 border-dashed border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/30 flex flex-col items-center justify-center cursor-pointer transition-all group">
                    <input 
                      type="file" 
                      multiple 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileChange}
                    />
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tải ảnh mới</span>
                  </label>

                  {/* Danh sách ảnh hiện có */}
                  {tempImages.map((imgObj, idx) => (
                    <div key={imgObj.idImgRoom || `old-${idx}`} className="relative aspect-square rounded-[24px] overflow-hidden group border border-gray-100 shadow-sm">
                      <img src={imgObj.img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                         <button 
                            type="button"
                            onClick={() => handleRemoveTempImage(idx, imgObj.idImgRoom)}
                            className="p-3 bg-rose-500/80 hover:bg-rose-600 backdrop-blur-md rounded-xl text-white transition-all shadow-lg"
                         >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                         </button>
                      </div>
                      {idx === 0 && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-[#2E5C44] text-white text-[10px] font-bold rounded-lg uppercase tracking-widest shadow-lg">Ảnh bìa</div>
                      )}
                    </div>
                  ))}

                  {/* Preview ảnh mới chọn */}
                  {newImageFiles.map((file, idx) => (
                    <div key={`new-${idx}`} className="relative aspect-square rounded-[24px] overflow-hidden group border-2 border-emerald-200 shadow-sm">
                      <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                         <button 
                            type="button"
                            onClick={() => handleRemoveNewFile(idx)}
                            className="p-3 bg-rose-500/80 hover:bg-rose-600 backdrop-blur-md rounded-xl text-white transition-all shadow-lg"
                         >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                         </button>
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-bold rounded uppercase">Mới</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 flex justify-end gap-4 bg-gray-50/50">
                <button 
                  onClick={() => {
                    setShowImageModal(false);
                    setNewImageFiles([]);
                    setTempImages(roomImages || []);
                  }} 
                  className="px-8 py-4 border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-white transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={handleSaveImages}
                  disabled={isUpdatingImages}
                  className="px-10 py-4 bg-[#2E5C44] text-white rounded-2xl font-bold hover:bg-[#244835] transition-all shadow-lg shadow-emerald-900/20 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {isUpdatingImages && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal Chỉnh Sửa Phòng */}
        {showEditModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Chỉnh sửa phòng nghỉ</h3>
                  <p className="text-sm text-gray-500 mt-1">Cập nhật thông tin chi tiết cho phòng #{id}.</p>
                </div>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <form onSubmit={handleUpdateRoom} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Tên phòng nghỉ</label>
                    <input 
                      type="text"
                      required
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-2 focus:ring-[#2E5C44] outline-none transition-all text-sm font-medium"
                      value={editRoomData.TenPhong}
                      onChange={(e) => setEditRoomData({...editRoomData, TenPhong: e.target.value})}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Địa chỉ / Vị trí</label>
                    <input 
                      type="text"
                      required
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-2 focus:ring-[#2E5C44] outline-none transition-all text-sm font-medium"
                      value={editRoomData.DiaChi}
                      onChange={(e) => setEditRoomData({...editRoomData, DiaChi: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Loại phòng</label>
                    <select 
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-2 focus:ring-[#2E5C44] outline-none transition-all text-sm font-medium appearance-none"
                      value={editRoomData.LoaiPhong}
                      onChange={(e) => setEditRoomData({...editRoomData, LoaiPhong: e.target.value})}
                    >
                      <option value="Standard">Standard</option>
                      <option value="Family">Family</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Trạng thái</label>
                    <select 
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-2 focus:ring-[#2E5C44] outline-none transition-all text-sm font-medium appearance-none"
                      value={editRoomData.TrangThai}
                      onChange={(e) => setEditRoomData({...editRoomData, TrangThai: e.target.value})}
                    >
                      <option value="dang_hoat_dong">Đang hoạt động</option>
                      <option value="dang_bao_tri">Đang bảo trì</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Giá gốc (VNĐ/đêm)</label>
                    <input 
                      type="number"
                      required
                      min="0"
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-2 focus:ring-[#2E5C44] outline-none transition-all text-sm font-bold"
                      value={editRoomData.GiaGoc}
                      onChange={(e) => setEditRoomData({...editRoomData, GiaGoc: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Số giường</label>
                    <input 
                      type="number"
                      required
                      min="1"
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-2 focus:ring-[#2E5C44] outline-none transition-all text-sm font-bold"
                      value={editRoomData.SoGiuong}
                      onChange={(e) => setEditRoomData({...editRoomData, SoGiuong: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Số người lớn</label>
                    <input 
                      type="number"
                      required
                      min="1"
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-2 focus:ring-[#2E5C44] outline-none transition-all text-sm font-bold"
                      value={editRoomData.SoNguoiLon}
                      onChange={(e) => setEditRoomData({...editRoomData, SoNguoiLon: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Số trẻ em</label>
                    <input 
                      type="number"
                      required
                      min="0"
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-2 focus:ring-[#2E5C44] outline-none transition-all text-sm font-bold"
                      value={editRoomData.SoTreEm}
                      onChange={(e) => setEditRoomData({...editRoomData, SoTreEm: e.target.value})}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Mô tả chi tiết</label>
                    <textarea 
                      rows="4"
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-2 focus:ring-[#2E5C44] outline-none transition-all text-sm font-medium resize-none"
                      value={editRoomData.MoTa}
                      onChange={(e) => setEditRoomData({...editRoomData, MoTa: e.target.value})}
                    ></textarea>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-4 border border-gray-100 text-gray-500 rounded-[24px] font-bold hover:bg-gray-50 transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit" 
                    disabled={isUpdatingRoom}
                    className="flex-[2] py-4 bg-[#2E5C44] text-white rounded-[24px] font-bold hover:bg-[#244835] transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isUpdatingRoom ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      'Lưu thay đổi'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AdminLayout>
    </MainLayout>
  );
};

export default AdminRoomDetail;
