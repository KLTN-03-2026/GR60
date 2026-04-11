using Homestay.Application.DTOS.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Services
{
    public interface IAuth
    {
        public  Task<AuthResponse?> LoginAsync(UserRequest userRequest);
        public Task<bool> RegistereAsync(RegisterRequest registerRequest);
    }
}
