using Homestay.Application.DTOS.HomeStay;
using Homestay.Domain.Entities;
using Microsoft.AspNetCore.Http;
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
        public Task UpdateAVTHomeStay(IFormFile imghomeStayRequest);
        public Task UpdateImgMoMoHomeStay(IFormFile imgmomoHomeStayRequest);
        public Task UpdateImgQRHomeStay(IFormFile imgqrHomeStayRequest);
        public Task UpdateInfoHomeStay(HomeStayRequest homeStayRequest);
    }
}
