using Homestay.Application.DTOS;
using Homestay.Application.DTOS.Users;
using Homestay.Application.Interfaces;
using Homestay.Application.Interfaces.Services;
using Homestay.Application.Static;
using Homestay.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Services
{
    public class User : IUser
    {
        private IUnitOfWork _unitOfWork;
        public User(IUnitOfWork unitOfWork) 
        {

            _unitOfWork = unitOfWork;   
        }   
        public async Task<CommonResponse> ChangePassAsync(int idUser, ChangePassRequest changePassRequest)
        {
            var checkOldPass = await _unitOfWork.UserRepository.checkOldPass(changePassRequest.Old_Pass, idUser);
            if(checkOldPass == null|| checkOldPass.id == 0)
            {
                return new CommonResponse
                {
                    StatusCode = 400,
                    Message = "Mật khẩu cũ của bạn không đúng"
                };
            }
            if (!CLassStatic.checkMk(changePassRequest.New_Pass))
            {
                return new CommonResponse
                {
                    StatusCode = 400,
                    Message  = "Mật khẩu mới không hợp lệ"
                };
            }
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.UserRepository.UpdateNewPass(idUser.ToString(), changePassRequest.New_Pass);
                _unitOfWork.Commit();
                return new CommonResponse
                {
                    StatusCode = 200,
                    Message = "Đổi mật khẩu thành công"
                };
            }
            catch
            {
                _unitOfWork.Rollback(); 
                return new CommonResponse
                {
                    StatusCode = 500,
                    Message = "Lỗi hệ thống"
                };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }

        public async Task<CommonResponse> CreateUser(CreateUserManagerRequest createUserManagerRequest)
        {
            var checkEmail = await _unitOfWork.UserRepository.CheckUserRegisterExistsAsync(createUserManagerRequest.Email);
            if (checkEmail)
            {
                return new CommonResponse
                {
                    StatusCode = 400,
                    Message = "Email đã có trong hệ thống"
                };
            }
            if (!CLassStatic.checkMk(createUserManagerRequest.Mat_Khau))
            {
                return new CommonResponse
                {
                    StatusCode = 400,
                    Message = "Mật khẩu không phù hợp"
                };
            }

            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.UserRepository.CreateUser(createUserManagerRequest);
                _unitOfWork.Commit();
                return new CommonResponse
                {
                    StatusCode = 201,
                    Message = "Thêm người dùng thành công"
                };
            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse
                {
                    StatusCode = 400,
                    Message = "Thêm người dùng thất bại"
                };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }

        public async Task<List<UsersEntities>> GetAllUser()
        {
            var result = await _unitOfWork.UserRepository.GetAllUser();
            return result;
        }

        public async Task<int> GetConversationByUser(int idUser)
        {
            var result = await _unitOfWork.conversationRepository.GetIDConversationByUser(idUser);
            if(result == 0)
            {
                _unitOfWork.BeginTransaction();
                try
                {
                    var idConversation = await _unitOfWork.conversationRepository.CreateConversation(idUser);
                    _unitOfWork.Commit();
                    return idConversation;
                } 
                catch
                {
                    _unitOfWork.Rollback();
                    return 0;
                }
                finally 
                { 
                    _unitOfWork.Dispose();
                }
            }
            else
            {
                return result;
            }
        }

        public async Task<List<MessageResponse>> GetMessageUser(int idConversation)
        {
            var result = await _unitOfWork.conversationRepository.GetListMessage(idConversation);
            return result;
        }

        public async Task<CommonResponse> UpdateAvatar(int idUser, IFormFile annh)
        {
            var fileName = "";
            if(annh != null)
            {
                var folder = "avatar";
                var avatar = await CLassStatic.UploadImg(annh, folder);
                fileName = Path.Combine(folder, avatar);
            }
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.UserRepository.UploadsAnh(idUser, fileName);
                _unitOfWork.Commit();
                return new CommonResponse
                {
                    StatusCode = 200,
                    Message = "thay đổi ảnh thành công"
                };
            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse
                {
                    StatusCode = 500,
                    Message = "Lỗi hệ thống"
                };
            }
            finally
            {
                _unitOfWork.Dispose();
            }

        }
        public async Task<CommonResponse> UpdateEmailUser(int idUser, string email)
        {
            var checkEmail = await _unitOfWork.UserRepository.CheckUserRegisterExistsAsync(email);
            if (string.IsNullOrEmpty(email)|| email.Trim() == "")
            {
                return new CommonResponse
                {
                    StatusCode = 400,
                    Message = "email rỗng"
                };
            }
            if (checkEmail)
            {
                return new CommonResponse
                {
                    StatusCode = 400,
                    Message = "trùng email"
                };
            }
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.UserRepository.UpdateEmailUser(idUser, email);
                _unitOfWork.Commit();
                return new CommonResponse
                {
                    StatusCode = 200,
                    Message = "Thay đổi thành công"
                };
            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse
                {
                    StatusCode = 500,
                    Message = "Lỗi hệ thống"
                };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }

        public async Task<CommonResponse> UpdateIsdelete(int idUser)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.UserRepository.UpdateIsdelete(idUser);
                _unitOfWork.Commit();
                return new CommonResponse
                {
                    StatusCode = 200,
                    Message = "người dùng đã xóa thành công"
                };
            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse
                {
                    StatusCode = 400,
                    Message = "Người dùng xóa thất bại"
                };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }

        public async Task<CommonResponse> UpdateUser(int idUser, InfoUpdateUser infoUpdateUser)
        {
             var a = infoUpdateUser.SDT.Trim();

            if(string.IsNullOrEmpty(infoUpdateUser.SDT)|| a =="")
            {
                return new CommonResponse
                {
                    StatusCode = 400,
                    Message = "không được để trống sdt"
                };
            }
            _unitOfWork.BeginTransaction();
            try
            {
                var result = new UsersEntities
                {
                    id = idUser,
                    Name = infoUpdateUser.Name,
                    Email = infoUpdateUser.Email,
                    SDT = infoUpdateUser.SDT,
                    Diachi = infoUpdateUser.Diachi,
                    NgaySinh = infoUpdateUser.NgaySinh,
                };
                await _unitOfWork.UserRepository.UpdateUser(result);
                _unitOfWork.Commit();
                return new CommonResponse
                {
                    StatusCode = 200,
                    Message = "Thay Đổi thông tin thành công"
                };
            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse
                {
                    StatusCode = 500,
                    Message = "Lỗi hệ thống"
                };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }
    }
}
