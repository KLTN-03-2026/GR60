using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Domain.Entities
{
    public class HomeStayEntities
    {
        public int Id { get; set; } = default!;
        public string Ten_Home { get; set; } = default!;
        public string Mo_Ta { get; set; } = default!;
        public string Dia_Chi { get; set; } = default!;
        public string SDT { get; set; } = default!;
        public string Email_Home { get; set; } = default!;
        public string Anh { get; set; } = default!;
        public string QR_Code { get; set; } = default!;
        public string MoMo { get; set; } = default!;
    }
}
