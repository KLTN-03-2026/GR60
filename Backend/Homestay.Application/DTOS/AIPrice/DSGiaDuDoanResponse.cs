using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.AIPrice
{
    public class DSGiaDuDoanResponse
    {
        public int idGiaDuDoan { get; set; } = default!;
        public int idRoom { get; set; } = default!;
        public decimal Gia_De_Xuat { get; set; } = default!;
        public string Ly_Do_Du_Doan { get; set; } = default!;
        public string Model_Name { get; set; } = default!;
        public string Trang_Thai { get; set; } = default!;
        public DateTime Thoi_Gian_Tao { get; set; } = default!;
        public DateTime Ngay_Bat_Dau_Du_Doan { get; set; } = default!;
        public DateTime Ngay_Ket_Thuc_Du_Doan { get; set; } = default!;
    }
}
