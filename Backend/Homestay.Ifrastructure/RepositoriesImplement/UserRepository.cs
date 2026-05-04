using Homestay.Application.DTOS.Users;
using Homestay.Application.Interfaces.Repositories;
using Homestay.Application.Services;
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
           string query = "INSERT INTO ql_hs_nguoi_dung (ho_ten, email, mat_khau, dia_chi, so_dien_thoai, anh_dai_dien, vai_tro, ngay_tao,trang_thai) " +
                "VALUES (@Name, @Email, @Matkhau, @Diachi, @SDT, @Anhdaidien, 'user', GETDATE(),'active')";
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

        public async Task<UsersEntities?> checkOldPass(string old_Pass, int id_User)
        {
            string query = @"select *
                        from ql_hs_nguoi_dung
                        where id = @idUser and mat_khau = @old_Pass";
            using var cmd = new SqlCommand(query, dBFactory.GetConnection, dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idUser", id_User);
            cmd.Parameters.AddWithValue("@old_Pass", old_Pass);
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new UsersEntities
                {
                    id = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),
                    Vaitro = reader["vai_tro"] == DBNull.Value ?null : Convert.ToString(reader["vai_tro"]),
                    Name = reader["ho_ten"] == DBNull.Value ? null : Convert.ToString(reader["ho_ten"]),
                    Email = reader["email"] == DBNull.Value ? null : Convert.ToString(reader["email"]),
                    SDT = reader["so_dien_thoai"] == DBNull.Value ? null : Convert.ToString(reader["so_dien_thoai"]),
                    Matkhau = "",
                    Diachi = reader["dia_chi"] == DBNull.Value ? null : Convert.ToString(reader["dia_chi"]),
                    Anhdaidien = reader["anh_dai_dien"] == DBNull.Value ? null : Convert.ToString(reader["anh_dai_dien"]),
                    Ngaytao = reader["ngay_sinh"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["ngay_tao"]),
                    NgaySinh = reader["ngay_sinh"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["ngay_sinh"]),
                };
            }
            return null;
        }

        public async Task<UsersEntities?> CheckUserLoginExistsAsync(string email, string matKhau)
        {
            
            string query = "SELECT * FROM ql_hs_nguoi_dung WHERE email = @Email AND mat_khau = @Matkhau and trang_thai = 'active'";
            using (var cmd = new SqlCommand(query, dBFactory.GetConnection, dBFactory.GetTransaction))
            {
                cmd.Parameters.AddWithValue("@Email", email);
                cmd.Parameters.AddWithValue("@Matkhau", matKhau);
                using var reader =  await cmd.ExecuteReaderAsync();   
                if(reader.Read())
                {
                    var user = new UsersEntities
                    {
                        id = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),
                        Vaitro = reader["vai_tro"] == DBNull.Value ? null : Convert.ToString(reader["vai_tro"]),
                        Name = reader["ho_ten"] == DBNull.Value ? null : Convert.ToString(reader["ho_ten"]),
                        Email = reader["email"] == DBNull.Value ? null : Convert.ToString(reader["email"]),
                        SDT = reader["so_dien_thoai"] == DBNull.Value ? null : Convert.ToString(reader["so_dien_thoai"]),
                        Matkhau = "",
                        Diachi = reader["dia_chi"] == DBNull.Value ? null : Convert.ToString(reader["dia_chi"]),
                        Anhdaidien = reader["anh_dai_dien"] == DBNull.Value ? null : Convert.ToString(reader["anh_dai_dien"]),
                        Ngaytao = reader["ngay_sinh"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["ngay_tao"]),
                        NgaySinh = reader["ngay_sinh"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["ngay_sinh"]),
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
                    if (await reader.ReadAsync())
                    {
                        return true;
                    }
                }
                return false;
            }
        }

        public async Task CreateUser(CreateUserManagerRequest createUserManagerRequest)
        {
            string query = "INSERT INTO ql_hs_nguoi_dung (ho_ten, email, mat_khau, dia_chi, so_dien_thoai, anh_dai_dien, vai_tro, ngay_tao,trang_thai) " +
       "VALUES (@Name, @Email, @Matkhau, @Diachi, @SDT, @Anhdaidien, @role , GETDATE(),'active')";
            using (var cmd = new SqlCommand(query, dBFactory.GetConnection, dBFactory.GetTransaction))
            {
                cmd.Parameters.AddWithValue("@Name", createUserManagerRequest.Name);
                cmd.Parameters.AddWithValue("@Email", createUserManagerRequest.Email);
                cmd.Parameters.AddWithValue("@Matkhau", createUserManagerRequest.Mat_Khau);
                cmd.Parameters.AddWithValue("@SDT", createUserManagerRequest.SDT);
                cmd.Parameters.AddWithValue("@role", createUserManagerRequest.Vaitro);
                cmd.Parameters.AddWithValue("@Diachi", "");
                cmd.Parameters.AddWithValue("@Anhdaidien", "");
                await cmd.ExecuteNonQueryAsync();
            }
        }

        public async Task<List<UsersEntities>> GetAllUser()
        {
            string query = @"select * 
                            from ql_hs_nguoi_dung";
            var listuser = new List<UsersEntities>();
            using var cmd =  new SqlCommand(query,dBFactory.GetConnection, dBFactory.GetTransaction);
            using var reader = await cmd.ExecuteReaderAsync ();
            while (await reader.ReadAsync())
            {
                var user = new UsersEntities
                {
                    id = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),
                    Vaitro = reader["vai_tro"] == DBNull.Value ? null : Convert.ToString(reader["vai_tro"]),
                    Name = reader["ho_ten"] == DBNull.Value ? null : Convert.ToString(reader["ho_ten"]),
                    Email = reader["email"] == DBNull.Value ? null : Convert.ToString(reader["email"]),
                    SDT = reader["so_dien_thoai"] == DBNull.Value ? null : Convert.ToString(reader["so_dien_thoai"]),
                    Matkhau = reader["mat_khau"] == DBNull.Value ? null : Convert.ToString(reader["mat_khau"]),
                    Diachi = reader["dia_chi"] == DBNull.Value ? null : Convert.ToString(reader["dia_chi"]),
                    Anhdaidien = reader["anh_dai_dien"] == DBNull.Value ? null : Convert.ToString(reader["anh_dai_dien"]),
                    Ngaytao = reader["ngay_sinh"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["ngay_tao"]),
                    NgaySinh = reader["ngay_sinh"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["ngay_sinh"]),
                    IsDelete = reader["trang_thai"] == DBNull.Value ? null : Convert.ToString(reader["trang_thai"]),
                };
                listuser.Add(user);
            }
            return listuser;
        }

        public async Task UpdateEmailUser(int idUser, string email)
        {
            string query = @"UPDATE ql_hs_nguoi_dung
                                    SET email = @email 
                                    where id = @idUser
                                    ";

            using var cmd = new SqlCommand(query, dBFactory.GetConnection, dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@email ", email);
            cmd.Parameters.AddWithValue("@iduser", idUser);
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task UpdateIsdelete(int idUser)
        {
            string query = @"UPDATE ql_hs_nguoi_dung
                            SET trang_thai = 'delete'
                            where id = @iduser";
            using var cmd = new SqlCommand(query, dBFactory.GetConnection, dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@iduser", idUser);
            await cmd.ExecuteNonQueryAsync();
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

        public async Task UpdateUser(UsersEntities usersEntities)
        {

            string query = @"UPDATE ql_hs_nguoi_dung
                            SET ho_ten = @hoTen,so_dien_thoai = @sdt, dia_chi = @diachi ,ngay_sinh = @ngaysinh 
                            where id = @iduser";
            using var cmd = new SqlCommand(query,dBFactory.GetConnection,dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@hoTen", usersEntities.Name);
            cmd.Parameters.AddWithValue("@sdt", usersEntities.SDT);
            cmd.Parameters.AddWithValue("@diachi", usersEntities.Diachi);
            cmd.Parameters.AddWithValue("@ngaysinh", usersEntities.NgaySinh);
            cmd.Parameters.AddWithValue("@iduser", usersEntities.id);
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task UploadsAnh(int idUser, string fileName)
        {
            string query = @"UPDATE ql_hs_nguoi_dung
                            SET anh_dai_dien = @fileAnh
                            where id = @iduser
                            ";
            using var cmd = new SqlCommand(query, dBFactory.GetConnection, dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@iduser", idUser);
            cmd.Parameters.AddWithValue("@fileAnh", fileName);
            await cmd.ExecuteNonQueryAsync();
        }
    }
}
