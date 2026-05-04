import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MainLayout from '../Layout/MainLayout';
import AdminLayout from './AdminLayout';
import { 
  Plus, Search, X, MapPin, Maximize,
  Eye, Filter, Download, 
  ChevronLeft, ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import { apiGetAdminRooms } from '../../services/adminRoomService';


const AdminRooms = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);


  // Fetch dữ liệu từ API
  React.useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await apiGetAdminRooms();
        setRooms(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Không thể tải danh sách phòng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Logic lọc dữ liệu
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.tenPhong?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Chuẩn hóa loại phòng để so sánh (backend trả về Vip, standard, family...)
    const currentLoai = room.loaiPhong?.toLowerCase();
    const matchesType = typeFilter === 'All' || currentLoai === typeFilter.toLowerCase();
    
    // Chuẩn hóa trạng thái
    const matchesStatus = statusFilter === 'All' || room.trangThai === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });


  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRooms = filteredRooms.slice(startIndex, startIndex + itemsPerPage);

  const getPreviewImage = (dsAnh) => {
    if (!dsAnh || dsAnh.length === 0) return null;
    return dsAnh[0];
  };


  const getStatusBadge = (status) => {
    switch (status) {
      case 'dang_hoat_dong': return 'bg-emerald-500 text-white';
      case 'dang_bao_tri': return 'bg-amber-500 text-white';
      case 'het_phong': return 'bg-rose-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'dang_hoat_dong': return 'Hoạt động';
      case 'dang_bao_tri': return 'Bảo trì';
      case 'het_phong': return 'Hết phòng';
      default: return status;
    }
  };


  const formatPrice = (price) => {
    if (price >= 1000) return `${(price / 1000).toLocaleString()}k`;
    return price.toLocaleString();
  };

  return (
    <MainLayout forceScrolled={true} requireAuth={true} hideFooter={true}>
      <AdminLayout>
        <div className="min-h-screen bg-[#FAFBFD] p-6 lg:p-8 font-sans text-[#1A251F] pb-24">
          
          {/* Header Section */}
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#1A251F]">Room Inventory</h2>
              <p className="text-gray-500 mt-1">Danh sách phòng nghỉ và trạng thái hệ thống.</p>
            </div>
            <div className="flex gap-2">
               <button className="p-3.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-600 transition-all shadow-sm"><Download size={20}/></button>
               <button className="p-3.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-600 transition-all shadow-sm"><Filter size={20}/></button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="max-w-[1400px] mx-auto bg-white p-4 rounded-[32px] border border-gray-100 mb-8 flex flex-col lg:flex-row gap-4 shadow-sm">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm tên phòng..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm text-gray-700 focus:ring-2 focus:ring-[#003580] outline-none transition-all"
              />
            </div>
            <div className="flex gap-3">
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-gray-50 text-gray-700 border-none rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#003580]"
              >
                <option value="All">Loại phòng</option>
                <option value="Standard">Standard</option>
                <option value="Family">Family</option>
                <option value="VIP">VIP</option>
              </select>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 text-gray-700 border-none rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#003580]"
              >
                <option value="All">Trạng thái</option>
                <option value="dang_hoat_dong">Hoạt động</option>
                <option value="dang_bao_tri">Bảo trì</option>
              </select>

            </div>
          </div>

          {/* Grid View */}
          <div className="max-w-[1400px] mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[32px] h-[400px] animate-pulse border border-gray-100 shadow-sm" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-32 bg-white rounded-[32px] border border-dashed border-rose-200">
                <p className="text-rose-500 font-medium">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold"
                >
                  Thử lại
                </button>
              </div>
            ) : paginatedRooms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedRooms.map((room) => (
                  <div key={room.id} className={`bg-white rounded-[32px] overflow-hidden border ${room.isDelete === "True" ? 'border-rose-100 bg-rose-50/10' : 'border-gray-100'} shadow-sm hover:shadow-md transition-all group relative`}>

                    
                    {/* Hiển thị isDelete bên ngoài thẻ */}
                    {room.isDelete === "True" && (
                      <div className="absolute top-4 right-4 z-10 bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest">Đã xóa</div>
                    )}

                    <div className="relative h-56 overflow-hidden bg-gray-50">
                      {room.dsAnh && room.dsAnh.length > 0 ? (
                        <img 
                          src={getPreviewImage(room.dsAnh)} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          alt={room.tenPhong} 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ImageIcon size={40} />
                        </div>
                      )}
                      
                      {/* Badge trạng thái (Hoạt động / Bảo trì) */}
                      <div className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm ${getStatusBadge(room.trangThai)}`}>
                        {getStatusText(room.trangThai)}
                      </div>
                    </div>


                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-900 truncate pr-2">{room.tenPhong}</h3>
                        <p className="text-sm font-bold text-[#003580] whitespace-nowrap">
                          {formatPrice(room.gia)} <span className="text-[10px] text-gray-400 font-normal">/đêm</span>
                        </p>
                      </div>

                      <div className="flex justify-between items-center mb-6">
                         <div className="flex items-center gap-1.5 text-gray-400">
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 rounded text-gray-600 tracking-wider uppercase">{room.loaiPhong}</span>
                         </div>
                         <div className="flex items-center gap-3 text-gray-400">
                            <div className="flex items-center gap-1">
                               <MapPin size={12} />
                               <span className="text-[10px]">Tầng {room.id % 20 + 1}</span>
                            </div>
                         </div>
                      </div>

                      {/* Chỉ giữ nút Chi tiết */}
                      <button 
                        onClick={() => navigate(`/admin/rooms/${room.id}`)}
                        className="w-full py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        Chi tiết phòng
                      </button>

                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-[32px] border border-dashed border-gray-200">
                <p className="text-gray-400">Không tìm thấy dữ liệu phòng phù hợp.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="max-w-[1400px] mx-auto mt-12 flex justify-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400 disabled:opacity-30 hover:bg-gray-50 transition-all"><ChevronLeft size={20}/></button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-12 h-12 rounded-2xl font-bold text-sm transition-all ${currentPage === i + 1 ? 'bg-[#003580] text-white shadow-md' : 'bg-white text-gray-400 hover:text-gray-700 border border-transparent hover:border-gray-100'}`}>{i + 1}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400 disabled:opacity-30 hover:bg-gray-50 transition-all"><ChevronRight size={20}/></button>
            </div>
          )}
        </div>

        {/* Modal Detail */}
        {isDetailModalOpen && selectedRoom && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="relative h-64 bg-gray-100">
                <img src={getPreviewImage(selectedRoom.dsAnh)} className="w-full h-full object-cover" alt="" />
                <button onClick={() => setIsDetailModalOpen(false)} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all"><X size={20}/></button>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{selectedRoom.tenPhong}</h4>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${getStatusBadge(selectedRoom.trangThai)}`}>{getStatusText(selectedRoom.trangThai)}</span>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-black text-[#003580]">{selectedRoom.gia?.toLocaleString()} <span className="text-sm font-normal text-gray-400">VNĐ</span></p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Mã phòng</p>
                      <p className="text-sm font-bold font-mono text-gray-700">#RM-{selectedRoom.id}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Loại phòng</p>
                      <p className="text-sm font-bold text-gray-700">{selectedRoom.loaiPhong}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Trạng thái dữ liệu</p>
                      <p className={`text-sm font-bold ${selectedRoom.isDelete === "True" ? 'text-rose-500' : 'text-emerald-500'}`}>{selectedRoom.isDelete === "True" ? 'Đã bị xóa/ẩn' : 'Đang hiện'}</p>
                   </div>

                </div>
                <div className="mt-8 flex justify-end">
                   <button onClick={() => setIsDetailModalOpen(false)} className="px-10 py-3.5 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95">Đóng cửa sổ</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </MainLayout>
  );
};

export default AdminRooms;
