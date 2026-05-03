using Homestay.Application.DTOS.HoLiday;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Repositories
{
    public interface IHolidaysRepository
    {
        public Task CreateHoliday(HolidayRequest createHolidayRequest);
        public Task DeleteHoliday(int idHoliday);
        public Task<List<HolidayResponse>> GetAllHoliday();
        public Task<List<HolidayResponse>> GetHolidayByDateAsync(DateTime startDate, DateTime endDate);
        public Task UpdateHoliday(int idHoliday, HolidayRequest createHolidayRequest);
    }
}
