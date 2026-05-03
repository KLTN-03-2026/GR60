using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS
{
    public class CommonResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; } = default!;
    }
}
