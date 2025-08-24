'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, User, MessageCircle, Clock, Stethoscope, UserCheck, Search, Users, Activity } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebardoctor';

/* ------------ Kiểu dữ liệu ------------ */
interface ChatRoom {
  id: number;
  customer_name: string;
  updated_at: string;
}

interface ChatMessage {
  room_id: number;
  sender_id: number;
  sender_type: 'customer' | 'doctor' | 'admin';
  message: string;
  created_at: string;
  sender_name?: string;
}
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/* ------------ Component ------------ */
export default function DoctorChatPage() {
  /* ----- State ----- */
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  /* ----- Ref ----- */
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageCache = useRef<Record<number, ChatMessage[]>>({});
  const currentRoomRef = useRef<number | null>(null); // theo dõi phòng hiện tại
  const sentMessagesRef = useRef<Set<string>>(new Set()); // theo dõi tin nhắn đã gửi để tránh trùng lặp

  /* ----- ID bác sĩ ----- */
  const doctorId =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || '{}')?.id
      : null;

  /* =========================================================
     1. Kết nối socket (chỉ chạy 1 lần khi doctorId có)
     ========================================================= */
  useEffect(() => {
    if (!doctorId) return;

    // Khởi tạo socket
    const socket = io(`${API_URL}`, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('registerDoctor', { doctor_id: doctorId });
    });

    // Lắng nghe tin nhắn mới – handler được gắn 1 lần duy nhất
    const handleNewMessage = (msg: ChatMessage) => {
      // Tạo key duy nhất cho tin nhắn để kiểm tra trùng lặp
      const messageKey = `${msg.room_id}-${msg.sender_id}-${msg.sender_type}-${msg.message}-${msg.created_at}`;
      
      // Kiểm tra xem tin nhắn này đã được xử lý chưa
      if (sentMessagesRef.current.has(messageKey)) {
        console.log('🔍 [DEBUG] Duplicate message detected, skipping:', messageKey);
        return;
      }
      
      // Đánh dấu tin nhắn này đã được xử lý
      sentMessagesRef.current.add(messageKey);
      
      // Lưu vào cache
      if (!messageCache.current[msg.room_id]) messageCache.current[msg.room_id] = [];
      messageCache.current[msg.room_id].push(msg);

      // Nếu đang ở đúng phòng thì hiển thị
      if (msg.room_id === currentRoomRef.current) {
        setMessages((prev) => {
          // Kiểm tra xem có tin nhắn tạm thời tương tự không
          const tempMessageIndex = prev.findIndex(existingMsg => 
            existingMsg.room_id === msg.room_id &&
            existingMsg.sender_id === msg.sender_id &&
            existingMsg.sender_type === msg.sender_type &&
            existingMsg.message === msg.message &&
            Math.abs(new Date(existingMsg.created_at).getTime() - new Date(msg.created_at).getTime()) < 5000 // Chênh lệch < 5 giây
          );
          
          if (tempMessageIndex !== -1) {
            // Thay thế tin nhắn tạm thời bằng tin nhắn chính thức từ server
            const newMessages = [...prev];
            newMessages[tempMessageIndex] = msg;
            console.log('🔍 [DEBUG] Replaced temporary message with official message');
            return newMessages;
          }
          
          // Kiểm tra xem tin nhắn này đã có trong state chưa
          const isDuplicate = prev.some(existingMsg => 
            existingMsg.room_id === msg.room_id &&
            existingMsg.sender_id === msg.sender_id &&
            existingMsg.sender_type === msg.sender_type &&
            existingMsg.message === msg.message &&
            existingMsg.created_at === msg.created_at
          );
          
          if (isDuplicate) {
            console.log('🔍 [DEBUG] Message already in state, skipping:', messageKey);
            return prev;
          }
          
          // Thêm tin nhắn mới
          return [...prev, msg];
        });
      }
      
      // Giới hạn số lượng tin nhắn đã gửi để tránh memory leak
      if (sentMessagesRef.current.size > 1000) {
        const firstKey = sentMessagesRef.current.values().next().value;
        if (firstKey) {
          sentMessagesRef.current.delete(firstKey);
        }
      }
    };
    socket.on('newMessage', handleNewMessage);

    // Cleanup
    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.disconnect();
    };
  }, [doctorId]);

  /* =========================================================
     2. Lấy danh sách phòng chat của bác sĩ
     ========================================================= */
  useEffect(() => {
    if (!doctorId) return;

    fetch(`${API_URL}/api/chat/rooms/doctor/${doctorId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setRooms(data);
      })
      .catch((err) => {
        console.error('❌ Lỗi khi fetch rooms:', err);
      });
  }, [doctorId]);

  /* =========================================================
     3. Khi chọn phòng: lấy tin nhắn & join room
     ========================================================= */
  useEffect(() => {
    if (!selectedRoomId || !socketRef.current) return;

    // Cập nhật ref theo dõi phòng hiện tại
    currentRoomRef.current = selectedRoomId;

    // Xóa cache của phòng cũ để tránh xung đột
    if (messageCache.current[selectedRoomId]) {
      delete messageCache.current[selectedRoomId];
    }

    // Nếu đã có trong cache thì dùng ngay
    if (messageCache.current[selectedRoomId]) {
      setMessages(messageCache.current[selectedRoomId]);
    } else {
      // Chưa có thì fetch
      fetch(`${API_URL}/api/chat/${selectedRoomId}/messages`)
        .then((res) => res.json())
        .then((data) => {
          // Lọc tin nhắn trùng lặp trước khi lưu vào cache
          const uniqueMessages = data.filter((msg: ChatMessage) => {
            const messageKey = `${msg.room_id}-${msg.sender_id}-${msg.sender_type}-${msg.message}-${msg.created_at}`;
            if (sentMessagesRef.current.has(messageKey)) {
              return false; // Bỏ qua tin nhắn đã xử lý
            }
            sentMessagesRef.current.add(messageKey);
            return true;
          });
          
          messageCache.current[selectedRoomId] = uniqueMessages;
          
          // Kết hợp tin nhắn từ API với tin nhắn tạm thời hiện tại
          setMessages(prev => {
            const tempMessages = prev.filter(msg => 
              msg.room_id === selectedRoomId && 
              msg.sender_type === 'doctor' &&
              Math.abs(new Date(msg.created_at).getTime() - Date.now()) < 10000 // Tin nhắn tạm thời < 10 giây
            );
            
            return [...uniqueMessages, ...tempMessages];
          });
        })
        .catch((err) => console.error('Lỗi khi fetch messages:', err));
    }

    // Tham gia room socket
    socketRef.current.emit('joinRoom', { room_id: selectedRoomId, role: 'doctor' });
  }, [selectedRoomId]);

  /* =========================================================
     4. Cuộn tự động xuống cuối khi có tin nhắn mới
     ========================================================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* =========================================================
     5. Gửi tin nhắn
     ========================================================= */
  const sendMessage = () => {
    if (!message.trim() || !selectedRoomId || !doctorId || !socketRef.current) return;

    // Tạo tin nhắn mới với ID tạm thời để tránh trùng lặp
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const newMessage: ChatMessage = {
      room_id: selectedRoomId,
      sender_id: doctorId,
      sender_type: 'doctor',
      message: message.trim(),
      created_at: new Date().toISOString()
    };

    // Hiển thị tin nhắn ngay lập tức (optimistic update)
    setMessages(prev => [...prev, newMessage]);
    
    // Lưu vào cache với ID tạm thời
    if (!messageCache.current[selectedRoomId]) messageCache.current[selectedRoomId] = [];
    messageCache.current[selectedRoomId].push(newMessage);
    
    // Tạo key duy nhất và đánh dấu đã gửi
    const messageKey = `${newMessage.room_id}-${newMessage.sender_id}-${newMessage.sender_type}-${newMessage.message}-${newMessage.created_at}`;
    sentMessagesRef.current.add(messageKey);

    // Gửi qua socket
    socketRef.current.emit('replyMessage', {
      room_id: selectedRoomId,
      sender_id: doctorId,
      sender_type: 'doctor',
      message: message.trim(),
    });

    // Xóa nội dung input
    setMessage('');
    
    // Cuộn xuống cuối
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const filteredRooms = rooms.filter(room =>
    room.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return date.toLocaleDateString('vi-VN', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  /* =========================================================
     6. JSX hiển thị
     ========================================================= */
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Sidebar chức năng bác sĩ */}
      <Sidebar />

      {/* Khu vực chat */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Phòng Chat của Bác sĩ
                </h1>
                <p className="text-gray-600">Tư vấn và hỗ trợ bệnh nhân trực tuyến</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-xl">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Đang hoạt động</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-xl">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">{rooms.length} bệnh nhân</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[85vh] bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/50">
          {/* Danh sách phòng chat */}
          <div className="w-1/3 bg-gradient-to-b from-white to-gray-50/50 border-r border-gray-200/50">
            {/* Search */}
            <div className="p-6 border-b border-gray-200/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bệnh nhân..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100/70 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all duration-200 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Rooms List */}
            <div className="overflow-y-auto h-full">
              {filteredRooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <Users className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm font-medium">
                    {rooms.length === 0 ? 'Chưa có bệnh nhân nào' : 'Không tìm thấy bệnh nhân'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {rooms.length === 0 ? 'Phòng chat sẽ xuất hiện khi có bệnh nhân liên hệ' : 'Thử tìm kiếm với từ khóa khác'}
                  </p>
                </div>
              ) : (
                filteredRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`relative p-6 cursor-pointer transition-all duration-200 border-b border-gray-100/50 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-green-50/50 ${
                      selectedRoomId === room.id 
                        ? 'bg-gradient-to-r from-blue-100/70 to-green-100/70 border-l-4 border-l-blue-500' 
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl">
                          <UserCheck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-800 truncate">
                            {room.customer_name}
                          </p>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            Phòng {room.id}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-500">
                            Cập nhật lúc {formatTime(room.updated_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Khung chat */}
          <div className="flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50/30">
            {/* Tiêu đề phòng */}
            <div className="px-8 py-6 bg-white/90 backdrop-blur-sm border-b border-gray-200/50">
              {selectedRoomId ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl">
                        <UserCheck className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {rooms.find(r => r.id === selectedRoomId)?.customer_name || 'Bệnh nhân'}
                      </h3>
                      <p className="text-sm text-gray-500">Phòng chat #{selectedRoomId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-800">Đang tư vấn</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-600">Chọn bệnh nhân để tư vấn</h3>
                  <p className="text-sm text-gray-500">Chọn một cuộc trò chuyện để bắt đầu tư vấn y tế</p>
                </div>
              )}
            </div>

            {/* Danh sách tin nhắn */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {selectedRoomId ? (
                messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                      <MessageCircle className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-medium">Cuộc trò chuyện mới</p>
                    <p className="text-sm">Hãy gửi lời chào để bắt đầu tư vấn cho bệnh nhân</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 ${
                        msg.sender_type === 'doctor' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        msg.sender_type === 'doctor' 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                          : 'bg-gradient-to-br from-green-500 to-green-600'
                      }`}>
                        {msg.sender_type === 'doctor' ? (
                          <Stethoscope className="w-4 h-4 text-white" />
                        ) : (
                          <User className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`max-w-[70%] ${
                        msg.sender_type === 'doctor' ? 'items-end' : 'items-start'
                      } flex flex-col`}>
                        <div
                          className={`px-6 py-4 rounded-3xl text-sm shadow-sm leading-relaxed whitespace-pre-line transition-all duration-200 hover:shadow-md ${
                            msg.sender_type === 'doctor'
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-lg'
                              : 'bg-white border border-gray-200/50 text-gray-800 rounded-bl-lg'
                          }`}
                        >
                          {msg.message}
                        </div>
                        <div className={`flex items-center gap-2 mt-2 ${
                          msg.sender_type === 'doctor' ? 'flex-row-reverse' : 'flex-row'
                        }`}>
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {(msg.sender_name || (msg.sender_type === 'doctor' ? 'Bác sĩ' : 'Bệnh nhân'))} • {formatTime(msg.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="p-6 bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl mb-6 inline-block">
                      <Stethoscope className="w-16 h-16 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Bảng điều khiển tư vấn y tế</h3>
                    <p className="text-gray-600 max-w-md">
                      Chọn một bệnh nhân từ danh sách bên trái để bắt đầu tư vấn và hỗ trợ trực tuyến
                    </p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Ô nhập tin nhắn */}
            {selectedRoomId && (
              <div className="p-6 bg-white/90 backdrop-blur-sm border-t border-gray-200/50">
                <div className="flex gap-4 items-end">
                  <div className="flex-1 bg-gray-100/70 rounded-3xl p-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Nhập tư vấn y tế cho bệnh nhân..."
                      rows={1}
                      className="w-full px-4 py-3 bg-transparent border-0 outline-none resize-none text-sm placeholder-gray-500 text-gray-800"
                      style={{ minHeight: '20px', maxHeight: '120px' }}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="p-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Send size={20} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3 px-2">
                  <p className="text-xs text-gray-500">
                    Nhấn Enter để gửi, Shift + Enter để xuống dòng
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Đang kết nối</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}