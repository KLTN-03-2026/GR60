using Homestay.Application.DTOS;
using Homestay.Application.DTOS.AIPrice;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Services
{
    public interface IAIService
    {
        public Task<CommonResponse> CreatePriceRoomAI(int id, NgayDuDoanRequest ngayDuDoanRequest);
        public Task<List<DSGiaApDungResponse>> GetGiaApDung();
        public Task<List<DSGiaDuDoanResponse>> GetListGiaDuDoan();
        public Task<CommonResponse> CreateGiaAPDung(int idRoom, CreateGiaApDungRequest createGiaApDungRequest);
        public Task<CommonResponse> DeleteGiaAPDungAndDuDoan(int idDuDoanGia);
    }
}
