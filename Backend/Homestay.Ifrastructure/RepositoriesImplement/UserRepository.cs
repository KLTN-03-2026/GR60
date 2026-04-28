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

        public async Task AddUserAsync(RegisterRequest usersRegis)
        {
           string query = "INSERT INTO ql_hs_nguoi_dung (ho_ten, email, mat_khau, dia_chi, so_dien_thoai, anh_dai_dien, vai_tro, ngay_tao) " +
                "VALUES (@Name, @Email, @Matkhau, @Diachi, @SDT, @Anhdaidien, 'user', GETDATE())";
            using(var cmd = new SqlCommand(query, dBFactory.GetConnection, dBFactory.GetTransaction))
            {
                cmd.Parameters.AddWithValue("@Name", usersRegis.Name);
                cmd.Parameters.AddWithValue("@Email", usersRegis.Email);
                cmd.Parameters.AddWithValue("@Matkhau", usersRegis.Matkhau);
                cmd.Parameters.AddWithValue("@Diachi", "");
                cmd.Parameters.AddWithValue("@SDT", "");
                cmd.Parameters.AddWithValue("@Anhdaidien", "");
                await cmd.ExecuteNonQueryAsync();
            }
        }

        public async Task<int> CheckEmailSdtUser(ForgotPassRequest forgotPassRequest)
        {
            string query = @"select id
                            from ql_hs_nguoi_dung
                            where email = @email and so_dien_thoai = @sdt";
            
            using var cmd = new SqlCommand(query,dBFactory.GetConnection, dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@email",forgotPassRequest.Email);
            cmd.Parameters.AddWithValue("@sdt", forgotPassRequest.Sdt);

            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]);
            }
            return 0;
        }

        public async Task<Users?> CheckUserLoginExistsAsync(string email, string matKhau)
        {
            
            string query = "SELECT * FROM ql_hs_nguoi_dung WHERE email = @Email AND mat_khau = @Matkhau";
            using (var cmd = new SqlCommand(query, dBFactory.GetConnection, dBFactory.GetTransaction))
            {
                cmd.Parameters.AddWithValue("@Email", email);
                cmd.Parameters.AddWithValue("@Matkhau", matKhau);
                using var reader =  await cmd.ExecuteReaderAsync();   
                if(reader.Read())
                {
                    var user = new Users
                    {
                        id = reader.GetInt32(0),
                        Vaitro = reader["vai_tro"].ToString(),
                        Name = reader["ho_ten"].ToString(),
                        Email = reader["email"].ToString(),
                        SDT = reader["so_dien_thoai"].ToString(),
                        Matkhau = "",
                        Diachi = reader["dia_chi"].ToString(),
                        Anhdaidien = reader["anh_dai_dien"].ToString(),
                        Ngaytao = Convert.ToDateTime(reader["ngay_tao"]),
                        NgaySinh = Convert.ToDateTime(reader["ngay_sinh"]),
                    };

                    return user;
                }
                return null;
            }
        }

        public async Task<bool> CheckUserRegisterExistsAsync(string email)
        {
            string query = "select * from ql_hs_nguoi_dung where email = @Email";
            using(var cmd = new SqlCommand(query, dBFactory.GetConnection, dBFactory.GetTransaction))
            {
                cmd.Parameters.AddWithValue("@Email", email);
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    if (reader.Read())
                    {
                        return true;
                    }
                }
                return false;
            }
        }

        public async Task UpdateNewPass(string userId, string newPass)
        {
            string query = @"UPDATE ql_hs_nguoi_dung
                            SET mat_khau = @newPass
                            where id = @userId";
            using var cmd = new SqlCommand(query,dBFactory.GetConnection, dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@newPass", newPass);
            cmd.Parameters.AddWithValue("@userId", userId);
            await cmd.ExecuteNonQueryAsync();
        }
    }
}
