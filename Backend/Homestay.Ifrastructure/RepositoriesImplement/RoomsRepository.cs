using Homestay.Application.DTOS.Rooms;
using Homestay.Application.Interfaces.Repositories;
using Homestay.Ifrastructure.Data;
using Microsoft.Data.SqlClient;
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
        public RoomsRepository(DBFactory dBFactory) 
        {
            _dBFactory = dBFactory;
        }
        public async Task<List<RoomResponse>> GetAllRoomsTypeAsync(string type)
        {
            string query =
              "WITH GiaMoiNhat AS(SELECT ql_phong_id, gia_ap_dung, ngay_ap_dung, ROW_NUMBER() OVER (PARTITION BY ql_phong_id ORDER BY ngay_ap_dung DESC) as rn FROM ql_hs_gia_ap_dung),"+
              "DanhGiaTrungBinh AS(SELECT ql_phong_id, AVG(CAST(so_sao AS FLOAT)) AS so_sao_tb FROM ql_hs_danh_gia GROUP BY ql_phong_id)," +
              "anhPhong1 as (SELECT phong_id, url_anh, ROW_NUMBER() OVER(PARTITION BY phong_id ORDER BY id ASC) as rn FROM ql_hs_anh_phong)" +
              "SELECT P.id, ROUND(dg.so_sao_tb, 1) AS so_sao, p.ten_phong, ap.url_anh,g.gia_ap_dung,p.mo_ta,p.so_nguoi_lon,p.so_tre_em FROM ql_hs_phong p " +
              "LEFT JOIN GiaMoiNhat g ON p.id = g.ql_phong_id AND g.rn = 1 " +
              "LEFT JOIN DanhGiaTrungBinh dg ON p.id = dg.ql_phong_id " +
              "LEFT JOIN anhPhong1 ap ON p.id = ap.phong_id and ap.rn = 1"+
             " WHERE p.loai_phong like @Type";
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
                query += "and P.dia_chi COLLATE SQL_Latin1_General_CP1_CI_AI LIKE @DiaChi ";
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
                cmd.Parameters.AddWithValue("@DiaChi", $"%{findRoomRequest.DiaChi}%");
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
                                        ql_phong_id,
                                        STRING_AGG(ten_tien_nghi, ', ') AS ds_tien_nghi
                                    FROM ql_hs_tien_nghi
                                    GROUP BY ql_phong_id
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
                                    ON p.id = tn.ql_phong_id
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
                    dsAnh = reader["ds_anh"].ToString().Split(';').ToList();
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
                        SoNguoiLon = reader["so_nguoi_lon"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_nguoi_lon"]),
                        SoTreEm = reader["so_tre_em"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_tre_em"]),
                        SoSao = reader["so_sao"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_sao"]),
                        SoGiuong = reader["so_giuong"] == DBNull.Value ? 0 : Convert.ToInt32(reader["so_giuong"]),
                        DSAnh = dsAnh,
                        DSTienNghi = dsTienNghi
                 };
                 }
            return null;
        }   
    }
}
