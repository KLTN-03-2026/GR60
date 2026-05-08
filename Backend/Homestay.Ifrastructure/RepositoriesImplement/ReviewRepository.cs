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

        public async Task<int> CheckUserBooking(int idRoom, int idUser)
        {
            string query = @"select  DP.id, ND.id as id_nguoi_dung,P.id as id_phong,DP.trang_thai
                                from ql_hs_dat_phong DP
                                left join ql_hs_nguoi_dung ND on DP.ql_nguoi_dung_id = ND.id
                                left join ql_hs_phong P on DP.ql_phong_id = P.id
                                where ND.id = @idUser and P.id = @idRoom and DP.trang_thai = 'da_hoan_thanh' and DP.isDelete = 'False'";
            using var cmd = new SqlCommand(query,_dBFactory.GetConnection,_dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idUser", idUser);
            cmd.Parameters.AddWithValue("@idRoom", idRoom);
            using var reader = await cmd.ExecuteReaderAsync();
            int idBooking = 0;
            if(await reader.ReadAsync())
            {
                idBooking = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]);  
            }
            return idBooking;
        }

        public async Task CreateReviews(int idRoom, int checkUserBooking, ReviewsRequest reviewsRequest)
        {
            string query = @"INSERT INTO ql_hs_danh_gia(ql_phong_id, ql_nguoi_dung_id, ql_dat_phong_id, so_sao, noi_dung, trang_thai, thoi_gian) 
                VALUES (@idRoom, @idUser, @idBooking, @SoSao, @NoiDung, @trang_thai, GETDATE());";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idRoom", idRoom);
            cmd.Parameters.AddWithValue("@idUser", reviewsRequest.idUser);
            cmd.Parameters.AddWithValue("@idBooking", checkUserBooking);
            cmd.Parameters.AddWithValue("@SoSao", reviewsRequest.So_Sao);
            cmd.Parameters.AddWithValue("@NoiDung", reviewsRequest.Noi_Dung);
            cmd.Parameters.AddWithValue("@trang_thai", reviewsRequest.Trang_Thai);
            await cmd.ExecuteNonQueryAsync();

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
            string query = @" with phanhoi as (
  select ph.id,ph.ql_danh_gia_id, ND.ho_ten as nguoi_phan_hoi,ph.noi_dung as noi_dung_phan_hoi ,ph.thoi_gian as thoi_gian_phan_hoi
  from ql_hs_phan_hoi ph
  left join ql_hs_nguoi_dung ND on ph.ql_nguoi_dung_id =  ND.id 
  )
  select ND.ho_ten as ho_ten_danh_gia, DG.thoi_gian as thoi_gian_dg ,so_sao,DG.noi_dung as noi_dung_dg,dg.trang_thai, ph.nguoi_phan_hoi,ph.noi_dung_phan_hoi,ph.thoi_gian_phan_hoi
                            from ql_hs_danh_gia DG
                            left join ql_hs_nguoi_dung ND on DG.ql_nguoi_dung_id=  ND.id 
							left join phanhoi ph on DG.id =  ph.ql_danh_gia_id 
                            where ql_phong_id = @idRoom";
            var listReview = new List<ReviewResponse>();
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idRoom", id);
            using var reader =  await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var review = new ReviewResponse
                {
                    Ho_Ten = reader["ho_ten_danh_gia"] == DBNull.Value ? null : reader["ho_ten_danh_gia"].ToString(),
                    Thoi_Gian = reader["thoi_gian_dg"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["thoi_gian_dg"]),
                    So_Sao = reader["so_sao"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_sao"]),
                    Noi_dung = reader["noi_dung_dg"] == DBNull.Value ? null : reader["noi_dung_dg"].ToString(),
                    Ho_Ten_Phan_Hoi = reader["nguoi_phan_hoi"] == DBNull.Value ? null : reader["nguoi_phan_hoi"].ToString(),
                    Thoi_Gian_Phan_Hoi = reader["thoi_gian_phan_hoi"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["thoi_gian_phan_hoi"]),
                    Noi_dung_Phan_Hoi = reader["noi_dung_phan_hoi"] == DBNull.Value ? null : reader["noi_dung_phan_hoi"].ToString(),
                    Trang_Thai = reader["trang_thai"] == DBNull.Value ? null : reader["trang_thai"].ToString(),
                };
                listReview.Add(review);
            }
            return listReview;
        }
    }
}
