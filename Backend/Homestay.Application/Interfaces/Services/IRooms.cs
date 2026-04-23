using Homestay.Application.DTOS.Rooms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Services
{
    public interface IRooms
    {
        public Task<List<RoomResponse>> FindRoomAsync(FindRoomRequest findRoomRequest);
        public Task<List<RoomResponse>> GetAllRoomsTypeAsync(string type);
        public Task<RoomResponse> GetRoomDetailAsync(int id);
        public Task<RoomPriceResponse> GetRoomPriceAsync(int id, RoomDetailRequest roomDetailRequest);
    }
}
