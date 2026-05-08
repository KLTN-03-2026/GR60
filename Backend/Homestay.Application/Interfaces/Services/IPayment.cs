using Homestay.Application.DTOS;
using Homestay.Application.DTOS.Payment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Services
{
    public interface IPayment
    {
        //public Task CreateBookingPayment(PaymentRequest paymentRequest);
        public Task<List<PaymentResponse>> GetAllPayment();
        public Task<CommonResponse> UpdateIsDeletePayment(int idPayment, int idBooking);
        public Task<CommonResponse> UpdateStatusPayment(PaymentUpdateStatusRequest request);
    }
}
