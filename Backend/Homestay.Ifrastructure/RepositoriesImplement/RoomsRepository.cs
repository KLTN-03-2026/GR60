using Homestay.Application.DTOS.Rooms;
using Homestay.Application.Interfaces.Repositories;
using Homestay.Application.Interfaces.Services;
using Homestay.Domain.Entities;
using Homestay.Ifrastructure.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Homestay.Ifrastructure.RepositoriesImplement
{
    public class RoomsRepository : IRoomsRepository
    {
        private DBFactory _dBFactory;
        private IConfiguration _configuration;

        public RoomsRepository(IConfiguration configuration,DBFactory dBFactory) 
        {
            _dBFactory = dBFactory;
            _configuration = configuration;
        }

        public async Task AddRoom(RoomInfoRequest createRoomRequest)
        {
            string query = @"insert into ql_hs_phong(ten_phong,ql_homestay_id,loai_phong,gia_goc,trang_thai,mo_ta,so_nguoi_lon,so_tre_em,so_giuong,isDelete,dia_chi)
                            values (@ten_phong,1,@loai_phong,@gia_goc,@trang_thai,@mo_ta,@so_nguoi_lon,@so_tre_em,@so_giuong,'false',@dia_chi)";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@ten_phong", createRoomRequest.TenPhong);
            cmd.Parameters.AddWithValue("@loai_phong", createRoomRequest.LoaiPhong);
            cmd.Parameters.AddWithValue("@gia_goc", createRoomRequest.GiaGoc);
            cmd.Parameters.AddWithValue("@trang_thai", createRoomRequest.TrangThai);
            cmd.Parameters.AddWithValue("@mo_ta", createRoomRequest.MoTa);
            cmd.Parameters.AddWithValue("@so_nguoi_lon", createRoomRequest.SoNguoiLon);
            cmd.Parameters.AddWithValue("@so_tre_em", createRoomRequest.SoTreEm);
            cmd.Parameters.AddWithValue("@so_giuong", createRoomRequest.SoGiuong);
            cmd.Parameters.AddWithValue("@dia_chi", createRoomRequest.DiaChi);
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task CreateRoomImg(int idRoom, string pathImg)
        {
            string query = @"insert into ql_hs_anh_phong (phong_id,url_anh,mo_ta)
                            values (@idRoom,@pathImg,'')";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idRoom", idRoom);
            cmd.Parameters.AddWithValue("@pathImg", pathImg);
            await cmd.ExecuteNonQueryAsync();
        }
        public async Task DeleteRoomDetailImg(int idImg)
        {
            string query = @"delete from ql_hs_anh_phong
                                    where id = @idImg";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idImg", idImg);
            await cmd.ExecuteNonQueryAsync();
        }
        public async Task<List<RoomResponse>> GetAllRooms()
        {
            string query = @"with anhphong as 
                            (
                            select phong_id,url_anh, ROW_NUMBER() OVER(PARTITION BY phong_id ORDER BY id ASC) as rn
                            from ql_hs_anh_phong
                            )
                            select p.id,p.ten_phong,p.loai_phong,p.gia_goc,p.trang_thai,ap.url_anh,p.isDelete
                            from ql_hs_phong p
                            left join anhphong ap on p.id = ap.phong_id and rn =1";
            var list = new List<RoomResponse>();
            var cmd = new SqlCommand(query,_dBFactory.GetConnection,_dBFactory.GetTransaction);
            var reader = await cmd.ExecuteReaderAsync();
            while(await reader.ReadAsync())
            {
                var room = new RoomResponse()
                {
                    Id = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),
                    TenPhong = reader["ten_phong"] == DBNull.Value ? null : reader["ten_phong"].ToString(),
                    LoaiPhong = reader["loai_phong"] == DBNull.Value ? null : reader["loai_phong"].ToString(),
                    Gia = reader["gia_goc"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["gia_goc"]),
                    TrangThai = reader["trang_thai"] == DBNull.Value ? null : reader["trang_thai"].ToString(),
                    DSAnh = new List<string> { reader["url_anh"] == DBNull.Value ? null : Path.Combine(_configuration["localhost"],reader["url_anh"].ToString()) },
                    IsDelete = reader["isDelete"] == DBNull.Value ? null : reader["isDelete"].ToString()
                };
                list.Add(room);
            }
            return list;
        }
        public async Task<List<RoomResponse>> GetAllRoomsTypeAsync(string type)
        {
            string query =
              "WITH GiaMoiNhat AS(SELECT ql_phong_id, gia_ap_dung, ngay_ap_dung, ROW_NUMBER() OVER (PARTITION BY ql_phong_id ORDER BY ngay_ap_dung DESC) as rn FROM ql_hs_gia_ap_dung),"+
              "DanhGiaTrungBinh AS(SELECT ql_phong_id, AVG(CAST(so_sao AS FLOAT)) AS so_sao_tb FROM ql_hs_danh_gia GROUP BY ql_phong_id)," +
              "anhPhong1 as (SELECT phong_id, url_anh, ROW_NUMBER() OVER(PARTITION BY phong_id ORDER BY id ASC) as rn FROM ql_hs_anh_phong)" +
              "SELECT P.id, ROUND(dg.so_sao_tb, 1) AS so_sao, p.ten_phong, ap.url_anh,g.gia_ap_dung,p.mo_ta,p.so_nguoi_lon,p.so_tre_em,p.trang_thai,p.gia_goc FROM ql_hs_phong p " +
              "LEFT JOIN GiaMoiNhat g ON p.id = g.ql_phong_id AND g.rn = 1 " +
              "LEFT JOIN DanhGiaTrungBinh dg ON p.id = dg.ql_phong_id " +
              "LEFT JOIN anhPhong1 ap ON p.id = ap.phong_id and ap.rn = 1"+
             " WHERE p.loai_phong like @Type and isDelete != N'true'";
                using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction) ;
                cmd.Parameters.AddWithValue("@Type", $"{type}%");
                using var reader = await cmd.ExecuteReaderAsync();
                var rooms = new List<RoomResponse>();
                while (await reader.ReadAsync())
                {
                    var room = new RoomResponse
                    {
                        Id = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),
                        TenPhong =  reader["ten_phong"] == DBNull.Value ? null:reader["ten_phong"].ToString(),
                        DSAnh = new List<string> { reader["url_anh"] == DBNull.Value ? null : Path.Combine(_configuration["localhost"],reader["url_anh"].ToString()) },
                        Mota = reader["mo_ta"] == DBNull.Value ? null : reader["mo_ta"].ToString(),
                        Gia = reader["gia_ap_dung"] == DBNull.Value ? Convert.ToDecimal(reader["gia_goc"]) : Convert.ToDecimal(reader["gia_ap_dung"]),
                        SoNguoiLon = reader["so_nguoi_lon"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_nguoi_lon"]),
                        SoTreEm = reader["so_tre_em"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_tre_em"]),
                        SoSao = reader["so_sao"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_sao"]),
                        TrangThai = reader["trang_thai"] == DBNull.Value ? null : reader["trang_thai"].ToString(),
                    };
                    rooms.Add(room);
                }
                return rooms;
        }
        public async Task<List<RoomResponse>> GetRoomByFindAsync(FindRoomRequest findRoomRequest)
        {
            string query = "WITH GiaMoiNhat AS(SELECT ql_phong_id, gia_ap_dung, ngay_ap_dung, ROW_NUMBER() OVER (PARTITION BY ql_phong_id ORDER BY ngay_ap_dung DESC) as rn FROM ql_hs_gia_ap_dung)," +
                            "DanhGiaTrungBinh AS(SELECT ql_phong_id, AVG(CAST(so_sao AS FLOAT)) AS so_sao_tb FROM ql_hs_danh_gia GROUP BY ql_phong_id)," +
                            "anhPhong1 as (SELECT phong_id, url_anh, ROW_NUMBER() OVER(PARTITION BY phong_id ORDER BY id ASC) as rn FROM ql_hs_anh_phong)" +
                            "SELECT   P.id, ROUND(DG.so_sao_tb, 1) AS so_sao,P.ten_phong, ap.url_anh, GAD.gia_ap_dung,P.mo_ta,P.so_nguoi_lon,P.so_tre_em,P.dia_chi" +
                            " FROM ql_hs_phong P" +
                            " left join DanhGiaTrungBinh DG on p.id = DG .ql_phong_id" +
                            " left join GiaMoiNhat GAD on p.id = GAD .ql_phong_id and  GAD.rn = 1" +
                            " left join anhPhong1 AP on p.id = AP.phong_id and  AP.rn = 1 "+
                            "where so_nguoi_lon >=0";
            if (!string.IsNullOrEmpty(findRoomRequest.DiaChi))
            {
                query += "and P.dia_chi COLLATE SQL_Latin1_General_CP1_CI_AI LIKE  @DiaChi ";
            } if(findRoomRequest.MucGiaMin > 0)
            {
                query += "and @GiaMin<= GAD.gia_ap_dung ";
            } if(findRoomRequest.MucGiaMax > 0)
            {
                query += "and GAD.gia_ap_dung <= @GiaMax ";
            } if(findRoomRequest.SoSao > 0)
            {
                query += "and DG.so_sao_tb >= @SoSao ";
            }  if(findRoomRequest.SoNguoiLon > 0)
            {
                query += "and P.so_nguoi_lon >= @SoNguoiLon ";
            }
            if (findRoomRequest.SoTreEm > 0)
            {
                query += "and P.so_tre_em >= @SoTreEm ";
            }
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            if (!string.IsNullOrEmpty(findRoomRequest.DiaChi))
            {
                cmd.Parameters.AddWithValue("@DiaChi", $"%/%{findRoomRequest.DiaChi}%");
            }
             if (findRoomRequest.MucGiaMin > 0)
            {
                cmd.Parameters.AddWithValue("@GiaMin", findRoomRequest.MucGiaMin);
            }  if (findRoomRequest.MucGiaMax > 0)
            {
                cmd.Parameters.AddWithValue("@GiaMax", findRoomRequest.MucGiaMax);
            }
             if (findRoomRequest.SoSao > 0)
            {
                cmd.Parameters.AddWithValue("@SoSao", findRoomRequest.SoSao);
            }
             if (findRoomRequest.SoNguoiLon > 0)
            {
                cmd.Parameters.AddWithValue("@SoNguoiLon", findRoomRequest.SoNguoiLon);
            }
            if (findRoomRequest.SoTreEm > 0)
            {
                cmd.Parameters.AddWithValue("@SoTreEm", findRoomRequest.SoTreEm);
            }
            using var reader = await cmd.ExecuteReaderAsync();
            var rooms = new List<RoomResponse>();
            while (await reader.ReadAsync())
            {
                var room = new RoomResponse
                {
                    Id = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),
                    TenPhong = reader["ten_phong"] == DBNull.Value ? null : reader["ten_phong"].ToString(),
                    DSAnh = new List<string> { reader["url_anh"] == DBNull.Value ? null : reader["url_anh"].ToString() },
                    Mota = reader["mo_ta"] == DBNull.Value ? null : reader["mo_ta"].ToString(),
                    Gia = reader["gia_ap_dung"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["gia_ap_dung"]),
                    SoNguoiLon = reader["so_nguoi_lon"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_nguoi_lon"]),
                    SoTreEm = reader["so_tre_em"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_tre_em"]),
                    SoSao = reader["so_sao"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_sao"])
                };
                rooms.Add(room);
            }
            return rooms;
        }
        public async Task<RoomResponse> GetRoomDetailAsync(int id)
        {
            string query = @"WITH GiaMoiNhat AS
                                (
                                    SELECT 
                                        ql_phong_id,
                                        gia_ap_dung,
                                        ROW_NUMBER() OVER (PARTITION BY ql_phong_id ORDER BY ngay_ap_dung DESC) AS rn
                                    FROM ql_hs_gia_ap_dung
                                ),
                                DanhGiaTrungBinh AS
                                (
                                    SELECT 
                                        ql_phong_id,
                                        AVG(CAST(so_sao AS FLOAT)) AS so_sao_tb
                                    FROM ql_hs_danh_gia
                                    GROUP BY ql_phong_id
                                ),
                                TienNghiGop AS
                                (
                                  SELECT 
                                      PTN.phong_id ,
	                                  STRING_AGG(ten_tien_nghi, ', ') AS ds_tien_nghi
                                  FROM Phong_TienNghi PTN
                                  left join TienNghi tn on PTN.tien_nghi_id = tn.id
                                  GROUP BY PTN.phong_id
                                ),
                                AnhPhongGop as 
                                (
		                                SELECT phong_id,STRING_AGG(url_anh,';') as ds_anh
		                                FROM ql_hs_anh_phong
		                                group by phong_id
                                )
                                SELECT 
                                    p.id,
                                    p.ten_phong,
                                    p.loai_phong,
                                    ISNULL(g.gia_ap_dung, 0) AS gia_ap_dung,
                                    p.trang_thai,
                                    p.mo_ta,
                                    p.gia_goc,
                                    p.dia_chi,
                                    p.so_nguoi_lon,
                                    p.so_tre_em,
                                    p.so_giuong,
                                    ROUND(ISNULL(dg.so_sao_tb, 0), 1) AS so_sao,

                                    ISNULL(tn.ds_tien_nghi, '') AS ds_tien_nghi,

                                    ISNULL(ap.ds_anh, '') AS ds_anh
                                FROM ql_hs_phong p
                                LEFT JOIN GiaMoiNhat g 
                                    ON p.id = g.ql_phong_id AND g.rn = 1
                                LEFT JOIN DanhGiaTrungBinh dg 
                                    ON p.id = dg.ql_phong_id
                                LEFT JOIN TienNghiGop tn
                                    ON p.id = tn.phong_id
                                LEFT JOIN AnhPhongGop ap 
                                    ON p.id = ap.phong_id
                                WHERE p.id = @id";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@id", id); 
            List<string> dsAnh = new List<string>();
            List<string> dsTienNghi = new List<string>();
                using var reader = await cmd.ExecuteReaderAsync();
                if(await reader.ReadAsync())
                {
                if (reader["ds_anh"]!= DBNull.Value)
                {
                    dsAnh =  reader["ds_anh"].ToString().Split(';').ToList();
                }
                if (reader["ds_tien_nghi"] != DBNull.Value)
                {
                    dsTienNghi = reader["ds_tien_nghi"].ToString().Split(',').ToList();
                }
                return new RoomResponse
                    {
                        Id = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),
                        TenPhong = reader["ten_phong"] == DBNull.Value ? null : reader["ten_phong"].ToString(),
                        LoaiPhong = reader["loai_phong"] == DBNull.Value ? null : reader["loai_phong"].ToString(),
                        TrangThai = reader["trang_thai"] == DBNull.Value ? null : reader["trang_thai"].ToString(),
                        Mota = reader["mo_ta"] == DBNull.Value ? null : reader["mo_ta"].ToString(),
                        Gia = reader["gia_ap_dung"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["gia_ap_dung"]),
                        Gia_Goc = reader["gia_goc"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["gia_goc"]),
                        SoNguoiLon = reader["so_nguoi_lon"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_nguoi_lon"]),
                        SoTreEm = reader["so_tre_em"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_tre_em"]),
                        SoSao = reader["so_sao"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_sao"]),
                        SoGiuong = reader["so_giuong"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_giuong"]),
                        DSAnh = dsAnh,
                        DSTienNghi = dsTienNghi,
                        DiaChi =  reader["dia_chi"] == DBNull.Value ? null : reader["dia_chi"].ToString(),
                };
                 }
            return null;
        }
        public async Task<List<ImgRoomResponse>> GetRoomDetailImg(int idRoom)
        {
            string query = @"select *
                        from ql_hs_anh_phong
                        where phong_id = @idRoom";
            var listImg = new List<ImgRoomResponse>();  
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idRoom", idRoom);
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var img = new ImgRoomResponse()
                {
                    IdImgRoom = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),
                    Img = reader["url_anh"] == DBNull.Value ? null : Path.Combine(_configuration["localhost"], reader["url_anh"].ToString())
                }; 
                listImg.Add(img);
            } 
            return listImg;
        }
        public async Task<RoomResponse> GetRoomDetailManager(int idRoom)
        {
            string query = @"              
                                SELECT 
                                    p.id,
                                    p.ten_phong,
                                    p.loai_phong,
									p.gia_goc,
                                    p.trang_thai,
                                    p.mo_ta,
                                    p.dia_chi,
                                    p.so_nguoi_lon,
                                    p.so_tre_em,
                                    p.so_giuong,
                                    p.isDelete
                                FROM ql_hs_phong p
                                WHERE p.id = @idUser";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idUser", idRoom);
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new RoomResponse
                {
                    Id = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),
                    TenPhong = reader["ten_phong"] == DBNull.Value ? null : reader["ten_phong"].ToString(),
                    LoaiPhong = reader["loai_phong"] == DBNull.Value ? null : reader["loai_phong"].ToString(),
                    TrangThai = reader["trang_thai"] == DBNull.Value ? null : reader["trang_thai"].ToString(),
                    Mota = reader["mo_ta"] == DBNull.Value ? null : reader["mo_ta"].ToString(),
                    Gia = reader["gia_goc"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["gia_goc"]),
                    SoNguoiLon = reader["so_nguoi_lon"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_nguoi_lon"]),
                    SoTreEm = reader["so_tre_em"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_tre_em"]),
                    SoGiuong = reader["so_giuong"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_giuong"]),
                    IsDelete = reader["isDelete"] == DBNull.Value ? null : reader["isDelete"].ToString(),
                    DiaChi =  reader["dia_chi"] == DBNull.Value ? null : reader["dia_chi"].ToString(),
                };
            }
            return null;

        }
        public async Task<string> GetUrlImgById(int idImg)
        {
            string query = @"              
                             select url_anh
                             from ql_hs_anh_phong
                             where id = @idImg";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idImg", idImg);
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return reader["url_anh"] == DBNull.Value ? null : reader["url_anh"].ToString();
            }
            return null;
        }

        public async Task UpdateRoom(int id, RoomInfoRequest roomInfoRequest)
        {
            string query = @"update ql_hs_phong
                             set ten_phong = @ten_phong,
                                 loai_phong = @loai_phong,
                                 gia_goc = @gia_goc,
                                 trang_thai = @trang_thai,
                                 mo_ta = @mo_ta,
                                 so_nguoi_lon = @so_nguoi_lon,
                                 so_tre_em = @so_tre_em,
                                 so_giuong = @so_giuong,
                                 dia_chi = @dia_chi
                             where id = @id";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@ten_phong", roomInfoRequest.TenPhong);
            cmd.Parameters.AddWithValue("@loai_phong", roomInfoRequest.LoaiPhong);
            cmd.Parameters.AddWithValue("@gia_goc", roomInfoRequest.GiaGoc);
            cmd.Parameters.AddWithValue("@trang_thai", roomInfoRequest.TrangThai);
            cmd.Parameters.AddWithValue("@mo_ta", roomInfoRequest.MoTa);
            cmd.Parameters.AddWithValue("@so_nguoi_lon", roomInfoRequest.SoNguoiLon);
            cmd.Parameters.AddWithValue("@so_tre_em", roomInfoRequest.SoTreEm);
            cmd.Parameters.AddWithValue("@so_giuong", roomInfoRequest.SoGiuong);
            cmd.Parameters.AddWithValue("@dia_chi", roomInfoRequest.DiaChi);
            cmd.Parameters.AddWithValue("@id", id);

            await cmd.ExecuteNonQueryAsync();
        }

        public async Task UpdateRoomIsDelete(int id)
        {
            string query = @"
                              update ql_hs_phong
                              set isDelete = 'True'
                              where id = @idRoom";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idRoom", id);
            await cmd.ExecuteNonQueryAsync();
        }
    }
}
