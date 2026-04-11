using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Users
{
    public class AuthResponse
    {
        public string Token { get; set; } = default!;
        public string Message { get; set; } = default!;
        public UserResponse response { get; set; } = default!;
    }
}
