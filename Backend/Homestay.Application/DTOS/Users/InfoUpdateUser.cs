using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Users
{
    public class InfoUpdateUser
    {
        public string Name { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string SDT { get; set; } = default!;
        public string Diachi { get; set; } = default!;
        public DateTime NgaySinh { get; set; } = default!;
    }
}
