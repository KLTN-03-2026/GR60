using Homestay.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Homestay.Api.Controllers
{
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "admin")]
    [ApiController]
    public class ManagerChatController : ControllerBase
    {
        private IChatManager _chat;
        public ManagerChatController(IChatManager chat) 
        {
            _chat = chat;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllConversation()
        {
            var result = await _chat.GetAllConversation();
            return Ok(result);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteConversation([FromBody]int idConversation)
        {
            await _chat.DeleteConversation(idConversation);
            return Ok("xóa tin nhắn thành công");
        }
    }
}
