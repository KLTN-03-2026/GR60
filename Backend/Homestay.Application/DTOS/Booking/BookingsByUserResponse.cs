using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Booking
{
    public class BookingsByUserResponse
    {
        public int Id_Booking { get; set; } = default!;
        public string Ten_Phong { get; set; } = default!;
        public string Url_Anh { get; set; } = default!;
        public DateTime Ngay_Nhan_Phong { get; set; } = default!;
        public DateTime Ngay_Tra_Phong { get; set; } = default!;
        public string Trang_Thai { get; set; } = default!;
        public decimal Tong_Tien { get; set; } = default!;
    }
}
