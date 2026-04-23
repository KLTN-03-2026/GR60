using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Rooms
{
    public class FindRoomRequest
    {
        public string? DiaChi { get; set; } = default!;
        public decimal? MucGiaMin { get; set; } = default!;
        public decimal? MucGiaMax { get; set; } = default!;
        public float? SoSao { get; set; } = default!;
        public int SoNguoiLon { get; set; } = default!;
        public int SoTreEm { get; set; } = default!;
    }
}
