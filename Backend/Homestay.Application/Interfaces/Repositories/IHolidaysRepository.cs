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
       public Task<List<HolidayResponse>> GetHolidayByDateAsync(DateTime startDate, DateTime endDate);
    }
}
