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
        public Task CreateBookingAsync(BookingRequest bookingRequest);
    }
}
