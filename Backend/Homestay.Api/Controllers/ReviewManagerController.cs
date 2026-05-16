using Homestay.Application.DTOS.Review;
using Homestay.Application.Interfaces.Services;
using Homestay.Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Homestay.Api.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class ReviewManagerController : ControllerBase
    {
        private IReview _Review;
        public ReviewManagerController(IReview review)
        {
            _Review = review;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllReview()
        {
            var result = await _Review.GetAllReviewManaGer();
            return Ok(result);
        }
        [HttpPost("phanhoi")]
        public async Task<IActionResult> CreatePhanHoi([FromBody] CreatePhanHoiRequest createPhanHoi)
        {
            var result = await _Review.CreatePhanHoi(createPhanHoi);
            if (result.StatusCode == 201)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
        [HttpDelete("{idreview}")]
        public async Task<IActionResult> DeleteReview(int idreview)
        {
            var result = await _Review.DeleteReview(idreview);
            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
        [HttpPatch("phanhoi/{idPhanHoi}")]
        public async Task<IActionResult> UpdatePhanHoi(int idPhanHoi,[FromBody]string noiDung)
        {
            var result = await _Review.UpdatePhanHoi(idPhanHoi,noiDung);
            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
    }
}
