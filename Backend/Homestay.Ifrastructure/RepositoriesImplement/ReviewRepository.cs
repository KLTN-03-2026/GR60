using Homestay.Application.DTOS.Review;
using Homestay.Application.Interfaces.Repositories;
using Homestay.Application.Services;
using Homestay.Ifrastructure.Data;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Ifrastructure.RepositoriesImplement
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly DBFactory _dBFactory;
        public ReviewRepository(DBFactory dBFactory)
        {
            _dBFactory = dBFactory;

        }
        public async Task<List<ReviewResponse>> GetAllReviewsAsync()
        {
            string query = @"
                            select ND.ho_ten, thoi_gian,so_sao,noi_dung
                            from ql_hs_danh_gia DG
                            left join ql_hs_nguoi_dung ND on DG.ql_nguoi_dung_id=  ND.id ";
            var listReview = new List<ReviewResponse>();
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            using var reader =  await cmd.ExecuteReaderAsync();
            while(await reader.ReadAsync())
            {
                var review = new ReviewResponse
                {
                    Ho_Ten = reader["ho_ten"] == DBNull.Value ? null : reader["ho_ten"].ToString(),
                    Thoi_Gian = reader["thoi_gian"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["thoi_gian"]),
                    So_Sao = reader["so_sao"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_sao"]),
                    Noi_dung = reader["noi_dung"] == DBNull.Value ? null : reader["noi_dung"].ToString(),
                };
                listReview.Add(review);
            }
            return listReview;
        }

        public async Task<List<ReviewResponse>> GetAllReviewsRRoomAsync(int id)
        {
            string query = @"select ND.ho_ten, thoi_gian,so_sao,noi_dung
                            from ql_hs_danh_gia DG
                            left join ql_hs_nguoi_dung ND on DG.ql_nguoi_dung_id=  ND.id 
                            where ql_phong_id = @idRoom";
            var listReview = new List<ReviewResponse>();
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idRoom", id);
            using var reader =  await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var review = new ReviewResponse
                {
                    Ho_Ten = reader["ho_ten"] == DBNull.Value ? null : reader["ho_ten"].ToString(),
                    Thoi_Gian = reader["thoi_gian"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["thoi_gian"]),
                    So_Sao = reader["so_sao"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_sao"]),
                    Noi_dung = reader["noi_dung"] == DBNull.Value ? null : reader["noi_dung"].ToString(),
                };
                listReview.Add(review);
            }
            return listReview;
        }
    }
}
