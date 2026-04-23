using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Rooms
{
    public class RoomPriceResponse
    {
        public decimal Gia { get; set; } = default!;
        public decimal GiaDatLichSom { get; set; } = default!;

    }
}
