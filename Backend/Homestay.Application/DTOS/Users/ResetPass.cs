using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Users
{
    public class ResetPass
    {
       public string Token { get; set; } = default!;
        public string NewPass { get; set; } = default!;
        public string ConfirmNewPass { get; set; } = default!;
    }
}
