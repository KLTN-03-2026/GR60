using Homestay.Application.DTOS.Payment;
using Homestay.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Repositories
{
    public interface IPaymentRepository
    {
       public Task CreatePayment(PaymentsEntities payments);
       public Task<List<PaymentResponse>> GetAllPayment();
       public Task UpdateIsDeletePayment(int idPayment, int idBooking);
    }
}
