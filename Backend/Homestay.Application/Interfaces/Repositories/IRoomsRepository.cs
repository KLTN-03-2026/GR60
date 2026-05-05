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
        public Task AddRoom(RoomInfoRequest roomInfoRequest);
        public Task CreateRoomImg(int idRoom, string pathImg);
        public Task DeleteRoomDetailImg(int idImg);
        public Task<List<RoomResponse>> GetAllRooms();
        public Task<List<RoomResponse>> GetAllRoomsTypeAsync(string type);
        public Task<List<RoomResponse>> GetRoomByFindAsync(FindRoomRequest findRoomRequest);
        public Task<RoomResponse> GetRoomDetailAsync(int id);
        public Task<List<ImgRoomResponse>> GetRoomDetailImg(int idRoom);
        public Task<RoomResponse> GetRoomDetailManager(int idRoom);
        public Task<string> GetUrlImgById(int idImg);
        public Task UpdateRoom(int id, RoomInfoRequest roomInfoRequest);
        public Task UpdateRoomIsDelete(int id);
    }
}
