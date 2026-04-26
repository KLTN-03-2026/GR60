using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Review
{
    public class CreateReviewResponse
    {
        public int StatusCode { get; set; } = default!;
        public string Message { get; set; } = default!;
    }
}
