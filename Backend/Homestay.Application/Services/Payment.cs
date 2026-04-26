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
    }
}
