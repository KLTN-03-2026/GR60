using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Rooms
{
    public class RoomResponse
    {
        public int Id { get; set; } = default!;
        public string TenPhong { get; set; } = default!;
        public string LoaiPhong { get; set; } = default!;
        public string TrangThai { get; set; } = default!;
        public List<string>  DSAnh { get; set; } = default!;
        public List<string> DSTienNghi { get; set; } = default!;
        public string DiaChi { get; set; } = default!;
        public string Mota { get; set; } = default!;
        public decimal Gia { get; set; } = default!;
        public int SoNguoiLon { get; set; } = default!;
        public int SoTreEm { get; set; } = default!;
        public int SoGiuong { get; set; } = default!;
        public int SoSao { get; set; } = default!;
        public string IsDelete { get; set; } = default!;


    }

}
