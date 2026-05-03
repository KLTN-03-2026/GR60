using Homestay.Application.DTOS;
using Homestay.Application.DTOS.Chats;
using Homestay.Application.DTOS.Users;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Services
{
    public interface IUser
    {
        public Task<CommonResponse> ChangePassAsync(int idUser,ChangePassRequest changePassRequest);
        public Task<int> GetConversationByUser(int idUser);
        public Task<List<MessageResponse>> GetMessageUser(int idConversation);
        public Task<CommonResponse> UpdateAvatar(int idUser, IFormFile annh);
        public Task<CommonResponse> UpdateEmailUser(int idUser, string email);
        public Task<CommonResponse> UpdateUser(int idUser, InfoUpdateUser infoUpdateUser);
    }
}
