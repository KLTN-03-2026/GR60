using Homestay.Application.DTOS.Users;
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
    public class UserRepository : IUserRepository
    {
        private DBFactory dBFactory;
        public UserRepository(DBFactory dBFactory)
        {
            this.dBFactory = dBFactory;
        }
        public async Task<Users?> CheckUserLoginExistsAsync(string email, string matKhau)
        {
            
            string query = "SELECT * FROM ql_hs_nguoi_dung WHERE email = @Email AND mat_khau = @Matkhau";
            using (var cmd = new SqlCommand(query, dBFactory.GetConnection, dBFactory.GetTransaction))
            {
                cmd.Parameters.AddWithValue("@Email", email);
                cmd.Parameters.AddWithValue("@Matkhau", matKhau);
                var reader =  await cmd.ExecuteReaderAsync();   
                if(reader.Read())
                {
                    var user = new Users
                    {
                        Vaitro = reader["vai_tro"].ToString(),
                        Name = reader["ho_ten"].ToString(),
                        Email = reader["email"].ToString(),
                        SDT = reader["so_dien_thoai"].ToString(),
                        Matkhau = "",
                        Diachi = reader["dia_chi"].ToString(),
                        Anhdaidien = reader["anh_dai_dien"].ToString(),
                        Ngaytao = Convert.ToDateTime(reader["ngay_tao"])
                    };
                    return user;
                }
                return null;
            }
        }
    }
}
