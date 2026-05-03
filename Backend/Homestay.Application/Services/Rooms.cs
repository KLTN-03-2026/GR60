using Homestay.Application.DTOS.Rooms;
using Homestay.Application.Interfaces;
using Homestay.Application.Interfaces.Repositories;
using Homestay.Application.Interfaces.Services;
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


        public Rooms(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;

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

        public async Task<List<RoomResponse>> GetAllRoomsTypeAsync(string type)
        {
            var rooms_type = await _unitOfWork.RoomsRepository.GetAllRoomsTypeAsync(type);
            return rooms_type;
        }

        public async Task<RoomResponse> GetRoomDetailAsync(int id)
        {

            var room = await _unitOfWork.RoomsRepository.GetRoomDetailAsync(id);
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
                DSAnh = room.DSAnh,
                SoGiuong = room.SoGiuong,
                DSTienNghi = room.DSTienNghi
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
    }
}
