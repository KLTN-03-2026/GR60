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
        [HttpPatch("IMG")]
        public async Task<IActionResult> UpdateAVTHomeStay([FromForm] IFormFile  ImghomeStayRequest)
        {
            await _homeStay.UpdateAVTHomeStay(ImghomeStayRequest);
            return Ok();
        }
        [HttpPatch("momo")]
        public async Task<IActionResult> UpdateImgMoMoHomeStay([FromForm] IFormFile ImgmomoHomeStayRequest)
        {
            await _homeStay.UpdateImgMoMoHomeStay(ImgmomoHomeStayRequest);
            return Ok();
        }

        [HttpPatch("qr")]
        public async Task<IActionResult> UpdateImgQRHomeStay([FromForm] IFormFile ImgqrHomeStayRequest)
        {
            await _homeStay.UpdateImgQRHomeStay(ImgqrHomeStayRequest);
            return Ok();
        }
    }
}
