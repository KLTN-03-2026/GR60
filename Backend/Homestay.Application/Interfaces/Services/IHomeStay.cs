using Homestay.Application.DTOS.HomeStay;
using Homestay.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Services
{
    public interface IHomeStay
    {
        public Task<HomeStayEntities> GetHomestay();
        public Task UpdateInfoHomeStay(HomeStayRequest homeStayRequest);
    }
}
