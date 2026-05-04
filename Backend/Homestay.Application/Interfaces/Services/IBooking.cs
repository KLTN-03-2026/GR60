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
        public Task<BookingDetailByUser> GetBookingById(int idBooking);
        public Task<List<BookingsByUserResponse>> GetBookingByUser(int idUser);
    }
}
