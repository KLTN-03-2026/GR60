using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        [Required(ErrorMessage = "Tên đăng nhập là bắt buộc")]
        public string Name { get; set; } = default!;

        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; } = default!;
        public string Matkhau { get; set; } = default!;
        public string MatkhauXacNhan { get; set; } = default!;

    }
}
