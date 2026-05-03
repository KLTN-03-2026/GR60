using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Chats
{
    public class MessageRepsonse
    {
        public int ql_cuoc_tro_chuyen_id { get; set; } = default!;
       public int ql_nguoi_dung_id { get; set; } = default!;
        public string  noi_dung { get; set; } = default!;
        public int trang_thai_doc { get; set; } = default!;
        public DateTime thoi_gian { get; set; } = default!;
    }
}
