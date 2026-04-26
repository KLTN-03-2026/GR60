using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Domain.Entities
{
    public class Payments
    {
        public int Id_Dat_phong { get; set; } = default!;
        public decimal So_tien {  get; set; } = default!;
        public string Phuong_thuc { get; set; } = default!;
        public string Hinh_Anh_Minh_Chung { get; set; } = default!;
        public string Trang_Thai { get; set; } = default!;
        public DateTime Thoi_Gian_Thanh_Toan { get; set; } = default!;


    }
}
