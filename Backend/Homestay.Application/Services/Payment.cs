using Homestay.Application.DTOS;
using Homestay.Application.DTOS.Payment;
using Homestay.Application.Interfaces;
using Homestay.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Services
{
    public class Payment:IPayment
    {
        //private IBooking _booking;
        private IUnitOfWork _unitOfWork;
        private IBooking booking;
       public Payment(IUnitOfWork unitOfWork) 
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<PaymentResponse>> GetAllPayment()
        {
           var result = await _unitOfWork.paymentRepository.GetAllPayment();
           return result;
        }

        public async Task<CommonResponse> UpdateIsDeletePayment(int idPayment, int idBooking)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.paymentRepository.UpdateIsDeletePayment(idPayment, idBooking);
                _unitOfWork.Commit();
                return new CommonResponse { StatusCode = 200, Message = "Cập nhật trạng thái thành công." };

            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse { StatusCode = 500, Message = "Lỗi khi cập nhật đặt phòng." };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }

        public async Task<CommonResponse> UpdateStatusPayment(PaymentUpdateStatusRequest request)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.BookingRepository.UpdateStatusBookingAndPayment(request.Id_Booking, request.Trang_Thai);
                _unitOfWork.Commit();
                return new CommonResponse { StatusCode = 200, Message = "Cập nhật trạng thái thành công." };

            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse { StatusCode = 500, Message = "Lỗi khi cập nhật đặt phòng." };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }
    }
}
