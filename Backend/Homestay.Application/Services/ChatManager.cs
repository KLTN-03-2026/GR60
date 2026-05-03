using Homestay.Application.DTOS.Chats;
using Homestay.Application.Interfaces;
using Homestay.Application.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Services
{
    public class ChatManager : IChatManager
    {
        private IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public ChatManager (IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }
        public async Task<List<ConversationResponse>> GetAllConversation()
        {
           var result = await _unitOfWork.conversationRepository.GetAllConversation();
           List < ConversationResponse > list = new List<ConversationResponse> ();
            foreach (var conversation in result) 
            {
                var conversationResponse = new ConversationResponse()
                {

                    id_Conversation = conversation.id_Conversation,
                    id_User = conversation.id_User,
                    Name_User = conversation.Name_User,
                    Trang_Thai = conversation.Trang_Thai,
                    New_Message = conversation.New_Message,
                    thoi_Gian = conversation.thoi_Gian,
                    Anh_Dai_Dien = (conversation.Anh_Dai_Dien == null || conversation.Anh_Dai_Dien == "") ? null : Path.Combine(_configuration["localhost"], conversation.Anh_Dai_Dien)
                };
                list.Add(conversationResponse);
                
            }
            return list;
        }

        public async Task CreateMessage(MessageRepsonse newMsg)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.conversationRepository.CreateMessage(newMsg);
                _unitOfWork.Commit();
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

        public async Task DeleteConversation(int idConversation)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.conversationRepository.DeleteConversation(idConversation);
                _unitOfWork.Commit();
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
