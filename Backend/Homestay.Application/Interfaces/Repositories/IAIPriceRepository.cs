using Homestay.Application.DTOS.AIPrice;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Repositories
{
    public interface IAIPriceRepository
    {
        public Task CreateAIPricePrediction(int idRoom, NgayDuDoanRequest ngayDuDoanRequest, GiaAIResponse? priceAi, string model);
        public Task CreateGiaAPDung(int idRoom, CreateGiaApDungRequest createGiaApDungRequest);
        public Task DeleteGiaAPDungAndDuDoan(int idRoom);
        public Task<DataAIprice> GetDataAIPrice(int id);
        public Task<List<DSGiaApDungResponse>> GetGiaApDung();
        public Task<List<DSGiaDuDoanResponse>> GetListGiaDuDoan();
    }
}
