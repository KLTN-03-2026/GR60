using Homestay.Application.DTOS;
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
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddHours(1)
            });
            return Ok(Login.response);
        }
        [HttpPost("register")]
        public async Task<IActionResult> AuthRegisterAsync([FromBody] RegisterRequest registerRequest)
        {
            var check = await _auth.RegistereAsync(registerRequest);
            if (check.StatusCode == 201)
            {
                return StatusCode(check.StatusCode,check);
            }

            return StatusCode(check.StatusCode, check);

        }
        //Response.Cookies.Delete("token");

        [HttpDelete("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("token");
         
            return Ok("Đăng xuất thành công");
        }
        [HttpPost("forgot-pass")]
        public async Task<IActionResult> ForgotPassword([FromBody]ForgotPassRequest forgotPassRequest)
        {
            var token = await _auth.CheckEmaiLSdt(forgotPassRequest);
            if(token == null)
            {
                return BadRequest();
            }
            return Ok(token);
        }
        [HttpPatch("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPass resetPass)
        {
           var result =  await _auth.ResetPassword(resetPass);
           if(result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode,result.Message);
            }
            return StatusCode(result.StatusCode, result.Message);

        }
        [Authorize]
        [HttpPost("test")]
        public IActionResult AuthRegister()
        {
            string test = _testSQlconnect.TestConnect().Result;
            return Ok(test);

        }
    }

}
