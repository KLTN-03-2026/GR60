using Homestay.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Repositories
{
    public interface ITestRepo
    {
        public Task<bool> GetUsers();
    }
}
