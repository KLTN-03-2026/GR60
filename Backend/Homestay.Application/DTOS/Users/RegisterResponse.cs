using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Users
{
    public class RegisterResponse
    {
       public int StatusCode { get; set; }
       public string Message { get; set; } = default!;
    }
}
