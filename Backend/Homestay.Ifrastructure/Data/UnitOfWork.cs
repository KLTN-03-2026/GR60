using Homestay.Application.Interfaces;
using Homestay.Application.Interfaces.Repositories;
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
        public ITestRepo TestRepo { get; set; }

        private DBFactory dBFactory;
        public UnitOfWork(DBFactory dBFactory,IUserRepository userRepository,IRoomsRepository roomsRepository,ITestRepo testRepo)
        {
            this.dBFactory = dBFactory;
            UserRepository = userRepository;
            RoomsRepository = roomsRepository;
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
