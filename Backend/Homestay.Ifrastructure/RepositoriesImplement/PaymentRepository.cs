using Homestay.Application.DTOS.Booking;
using Homestay.Application.DTOS.Payment;
using Homestay.Application.Interfaces.Repositories;
using Homestay.Domain.Entities;
using Homestay.Ifrastructure.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Ifrastructure.RepositoriesImplement
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly DBFactory _dbFactory;
        private IConfiguration _configuration;
        public PaymentRepository(DBFactory dBFactory,IConfiguration configuration) 
        {
            _dbFactory = dBFactory;
            _configuration = configuration;
        }
        public async Task CreatePayment(PaymentsEntities payments)
        {
            string query = @"INSERT INTO ql_hs_thanh_toan(ql_dat_phong_id,so_tien,phuong_thuc,hinh_anh_minh_chung,trang_thai,thoi_gian_thanh_toan,isDelete)
                             values (@idBooking,@So_tien ,@phuongThuc,@Anh,'dang_xu_ly',GETDATE(),'False')";
           using var cmd = new SqlCommand(query, _dbFactory.GetConnection, _dbFactory.GetTransaction);

            cmd.Parameters.AddWithValue("@idBooking", payments.Id_Dat_phong);
            cmd.Parameters.AddWithValue("@So_tien", payments.So_tien);
            cmd.Parameters.AddWithValue("@Anh", payments.Hinh_Anh_Minh_Chung);
            cmd.Parameters.AddWithValue("@phuongThuc", payments.Phuong_thuc);
            await cmd.ExecuteNonQueryAsync();

        }

        public async Task<List<PaymentResponse>> GetAllPayment()
        {
            var listbooking = new List<PaymentResponse>();
            string query = @"select  tt.id as idThanh_toan, dp.id as id_dat_phong, nd.id as idUser, nd.ho_ten,tt.so_tien,tt.phuong_thuc,tt.hinh_anh_minh_chung,tt.trang_thai ,tt.thoi_gian_thanh_toan, tt.isDelete
                            from ql_hs_thanh_toan tt
                            left join ql_hs_dat_phong dp on tt.ql_dat_phong_id = dp.id
                            left join ql_hs_nguoi_dung nd on dp.ql_nguoi_dung_id = nd.id";
            using var cmd = new SqlCommand(query, _dbFactory.GetConnection, _dbFactory.GetTransaction);
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var day = new PaymentResponse()
                {
                    Id_Booking = reader["id_dat_phong"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id_dat_phong"]),
                    Id_Payment = reader["idThanh_toan"] == DBNull.Value ? 0 : Convert.ToInt32(reader["idThanh_toan"]),
                    User_Name = reader["ho_ten"] == DBNull.Value ? null : Convert.ToString(reader["ho_ten"]),
                    Tong_Tien = reader["so_tien"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["so_tien"]),
                    Phuong_Thuc = reader["phuong_thuc"] == DBNull.Value ? null : Convert.ToString(reader["phuong_thuc"]),   
                    Thoi_Gian_Thanh_Toan = reader["thoi_gian_thanh_toan"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["thoi_gian_thanh_toan"]),
                    IMG = reader["hinh_anh_minh_chung"] == DBNull.Value ? null : Path.Combine(_configuration["localhost"], Convert.ToString(reader["hinh_anh_minh_chung"])),
                    Trang_Thai = reader["trang_thai"] == DBNull.Value ? null : Convert.ToString(reader["trang_thai"]),
                    IsDelete = reader["isDelete"] == DBNull.Value ? null : Convert.ToString(reader["isDelete"])
                };
                listbooking.Add(day);
            }
            return listbooking;
        }

        public async Task UpdateIsDeletePayment(int idPayment, int idBooking)
        {
            string query = @"update ql_hs_thanh_toan
                        set isDelete = 'True'
                        where id = @idPayment

                        update ql_hs_dat_phong
                        set trang_thai = 'da_huy'
                        where id = @idBooking";
            using var cmd = new SqlCommand(query, _dbFactory.GetConnection, _dbFactory.GetTransaction);

            cmd.Parameters.AddWithValue("@idBooking", idBooking);
            cmd.Parameters.AddWithValue("@idPayment", idPayment);
            await cmd.ExecuteNonQueryAsync();
        }
    }
}
