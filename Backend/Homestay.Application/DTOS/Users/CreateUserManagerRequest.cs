using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Users
{
    public class CreateUserManagerRequest
    {
        public string Name { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string SDT { get; set; } = default!;
        public string Vaitro { get; set; } = default!;
        public string Mat_Khau { get; set; } = default!;
    }
}
