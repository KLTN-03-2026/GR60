using Homestay.Application.DTOS;
using Homestay.Application.DTOS.HoLiday;
using Homestay.Application.Interfaces;
using Homestay.Application.Interfaces.Repositories;
using Homestay.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Services
{
    public class Holiday : Iholiday
    {
        private IUnitOfWork _unitOfWork;
        public Holiday (IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<CommonResponse> CreateHoliday(HolidayRequest createHolidayRequest)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.HolidaysRepository.CreateHoliday(createHolidayRequest);
                _unitOfWork.Commit();
                return new CommonResponse()
                {
                    StatusCode = 201,
                    Message = "thêm ngày lễ thành công"
                };
            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse()
                {
                    StatusCode = 400,
                    Message = "thêm ngày lễ thất bại"
                };
            }
            finally { _unitOfWork.Dispose(); }
            
        }

        public async Task<CommonResponse> DeleteHoliday(int idHoliday)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.HolidaysRepository.DeleteHoliday(idHoliday);
                _unitOfWork.Commit();
                return new CommonResponse()
                {
                    StatusCode = 204,
                    Message = "Xóa ngày lễ thành công"
                };
            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse()
                {
                    StatusCode = 400,
                    Message = "Xóa ngày lễ thất bại"
                };
            }
            finally { _unitOfWork.Dispose(); }
        }
        public async Task<List<HolidayResponse>> GetAllHoliday()
        {
            var result = await _unitOfWork.HolidaysRepository.GetAllHoliday();
            return result;
        }

        public async Task<CommonResponse> UpdateHoliday(int idHoliday, HolidayRequest createHolidayRequest)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.HolidaysRepository.UpdateHoliday(idHoliday,createHolidayRequest);
                _unitOfWork.Commit();
                return new CommonResponse()
                {
                    StatusCode = 201,
                    Message = "Sửa ngày lễ thành công"
                };
            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse()
                {
                    StatusCode = 400,
                    Message = "Sửa ngày lễ thất bại"
                };
            }
            finally { _unitOfWork.Dispose(); }

        }
    }
}
