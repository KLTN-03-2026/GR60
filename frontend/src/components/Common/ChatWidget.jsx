import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Loader2 } from 'lucide-react';
import { apiGetConversation, apiGetMessages } from '../../services/chatService';
import signalRService from '../../services/signalRService';

const ChatWidget = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [inputMessage, setInputMessage] = useState('');

  const getUserId = () => {
    if (!currentUser) return null;
    return currentUser.iduser || currentUser.idUser || currentUser.id || currentUser.Id || currentUser.IdUser;
  };

  // Gọi API lấy conversationId khi mở popup
  useEffect(() => {
    if (isOpen && currentUser && !conversationId && !isLoading) {
      const fetchConversation = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const idUser = getUserId();
          if (!idUser) throw new Error('Không tìm thấy thông tin ID người dùng.');
          
          const id = await apiGetConversation(idUser);
          setConversationId(id);
        } catch (err) {
          setError(err.message || 'Lỗi khi lấy thông tin trò chuyện.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchConversation();
    }
  }, [isOpen, currentUser, conversationId]);

  // Gọi API lấy messages khi đã có conversationId
  useEffect(() => {
    if (isOpen && conversationId) {
      const fetchMessages = async () => {
        setIsLoadingMessages(true);
        try {
          const idUser = getUserId();
          const data = await apiGetMessages(idUser, conversationId);
          setMessages(data || []);
        } catch (err) {
          console.error('Lỗi khi lấy tin nhắn:', err);
        } finally {
          setIsLoadingMessages(false);
        }
      };
      fetchMessages();
      
      // Khởi tạo SignalR
      const initSignalR = async () => {
        await signalRService.startConnection();
        await signalRService.joinChatRoom(conversationId);
        signalRService.onReceiveMessage((newMessage) => {
          if (newMessage.ql_cuoc_tro_chuyen_id === conversationId) {
            setMessages(prev => [newMessage, ...prev]);
          }
        });
      };
      initSignalR();
      
      return () => {
        signalRService.offReceiveMessage();
      };
    }
  }, [isOpen, conversationId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !conversationId) return;
    try {
      const idUser = getUserId();
      await signalRService.sendMessage(conversationId, idUser, inputMessage);
      setInputMessage('');
    } catch (err) {
      console.error('Lỗi khi gửi tin nhắn:', err);
    }
  };

  if (!currentUser) return null;

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    return date.toLocaleString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Popup */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-[#2D3E35] p-4 text-white flex justify-between items-center">
            <div>
              <h3 className="font-serif font-bold text-lg">Chăm sóc khách hàng</h3>
              <p className="text-white/70 text-xs">Chúng tôi có thể giúp gì cho bạn?</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="h-96 flex flex-col bg-gray-50/50 p-4 relative">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-gray-500 font-medium">Đang kết nối...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-3">
                  <X className="w-6 h-6" />
                </div>
                <p className="text-sm text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => setConversationId(null)}
                  className="px-4 py-2 bg-primary text-white rounded-full text-xs font-bold hover:bg-primary/90 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            ) : conversationId ? (
              <div className="flex-1 overflow-y-auto space-y-4 flex flex-col-reverse pr-2">
                {isLoadingMessages ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-xs text-gray-400">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMyMessage = msg.id_User === getUserId();
                    return (
                      <div 
                        key={msg.id_Message} 
                        className={`flex items-end gap-2 max-w-[85%] ${isMyMessage ? 'ml-auto flex-row-reverse' : ''}`}
                      >
                        {!isMyMessage && (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-primary font-bold text-[10px]">CS</span>
                          </div>
                        )}
                        <div className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
                          <div 
                            className={`px-4 py-2.5 shadow-sm text-sm ${
                              isMyMessage 
                                ? 'bg-primary text-white rounded-2xl rounded-tr-sm' 
                                : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'
                            }`}
                          >
                            <p className="leading-relaxed">{msg.noi_Dung}</p>
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1 px-1">
                            {formatTime(msg.thoi_Gian)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-400">Không có dữ liệu</p>
              </div>
            )}

            {/* Input area */}
            <div className="mt-4 flex gap-2">
              <input 
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Nhập tin nhắn..." 
                className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                disabled={isLoading || error}
              />
              <button 
                onClick={handleSendMessage}
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 hover:bg-primary/90 disabled:opacity-50 transition-colors"
                disabled={isLoading || error || !inputMessage.trim()}
              >
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'} text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:scale-105 hover:-translate-y-1 transition-all duration-300 z-50`}
      >
        {isOpen ? (
          <X className="w-6 h-6 animate-in zoom-in duration-300" />
        ) : (
          <MessageCircle className="w-6 h-6 animate-in zoom-in duration-300" />
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
