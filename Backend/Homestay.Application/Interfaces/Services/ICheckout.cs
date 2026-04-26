using Homestay.Application.DTOS.Booking;
using Homestay.Application.DTOS.Payment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Services
{
    public interface ICheckout
    {
           public Task CreateBookingPayment(PaymentRequest paymentRequest,BookingRequest bookingRequest);
    }
}
