using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Payment
{
    public class PaymentRequest
    {
        public decimal So_Tien { get; set; } = default!;
        public string Phuong_Thuc { get; set; } = default!;
        public IFormFile Hinh_Anh_Minh_Chung { get; set; } = default!;
    }
}
