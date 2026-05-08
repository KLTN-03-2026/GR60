import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import MainLayout from '../Layout/MainLayout';
import { 
  BarChart2, Calendar, TrendingUp, Users, Home, 
  ArrowUpRight, ArrowDownRight, Clock, Filter, CheckCircle2, XCircle, AlertCircle, Loader2,
  Star, CreditCard, DollarSign, Bed, Award, UserCheck, PieChart, MousePointer2,
  Ban
} from 'lucide-react';
import { apiGetBookings } from '../../services/adminBookingService';
import { apiGetPayments } from '../../services/adminPaymentService';
import { apiGetAdminRooms } from '../../services/adminRoomService';
import { apiGetAdminUsers } from '../../services/adminUserService';
import { apiGetReviews } from '../../services/reviewService';
import { showToast } from '../Common/Notification';

const AdminStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    bookings: [],
    payments: [],
    rooms: [],
    users: [],
    reviews: []
  });
  
  const [dateRange, setDateRange] = useState({
    fromDate: '',
    toDate: ''
  });
  const [filteredData, setFilteredData] = useState({
    bookings: [],
    payments: [],
    users: [],
    reviews: []
  });

  const [chartViewMode, setChartViewMode] = useState('day'); 

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookings, payments, rooms, users, reviews] = await Promise.all([
        apiGetBookings(),
        apiGetPayments(),
        apiGetAdminRooms(),
        apiGetAdminUsers(),
        apiGetReviews()
      ]);
      
      const allData = { bookings, payments, rooms, users, reviews };
      setData(allData);
      
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const today = now.toISOString().split('T')[0];
      setDateRange({ fromDate: firstDay, toDate: today });

      const initialBookings = (bookings || []).filter(b => {
        const date = new Date(b.ngay_Tao);
        return date >= new Date(firstDay) && date <= new Date(today + 'T23:59:59');
      });
      const initialPayments = (payments || []).filter(p => {
        const date = new Date(p.thoi_Gian_Thanh_Toan);
        return date >= new Date(firstDay) && date <= new Date(today + 'T23:59:59');
      });
      const initialUsers = (users || []).filter(u => {
        const date = new Date(u.ngay_Tao || u.ngayTao || u.ngay_tao);
        return date >= new Date(firstDay) && date <= new Date(today + 'T23:59:59');
      });

      setFilteredData({
        ...allData,
        bookings: initialBookings,
        payments: initialPayments,
        users: initialUsers
      });

    } catch (err) {
      showToast('Lỗi khi tải dữ liệu thống kê: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplyFilter = () => {
    const { fromDate, toDate } = dateRange;
    if (!fromDate || !toDate) {
      showToast('Vui lòng chọn đầy đủ khoảng thời gian.', 'error');
      return;
    }
    if (new Date(fromDate) > new Date(toDate)) {
      showToast('Ngày bắt đầu không được lớn hơn ngày kết thúc.', 'error');
      return;
    }

    const filteredBookings = data.bookings.filter(b => {
      const date = new Date(b.ngay_Tao);
      return date >= new Date(fromDate) && date <= new Date(toDate + 'T23:59:59');
    });

    const filteredPayments = data.payments.filter(p => {
      const date = new Date(p.thoi_Gian_Thanh_Toan);
      return date >= new Date(fromDate) && date <= new Date(toDate + 'T23:59:59');
    });

    const filteredUsers = data.users.filter(u => {
      const date = new Date(u.ngay_Tao || u.ngayTao || u.ngay_tao);
      return date >= new Date(fromDate) && date <= new Date(toDate + 'T23:59:59');
    });

    setFilteredData({
      ...data,
      bookings: filteredBookings,
      payments: filteredPayments,
      users: filteredUsers
    });
    
    showToast('Đã cập nhật dữ liệu thống kê.', 'success');
  };

  const revenueTrendData = useMemo(() => {
    const { fromDate, toDate } = dateRange;
    if (!fromDate || !toDate) return [];
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
    const dailyRevenueMap = {};
    filteredData.payments.filter(p => p.trang_Thai === 'da_hoan_thanh').forEach(p => {
      const d = new Date(p.thoi_Gian_Thanh_Toan);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      dailyRevenueMap[key] = (dailyRevenueMap[key] || 0) + (p.tong_Tien || 0);
    });
    const result = [];
    if (chartViewMode === 'day') {
      const step = Math.max(1, Math.floor(diffDays / 12));
      for (let i = 0; i < Math.min(diffDays, 12); i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + (i * step));
        if (d > end) break;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        result.push({ label: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }), value: dailyRevenueMap[key] || 0 });
      }
    } else if (chartViewMode === 'week') {
      const numWeeks = Math.ceil(diffDays / 7);
      for (let i = 0; i < Math.min(numWeeks, 8); i++) {
        let weekTotal = 0;
        const weekStart = new Date(start);
        weekStart.setDate(weekStart.getDate() + (i * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        Object.keys(dailyRevenueMap).forEach(dateStr => {
           const d = new Date(dateStr);
           if (d >= weekStart && d <= weekEnd && d <= end) weekTotal += dailyRevenueMap[dateStr];
        });
        result.push({ label: `Tuần ${i + 1}`, value: weekTotal });
      }
    } else if (chartViewMode === 'month') {
      const startMonth = start.getMonth();
      const startYear = start.getFullYear();
      const totalMonths = (end.getFullYear() - startYear) * 12 + (end.getMonth() - startMonth) + 1;
      for (let i = 0; i < Math.min(totalMonths, 12); i++) {
        let monthTotal = 0;
        const currentMonth = new Date(startYear, startMonth + i, 1);
        const nextMonth = new Date(startYear, startMonth + i + 1, 0);
        Object.keys(dailyRevenueMap).forEach(dateStr => {
           const d = new Date(dateStr);
           if (d >= currentMonth && d <= nextMonth && d <= end && d >= start) monthTotal += dailyRevenueMap[dateStr];
        });
        result.push({ label: `T${currentMonth.getMonth() + 1}`, value: monthTotal });
      }
    }
    return result;
  }, [filteredData.payments, dateRange, chartViewMode]);

  const maxRevenue = Math.max(...revenueTrendData.map(d => d.value), 1);
  const svgWidth = 1000;
  const svgHeight = 350;
  const paddingX = 50;
  const paddingY = 40;

  const getPoint = (index, value) => {
    const x = paddingX + (index / Math.max(1, revenueTrendData.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - (value / maxRevenue) * (svgHeight - paddingY * 2);
    return { x, y };
  };

  const generateSvgPath = (data, isClosed = false) => {
    if (data.length < 2) return "";
    let path = `M ${getPoint(0, data[0].value).x},${getPoint(0, data[0].value).y}`;
    for (let i = 1; i < data.length; i++) {
        const p0 = getPoint(i - 1, data[i - 1].value);
        const p1 = getPoint(i, data[i].value);
        const cp1x = p0.x + (p1.x - p0.x) / 2;
        path += ` C ${cp1x},${p0.y} ${cp1x},${p1.y} ${p1.x},${p1.y}`;
    }
    if (isClosed) {
        const lastP = getPoint(data.length - 1, data[data.length - 1].value);
        const firstP = getPoint(0, data[0].value);
        path += ` L ${lastP.x},${svgHeight - 10} L ${firstP.x},${svgHeight - 10} Z`;
    }
    return path;
  };

  const totalRevenueKPI = useMemo(() => 
    filteredData.payments
      .filter(p => p.trang_Thai === 'da_hoan_thanh')
      .reduce((sum, p) => sum + (p.tong_Tien || 0), 0)
  , [filteredData.payments]);

  const activeBookingsCount = useMemo(() => 
    filteredData.bookings.filter(b => b.trang_Thai !== 'da_huy').length
  , [filteredData.bookings]);

  const cancelledBookingsCount = useMemo(() => 
    filteredData.bookings.filter(b => b.trang_Thai === 'da_huy').length
  , [filteredData.bookings]);

  const newCustomersCount = useMemo(() => 
    filteredData.users.filter(u => {
        const role = (u.vai_Tro || u.vaitro || u.Vaitro || u.vai_tro || '').toLowerCase();
        return role === 'khách' || role === 'khach';
    }).length
  , [filteredData.users]);

  const avgRating = useMemo(() => {
    if (data.reviews.length === 0) return 0;
    const sum = data.reviews.reduce((acc, r) => acc + (r.so_sao || r.so_Sao || 0), 0);
    return (sum / data.reviews.length).toFixed(1);
  }, [data.reviews]);

  const occupancyRate = useMemo(() => {
    if (data.rooms.length === 0) return 0;
    const { fromDate, toDate } = dateRange;
    if (!fromDate || !toDate) return 0;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
    let totalBookedDays = 0;
    filteredData.bookings.filter(b => b.trang_Thai === 'da_hoan_thanh').forEach(b => {
      const checkIn = new Date(b.ngay_Nhan_Phong);
      const checkOut = new Date(b.ngay_Tra_Phong);
      const days = Math.ceil(Math.abs(checkOut - checkIn) / (1000 * 60 * 60 * 24));
      totalBookedDays += days;
    });
    const rate = (totalBookedDays / (data.rooms.length * diffDays)) * 100;
    return Math.min(Math.round(rate), 100);
  }, [filteredData.bookings, data.rooms, dateRange]);

  // FIXED: Xếp hạng phòng theo DOANH THU THỰC TẾ
  const topRooms = useMemo(() => {
    const revenueMap = {};
    filteredData.bookings.filter(b => b.trang_Thai === 'da_hoan_thanh').forEach(b => {
      const name = b.room_Name || b.ten_Phong || b.tenPhong || `Phòng ${b.id_Room}`;
      revenueMap[name] = (revenueMap[name] || 0) + (b.tong_Tien || 0);
    });
    return Object.entries(revenueMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [filteredData.bookings]);

  const topVIPs = useMemo(() => {
    const spend = {};
    filteredData.payments.filter(p => p.trang_Thai === 'da_hoan_thanh').forEach(p => {
      const name = p.user_Name || 'Ẩn danh';
      spend[name] = (spend[name] || 0) + (p.tong_Tien || 0);
    });
    return Object.entries(spend).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [filteredData.payments]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) {
    return (
      <MainLayout forceScrolled={true} requireAuth={true} hideFooter={true}>
        <AdminLayout>
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4">
               <Loader2 className="w-12 h-12 text-[#2D3E35] animate-spin" />
               <p className="text-gray-400 font-bold animate-pulse text-xs uppercase tracking-widest">Đang khởi tạo báo cáo...</p>
            </div>
          </div>
        </AdminLayout>
      </MainLayout>
    );
  }

  return (
    <MainLayout forceScrolled={true} requireAuth={true} hideFooter={true}>
      <AdminLayout>
        <div className="min-h-screen bg-[#FDFBF7] p-6 lg:p-10 pb-24 text-[#1A251F]">
          <div className="max-w-[1600px] mx-auto space-y-10">
            
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-[#1A251F] mb-2">Phân tích hệ thống</h1>
                <p className="text-gray-500 font-medium text-lg">Dữ liệu tổng hợp thực tế từ 60 HOMES.</p>
              </div>

              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-wrap items-center gap-6 w-full xl:w-auto">
                <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Từ ngày</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
                      <input 
                        type="date"
                        value={dateRange.fromDate}
                        onChange={(e) => setDateRange({...dateRange, fromDate: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Đến ngày</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" size={18} />
                      <input 
                        type="date"
                        value={dateRange.toDate}
                        onChange={(e) => setDateRange({...dateRange, toDate: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleApplyFilter}
                  className="px-8 py-3.5 bg-[#1A251F] text-white rounded-2xl font-black text-sm hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200 mt-auto"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
              <div className="bg-[#1A251F] p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-emerald-500/20"></div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="p-4 bg-white/10 text-emerald-400 rounded-3xl"><DollarSign size={28} /></div>
                </div>
                <div className="relative z-10">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Doanh thu thực</p>
                  <h3 className="text-2xl font-black text-white">{totalRevenueKPI.toLocaleString()} <span className="text-emerald-400 text-base font-medium">₫</span></h3>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl"><Bed size={28} /></div>
                  <div className="flex items-center gap-1 text-blue-500 font-bold text-[10px] bg-blue-50 px-2 py-1 rounded-full uppercase">Đã duyệt</div>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Tổng số lượt đặt</p>
                  <h3 className="text-3xl font-black text-[#1A251F]">{activeBookingsCount}</h3>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-rose-50 text-rose-500 rounded-3xl"><Ban size={28} /></div>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Số đơn đã hủy</p>
                  <h3 className="text-3xl font-black text-rose-600">{cancelledBookingsCount}</h3>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl"><UserCheck size={28} /></div>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Khách hàng mới</p>
                  <h3 className="text-3xl font-black text-[#1A251F]">{newCustomersCount}</h3>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-amber-50 text-amber-500 rounded-3xl"><Star size={28} /></div>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Đánh giá hệ thống</p>
                  <h3 className="text-3xl font-black text-[#1A251F]">{avgRating} <span className="text-amber-500 text-xl">★</span></h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#2D3E35] p-10 rounded-[48px] shadow-2xl flex flex-col h-full text-white relative overflow-hidden">
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <h3 className="text-2xl font-black mb-10 relative z-10">Hiệu suất hoạt động</h3>
                <div className="space-y-10 relative z-10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Tỷ lệ lấp đầy</p>
                        <h4 className="text-3xl font-black">{occupancyRate}%</h4>
                      </div>
                    </div>
                    <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full shadow-[0_0_15px_rgba(52,211,153,0.4)] transition-all duration-1000" style={{ width: `${occupancyRate}%` }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                    <div className="space-y-3">
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Phân bổ trạng thái</p>
                      <div className="space-y-2">
                        {[
                          { label: 'Hoàn thành', color: 'bg-emerald-400', count: filteredData.bookings.filter(b => b.trang_Thai === 'da_hoan_thanh').length },
                          { label: 'Đang xử lý', color: 'bg-amber-400', count: filteredData.bookings.filter(b => b.trang_Thai === 'dang_xu_ly').length },
                          { label: 'Đã hủy', color: 'bg-rose-400', count: filteredData.bookings.filter(b => b.trang_Thai === 'da_huy').length }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-xs font-bold">
                            <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${item.color}`}></div>{item.label}</div>
                            <span>{item.count} đơn</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center bg-white/5 rounded-3xl p-4">
                      <PieChart size={64} className="text-emerald-400 mb-2 opacity-50" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* UPDATED: Top Rooms by Revenue */}
                <div className="bg-white p-8 rounded-[48px] border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Award size={20} /></div>
                    <h3 className="text-xl font-black text-[#1A251F]">Phòng doanh thu cao nhất</h3>
                  </div>
                  <div className="space-y-4">
                    {topRooms.length > 0 ? topRooms.map(([name, rev], i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-emerald-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 flex items-center justify-center bg-[#1A251F] text-white text-xs font-black rounded-lg">{i + 1}</span>
                          <span className="font-bold text-gray-700">{name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-600 font-black text-sm">{formatPrice(rev)}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Tổng thu</p>
                        </div>
                      </div>
                    )) : <p className="text-center text-gray-400 py-4 font-medium italic">Không có dữ liệu doanh thu phòng</p>}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[48px] border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Users size={20} /></div>
                    <h3 className="text-xl font-black text-[#1A251F]">Khách hàng VIP</h3>
                  </div>
                  <div className="space-y-4">
                    {topVIPs.length > 0 ? topVIPs.map(([name, spend], i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-blue-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs shadow-sm">{name.substring(0, 2)}</div>
                          <span className="font-bold text-gray-700">{name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-600 font-black text-sm">{formatPrice(spend)}</p>
                        </div>
                      </div>
                    )) : <p className="text-center text-gray-400 py-4 font-medium italic">Không có dữ liệu</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm flex flex-col h-[550px] overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-[#1A251F]">Biểu đồ Biến động Doanh thu</h3>
                  <p className="text-sm font-medium text-gray-400">Dữ liệu thực tế theo thời gian</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-[18px] border border-gray-200/50 shadow-inner">
                  {['day', 'week', 'month'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setChartViewMode(mode)}
                      className={`px-6 py-2 rounded-[14px] text-xs font-black transition-all ${
                        chartViewMode === mode ? 'bg-[#1A251F] text-white shadow-lg' : 'text-gray-400'
                      }`}
                    >
                      {mode === 'day' ? 'Ngày' : mode === 'week' ? 'Tuần' : 'Tháng'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 w-full relative flex flex-col justify-end pb-12">
                {revenueTrendData.length > 1 ? (
                  <div className="w-full h-full relative group/chart">
                    <div className="absolute inset-0 pb-10">
                      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {[0, 0.25, 0.5, 0.75, 1].map(v => (
                          <line key={v} x1={paddingX} y1={paddingY + v * (svgHeight - paddingY * 2)} x2={svgWidth - paddingX} y2={paddingY + v * (svgHeight - paddingY * 2)} stroke="#F1F5F9" strokeWidth="1" />
                        ))}
                        <path d={generateSvgPath(revenueTrendData, true)} fill="url(#areaGradient)" />
                        <path d={generateSvgPath(revenueTrendData, false)} fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    <div className="absolute inset-0 pb-10 flex" style={{ paddingLeft: paddingX, paddingRight: paddingX }}>
                        {revenueTrendData.map((d, i) => (
                          <div key={i} className="flex-1 group/tooltip relative h-full flex flex-col items-center">
                            <div className="absolute top-0 bottom-0 w-[1px] bg-emerald-500/10 opacity-0 group-hover/tooltip:opacity-100 pointer-events-none"></div>
                            <div className="opacity-0 group-hover/tooltip:opacity-100 transition-all absolute top-0 transform -translate-y-1/2 mb-2 z-20 pointer-events-none">
                              <div className="bg-[#1A251F] text-white px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-2xl flex flex-col items-center min-w-[100px]">
                                <span className="text-emerald-400 uppercase">{d.label}</span>
                                <span>{formatPrice(d.value)}</span>
                              </div>
                            </div>
                            <div className="absolute inset-0 cursor-pointer"></div>
                          </div>
                        ))}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-10 flex justify-between px-2" style={{ paddingLeft: paddingX, paddingRight: paddingX }}>
                        {revenueTrendData.map((d, i) => (
                          <div key={i} className="flex flex-col items-center w-0 overflow-visible">
                            <span className="whitespace-nowrap text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                              {d.label}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 italic">Dữ liệu không đủ</div>
                )}
              </div>
            </div>

          </div>
        </div>
      </AdminLayout>
    </MainLayout>
  );
};

export default AdminStatistics;
