using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        public Task<bool> CheckUserLoginExistsAsync(string email,string matKhau);

    }
}
