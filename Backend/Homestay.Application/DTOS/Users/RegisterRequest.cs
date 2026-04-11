using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.Users
{
    public class RegisterRequest
    {
        //cần bỏ attribute này để đảm bảo tính nhất quán giữa client và server, tránh lỗi khi client gửi dữ liệu với tên trường khác
        [JsonPropertyName("Name")]
        public string Name { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string SDT { get; set; } = default!;
        public string Matkhau { get; set; } = default!;
    }
}
