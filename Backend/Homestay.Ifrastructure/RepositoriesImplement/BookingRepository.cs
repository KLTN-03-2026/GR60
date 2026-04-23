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
                            where ql_phong_id  = @IdRoom and trang_thai = 'da_hoan_thanh'";
            using var cmd = new SqlCommand(query,_DBFactory.GetConnection,_DBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@IdRoom", idRoom);
            var reader = await cmd.ExecuteReaderAsync();
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
        public async Task CreateBooking(BookingRequest bookingRequest)
        {
            DateTime time = DateTime.Now;
            string query = @"INSERT INTO ql_hs_dat_phong(ql_nguoi_dung_id,ql_phong_id,ngay_nhan_phong,ngay_tra_phong,so_nguoi,tong_tien,trang_thai,ngay_tao)
                            values (@Id_user,@Id_Room,@Ngay_Nhan_Phong,@Ngay_Tra_Phong,@So_Nguoi,@TongTien,'dang_xu_ly',@ngay_tao)";
            using var cmd = new SqlCommand(query, _DBFactory.GetConnection, _DBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@Id_user", bookingRequest.Id_User);
            cmd.Parameters.AddWithValue("@Id_Room", bookingRequest.Id_Room);
            cmd.Parameters.AddWithValue("@Ngay_Nhan_Phong", bookingRequest.Ngay_Nhan_Phong);
            cmd.Parameters.AddWithValue("@Ngay_Tra_Phong", bookingRequest.Ngay_Tra_Phong);
            cmd.Parameters.AddWithValue("@So_Nguoi", bookingRequest.So_Nguoi);
            cmd.Parameters.AddWithValue("@TongTien", bookingRequest.Tong_Tien);
            cmd.Parameters.AddWithValue("@ngay_tao", time);
           await cmd.ExecuteNonQueryAsync();
        }
    }
}
