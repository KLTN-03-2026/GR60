using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.HoLiday
{
    public class HolidayRequest
    {
        public string NameHoliday { get; set; } = default!;
        public DateTime HolidayStart { get; set; }
        public DateTime HolidayEnd { get; set; }
        public decimal He_so { get; set; }
    }
}
