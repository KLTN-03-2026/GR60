using Homestay.Application.DTOS.Booking;
using Homestay.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Homestay.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private IBooking _booking;
        public BookingController(IBooking booking)
        {
            _booking = booking;
        }
        [HttpPost]
        public async Task<IActionResult> CreateBookingAsync([FromBody] BookingRequest bookingRequest)
        {
            await _booking.CreateBookingAsync(bookingRequest);
            return Ok(bookingRequest);
        }
        [HttpGet("day")]
        public async Task<IActionResult> BookingRoomAsync([FromQuery] int idRoom)
        {
            var result = await _booking.BookingRoomAsync(idRoom);
            return Ok(result);
        }
    }
}
