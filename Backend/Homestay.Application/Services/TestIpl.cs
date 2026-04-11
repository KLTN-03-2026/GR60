using Homestay.Application.DTOS.Users;
using Homestay.Application.Interfaces;
using Homestay.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Services
{
    public class TestIpl : ITestSQlconnect
    {
        private IUnitOfWork _unitOfWork;
        public TestIpl(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<string> TestConnect()
        {
            if (_unitOfWork == null) throw new Exception("UOW null");
            if (_unitOfWork.TestRepo == null) throw new Exception("Repo null");
            if (await _unitOfWork.TestRepo.GetUsers())
            {
                return "Kết nối thành công";
            }
            return "Kết nối thất bại";

        }
    } 
}
