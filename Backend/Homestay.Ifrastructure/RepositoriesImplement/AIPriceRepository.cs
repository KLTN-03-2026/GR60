using Homestay.Application.DTOS.AIPrice;
using Homestay.Application.DTOS.Review;
using Homestay.Application.Interfaces.Repositories;
using Homestay.Ifrastructure.Data;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Ifrastructure.RepositoriesImplement
{
    public class AIPriceRepository : IAIPriceRepository
    {
        private DBFactory _dBFactory;
        public AIPriceRepository(DBFactory dBFactory)
        {
            _dBFactory = dBFactory;
        }
        public async Task CreateAIPricePrediction(int idRoom, NgayDuDoanRequest ngayDuDoanRequest, GiaAIResponse? priceAi, string model)
        {
            string query = @"insert into ql_hs_du_doan_gia_ai(ql_phong_id,gia_de_xuat
                            ,ly_do_du_doan,model_name,trang_thai,thoi_gian_tao,ngay_bat_dau_du_doan,ngay_ket_thuc_du_doan)
                            values(@ql_phong_id,@gia_de_xuat,@ly_do_du_doan,@model_name,'cho_duyet',GETDATE(),@ngay_bat_dau_du_doan,@ngay_ket_thuc_du_doan)";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@ql_phong_id", idRoom);

            cmd.Parameters.AddWithValue("@gia_de_xuat", priceAi.Gia_Du_Doan);

            cmd.Parameters.AddWithValue("@ly_do_du_doan", priceAi.Ly_Do);

            cmd.Parameters.AddWithValue("@model_name", model);

            cmd.Parameters.AddWithValue("@ngay_bat_dau_du_doan", ngayDuDoanRequest.Ngay_Bat_Dau_Du_doan);

            cmd.Parameters.AddWithValue("@ngay_ket_thuc_du_doan", ngayDuDoanRequest.Ngay_Ket_Thuc_Du_doan);

            await cmd.ExecuteNonQueryAsync();
        }

        public async Task CreateGiaAPDung(int idRoom, CreateGiaApDungRequest createGiaApDungRequest)
        {
            string query = @"insert into ql_hs_gia_ap_dung(ql_phong_id,ql_du_doan_gia_id,ngay_ap_dung,gia_ap_dung,ql_nguoi_duyet_id,trang_thai,thoi_gian_tao)
                             values(@ql_phong_id,@ql_du_doan_gia_id,GETDATE(),@gia_ap_dung,@ql_nguoi_duyet_id,'ap_dung_tu_ai',@thoi_gian_tao)
                             update ql_hs_du_doan_gia_ai 
                             set trang_thai = 'da_duyet'
                             where id = @ql_du_doan_gia_id";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@ql_phong_id", idRoom);

            cmd.Parameters.AddWithValue("@ql_du_doan_gia_id", createGiaApDungRequest.idDuDoanGia);

            cmd.Parameters.AddWithValue("@gia_ap_dung", createGiaApDungRequest.giaApDung);

            cmd.Parameters.AddWithValue("@ql_nguoi_duyet_id", createGiaApDungRequest.idUser);

            cmd.Parameters.AddWithValue("@thoi_gian_tao", createGiaApDungRequest.thoiGianTao);

            await cmd.ExecuteNonQueryAsync();
        }

        public async Task DeleteGiaAPDungAndDuDoan(int idDuDoanGia)
        {
            string query = @"delete from ql_hs_gia_ap_dung
                            where ql_du_doan_gia_id = @idDuDoanGia
                            delete from ql_hs_du_doan_gia_ai
                            where id = @idDuDoanGia
                            ";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idDuDoanGia", idDuDoanGia);
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task<DataAIprice> GetDataAIPrice(int idRoom)
        {
            string query = @"  with GiaApDung as(
	                        SELECT ql_phong_id,STRING_AGG(gia_ap_dung,';') as ds_gia,STRING_AGG(ngay_ap_dung,';') as ds_ngay_ap_dung
	                        FROM ql_hs_gia_ap_dung
	                        group by ql_phong_id
	                        )
	                        select p.gia_goc, gad.ds_gia, gad.ds_ngay_ap_dung,p.loai_phong,p.so_nguoi_lon,p.so_tre_em
	                        from ql_hs_phong p
	                        left join GiaApDung gad on p.id = gad.ql_phong_id
	                        where p.id = @idRoom";
            var listPrince = new List<decimal>();
            var listDatePrince = new List<DateTime>();


            using var cmd = new SqlCommand(query,_dBFactory.GetConnection,_dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idRoom", idRoom);
            using var reader = await cmd.ExecuteReaderAsync();
            if(await reader.ReadAsync())
            {
                if (reader["ds_gia"] != DBNull.Value)
                {
                    listPrince = reader["ds_gia"].ToString().Split(';').Select(a => decimal.Parse(a)).ToList();
                }
                if (reader["ds_ngay_ap_dung"] != DBNull.Value)
                {
                    listDatePrince = reader["ds_ngay_ap_dung"].ToString().Split(';').Select(a => DateTime.Parse(a)).ToList();
                }
                //{
                //    var dsGia = reader.GetString(1).Split(';');
                //    listPrince = dsGia.Select(decimal.Parse).ToList();
                //}
                var data = new DataAIprice
                {
                    Gia_Goc = reader["gia_goc"] == DBNull.Value ? 0 : (decimal)reader["gia_goc"],
                    PriceList = listPrince.Count == 0 ? null : listPrince ,
                    DateList = listDatePrince.Count == 0 ? null : listDatePrince,
                    Loai_Phong = reader["loai_phong"] == DBNull.Value ? string.Empty : reader["loai_phong"].ToString(),
                    So_Nguoi_Lon = reader["so_nguoi_lon"] == DBNull.Value ? 0 : (int)reader["so_nguoi_lon"],
                    So_Tre_Em = reader["so_tre_em"] == DBNull.Value ? 0 : (int)reader["so_tre_em"],
                };
                return data;
            }
            return null;
        }
        public async Task<List<DSGiaApDungResponse>> GetGiaApDung()
        {
            string query = @"with GiaApDungMoiNhat as
                            (
                            select ql_phong_id,ngay_ap_dung, gia_ap_dung, ROW_NUMBER() over(PARTITION BY ql_phong_id order by ngay_ap_dung desc) as rn
                            from ql_hs_gia_ap_dung 
                            )
                              select p.id,p.ten_phong,p.gia_goc,p.trang_thai,gad.gia_ap_dung,gad.ngay_ap_dung
                              from ql_hs_phong p
                              left join GiaApDungMoiNhat gad on p.id = gad.ql_phong_id and rn = 1
                              where p.isDelete = 'false'";
            using var cmd = new SqlCommand(query,_dBFactory.GetConnection,_dBFactory.GetTransaction);
            var listRoomPrice = new List<DSGiaApDungResponse>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var roomPrice = new DSGiaApDungResponse()
                {
                    idRoom = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),

                    Ten_Phong = reader["ten_phong"] == DBNull.Value ? null : Convert.ToString(reader["ten_phong"]),

                    Trang_Thai = reader["trang_thai"] == DBNull.Value ? null : Convert.ToString(reader["trang_thai"]),

                    Gia_goc = reader["gia_goc"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["gia_goc"]),

                    Gia_Ap_Dung = reader["gia_ap_dung"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["gia_ap_dung"]),

                    Ngay_Ap_Dung = reader["ngay_ap_dung"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["ngay_ap_dung"])
                };
                listRoomPrice.Add(roomPrice);
            }
            return listRoomPrice;
        }

        public async Task<List<DSGiaDuDoanResponse>> GetListGiaDuDoan()
        {
            string query = @"SELECT id
                          ,ql_phong_id
                          ,gia_de_xuat
                          ,ly_do_du_doan
                          ,model_name
                          ,trang_thai
                          ,thoi_gian_tao
                          ,ngay_bat_dau_du_doan
                          ,ngay_ket_thuc_du_doan
                      FROM ql_hs_du_doan_gia_ai
                    ";
            using var cmd = new SqlCommand(query,_dBFactory.GetConnection,_dBFactory.GetTransaction);
            var listRoomPrice = new List<DSGiaDuDoanResponse>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync()) 
            {
                var price = new DSGiaDuDoanResponse()
                {
                   idGiaDuDoan = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),
                   idRoom = reader["ql_phong_id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["ql_phong_id"]),
                   Gia_De_Xuat = reader["gia_de_xuat"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["gia_de_xuat"]),
                   Ly_Do_Du_Doan = reader["ly_do_du_doan"] == DBNull.Value ? null : Convert.ToString(reader["ly_do_du_doan"]),
                   Model_Name = reader["model_name"] == DBNull.Value ? null : Convert.ToString(reader["model_name"]),
                   Trang_Thai = reader["trang_thai"] == DBNull.Value ? null : Convert.ToString(reader["trang_thai"]),
                   Thoi_Gian_Tao = reader["thoi_gian_tao"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["thoi_gian_tao"]),
                   Ngay_Bat_Dau_Du_Doan = reader["ngay_bat_dau_du_doan"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["ngay_bat_dau_du_doan"]),
                   Ngay_Ket_Thuc_Du_Doan = reader["ngay_ket_thuc_du_doan"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["ngay_ket_thuc_du_doan"]),
                };
                listRoomPrice.Add(price);
            }
            return listRoomPrice;
        }
    }
}
