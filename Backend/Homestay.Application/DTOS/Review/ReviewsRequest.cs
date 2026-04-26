using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Review
{
    public class ReviewsRequest
    {
        public int So_Sao { get; set; } = default!;
        public string Noi_Dung { get; set; } = default!;
    }
}
