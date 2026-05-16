using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Review
{
    public class ReviewManagerResponse
    {
        public int Id_Nguoi_Dung { get; set; } = default!;
        public string Ho_Ten { get; set; } = default!;
        public int Id_Phong{ get; set; } = default!;
        public string Ten_Phong { get; set; } = default!;
        public int Id_Danh_Gia { get; set; } = default!;
        public DateTime Thoi_Gian { get; set; } = default!;
        public int So_Sao { get; set; } = default!;
        public string Noi_dung { get; set; } = default!;
        public string Trang_Thai { get; set; } = default!;

        public int Id_Phan_Hoi { get; set; } = default!;
        public string Ho_Ten_Phan_Hoi { get; set; } = default!;
        public DateTime Thoi_Gian_Phan_Hoi { get; set; } = default!;
        public string Noi_dung_Phan_Hoi { get; set; } = default!;
    }
}
