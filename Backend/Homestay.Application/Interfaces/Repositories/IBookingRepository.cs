using Homestay.Application.DTOS.Booking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Repositories
{
    public interface IBookingRepository
    {
        public  Task<List<DayBookingReponse>> CheckDayBookingRoomAsync(int idRoom);
        public Task<int> CreateBooking(BookingRequest bookingRequest);
        public Task<BookingDetailByUser> GetBookingById(int idBooking);
        public Task<List<BookingsByUserResponse>> GetBookingByUser(int idUser);
        public Task<List<DayBookingReponse>> GetDayCheckInCheckOutByRoomIdInFuture(int idRoom);
    }
}
