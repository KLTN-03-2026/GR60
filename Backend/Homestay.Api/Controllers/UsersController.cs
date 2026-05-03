using Homestay.Application.DTOS.Users;
using Homestay.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Homestay.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private IUser _user;
        public UsersController(IUser user)
        {
            _user = user;
        }

        [HttpPatch("{idUser}/password")]
        public async Task<IActionResult> ChangePassword(int idUser,[FromBody]ChangePassRequest changePassRequest)
        {
            var result = await _user.ChangePassAsync(idUser,changePassRequest); 
            if(result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);
            }
                return StatusCode(result.StatusCode, result);
        }

        [HttpPatch("{idUser}/infouser")]
        public async Task<IActionResult> UpdateUser(int idUser, [FromBody] InfoUpdateUser infoUpdateUser)
        {
            var result = await _user.UpdateUser(idUser, infoUpdateUser);
            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);
            }
            return StatusCode(result.StatusCode, result);
        }

        [HttpPatch("{idUser}/emailuser")]
        public async Task<IActionResult> UpdateEmailUser(int idUser, [FromForm] string email)
        {
            var result = await _user.UpdateEmailUser(idUser, email);
            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);
            }
            return StatusCode(result.StatusCode, result);
        }

        [HttpPatch("{idUser}/avatar")]
        public async Task<IActionResult> UpdateAvatar(int idUser,[FromForm] IFormFile annh)
        {
            var result = await _user.UpdateAvatar(idUser, annh);
            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost("{idUser}/conversation")]
        public async Task<IActionResult> GetConversation(int idUser)
        {
            var result = await _user.GetConversationByUser(idUser);
            return Ok(result);
        }
        [HttpGet("{idUser}/Message")]
        public async Task<IActionResult> GetMessageUser([FromQuery]int idConversation)
        {
            var result = await _user.GetMessageUser(idConversation);
            return Ok(result);
        }
    }
}
