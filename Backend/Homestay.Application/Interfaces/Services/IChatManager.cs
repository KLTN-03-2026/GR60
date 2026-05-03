using Homestay.Application.DTOS.Chats;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Services
{
    public interface IChatManager
    {
        public Task CreateMessage(MessageRepsonse newMsg);
        public Task DeleteConversation(int idConversation);
        public Task<List<ConversationResponse>> GetAllConversation();
    }
}
