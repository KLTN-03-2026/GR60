using Homestay.Application.DTOS.Amenities;
using Homestay.Application.Interfaces.Repositories;
using Homestay.Application.Interfaces.Services;
using Homestay.Ifrastructure.Data;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Ifrastructure.RepositoriesImplement
{
    public class AmenitiesRepository : IAmenitiesRepository
    {
        private readonly DBFactory _dBFactory;
        public AmenitiesRepository(DBFactory dbFactory)
        {
            _dBFactory = dbFactory;
        }

        public async Task CreateDAmenity(AmenitiesRequest amenitiesRequest)
        {
            string query = @"   insert into TienNghi(ten_tien_nghi,mo_ta,trang_thai)
                                 values(@ten_tien_nghi,@mo_ta,@trang_thai)";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@ten_tien_nghi", amenitiesRequest.Ten_Tien_Nghi);
            cmd.Parameters.AddWithValue("@mo_ta", amenitiesRequest.Mo_Ta);
            cmd.Parameters.AddWithValue("@trang_thai", amenitiesRequest.Trang_Thai);
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task CreateRoomDetailAmenities(int idRoom, AmenitiesByRoomRequest amenitiesByRoomRequest)
        {
            string query = @"insert into Phong_TienNghi(phong_id,tien_nghi_id,so_luong)
                            values (@idRoom,@idTienNghi,@soluong)";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idRoom", idRoom);
            cmd.Parameters.AddWithValue("@idTienNghi", amenitiesByRoomRequest.IdTienNghi);
            cmd.Parameters.AddWithValue("@soluong", amenitiesByRoomRequest.Soluong);
            await cmd.ExecuteNonQueryAsync();
        }
        public async Task DeleteRoomAmenities(int idRoom, int idTienNghi)
        {
            string query = @"delete from Phong_TienNghi
                where phong_id =@idRoom and tien_nghi_id = @idTienNghi";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idRoom", idRoom);
            cmd.Parameters.AddWithValue("@idTienNghi", idTienNghi);
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task DeleteRoomAmenities(int id)
        {
            string query = @" delete from  Phong_TienNghi
                                 where tien_nghi_id = @idTienNghi

                                 delete from  TienNghi
                                 where id = @idTienNghi";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idTienNghi", id);
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task<List<AmenitiesByRoomResponse>> GetAmenitiesByRoom(int idRoom)
        {
            string query = @"select PTN.phong_id, tn.id, tn.ten_tien_nghi,PTN.so_luong
                            from Phong_TienNghi PTN
                            left join TienNghi tn on PTN.tien_nghi_id = tn.id
                            where PTN.phong_id = @idRoom";
            var listAmenities = new List<AmenitiesByRoomResponse>();
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idRoom", idRoom);
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync()) 
            {
                var Amenities = new AmenitiesByRoomResponse()
                {
                    IdTienNghi = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),
                    TenTienNghi = reader["ten_tien_nghi"] == DBNull.Value ? null : Convert.ToString(reader["ten_tien_nghi"]),
                    Soluong = reader["so_luong"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_luong"]),
                };
                listAmenities.Add(Amenities);
            }
            return listAmenities;
        }

        public async Task<List<AmenitiesResponse>> GetListAmenities()
        {
            string query = @"select *
                            from TienNghi";
            var listAmenities = new List<AmenitiesResponse>();
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var Amenities = new AmenitiesResponse()
                {
                    IdTienNghi = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),
                    Ten_Tien_Nghi = reader["ten_tien_nghi"] == DBNull.Value ? null : Convert.ToString(reader["ten_tien_nghi"]),
                    Mo_Ta = reader["mo_ta"] == DBNull.Value ? null : Convert.ToString(reader["mo_ta"]),
                    Trang_Thai = reader["trang_thai"] == DBNull.Value ? null : Convert.ToString(reader["trang_thai"]),
                };
                listAmenities.Add(Amenities);
            }
            return listAmenities;

        }

        public async Task UpdateAmenity(int id, AmenitiesRequest amenitiesRequest)
        {
            string query = @"   update TienNghi
                                set ten_tien_nghi = @ten_tien_nghi, mo_ta = @mo_ta, trang_thai = @trang_thai
                                where id = @id";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@ten_tien_nghi", amenitiesRequest.Ten_Tien_Nghi);
            cmd.Parameters.AddWithValue("@mo_ta", amenitiesRequest.Mo_Ta);
            cmd.Parameters.AddWithValue("@trang_thai", amenitiesRequest.Trang_Thai);
            cmd.Parameters.AddWithValue("@id", id);
            await cmd.ExecuteNonQueryAsync();
        }
    }
}
