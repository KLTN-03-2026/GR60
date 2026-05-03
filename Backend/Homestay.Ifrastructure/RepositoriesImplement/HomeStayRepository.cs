using Homestay.Application.DTOS.HomeStay;
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
    public class HomeStayRepository : IHomeStayRepository
    {
        private DBFactory _dbFactory;
        public HomeStayRepository (DBFactory dbFactory)
        {
            _dbFactory = dbFactory;
        }
        public async Task<HomeStayEntities> GetInfoHomeStay()
        {
            string query = @"select * 
                        from ql_hs_homestay";

            using var cmd = new SqlCommand(query, _dbFactory.GetConnection, _dbFactory.GetTransaction);
            using var reader = await cmd.ExecuteReaderAsync();
            if(await reader.ReadAsync())
            {
                return new HomeStayEntities
                {
                    Id = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),
                    Ten_Home = reader["ten_homestay"] == DBNull.Value ? null : Convert.ToString(reader["ten_homestay"]),
                    Mo_Ta = reader["mo_ta"] == DBNull.Value ? null : Convert.ToString(reader["mo_ta"]),
                    Dia_Chi = reader["dia_chi"] == DBNull.Value ? null : Convert.ToString(reader["dia_chi"]),
                    SDT = reader["so_dien_thoai"] == DBNull.Value ? null : Convert.ToString(reader["so_dien_thoai"]),
                    Email_Home = reader["email_lien_he"] == DBNull.Value ? null : Convert.ToString(reader["email_lien_he"]),
                    Anh = reader["hinh_anh"] == DBNull.Value ? null : Convert.ToString(reader["hinh_anh"]),
                    QR_Code = reader["QR_Code"] == DBNull.Value ? null : Convert.ToString(reader["QR_Code"]),
                    MoMo = reader["MoMo"] == DBNull.Value ? null : Convert.ToString(reader["MoMo"]),
                };
            }
            return null;
        }

        public async Task UpdateInfoHomeStay(HomeStayEntities homeStay)
        {
            string query = @"UPDATE ql_hs_homestay
                            SET ten_homestay = @ten_Home, mo_ta = @mo_ta, dia_chi = @dia_chi, 
                            so_dien_thoai = @sdt, email_lien_he = @emai, hinh_anh = @hinh_anh, QR_Code = @QR, MoMo=@momo";
            using var cmd = new SqlCommand(query, _dbFactory.GetConnection, _dbFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@ten_Home", homeStay.Ten_Home);
            cmd.Parameters.AddWithValue("@mo_ta", homeStay.Mo_Ta);
            cmd.Parameters.AddWithValue("@dia_chi", homeStay.Dia_Chi);
            cmd.Parameters.AddWithValue("@sdt", homeStay.SDT);
            cmd.Parameters.AddWithValue("@emai", homeStay.Email_Home);
            cmd.Parameters.AddWithValue("@hinh_anh", homeStay.Anh);
            cmd.Parameters.AddWithValue("@QR", homeStay.QR_Code);
            cmd.Parameters.AddWithValue("@momo", homeStay.MoMo);
            await cmd.ExecuteNonQueryAsync();
        }
    }
}
