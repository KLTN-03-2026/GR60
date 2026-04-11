using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Users
{
    public class UserResponse
    {
        public string Vaitro { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string SDT { get; set; } = default!;
        public string Diachi { get; set; } = default!;
        public string Anhdaidien { get; set; } = default!;
        public DateTime Ngaytao { get; set; }
    }
}
