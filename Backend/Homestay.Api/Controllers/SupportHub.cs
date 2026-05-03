using Homestay.Application.DTOS.Chats;
using Homestay.Application.Interfaces.Services;
using Microsoft.AspNetCore.SignalR;

namespace Homestay.Api.Controllers
{
    public class SupportHub:Hub
    {
        private IChatManager _chatManager;
        public SupportHub(IChatManager chatManager)
        {
            _chatManager = chatManager;
        }
        // 1. Dành cho CSKH: Khi nhân viên đăng nhập, gọi hàm này để vào nhóm trực page
        public async Task JoinChatRoom(int cuocTroChuyenId)
        {
            // Ép kiểu ID int sang string để tạo tên Group cho SignalR
            string groupName = $"Room_{cuocTroChuyenId}";

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }
        public async Task SendMessage(int cuocTroChuyenId, int nguoiDungId, string message)
        {
            // BƯỚC A: LƯU VÀO DATABASE
            var newMsg = new MessageRepsonse
            {
                ql_cuoc_tro_chuyen_id = cuocTroChuyenId,
                ql_nguoi_dung_id = nguoiDungId,
                noi_dung = message,
                trang_thai_doc = 0, // Mặc định là 0 (Chưa đọc)
                thoi_gian = DateTime.Now
            };

            await _chatManager.CreateMessage(newMsg);

            // BƯỚC B: PHÁT TIN NHẮN CHO NGƯỜI TRONG PHÒNG
            string groupName = $"Room_{cuocTroChuyenId}";

            // Phát sự kiện "ReceiveMessage" kèm theo dữ liệu vừa lưu
            await Clients.Group(groupName).SendAsync(
                "ReceiveMessage",
                newMsg.ql_cuoc_tro_chuyen_id,
                newMsg.ql_nguoi_dung_id,
                newMsg.noi_dung,
                newMsg.thoi_gian
            );
        }
    }
}

