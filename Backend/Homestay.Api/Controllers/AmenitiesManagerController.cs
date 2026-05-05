using Homestay.Application.DTOS.Amenities;
using Homestay.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Homestay.Api.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class AmenitiesManagerController : ControllerBase
    {
        private IAmenities _amenities;


        public AmenitiesManagerController(IAmenities amenities)
        {
            _amenities = amenities;
        }
        [HttpGet]
        public async Task<IActionResult> GetListAmenities()
        {
            var result = await _amenities.GetListAmenities();
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAmenity(int id)
        {
            var result = await _amenities.DeleteAmenity(id);
            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateDAmenity([FromBody] AmenitiesRequest amenitiesRequest)
        {
            var result = await _amenities.CreateDAmenity(amenitiesRequest);
            if (result.StatusCode == 201)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAmenity(int id, [FromBody] AmenitiesRequest amenitiesRequest)
        {
            var result = await _amenities.UpdateAmenity(id, amenitiesRequest);
            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
    }
}
