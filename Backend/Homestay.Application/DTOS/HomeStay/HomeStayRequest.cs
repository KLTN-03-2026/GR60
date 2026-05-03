using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.HomeStay
{
    public class HomeStayRequest
    {
        public string Ten_Home { get; set; } = default!;
        public string Mo_Ta { get; set; } = default!;
        public string Dia_Chi { get; set; } = default!;
        public string SDT { get; set; } = default!;
        public string Email_Home { get; set; } = default!;
        public IFormFile Anh { get; set; } = default!;
        public IFormFile QR_Code { get; set; } = default!;
        public IFormFile MoMo { get; set; } = default!;
    }
}
