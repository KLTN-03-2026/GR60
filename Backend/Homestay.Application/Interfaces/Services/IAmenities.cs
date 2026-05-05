using Homestay.Application.DTOS;
using Homestay.Application.DTOS.Amenities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Services
{
    public interface IAmenities
    {
        public Task<CommonResponse> CreateDAmenity(AmenitiesRequest amenitiesRequest);
        public Task<CommonResponse> CreateRoomDetailAmenities(int idRoom, AmenitiesByRoomRequest amenitiesByRoomRequest);
        public Task<CommonResponse> DeleteAmenity(int id);
        public Task<CommonResponse> DeleteRoomDetailAmenities(int idRoom, int idTienNghi);
        public Task<List<AmenitiesByRoomResponse>> GetAmenitiesByRoom(int idRoom);
        public Task<List<AmenitiesResponse>> GetListAmenities();
        public Task<CommonResponse> UpdateAmenity(int id, AmenitiesRequest amenitiesRequest);
    }
}
