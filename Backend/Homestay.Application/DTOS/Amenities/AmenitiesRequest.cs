using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Amenities
{
    public class AmenitiesRequest
    {
        public string Ten_Tien_Nghi { get; set; } = default!;
        public string Mo_Ta { get; set; } = default!;
        public string Trang_Thai { get; set; } = default!;
    }
}
