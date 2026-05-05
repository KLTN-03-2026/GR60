using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Rooms
{
    public class RoomInfoRequest
    {
        public string TenPhong { get; set; } = default!;
        public string LoaiPhong { get; set; } = default!;
        public decimal GiaGoc { get; set; } = default!;
        public string TrangThai { get; set; } = default!;
        public string MoTa { get; set; } = default!;
        public int SoNguoiLon { get; set; } = default!;
        public int SoTreEm { get; set; } = default!;
        public int SoGiuong { get; set; } = default!;
        public string DiaChi { get; set; } = default!;
    }
}
