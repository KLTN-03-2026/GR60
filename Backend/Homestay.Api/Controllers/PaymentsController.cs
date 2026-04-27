using Homestay.Application.DTOS;
using Homestay.Application.DTOS.Booking;
using Homestay.Application.DTOS.Payment;
using Homestay.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Homestay.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private ICheckout _checkout;

        public PaymentsController(ICheckout checkout) 
        {
            _checkout = checkout;
        }
        [Authorize]
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromForm]PaymentRequest paymentRequest,[FromForm] BookingRequest bookingRequest)
        {
            try
            {
                await _checkout.CreateBookingPayment(paymentRequest, bookingRequest);
                return Ok();
            }
            catch(Exception ex) 
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
