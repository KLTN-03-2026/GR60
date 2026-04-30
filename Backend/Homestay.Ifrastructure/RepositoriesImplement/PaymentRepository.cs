using Homestay.Application.DTOS.Payment;
using Homestay.Application.Interfaces.Repositories;
using Homestay.Domain.Entities;
using Homestay.Ifrastructure.Data;
using Microsoft.Data.SqlClient;
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
        public PaymentRepository(DBFactory dBFactory) 
        {
            _dbFactory = dBFactory;
        }
        public async Task CreatePayment(PaymentsEntities payments)
        {
            string query = @"INSERT INTO ql_hs_thanh_toan(ql_dat_phong_id,so_tien,phuong_thuc,hinh_anh_minh_chung,trang_thai,thoi_gian_thanh_toan)
                             values (@idBooking,@So_tien ,@phuongThuc,@Anh,'cho_thanh_toan',GETDATE())";
           using var cmd = new SqlCommand(query, _dbFactory.GetConnection, _dbFactory.GetTransaction);

            cmd.Parameters.AddWithValue("@idBooking", payments.Id_Dat_phong);
            cmd.Parameters.AddWithValue("@So_tien", payments.So_tien);
            cmd.Parameters.AddWithValue("@Anh", payments.Hinh_Anh_Minh_Chung);
            cmd.Parameters.AddWithValue("@phuongThuc", payments.Phuong_thuc);
            await cmd.ExecuteNonQueryAsync();

        }
    }
}
