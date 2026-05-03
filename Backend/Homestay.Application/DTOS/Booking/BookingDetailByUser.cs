using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Booking
{
    public class BookingDetailByUser:BookingsByUserResponse
    {
        public int IdPhong { get; set; } = default!;
        public decimal So_Sao { get; set; } = default!;
        public int So_Nguoi_Lon { get; set; } = default!;
        public int So_Tre_em { get; set; } = default!;
        public string Dia_chi { get; set; } = default!;
        public DateTime Ngay_Tao { get; set; } = default!;
    }
}
