using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Payment
{
    public class PaymentResponse
    {
        public int Id_Payment{ get; set; } = default!;
        public int Id_Booking { get; set; } = default!;
        public string User_Name { get; set; } = default!;
        public decimal Tong_Tien { get; set; } = default!;
        public DateTime Thoi_Gian_Thanh_Toan { get; set; } = default!;
        public string Phuong_Thuc { get; set; } = default!;
        public string IMG { get; set; } = default!;
        public string Trang_Thai { get; set; } = default!;
        public string IsDelete { get; set; } = default!;
    }
}
