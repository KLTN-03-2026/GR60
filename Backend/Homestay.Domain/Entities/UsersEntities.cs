using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Domain.Entities
{
    public class UsersEntities
    {
        public int id { get; set; } = default!;
        public string Vaitro { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string SDT { get; set; } = default!;
        public string Matkhau { get; set; } = default!;
        public string Diachi { get; set; } = default!;
        public string Anhdaidien { get; set; } = default!;
        public DateTime Ngaytao{ get; set; } = default!;
        public DateTime NgaySinh { get; set; } = default!;
        public string IsDelete { get; set; } = default!;    
    }
}
