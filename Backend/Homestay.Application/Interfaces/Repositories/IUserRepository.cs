using Homestay.Application.DTOS.Users;
using Homestay.Application.Services;
using Homestay.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        public Task<UsersEntities?> CheckUserLoginExistsAsync(string email,string matKhau);
        public Task<bool> CheckUserRegisterExistsAsync(string email);
        public Task AddUserAsync(RegisterRequest usersRegis);
        public Task<int> CheckEmailSdtUser(ForgotPassRequest forgotPassRequest);
        public Task UpdateNewPass(string userId, string newPass);
        public Task<UsersEntities> checkOldPass(string old_Pass, int id_User);
        public Task UpdateUser(UsersEntities usersEntities);
        public Task UpdateEmailUser(int idUser, string email);
        public Task UploadsAnh(int idUser, string fileName);
    }
}
