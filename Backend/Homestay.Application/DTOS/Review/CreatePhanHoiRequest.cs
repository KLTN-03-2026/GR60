using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Review
{
    public class CreatePhanHoiRequest
    {
        public int IdUser { get; set; } = default!;
        public int IdReview { get; set; } = default!;
        public string NoiDung { get; set; } = default!;
    }
}
