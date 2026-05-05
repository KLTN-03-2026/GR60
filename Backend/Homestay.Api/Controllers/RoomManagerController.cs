using Homestay.Application.DTOS.Amenities;
using Homestay.Application.DTOS.Rooms;
using Homestay.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Homestay.Api.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize]
    public class RoomManagerController : ControllerBase
    {
        private IRooms _rooms;
        private IBooking _booking;
        private IAmenities _amenities;


        public RoomManagerController(IRooms rooms,IBooking booking, IAmenities amenities)
        {
            _rooms = rooms;
            _booking = booking;
            _amenities = amenities;
        }
        [HttpPost]
        public async Task<IActionResult> AddRoom([FromBody]RoomInfoRequest createRoomRequest)
        {
            var result = await _rooms.AddRoom(createRoomRequest);
            if (result.StatusCode == 201)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] RoomInfoRequest createRoomRequest)
        {
            var result = await _rooms.UpdateRoom(id, createRoomRequest);
            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
        [HttpPatch("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var result = await _rooms.UpdateRoomIsDelete(id);
            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
        [HttpGet]
        public async Task<IActionResult> GetAllRoom()
        {
            var result = await _rooms.GetAllRooms();
            return Ok(result);
        }
        [HttpGet("{idRoom}")]
        public async Task<IActionResult> GetRoomDetail(int idRoom)
        {
            var result = await _rooms.GetRoomDetailManager(idRoom);
            return Ok(result);
        }
        [HttpGet("{idRoom}/amenities")]
        public async Task<IActionResult> GetRoomDetailAmenities(int idRoom)
        {
            var result = await _amenities.GetAmenitiesByRoom(idRoom);
            return Ok(result);
        }

        [HttpPost("{idRoom}/amenities")]
        public async Task<IActionResult> CreateRoomDetailAmenities(int idRoom, [FromBody] AmenitiesByRoomRequest amenitiesByRoomRequest )
        {
            var result = await _amenities.CreateRoomDetailAmenities(idRoom, amenitiesByRoomRequest);

            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
        [HttpDelete("{idRoom}/amenities")]
        public async Task<IActionResult> DeleteRoomDetailAmenities(int idRoom,[FromBody] int IdTienNghi)
        {
            var result = await _amenities.DeleteRoomDetailAmenities(idRoom, IdTienNghi);

            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
        [HttpGet("{idRoom}/imgRoom")]
        public async Task<IActionResult> GetRoomDetailImg(int idRoom)
        {
            var result = await _rooms.GetRoomDetailImg(idRoom);
            return Ok(result);
        }
        [HttpPost("{idRoom}/imgRoom")]
        public async Task<IActionResult> AddRoomDetailImg(int idRoom,[FromForm]IFormFile fileAnh)
        {
            var result = await _rooms.AddRoomDetailImg(idRoom, fileAnh);
            if (result.StatusCode == 201)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
        [HttpDelete("{idRoom}/imgRoom")]
        public async Task<IActionResult> DeleteRoomDetailImg([FromBody]int idImg)
        {
            var result = await _rooms.DeleteRoomDetailImg(idImg);
            if (result.StatusCode == 200)
            {
                return StatusCode(result.StatusCode, result);

            }
            return StatusCode(result.StatusCode, result);
        }
    }
}
