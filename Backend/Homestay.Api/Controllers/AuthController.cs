using Homestay.Application.DTOS.Users;
using Homestay.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace Homestay.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly IAuth _auth;
        private ITestSQlconnect _testSQlconnect;
        public AuthController(ILogger<AuthController> logger, IAuth auth,ITestSQlconnect testSQlconnect)
        {
            _logger = logger;
            _auth = auth;
            _testSQlconnect = testSQlconnect;
        }
        [HttpPost("login")]
        public async Task<IActionResult> AuthLogin([FromBody] UserRequest userRequest)
        {
            var Login = await _auth.LoginAsync(userRequest);
            if (Login ==null)
            {
                return BadRequest("Email hoặc mật khẩu không đúng");
            }
            Response.Cookies.Append("token", Login.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });
            return Ok(Login.response);
        }
        [HttpPost("register")]

        public async Task<IActionResult> AuthRegisterAsync([FromBody] RegisterRequest registerRequest)
        {
            var check = await _auth.RegistereAsync(registerRequest);
            if (check)
            {
                return Ok("Đăng ký thành công");
            }
            else
            {
                return BadRequest("Đăng ký thất bại");

            }
        }


          //Response.Cookies.Delete("token");
      
        [Authorize]
        [HttpPost("test")]
        public IActionResult AuthRegister()
        {
            string test = _testSQlconnect.TestConnect().Result;
            return Ok(test);

        }
    }

}
