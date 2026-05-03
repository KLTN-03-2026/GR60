import React, { useState, useEffect } from 'react';
import MainLayout from '../Layout/MainLayout';
import AdminLayout from './AdminLayout';
import { Search, Plus, Image as ImageIcon, Smile, Send, MoreVertical, Phone, Video, Loader2, MessageSquare, Trash2, ArrowLeft } from 'lucide-react';
import { apiGetAdminConversations, apiGetMessages, apiDeleteConversation } from '../../services/chatService';
import signalRService from '../../services/signalRService';

const AdminChat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatActiveOnMobile, setIsChatActiveOnMobile] = useState(false);

  const getAdminId = () => {
    try {
      const userStr = localStorage.getItem('homestayUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.iduser || user.idUser || user.id || user.Id || user.IdUser;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const formatTime = (timeStr) => {
    if (!timeStr || timeStr === '0001-01-01T00:00:00') return '';
    const date = new Date(timeStr);
    return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
  };

  const parseAvatar = (url, name) => {
    if (!url) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random`;
    let formatted = url.replace(/\\/g, '/');
    if (formatted.includes('http') && formatted.lastIndexOf('http') > 0) {
      formatted = formatted.substring(formatted.lastIndexOf('http'));
    }
    return formatted;
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await apiGetAdminConversations();
        const dataArray = Array.isArray(data) ? data : [];
        const transformedData = dataArray.map(conv => ({
          id: conv.id_Conversation,
          userId: conv.id_User,
          name: conv.name_User || 'Người dùng',
          preview: conv.new_Message || 'Chưa có tin nhắn',
          time: formatTime(conv.thoi_Gian),
          unread: false,
          active: false,
          avatar: parseAvatar(conv.anh_Dai_Dien, conv.name_User)
        }));
        setConversations(transformedData);
        if (transformedData.length > 0) {
          setActiveConv(transformedData[0]);
        }
      } catch (err) {
        console.error('Lỗi khi lấy danh sách chat:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Lấy tin nhắn khi chọn conversation
  useEffect(() => {
    if (activeConv) {
      const fetchMessages = async () => {
        setIsLoadingMessages(true);
        try {
          const data = await apiGetMessages(activeConv.userId, activeConv.id);
          setMessages(Array.isArray(data) ? data : []);
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
        await signalRService.joinChatRoom(activeConv.id);
        signalRService.onReceiveMessage((newMessage) => {
          if (newMessage.ql_cuoc_tro_chuyen_id === activeConv.id) {
            setMessages(prev => [newMessage, ...prev]);
            
            // Cập nhật preview của danh sách bên trái
            setConversations(prevConvs => prevConvs.map(c => {
              if (c.id === activeConv.id) {
                return { ...c, preview: newMessage.noi_Dung, time: formatTime(newMessage.thoi_Gian) };
              }
              return c;
            }));
          } else {
            // Có tin nhắn ở phòng khác (nếu backend support gửi broadcast)
            setConversations(prevConvs => prevConvs.map(c => {
              if (c.id === newMessage.ql_cuoc_tro_chuyen_id) {
                return { ...c, unread: true, preview: newMessage.noi_Dung, time: formatTime(newMessage.thoi_Gian) };
              }
              return c;
            }));
          }
        });
      };
      initSignalR();
      
      return () => {
        signalRService.offReceiveMessage();
      };
    } else {
      setMessages([]);
    }
  }, [activeConv]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeConv) return;
    try {
      const adminId = getAdminId();
      await signalRService.sendMessage(activeConv.id, adminId, inputMessage);
      setInputMessage('');
    } catch (err) {
      console.error('Lỗi khi gửi tin nhắn:', err);
    }
  };

  const handleSelectConv = (conv) => {
    setActiveConv(conv);
    setIsChatActiveOnMobile(true);
  };

  const handleDeleteConversation = async () => {
    if (!activeConv) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa cuộc trò chuyện này không?')) return;
    
    try {
      await apiDeleteConversation(activeConv.id);
      setConversations(prev => prev.filter(c => c.id !== activeConv.id));
      setActiveConv(null);
      setMessages([]);
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: 'Xóa tin nhắn thành công', type: 'success' } 
      }));
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: { message: 'Lỗi khi xóa cuộc trò chuyện', type: 'error' } 
      }));
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout forceScrolled={true} requireAuth={true} hideFooter={true}>
      <AdminLayout>
        <div className="flex h-full w-full bg-white relative">
        
        {/* Left Column: Conversation List */}
        <div className={`w-full md:w-[320px] flex-shrink-0 border-r border-gray-200/60 flex flex-col h-full bg-white ${isChatActiveOnMobile ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 pb-4">
            <h3 className="font-serif text-xl font-bold text-[#1A251F] mb-4">Trò chuyện</h3>
            
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#2D3E35] focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-1.5 bg-[#2D3E35] text-white text-sm font-medium rounded-full shadow-sm">
                Tất cả
              </button>
              <button className="px-4 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium rounded-full transition-colors">
                Chưa đọc
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-400">Không tìm thấy cuộc trò chuyện nào.</div>
            ) : (
              filteredConversations.map((conv) => (
                <div 
                  key={conv.id}
                  onClick={() => handleSelectConv(conv)}
                  className={`flex gap-3 p-4 cursor-pointer transition-colors border-l-4 ${
                    activeConv?.id === conv.id 
                      ? 'border-[#2D3E35] bg-[#FDFBF7]' 
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="relative">
                    <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover" />
                    {conv.unread && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-[#1A251F] text-[15px] truncate">{conv.name}</h4>
                      <span className="text-[11px] text-gray-400 flex-shrink-0">{conv.time}</span>
                    </div>
                    <p className={`text-sm truncate ${conv.unread ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                      {conv.preview}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Middle Column: Chat Window */}
        <div className={`flex-1 flex flex-col h-full bg-[#FDFBF7] relative ${!isChatActiveOnMobile ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Chat Header */}
          {activeConv ? (
            <>
              <div className="h-[72px] px-6 border-b border-gray-200/50 flex items-center justify-between bg-white/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsChatActiveOnMobile(false)}
                    className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <img src={activeConv.avatar} alt={activeConv.name} className="w-10 h-10 rounded-full object-cover" />
                  <h3 className="font-bold text-[#1A251F] text-lg">{activeConv.name}</h3>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <button className="hover:text-gray-600"><Phone size={20} /></button>
                  <button className="hover:text-gray-600"><Video size={20} /></button>
                  <button 
                    onClick={handleDeleteConversation}
                    className="hover:text-red-500 transition-colors"
                    title="Xóa cuộc trò chuyện"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col-reverse">
            {isLoadingMessages ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <p>Chưa có tin nhắn nào</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isAdmin = msg.id_User !== activeConv.userId;
                
                return (
                  <div 
                    key={msg.id_Message || index} 
                    className={`flex gap-3 max-w-[75%] ${isAdmin ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    {!isAdmin && (
                      <div className="w-8 flex-shrink-0">
                        <img src={activeConv.avatar} alt={activeConv.name} className="w-8 h-8 rounded-full object-cover mt-auto" />
                      </div>
                    )}
                    
                    <div className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                      <div 
                        className={`px-5 py-3 shadow-sm ${
                          isAdmin 
                            ? 'bg-[#2D3E35] text-white rounded-2xl rounded-tr-sm' 
                            : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-100'
                        }`}
                      >
                        <p className="text-[15px] leading-relaxed">{msg.noi_Dung}</p>
                      </div>
                      <span className="text-[11px] text-gray-400 mt-1.5 px-1">{formatTime(msg.thoi_Gian)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Chat Input */}
          <div className="p-6 bg-transparent">
            <div className="flex items-center gap-3 bg-[#EAE6DF] rounded-full p-2 pr-2.5">
              <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded-full hover:bg-black/5 transition-colors">
                <Plus size={20} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded-full hover:bg-black/5 transition-colors">
                <ImageIcon size={20} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded-full hover:bg-black/5 transition-colors">
                <Smile size={20} />
              </button>
              
              <input 
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Nhập tin nhắn..." 
                className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 px-2 placeholder-gray-400"
              />
              
              <button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="w-11 h-11 flex items-center justify-center bg-[#2D3E35] text-white rounded-full hover:bg-[#1A251F] transition-colors shadow-md disabled:opacity-50"
              >
                <Send size={18} className="ml-1" />
              </button>
            </div>
          </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
              <p>Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          )}

        </div>

        {/* Right Column: User Profile */}
        {activeConv ? (
          <div className="hidden xl:flex w-[280px] flex-shrink-0 border-l border-gray-200/60 bg-white flex-col items-center py-10 px-6">
            <div className="w-24 h-24 rounded-full p-1 border-2 border-gray-200 mb-4">
              <img 
                src={activeConv.avatar} 
                alt={activeConv.name} 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h3 className="font-bold text-[#1A251F] text-lg text-center leading-tight mb-1">
              {activeConv.name}
            </h3>
            <p className="text-sm text-gray-500 mb-8">Khách hàng</p>
          </div>
        ) : (
          <div className="hidden xl:block w-[280px] flex-shrink-0 border-l border-gray-200/60 bg-white"></div>
        )}

      </div>
    </AdminLayout>
    </MainLayout>
  );
};

export default AdminChat;
