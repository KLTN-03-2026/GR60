using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Users
{
    public class LoginRequest
    {
        public string Email { get; set; } = default!;
        public string Matkhau { get; set; } = default!;
    }
}
