using Homestay.Application.DTOS.Review;
using Homestay.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Homestay.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private IReview _Review;
        public ReviewsController(IReview review)
        {
            _Review = review;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllReview()
        {
            var result = await _Review.GetAllReviewAsync();
            return Ok(result);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateReviewAsync([FromQuery] int idRoom, [FromBody] ReviewsRequest reviewsRequest)
        {
            var result = await _Review.CreateReviewAsync(idRoom,reviewsRequest);
            if(result.StatusCode == 201)
            {
                return StatusCode(result.StatusCode, result);
            }
            return StatusCode(result.StatusCode, result);
        }

    }
}
