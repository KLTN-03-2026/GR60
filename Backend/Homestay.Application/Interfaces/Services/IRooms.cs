using Homestay.Application.DTOS;
using Homestay.Application.DTOS.Rooms;
using Microsoft.AspNetCore.Http;
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
        public Task<List<RoomResponse>> GetAllRooms();
        public Task<List<RoomResponse>> GetAllRoomsTypeAsync(string type);
        public Task<RoomResponse> GetRoomDetailManager(int idRoom);
        public Task<RoomResponse> GetRoomDetailAsync(int id);
        public Task<RoomPriceResponse> GetRoomPriceAsync(int id, RoomDetailRequest roomDetailRequest);
        public Task <List<ImgRoomResponse>> GetRoomDetailImg(int idRoom);
        public Task<CommonResponse> AddRoomDetailImg(int idRoom, IFormFile fileAnh);
        public Task<CommonResponse> DeleteRoomDetailImg(int idImg);
        public Task<CommonResponse> AddRoom(RoomInfoRequest roomInfoRequest);
        public Task<CommonResponse> UpdateRoom(int id,RoomInfoRequest roomInfoRequest);
        public Task<CommonResponse> UpdateRoomIsDelete(int id);
    }
}
