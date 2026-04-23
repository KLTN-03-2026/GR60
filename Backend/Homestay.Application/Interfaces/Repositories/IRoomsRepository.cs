using Homestay.Application.DTOS.Rooms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Repositories
{
    public interface IRoomsRepository
    {
        public Task<List<RoomResponse>> GetAllRoomsTypeAsync(string type);
        public Task<List<RoomResponse>> GetRoomByFindAsync(FindRoomRequest findRoomRequest);
        public Task<RoomResponse> GetRoomDetailAsync(int id);
    }
}
