using Homestay.Application.DTOS.AIPrice;
using Homestay.Application.DTOS.Amenities;
using Homestay.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Homestay.Api.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin")]

    public class AIPriceManagerController : ControllerBase
    {
        private IAIService _aIService;
        public AIPriceManagerController(IAIService aIService)
        {
            _aIService = aIService;
        }   

        [HttpPost("{idRoom}")]
        public async Task<IActionResult> CreatePriceRoomAI(int idRoom,[FromBody]NgayDuDoanRequest ngayDuDoanRequest)
        {
            var result = await _aIService.CreatePriceRoomAI(idRoom, ngayDuDoanRequest);
            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("giaapdung")]
        public async Task<IActionResult> GetGiaApDung()
        {
            var result = await _aIService.GetGiaApDung();
            return Ok(result);
        }
        [HttpGet]
        public async Task<IActionResult> GetListGiaDuDoan()
        {
            var result = await _aIService.GetListGiaDuDoan();
            return Ok(result);
        }
        [HttpPost("{idRoom}/giaapDung")]
        public async Task<IActionResult> CreateGiaAPDung(int idRoom,[FromBody] CreateGiaApDungRequest createGiaApDungRequest)
        {
            var result = await _aIService.CreateGiaAPDung(idRoom, createGiaApDungRequest);
            if (result.StatusCode == 201)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
        [HttpDelete("doangia/{idDuDoanGia}")]
        public async Task<IActionResult> DeleteGiaAPDungAndDuDoan(int idDuDoanGia)
        {
            var result = await _aIService.DeleteGiaAPDungAndDuDoan(idDuDoanGia);
            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
    }
}
