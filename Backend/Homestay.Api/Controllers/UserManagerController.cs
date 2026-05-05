using Homestay.Application.DTOS.Users;
using Homestay.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Homestay.Api.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize]
    public class UserManagerController : ControllerBase
    {
        private IUser _user;
        public UserManagerController(IUser user) 
        {
            _user = user;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllUser()
        {
            var result = await _user.GetAllUser();
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserManagerRequest createUserManagerRequest)
        {
            var result = await _user.CreateUser(createUserManagerRequest);
            if (result.StatusCode == 201)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }

        [HttpPatch("{idUser}")]
        public async Task<IActionResult> UpdateIsdelete(int idUser)
        {
            var result = await _user.UpdateIsdelete(idUser);
            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
    }
}
