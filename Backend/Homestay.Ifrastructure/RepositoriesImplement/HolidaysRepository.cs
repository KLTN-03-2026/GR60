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

        public async Task CreateHoliday(HolidayRequest createHolidayRequest)
        {
            string query = @" INSERT INTO ql_hs_ngay_le(ten_ngay_le, ngay_bat_dau, ngay_ket_thuc, he_so) 
                          VALUES (@ten_ngay_le, @ngay_bat_dau, @ngay_ket_thuc, @he_so)";
            using (var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction))
            {
                cmd.Parameters.AddWithValue("@ten_ngay_le", createHolidayRequest.NameHoliday);
                cmd.Parameters.AddWithValue("@ngay_bat_dau", createHolidayRequest.HolidayStart);
                cmd.Parameters.AddWithValue("@ngay_ket_thuc", createHolidayRequest.HolidayEnd);
                cmd.Parameters.AddWithValue("@he_so", createHolidayRequest.He_so);
                await cmd.ExecuteNonQueryAsync();
            }
        }

        public async Task DeleteHoliday(int idHoliday)
        {
            string query = @"delete from ql_hs_ngay_le
                            where id = @id";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@id", idHoliday);
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task<List<HolidayResponse>> GetAllHoliday()
        {
            string query = @"select *
                            from ql_hs_ngay_le
                            ";
            var listHoliday = new List<HolidayResponse>();
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync()) 
            {
                var holiday = new HolidayResponse()
                {
                    Id = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),
                    NameHoliday = reader["ten_ngay_le"] == DBNull.Value ? null : Convert.ToString(reader["ten_ngay_le"]),
                    HolidayStart = reader["ngay_bat_dau"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["ngay_bat_dau"]),
                    HolidayEnd = reader["ngay_ket_thuc"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["ngay_ket_thuc"]),
                    He_so = reader["he_so"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["he_so"]),
                };    
                listHoliday.Add(holiday);
            }
            return listHoliday;
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

        public async Task UpdateHoliday(int idHoliday, HolidayRequest HolidayRequest)
        {
            string query = @"update ql_hs_ngay_le
                            set ten_ngay_le = @ten, ngay_bat_dau = @daystart, ngay_ket_thuc= @dayend,he_so = @he_so
                            where id = @id";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@id", idHoliday);
            cmd.Parameters.AddWithValue("@ten",HolidayRequest.NameHoliday);
            cmd.Parameters.AddWithValue("@daystart", HolidayRequest.HolidayStart);
            cmd.Parameters.AddWithValue("@dayend", HolidayRequest.HolidayEnd);
            cmd.Parameters.AddWithValue("@he_so", HolidayRequest.He_so);
            await cmd.ExecuteNonQueryAsync();
        }
    }
}
