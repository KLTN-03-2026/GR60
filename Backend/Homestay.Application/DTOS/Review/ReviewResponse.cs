using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Review
{
    public class ReviewResponse
    {
        public string Ho_Ten { get; set; } = default!;
        public DateTime Thoi_Gian { get; set; } = default!;
        public int So_Sao { get; set; } = default!; 
        public string Noi_dung { get; set; } = default!; 
    }
}
