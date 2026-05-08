using Homestay.Application.DTOS.Payment;
using Homestay.Application.Interfaces.Services;
using Homestay.Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Homestay.Api.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class PaymentManagerController : ControllerBase
    {
        private IPayment _payment;
        public PaymentManagerController(IPayment payment)
        {
            _payment = payment;
        }   
        [HttpGet]
        public async Task<IActionResult> GetAllPayment()
        {
            var result = await _payment.GetAllPayment();
            return Ok(result);
        }

        [HttpPatch("status")]
        public async Task<IActionResult> UpdatePayment([FromBody] PaymentUpdateStatusRequest request)
        {
            var result = await _payment.UpdateStatusPayment(request);
            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
       
        [HttpPatch("{idPayment}/isDelete")]
        public async Task<IActionResult> UpdateIsDeleteBooking(int idPayment,[FromBody]int idBooking)
        {
            var result = await _payment.UpdateIsDeletePayment(idPayment,idBooking);
            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
    }
}
