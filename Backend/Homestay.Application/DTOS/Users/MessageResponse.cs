using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Users
{
    public class MessageResponse
    {
        public int id_Message { get; set; } = default!;
        public int id_Conversation { get; set; } = default!;
        public int id_User { get; set; } = default!;
        public string noi_Dung { get; set; } = default!;
        public DateTime thoi_Gian { get; set; } = default!;
    }
}
