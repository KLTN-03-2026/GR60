using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.AIPrice
{
    public class DataAIprice
    {
        public decimal Gia_Goc { get; set; } = default!;
        public List<decimal> PriceList { get; set; } = default!;
        public List<DateTime> DateList { get; set; } = default!;
        public string Loai_Phong { get; set; } = default!;
        public int So_Nguoi_Lon { get; set; } = default!;
        public int So_Tre_Em { get; set; } = default!;
        public decimal OccupancyRateLast7Days { get; set; } = default!;
    }
}
