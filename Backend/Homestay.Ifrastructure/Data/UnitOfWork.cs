using Homestay.Application.Interfaces;
using Homestay.Application.Interfaces.Repositories;
using Homestay.Application.Interfaces.Services;
using Homestay.Application.Services;
using Homestay.Ifrastructure.RepositoriesImplement;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Ifrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        public IUserRepository UserRepository { get; set; }
        public IRoomsRepository RoomsRepository { get; set; }
        public IHolidaysRepository HolidaysRepository { get; set; }
        public ITestRepo TestRepo { get; set; }

        public IBookingRepository BookingRepository { get; set; }
        public IReviewRepository ReviewRepository { get; set; }
        public IPaymentRepository paymentRepository { get; set; }

        public IHomeStayRepository homeStayRepository { get; set; }

        private DBFactory dBFactory;
        public UnitOfWork(
               DBFactory dBFactory,
               IUserRepository userRepository,
               IRoomsRepository roomsRepository,
               IHolidaysRepository HolidaysRepository,
               IBookingRepository bookingRepository,
               IReviewRepository reviewRepository,
               ITestRepo testRepo,
               IPaymentRepository paymentRepository,
               IHomeStayRepository homeStayRepository
               
                
            )
        {
            this.dBFactory = dBFactory;
            this.UserRepository = userRepository;
            this. RoomsRepository = roomsRepository;
            this.HolidaysRepository = HolidaysRepository;
            this.BookingRepository = bookingRepository;
            this.ReviewRepository = reviewRepository;    
            this.paymentRepository = paymentRepository;
            this.homeStayRepository = homeStayRepository;
            TestRepo = testRepo;
        }

        public void BeginTransaction()
        {
            dBFactory.BeginTransaction();
        }

        public void Commit()
        {
            dBFactory.commit();
        }

        public void Rollback()
        {
            dBFactory.Rollback();
        }
        public void Dispose()
        {
            dBFactory.Dispose();
        }
    }
}
