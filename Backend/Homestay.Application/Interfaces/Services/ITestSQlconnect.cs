using Homestay.Application.DTOS.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Services
{
    public interface ITestSQlconnect
    {
        public Task<string> TestConnect();
    }
}
