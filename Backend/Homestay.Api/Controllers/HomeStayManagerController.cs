using Homestay.Application.DTOS.HomeStay;
using Homestay.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Homestay.Api.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin")]
    public class HomeStayManagerController : ControllerBase
    {
        private IHomeStay _homeStay;
        public HomeStayManagerController(IHomeStay homeStay)
        {
            _homeStay = homeStay;
        }
        [HttpGet]
        public async Task<IActionResult> GetHomeStay()
        {
            var result = await _homeStay.GetHomestay();
            return Ok(result);
        }
        [HttpPut]
        public async Task<IActionResult> UpdateInfoHomeStay( [FromForm] HomeStayRequest homeStayRequest)
        {
            await _homeStay.UpdateInfoHomeStay(homeStayRequest);
            return Ok();
        }
    }
}
