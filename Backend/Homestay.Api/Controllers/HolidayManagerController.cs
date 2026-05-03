using Homestay.Application.DTOS.HoLiday;
using Homestay.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Homestay.Api.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin")]
    public class HolidayManagerController : ControllerBase
    {
        private Iholiday _holiday;
        public HolidayManagerController(Iholiday iholiday)
        {
            _holiday = iholiday;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllHoliday()
        {
            var result = await _holiday.GetAllHoliday();
            return  Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> CreateHoliday([FromBody] HolidayRequest createHolidayRequest)
        {
            var result = await _holiday.CreateHoliday(createHolidayRequest);
            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
        [HttpPut("{idHoliday}")]
        public async Task<IActionResult> UpdateHoliday(int idHoliday,[FromBody] HolidayRequest createHolidayRequest)
        {
            var result = await _holiday.UpdateHoliday(idHoliday,createHolidayRequest);
            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
        [HttpDelete("{idHoliday}")]
        public async Task<IActionResult> DeleteHoliday(int idHoliday)
        {
            var result = await _holiday.DeleteHoliday(idHoliday);
            if (result.StatusCode == 204)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
    }
}
