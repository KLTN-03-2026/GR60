using Homestay.Application.Interfaces.Repositories;
using Homestay.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces
{
    //Kế thừa Idisposable để đảm bảo rằng các tài nguyên được giải phóng đúng cách sau khi sử unitof work
    // Khi một đối tượng UnitOfWork được sử dụng trong một khối using,
    // phương thức Dispose sẽ tự động được gọi khi khối using kết thúc,
    // giúp đảm bảo rằng các tài nguyên được giải phóng đúng cách.
    public interface IUnitOfWork //:IDisposable
    {
        public IUserRepository UserRepository { get; }
        public ITestRepo TestRepo { get; }
        public IRoomsRepository RoomsRepository { get; }
        public IHolidaysRepository HolidaysRepository { get; }
        public IBookingRepository BookingRepository { get; }
        public IReviewRepository ReviewRepository { get; }

        void BeginTransaction();
        void Commit();
        void Rollback();
        void Dispose();
    }
}
