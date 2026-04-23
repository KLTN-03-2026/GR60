using Homestay.Application.DTOS.HoLiday;
using Homestay.Application.Interfaces.Repositories;
using Homestay.Ifrastructure.Data;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Ifrastructure.RepositoriesImplement
{

    public class HolidaysRepository : IHolidaysRepository
    {
        private DBFactory _dBFactory;
        public HolidaysRepository(DBFactory dbFactory)
        {
            _dBFactory = dbFactory;
        }
        public async Task<List<HolidayResponse>> GetHolidayByDateAsync(DateTime startDate, DateTime endDate)
        {
            string query = @"select id,ten_ngay_le,ngay_bat_dau,ngay_ket_thuc,he_so
	                        from ql_hs_ngay_le
	                        where ngay_bat_dau >= @startDate and ngay_ket_thuc <= @endDate";
            using var cmd = new SqlCommand(query,_dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@startDate", startDate);
            cmd.Parameters.AddWithValue("@endDate", endDate);
            var holidays = new List<HolidayResponse>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var holiday = new HolidayResponse
                {
                    Id = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),
                    NameHoliday = reader["ten_ngay_le"] == DBNull.Value ? string.Empty : reader["ten_ngay_le"].ToString(),
                    HolidayStart = reader["ngay_bat_dau"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["ngay_bat_dau"]),
                    HolidayEnd = reader["ngay_ket_thuc"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["ngay_ket_thuc"]),
                    He_so = reader["he_so"] == DBNull.Value ? 0 : (decimal)reader["he_so"]
                };
                holidays.Add(holiday);
            }
            return holidays;
        }
    }
}
