using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Payment
{
    public class PaymentUpdateStatusRequest
    {
        public int Id_Booking { get; set; } = default!;
        public string Trang_Thai { get; set; } = default!;
    }
}
