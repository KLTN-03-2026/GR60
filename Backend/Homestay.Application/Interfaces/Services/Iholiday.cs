using Homestay.Application.DTOS;
using Homestay.Application.DTOS.HoLiday;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Services
{
    public interface Iholiday
    {
        public Task<CommonResponse> CreateHoliday(HolidayRequest createHolidayRequest);
        public Task<CommonResponse> DeleteHoliday(int idHoliday);
        public Task<List<HolidayResponse>> GetAllHoliday();
        public Task<CommonResponse> UpdateHoliday(int idHoliday, HolidayRequest createHolidayRequest);
    }
}
