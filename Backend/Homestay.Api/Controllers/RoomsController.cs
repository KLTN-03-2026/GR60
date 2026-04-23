using Homestay.Application.DTOS;
using Homestay.Application.DTOS.Rooms;
using Homestay.Application.Interfaces;
using Homestay.Application.Interfaces.Services;
using Homestay.Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Homestay.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly ILogger<RoomsController> _logger;
        private IRooms _rooms;
        public IReview _review;

        public RoomsController(
            ILogger<RoomsController> logger,
            IRooms rooms,
            IReview review
            )
            {
                _logger = logger;
                _rooms = rooms;
                _review = review;   
        }
        [HttpGet]
        public async Task<IActionResult> GetAllRoomsType([FromQuery] string type)
        {
            var result = await _rooms.GetAllRoomsTypeAsync(type);


            return Ok(result);
        }

        [HttpGet("roomfind")]
        public async Task<IActionResult> FindRoom([FromQuery] FindRoomRequest findRoomRequest)
        { 
            var result = await _rooms.FindRoomAsync(findRoomRequest);
            if(result == null)
            {
                return NotFound(new Mesage { Message = "Không tìm thấy phòng nào phù hợp với yêu cầu của bạn." });
            }
            return Ok(result);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> DetailRoom(int id )
        {
            var result = await _rooms.GetRoomDetailAsync(id);
            return Ok(result);
        }
        [HttpGet("{id}/price")]
        public async Task<IActionResult> RoompPrice(int id, [FromQuery] RoomDetailRequest roomDetailRequest)
        {
            var result = await _rooms.GetRoomPriceAsync(id, roomDetailRequest);
            return Ok(result);
        }

        [HttpGet("{id}/review")]
        public async Task<IActionResult> DetailRoomReview(int id)
        {
            var result = await _review.GelAllReviewsRoom(id);
            return Ok(result);
        }

    }
}
