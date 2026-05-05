using Homestay.Application.DTOS;
using Homestay.Application.DTOS.Amenities;
using Homestay.Application.Interfaces;
using Homestay.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Services
{
    public class Amenities : IAmenities
    {
        private IUnitOfWork _unitOfWork;
        public Amenities(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<CommonResponse> CreateDAmenity(AmenitiesRequest amenitiesRequest)
        {
            var result = await _unitOfWork.amenitiesRepository.GetListAmenities();
                if (result.Any(x => x.Ten_Tien_Nghi.ToLower() == amenitiesRequest.Ten_Tien_Nghi.ToLower()))
                {
                    return new CommonResponse
                    {
                        StatusCode = 400,
                        Message = "Tiện nghi đã tồn tại trong hệ thống"
                    };
            }
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.amenitiesRepository.CreateDAmenity(amenitiesRequest);
                _unitOfWork.Commit();
                return new CommonResponse
                {
                    StatusCode = 201,
                    Message = "Thêm tiện nghi vào hệ thống thành công"
                };
            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse
                {
                    StatusCode = 400,
                    Message = "Thêm tiện nghi vào hệ thống thất bại"
                };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }

        public async Task<CommonResponse> CreateRoomDetailAmenities(int idRoom, AmenitiesByRoomRequest amenitiesByRoomRequest)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.amenitiesRepository.CreateRoomDetailAmenities(idRoom, amenitiesByRoomRequest);
                _unitOfWork.Commit();
                return new CommonResponse
                {
                    StatusCode = 200,
                    Message = "thêm tiện nghi thành công"
                };
            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse
                {
                    StatusCode = 400,
                    Message = "Phòng đã có tiện nghi"
                };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }

        public async Task<CommonResponse> DeleteAmenity(int id)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.amenitiesRepository.DeleteRoomAmenities(id);
                _unitOfWork.Commit();
                return new CommonResponse
                {
                    StatusCode = 200,
                    Message = "Xóa tiện nghi ra khỏi hệ thông thành công"
                };
            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse
                {
                    StatusCode = 400,
                    Message = "Xóa tiện nghi thất bại"
                };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }

        public async Task<CommonResponse> DeleteRoomDetailAmenities(int idRoom, int idTienNghi)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.amenitiesRepository.DeleteRoomAmenities(idRoom, idTienNghi);
                _unitOfWork.Commit();
                return new CommonResponse
                {
                    StatusCode = 200,
                    Message = "Xóa tiện nghi thành công"
                };
            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse
                {
                    StatusCode = 400,
                    Message = "Xóa tiện nghi thất bại"
                };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }

        public async Task<List<AmenitiesByRoomResponse>> GetAmenitiesByRoom(int idRoom)
        {
            var result = await _unitOfWork.amenitiesRepository.GetAmenitiesByRoom(idRoom);
            return result;
        }

        public async Task<List<AmenitiesResponse>> GetListAmenities()
        {
            var result = await _unitOfWork.amenitiesRepository.GetListAmenities();
            return result;
        }

        public async Task<CommonResponse> UpdateAmenity(int id, AmenitiesRequest amenitiesRequest)
        {
            //var result = await _unitOfWork.amenitiesRepository.GetListAmenities();
            //if (result.Any(x => x.Ten_Tien_Nghi.ToLower() == amenitiesRequest.Ten_Tien_Nghi.ToLower()))
            //{
            //    return new CommonResponse
            //    {
            //        StatusCode = 400,
            //        Message = "Tiện nghi đã tồn tại trong hệ thống"
            //    };
            //}
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.amenitiesRepository.UpdateAmenity(id, amenitiesRequest);
                _unitOfWork.Commit();
                return new CommonResponse
                {
                    StatusCode = 200,
                    Message = "Cập nhật tiện nghi thành công"
                };
            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse
                {
                    StatusCode = 400,
                    Message = "Cập nhật tiện nghi thất bại"
                };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }
    }
}
