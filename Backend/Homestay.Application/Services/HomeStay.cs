using Homestay.Application.DTOS.HomeStay;
using Homestay.Application.Interfaces;
using Homestay.Application.Interfaces.Services;
using Homestay.Application.Static;
using Homestay.Domain.Entities;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Services
{
    public class HomeStay : IHomeStay
    {
        private IUnitOfWork _unitOfWork;
        private IConfiguration? _configuration;
        public HomeStay(IUnitOfWork unitOfWork,IConfiguration? configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }
        public async Task<HomeStayEntities> GetHomestay()
        {
            var result =  await _unitOfWork.homeStayRepository.GetInfoHomeStay();
            return new HomeStayEntities
            {
                Id = result.Id,
                Ten_Home = result.Ten_Home,
                Mo_Ta = result.Mo_Ta,
                Dia_Chi = result.Dia_Chi,
                SDT = result.SDT,
                Email_Home = result.Email_Home,
                Anh = Path.Combine(_configuration["localhost"], result.Anh),
                QR_Code = Path.Combine(_configuration["localhost"], result.QR_Code),
                MoMo = Path.Combine(_configuration["localhost"], result.MoMo),
            };
        }

        public async Task UpdateInfoHomeStay(HomeStayRequest homeStayRequest)
        {
            var ListAnh = await _unitOfWork.homeStayRepository.GetInfoHomeStay();
            var nameAnh = await  CLassStatic.UploadImg(homeStayRequest.Anh, "HomeImg");
            var nameQr_code = await CLassStatic.UploadImg(homeStayRequest.QR_Code, "HomeImg");
            var nameMOMO = await CLassStatic.UploadImg(homeStayRequest.MoMo, "HomeImg");
            var anh = Path.Combine("HomeImg", nameAnh);
            var anhQr = Path.Combine("HomeImg", nameQr_code);
            var anhMoMo = Path.Combine("HomeImg", nameMOMO);
            var homeStay = new HomeStayEntities()
            {
                Anh = anh,
                Dia_Chi = homeStayRequest.Dia_Chi,
                Email_Home = homeStayRequest.Email_Home,
                Ten_Home = homeStayRequest.Ten_Home,
                Mo_Ta = homeStayRequest.Mo_Ta,
                SDT = homeStayRequest.SDT,
                QR_Code = anhQr,
                MoMo = anhMoMo
            };
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.homeStayRepository.UpdateInfoHomeStay(homeStay);
                _unitOfWork.Commit();
                CLassStatic.DeleteFileImg(ListAnh.Anh, "HomeImg");
                CLassStatic.DeleteFileImg(ListAnh.QR_Code, "HomeImg");
                CLassStatic.DeleteFileImg(ListAnh.MoMo, "HomeImg");
            }
            catch
            {
                _unitOfWork.Rollback();
            }
            finally 
            {
                _unitOfWork.Dispose();
            }
        }
    }
}
