using Homestay.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Homestay.Api.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class BookingManagerController : ControllerBase
    {
        private IBooking _booking;
        public BookingManagerController(IBooking booking)
        {
            _booking = booking;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBooking()
        {
            var result = await _booking.GetAllBooking();
            return Ok(result);
        }

        [HttpPatch("{idBooking}/status")]
        public async Task<IActionResult> UpdateBooking(int idBooking, [FromBody] string trangThai)
        {
            var result = await _booking.UpdateStatusBooking(idBooking, trangThai);
            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }

        [HttpPatch("{idBooking}/isDelete")]
        public async Task<IActionResult> UpdateIsDeleteBooking(int idBooking)
        {
            var result = await _booking.UpdateIsDeleteBooking(idBooking);
            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
    }
}
