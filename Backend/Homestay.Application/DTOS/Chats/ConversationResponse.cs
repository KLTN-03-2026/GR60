using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Chats
{
    public class ConversationResponse
    {
        public int id_Conversation { get; set; } = default!;
        public int id_User { get; set; } = default!;
        public string Name_User { get; set; } = default!;
        public string Trang_Thai { get; set; } = default!;
        public string New_Message { get; set; } = default!;
        public string Anh_Dai_Dien { get; set; } = default!;
        public DateTime thoi_Gian { get; set; } = default!;
    }
}
