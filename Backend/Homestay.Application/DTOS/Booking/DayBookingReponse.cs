using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Booking
{
    public class DayBookingReponse
    {
        public DateTime Ngay_Nhan_Phong { get; set; } = default!;
        public DateTime Ngay_Tra_Phong { get; set; } = default!;
    }
}
