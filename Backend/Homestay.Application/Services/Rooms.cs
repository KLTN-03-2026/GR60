using Homestay.Application.DTOS;
using Homestay.Application.DTOS.Rooms;
using Homestay.Application.DTOS.Users;
using Homestay.Application.Interfaces;
using Homestay.Application.Interfaces.Repositories;
using Homestay.Application.Interfaces.Services;
using Homestay.Application.Static;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Services
{
    public class Rooms : IRooms
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public Rooms(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        public async Task<List<RoomResponse>> FindRoomAsync(FindRoomRequest findRoomRequest)
        {
            var rooms_type = await _unitOfWork.RoomsRepository.GetRoomByFindAsync(findRoomRequest);
            if(rooms_type == null|| rooms_type.Count() == 0)
            {
                return null;
            }
            return rooms_type;
        }

        public async Task<List<RoomResponse>> GetAllRooms()
        {
            var result = await _unitOfWork.RoomsRepository.GetAllRooms();
            return result;
        }

        public async Task<List<RoomResponse>> GetAllRoomsTypeAsync(string type)
        {
            var rooms_type = await _unitOfWork.RoomsRepository.GetAllRoomsTypeAsync(type);
            return rooms_type;
        }

        public Task<RoomResponse> GetRoomDetailManager(int idRoom)
        {
            var room = _unitOfWork.RoomsRepository.GetRoomDetailManager(idRoom);
            return room;
        }

        public async Task<RoomResponse> GetRoomDetailAsync(int id)
        {

            var room = await _unitOfWork.RoomsRepository.GetRoomDetailAsync(id);
            var listImg = new List<string>();
            foreach(var item in room.DSAnh)
            {
                var anh = Path.Combine(Path.Combine(_configuration["localhost"], item));
                listImg.Add(anh);
            }
            return new RoomResponse
            {
                Id = room.Id,
                TenPhong = room.TenPhong,
                LoaiPhong = room.LoaiPhong,
                TrangThai = room.TrangThai,
                Mota = room.Mota,
                SoNguoiLon = room.SoNguoiLon,
                SoTreEm = room.SoTreEm,
                SoSao = room.SoSao,
                DSAnh = listImg,
                SoGiuong = room.SoGiuong,
                DSTienNghi = room.DSTienNghi,
                DiaChi = room.DiaChi,
            };
        }

        public async Task<RoomPriceResponse> GetRoomPriceAsync(int id, RoomDetailRequest roomDetailRequest)
        {
            var room = await _unitOfWork.RoomsRepository.GetRoomDetailAsync(id);
            var holiday = await _unitOfWork.HolidaysRepository.GetHolidayByDateAsync(roomDetailRequest.NgayNhanPhong, roomDetailRequest.NgayTraPhong);
            bool checkDay = (roomDetailRequest.NgayNhanPhong.Date - DateTime.Now.Date).TotalDays >= 60;
            decimal totalPrice = 0;
            decimal totalPriceEarly = 0;


            for (DateTime date = roomDetailRequest.NgayNhanPhong; date < roomDetailRequest.NgayTraPhong; date = date.AddDays(1))
            {
                var price = room.Gia;
                var holidayDetail = holiday.FirstOrDefault(h => h.HolidayStart <= date && h.HolidayEnd >= date);
                if (holidayDetail != null)
                {
                    price = room.Gia * holidayDetail.He_so;
                }
                else
                {
                    price = room.Gia;
                }
                totalPrice += price;
            }
            var discount = 0.1;
            if (checkDay)
            {
                totalPriceEarly = totalPrice - totalPrice * Convert.ToDecimal(discount);
                return  new RoomPriceResponse
                {
                    Gia = totalPrice,
                    GiaDatLichSom = totalPriceEarly
                };
            }
            
            return new RoomPriceResponse
            {
                Gia = totalPrice,
                GiaDatLichSom = totalPrice
            };
        }

        public async Task<List<ImgRoomResponse>> GetRoomDetailImg(int idRoom)
        {
            var ListImg = await _unitOfWork.RoomsRepository.GetRoomDetailImg(idRoom);
            return ListImg;
        }

        public async Task<CommonResponse> AddRoomDetailImg(int idRoom, IFormFile fileAnh)
        {
            if(fileAnh == null)
            {
                return new CommonResponse()
                {
                    StatusCode = 400,
                    Message = "không có ảnh",
                };
            }
            var folder = "ImgRoom";
            var fileName = await CLassStatic.UploadImg(fileAnh, folder);
            var pathImg = Path.Combine(folder, fileName);

            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.RoomsRepository.CreateRoomImg(idRoom, pathImg);
                _unitOfWork.Commit();
                return new CommonResponse
                {
                    StatusCode = 201,
                    Message = "Thêm ảnh thành công"
                };
            }
            catch(Exception ex) 
            {
                _unitOfWork.Rollback();
                return new CommonResponse
                {
                    StatusCode = 400,
                    Message = "Thêm ảnh thất bại"
                };
            }
            finally
            {
                _unitOfWork.Dispose();
            }



            throw new NotImplementedException();
        }

        public async Task<CommonResponse> DeleteRoomDetailImg(int idImg)
        {
            var urlAnhOld = await _unitOfWork.RoomsRepository.GetUrlImgById(idImg);

            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.RoomsRepository.DeleteRoomDetailImg(idImg);
                _unitOfWork.Commit();
                CLassStatic.DeleteFileImg(urlAnhOld, "ImgRoom");
                return new CommonResponse
                {
                    StatusCode = 200,
                    Message = "xóa ảnh thành công"
                };
            }
            catch (Exception ex)
            {
                _unitOfWork.Rollback();
                return new CommonResponse
                {
                    StatusCode = 400,
                    Message = "xóa ảnh thất bại"
                };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }
    }
}
