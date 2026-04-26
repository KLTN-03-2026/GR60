using Homestay.Application.DTOS.Booking;
using Homestay.Application.Interfaces;
using Homestay.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Services
{
    public class Booking : IBooking
    {
        private readonly IUnitOfWork _unitOfWork;
        public Booking(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<DayBookingReponse>> BookingRoomAsync(int idRoom)
        {
            var CheckDayBooking = await _unitOfWork.BookingRepository.CheckDayBookingRoomAsync(idRoom);
            return CheckDayBooking.ToList();
        }

        public async Task<int> CreateBookingAsync(BookingRequest bookingRequest)
        {
            _unitOfWork.BeginTransaction();
            try
            {
               var result =  await _unitOfWork.BookingRepository.CreateBooking(bookingRequest);
                _unitOfWork.Commit();
                return result;

            }
            catch
            {
                _unitOfWork.Rollback();
                return -1;
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }
    }
}
