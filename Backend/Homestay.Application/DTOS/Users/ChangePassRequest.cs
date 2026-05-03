using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Users
{
    public class ChangePassRequest
    {
        public string Old_Pass { get; set; } = default!;
        public string New_Pass { get; set; } = default!;

    }
}
