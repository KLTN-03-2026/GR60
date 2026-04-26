using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Booking
{
    public class BookingRequest
    {
        public int Id_User { get; set; } = default!;
        public int Id_Room { get; set; } = default!;
        public DateTime Ngay_Nhan_Phong {  get; set; } = default!;
        public DateTime Ngay_Tra_Phong { get;set; } = default!;
        public int So_Nguoi { get; set; } = default!;
        public decimal Tong_Tien { get; set; } = default!;
    }
}
