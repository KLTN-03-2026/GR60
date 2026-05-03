using Homestay.Application.DTOS.Chats;
using Homestay.Application.DTOS.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Repositories
{
    public interface IConversationRepository
    {
        public Task<int> CreateConversation(int idUser);
        public Task CreateMessage(MessageRepsonse newMsg);
        Task DeleteConversation(int idConversation);
        public Task<List<ConversationResponse>> GetAllConversation();
        public Task<int> GetIDConversationByUser(int idUser);
        public Task<List<MessageResponse>> GetListMessage(int idConversation);
    }
}
