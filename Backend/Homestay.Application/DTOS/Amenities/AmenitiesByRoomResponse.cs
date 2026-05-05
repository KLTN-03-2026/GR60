using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Amenities
{
    public class AmenitiesByRoomResponse
    {
        public int IdTienNghi { get; set; } = default!;
        public string TenTienNghi { get; set; } = default!;
        public int Soluong { get; set; } = default!;
    }
}
