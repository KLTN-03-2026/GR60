using Homestay.Application.DTOS;
using Homestay.Application.DTOS.Booking;
using Homestay.Application.DTOS.Payment;
using Homestay.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Homestay.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private IPayment _payment;
        private ICheckout _checkout;

        public PaymentsController(IPayment payment,ICheckout checkout) 
        {
            _payment = payment;
            _checkout = checkout;
        }
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromForm]PaymentRequest paymentRequest,[FromForm] BookingRequest bookingRequest)
        {
            await _checkout.CreateBookingPayment(paymentRequest,bookingRequest);
            return Ok();
        }
    }
}
