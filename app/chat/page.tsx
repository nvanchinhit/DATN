'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, User, MessageCircle, Clock, Stethoscope, Hospital, Search } from 'lucide-react';

interface ChatRoom {
  id: number;
  customer_id: number;
  assigned_doctor_id: number | null;
  doctor_name?: string;
  updated_at: string;
}

interface ChatMessage {
  room_id: number;
  sender_id: number;
  sender_type: 'customer' | 'doctor' | 'admin';
  message: string;
  created_at: string;
}

export default function UserChatPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Khởi tạo socket
  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected:', socketRef.current?.id);
    });

    // Nhận tin nhắn mới từ server
    socketRef.current.on('newMessage', (msg: ChatMessage) => {
      if (msg.room_id === selectedRoomId) {
        setMessages((prev) => {
          const isDuplicate = prev.some(
            (m) =>
              m.room_id === msg.room_id &&
              m.sender_id === msg.sender_id &&
              m.message === msg.message &&
              Math.abs(new Date(m.created_at).getTime() - new Date(msg.created_at).getTime()) < 1000
          );
          return isDuplicate ? prev : [...prev, msg];
        });
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [selectedRoomId]);

  // Lấy customer ID từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCustomerId(parsedUser.id);
    }
  }, []);

  // Lấy danh sách phòng chat
  useEffect(() => {
    if (!customerId) return;

    fetch(`http://localhost:5000/api/chat/rooms/customer/${customerId}`)
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }, [customerId]);

  // Khi chọn phòng thì lấy tin nhắn
  useEffect(() => {
    if (!selectedRoomId) return;

    fetch(`http://localhost:5000/api/chat/${selectedRoomId}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data));

    socketRef.current?.emit('joinRoom', {
      room_id: selectedRoomId,
      role: 'customer',
    });
  }, [selectedRoomId]);

  // Scroll khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !selectedRoomId || !customerId) return;

    const newMsg: ChatMessage = {
      room_id: selectedRoomId,
      sender_id: customerId,
      sender_type: 'customer',
      message,
      created_at: new Date().toISOString(),
    };

    // Gửi qua socket
    socketRef.current?.emit('sendMessage', {
      room_id: selectedRoomId,
      customer_id: customerId,
      message,
    });

    // Hiển thị ngay lên UI
    setMessages((prev) => [...prev, newMsg]);
    setMessage('');
  };

  const filteredRooms = rooms.filter(room => {
    const doctorName = room.doctor_name || 'Bệnh viện ABC';
    return doctorName.toLowerCase().includes(searchTerm.toLowerCase());
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Tin nhắn của bạn
            </h1>
          </div>
          <p className="text-gray-600">Trao đổi trực tiếp với đội ngũ y tế chuyên nghiệp</p>
        </div>

        <div className="flex h-[85vh] bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/50">
          {/* Sidebar */}
          <div className="w-1/3 bg-gradient-to-b from-white to-gray-50/50 border-r border-gray-200/50">
            {/* Search */}
            <div className="p-6 border-b border-gray-200/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm cuộc trò chuyện..."
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
                  <MessageCircle className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm">Chưa có cuộc trò chuyện nào</p>
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
                      <div className={`p-3 rounded-2xl transition-all duration-200 ${
                        room.assigned_doctor_id 
                          ? 'bg-gradient-to-br from-green-100 to-green-200' 
                          : 'bg-gradient-to-br from-blue-100 to-blue-200'
                      }`}>
                        {room.assigned_doctor_id ? (
                          <Stethoscope className="w-5 h-5 text-green-600" />
                        ) : (
                          <Hospital className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-800 truncate">
                            {room.assigned_doctor_id
                              ? room.doctor_name || 'Bác sĩ'
                              : 'Bệnh viện ABC'}
                          </p>
                          {room.assigned_doctor_id && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              Online
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-500">
                            {formatTime(room.updated_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50/30">
            {/* Chat Header */}
            <div className="px-8 py-6 bg-white/90 backdrop-blur-sm border-b border-gray-200/50">
              {selectedRoomId ? (
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${
                    rooms.find((r) => r.id === selectedRoomId)?.assigned_doctor_id
                      ? 'bg-gradient-to-br from-green-100 to-green-200'
                      : 'bg-gradient-to-br from-blue-100 to-blue-200'
                  }`}>
                    {rooms.find((r) => r.id === selectedRoomId)?.assigned_doctor_id ? (
                      <Stethoscope className="w-6 h-6 text-green-600" />
                    ) : (
                      <Hospital className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {rooms.find((r) => r.id === selectedRoomId)?.assigned_doctor_id
                        ? rooms.find((r) => r.id === selectedRoomId)?.doctor_name || 'Bác sĩ'
                        : 'Bệnh viện ABC'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {rooms.find((r) => r.id === selectedRoomId)?.assigned_doctor_id
                        ? 'Bác sĩ trực tuyến'
                        : 'Hỗ trợ y tế 24/7'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-600">Chọn cuộc trò chuyện</h3>
                  <p className="text-sm text-gray-500">Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {selectedRoomId ? (
                messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                      <MessageCircle className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-medium">Bắt đầu cuộc trò chuyện</p>
                    <p className="text-sm">Gửi tin nhắn đầu tiên để bắt đầu trao đổi</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 ${
                        msg.sender_type === 'customer' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        msg.sender_type === 'customer' 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                          : 'bg-gradient-to-br from-green-500 to-green-600'
                      }`}>
                        {msg.sender_type === 'customer' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Stethoscope className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`max-w-[70%] ${
                        msg.sender_type === 'customer' ? 'items-end' : 'items-start'
                      } flex flex-col`}>
                        <div
                          className={`px-6 py-4 rounded-3xl text-sm shadow-sm whitespace-pre-line leading-relaxed transition-all duration-200 hover:shadow-md ${
                            msg.sender_type === 'customer'
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-lg'
                              : 'bg-white border border-gray-200/50 text-gray-800 rounded-bl-lg'
                          }`}
                        >
                          {msg.message}
                        </div>
                        <div className={`flex items-center gap-1 mt-2 ${
                          msg.sender_type === 'customer' ? 'flex-row-reverse' : 'flex-row'
                        }`}>
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {formatTime(msg.created_at)}
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
                      <MessageCircle className="w-16 h-16 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Chào mừng đến với hệ thống chat</h3>
                    <p className="text-gray-600 max-w-md">
                      Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu trao đổi với đội ngũ y tế
                    </p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
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
                      placeholder="Nhập tin nhắn của bạn..."
                      rows={1}
                      className="w-full px-4 py-3 bg-transparent border-0 outline-none resize-none text-sm placeholder-gray-500"
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
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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