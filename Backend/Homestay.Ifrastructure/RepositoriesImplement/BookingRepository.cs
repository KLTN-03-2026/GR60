using Homestay.Application.DTOS.Booking;
using Homestay.Application.Interfaces.Repositories;
using Homestay.Ifrastructure.Data;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Ifrastructure.RepositoriesImplement
{
    public class BookingRepository : IBookingRepository
    {
        private DBFactory _DBFactory;
        public BookingRepository(DBFactory dBFactory)
        {
            _DBFactory = dBFactory;
        }
        public async Task<List<DayBookingReponse>> CheckDayBookingRoomAsync(int idRoom)
        {
            var listDay = new List<DayBookingReponse> ();
            string query = @"select ngay_nhan_phong,ngay_tra_phong
                            from ql_hs_dat_phong
                            where ql_phong_id  = @IdRoom and trang_thai = 'da_hoan_thanh' and ngay_tra_phong > GETDATE()";
            using var cmd = new SqlCommand(query,_DBFactory.GetConnection,_DBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@IdRoom", idRoom);
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var day = new DayBookingReponse()
                {
                    Ngay_Nhan_Phong = reader["ngay_nhan_phong"] == DBNull.Value ? DateTime.MinValue :Convert.ToDateTime(reader["ngay_nhan_phong"]),
                    Ngay_Tra_Phong = reader["ngay_tra_phong"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["ngay_tra_phong"]),
                };
                listDay.Add(day);
            }
            return listDay;
        }
        public async Task<int> CreateBooking(BookingRequest bookingRequest)
        {
            DateTime time = DateTime.Now;
            string query = @"INSERT INTO ql_hs_dat_phong(ql_nguoi_dung_id,ql_phong_id,ngay_nhan_phong,ngay_tra_phong,so_nguoi,tong_tien,trang_thai,ngay_tao)
                            values (@Id_user,@Id_Room,@Ngay_Nhan_Phong,@Ngay_Tra_Phong,@So_Nguoi,@TongTien,'dang_xu_ly',@ngay_tao);
                                SELECT CAST(SCOPE_IDENTITY() AS INT);";

            using var cmd = new SqlCommand(query, _DBFactory.GetConnection, _DBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@Id_user", bookingRequest.Id_User);
            cmd.Parameters.AddWithValue("@Id_Room", bookingRequest.Id_Room);
            cmd.Parameters.AddWithValue("@Ngay_Nhan_Phong", bookingRequest.Ngay_Nhan_Phong);
            cmd.Parameters.AddWithValue("@Ngay_Tra_Phong", bookingRequest.Ngay_Tra_Phong);
            cmd.Parameters.AddWithValue("@So_Nguoi", bookingRequest.So_Nguoi);
            cmd.Parameters.AddWithValue("@TongTien", bookingRequest.Tong_Tien);
            cmd.Parameters.AddWithValue("@ngay_tao", time);
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        public async Task<BookingDetailByUser> GetBookingById(int idBooking)
        {
            string query = @"with AnhPhong as
                            ( 
	                            select phong_id, url_anh, ROW_NUMBER() OVER(PARTITION BY phong_id order by id asc) as rn
	                            from ql_hs_anh_phong
                            ),
                            DanhGia as
                            ( 
	                            select ql_phong_id, avg (CAST( so_sao AS FLOAT)) AS so_sao_tb
	                            from ql_hs_danh_gia
	                            group by ql_phong_id
                            )
                            select dp.id,p.id as id_phong,p.ten_phong, ap.url_anh,dp.ngay_nhan_phong,dp.ngay_tra_phong,dp.tong_tien,dp.trang_thai,ROUND(dg.so_sao_tb, 1) AS so_sao,dp.ngay_tao,p.so_nguoi_lon,p.so_tre_em,p.dia_chi
                            from ql_hs_dat_phong dp
                            left join ql_hs_phong p on dp.ql_phong_id = p.id
                            left join AnhPhong ap on p.id = ap.phong_id and rn = 1
                            left join DanhGia dg on p.id = dg.ql_phong_id 
                            where dp.id = @idBooking";
            using var cmd = new SqlCommand(query,_DBFactory.GetConnection, _DBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idBooking", idBooking);
            using var reader = await cmd.ExecuteReaderAsync();
            if(await reader.ReadAsync())
            {
                return new BookingDetailByUser()
                {
                    Id_Booking = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),
                    IdPhong = reader["id_phong"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id_phong"]),

                    Ten_Phong = reader["ten_phong"] == DBNull.Value ? null : Convert.ToString(reader["ten_phong"]),
                    Url_Anh = reader["url_anh"] == DBNull.Value ? null : Convert.ToString(reader["url_anh"]),
                    Ngay_Nhan_Phong = reader["ngay_nhan_phong"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["ngay_nhan_phong"]),
                    Ngay_Tra_Phong = reader["ngay_tra_phong"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["ngay_tra_phong"]),
                    Trang_Thai = reader["trang_thai"] == DBNull.Value ? null : Convert.ToString(reader["trang_thai"]),
                    Tong_Tien = reader["tong_tien"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["tong_tien"]),
                  
                    Dia_chi = reader["dia_chi"] == DBNull.Value ? null : Convert.ToString(reader["dia_chi"]),
                    Ngay_Tao = reader["ngay_tao"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["ngay_tao"]),
                    So_Nguoi_Lon = reader["so_nguoi_lon"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_nguoi_lon"]),
                    So_Tre_em = reader["so_tre_em"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_tre_em"]),
                    So_Sao = reader["so_sao"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["so_sao"])
                };
            }
            return null;
        }

        public async Task<List<BookingsByUserResponse>> GetBookingByUser(int idUser)
        {
            string query = @"with AnhPhong as
                            ( 
	                            select phong_id, url_anh, ROW_NUMBER() OVER(PARTITION BY phong_id order by id asc) as rn
	                            from ql_hs_anh_phong
                            )
                            select dp.id,p.ten_phong, ap.url_anh,dp.ngay_nhan_phong,dp.ngay_tra_phong,dp.tong_tien,dp.trang_thai
                            from ql_hs_dat_phong dp
                            left join ql_hs_phong p on dp.ql_phong_id = p.id
                            left join AnhPhong ap on p.id = ap.phong_id and rn = 1
                            where dp.ql_nguoi_dung_id = @idUser";
            using var cmd = new SqlCommand(query,_DBFactory.GetConnection, _DBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idUser", idUser);
            using var reader = await cmd.ExecuteReaderAsync();
            List<BookingsByUserResponse> result = new List<BookingsByUserResponse>();
            while (await reader.ReadAsync()) 
            { 
                var booking = new BookingsByUserResponse()
                {
                    Id_Booking = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),
                    Ten_Phong = reader["ten_phong"] == DBNull.Value ? null : Convert.ToString(reader["ten_phong"]),
                    Url_Anh = reader["url_anh"] == DBNull.Value ? null : Convert.ToString(reader["url_anh"]),
                    Ngay_Nhan_Phong = reader["ngay_nhan_phong"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["ngay_nhan_phong"]),
                    Ngay_Tra_Phong = reader["ngay_tra_phong"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["ngay_tra_phong"]),
                    Trang_Thai = reader["trang_thai"] == DBNull.Value ? null : Convert.ToString(reader["trang_thai"]),
                    Tong_Tien = reader["tong_tien"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["tong_tien"]),

                };
                result.Add(booking);
            }
            return result;
        }

        public Task<List<DayBookingReponse>> GetDayCheckInCheckOutByRoomIdInFuture(int idRoom)
        {
            throw new NotImplementedException();
        }

        public async Task<BookingAIServiceResponse> GetOccupancyRateLast7Days()
        {
            string query = @"	SELECT
                                COUNT(CASE
                                    WHEN ngay_tao >= DATEADD(DAY, -7, GETDATE())
                                    THEN 1
                                END) AS Tong_dat_phong,
                               (select count(*)*7 from ql_hs_phong) AS Tong_phong
                               FROM ql_hs_dat_phong dp";
            using var cmd = new SqlCommand(query,_DBFactory.GetConnection,_DBFactory.GetTransaction);
            using var reader = await cmd.ExecuteReaderAsync();
            if(await reader.ReadAsync())
            {
                return new BookingAIServiceResponse()
                {
                    Tong_phong = reader["Tong_phong"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["Tong_phong"]),
                    Tong_dat_phong = reader["Tong_dat_phong"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["Tong_dat_phong"])
                };
            }
            return null;
        }
    }
}
