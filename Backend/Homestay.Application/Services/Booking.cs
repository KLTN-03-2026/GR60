using Homestay.Application.DTOS;
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

        public Task<List<BookingManagerRessponse>> GetAllBooking()
        {
            var result = _unitOfWork.BookingRepository.GetAllBooking();
            return result;
        }

        public async Task<BookingDetailByUser> GetBookingById(int idBooking)
        {
            var result = await _unitOfWork.BookingRepository.GetBookingById(idBooking);
            return result;
        }

        public async Task<List<BookingsByUserResponse>> GetBookingByUser(int idUser)
        {
            var result = await _unitOfWork.BookingRepository.GetBookingByUser(idUser);
            if(result == null)
            {
                return null;
            }
            return result;
        }

        public async Task<CommonResponse> UpdateIsDeleteBooking(int idBooking)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.BookingRepository.UpdateIsDeleteBooking(idBooking);
                _unitOfWork.Commit();
                return new CommonResponse { StatusCode = 200, Message = "Xóa đơn đặt phòng thành công." };

            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse { StatusCode = 500, Message = "Lỗi khi Xóa đơn đặt phòng." };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }

        public async Task<CommonResponse> UpdateStatusBooking(int idBooking, string trangThai)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.BookingRepository.UpdateStatusBookingAndPayment(idBooking, trangThai);
                _unitOfWork.Commit();
                return new CommonResponse { StatusCode = 200, Message = "Cập nhật trạng thái đặt phòng thành công." };

            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse { StatusCode = 500, Message = "Lỗi khi cập nhật trạng thái đặt phòng." };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }
    }
}
