using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.AIPrice
{
    public class DSGiaApDungResponse
    {
        public int idRoom { get; set; }
        public string Ten_Phong { get; set; } = default!;
        public decimal Gia_goc { get; set; } = default!;
        public string Trang_Thai { get; set; } = default!;
        public decimal Gia_Ap_Dung{ get; set; } = default!;
        public DateTime Ngay_Ap_Dung { get; set; } = default!;
    }
}
