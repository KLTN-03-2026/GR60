using Homestay.Application.DTOS.Amenities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Repositories
{
    public interface IAmenitiesRepository
    {
        public Task CreateDAmenity(AmenitiesRequest amenitiesRequest);
        public Task CreateRoomDetailAmenities(int idRoom, AmenitiesByRoomRequest amenitiesByRoomRequest);
        public Task DeleteRoomAmenities(int idRoom, int idTienNghi);
        public Task DeleteRoomAmenities(int id);
        public Task<List<AmenitiesByRoomResponse>> GetAmenitiesByRoom(int idRoom);
        public Task<List<AmenitiesResponse>> GetListAmenities();
        public Task UpdateAmenity(int id, AmenitiesRequest amenitiesRequest);
    }
}
