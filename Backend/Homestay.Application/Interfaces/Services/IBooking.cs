using Homestay.Application.DTOS;
using Homestay.Application.DTOS.Booking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Services
{
    public interface IBooking
    {
        public Task<List<DayBookingReponse>> BookingRoomAsync(int idRoom);
        public Task<int> CreateBookingAsync(BookingRequest bookingRequest);
        public Task<List<BookingManagerRessponse>> GetAllBooking();
        public Task<BookingDetailByUser> GetBookingById(int idBooking);
        public Task<List<BookingsByUserResponse>> GetBookingByUser(int idUser);
        public Task<CommonResponse> UpdateIsDeleteBooking(int idBooking);
        public Task<CommonResponse> UpdateStatusBooking(int idBooking, string trangThai);
    }
}
