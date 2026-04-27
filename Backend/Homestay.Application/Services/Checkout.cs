using Homestay.Application.DTOS.Booking;
using Homestay.Application.DTOS.Payment;
using Homestay.Application.Interfaces;
using Homestay.Application.Interfaces.Services;
using Homestay.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Services
{
    public class Checkout : ICheckout
    {
        private IUnitOfWork _unitOfWork;
        public Checkout(IUnitOfWork unitOfWork) 
        {
            _unitOfWork = unitOfWork;
        }
        public async Task CreateBookingPayment(PaymentRequest paymentRequest, BookingRequest bookingRequest)
        {
            if (paymentRequest.Hinh_Anh_Minh_Chung == null)
            {
                throw new Exception("không có ảnh");
            }
            var fileName = await UploadImg(paymentRequest.Hinh_Anh_Minh_Chung);
            var pathImg = Path.Combine("UploadsImg", fileName);
            _unitOfWork.BeginTransaction();

            try
            {
              var idBooking =   await _unitOfWork.BookingRepository.CreateBooking(bookingRequest);
                var payment = new Payments
                {
                    Id_Dat_phong = idBooking,
                    So_tien = Convert.ToDecimal(bookingRequest.Tong_Tien),
                    Phuong_thuc = paymentRequest.Phuong_Thuc.ToString(),
                    Hinh_Anh_Minh_Chung = pathImg,
                    Trang_Thai = "cho_thanh_toan"
                };
                await  _unitOfWork.paymentRepository.CreatePayment(payment);
                _unitOfWork.Commit();
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;

            }
            finally
            {
                _unitOfWork.Dispose();
            }

        }
        public async Task<string> UploadImg(IFormFile formFile)
        {
            var folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UploadsImg");
            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);
            Guid guid = Guid.NewGuid();
            var fileName = guid.ToString() + formFile.FileName;
            var path = Path.Combine(folder, fileName);
            using var stream = new FileStream(path, FileMode.Create);
            await formFile.CopyToAsync(stream);
            return fileName;
        }
    }
}
