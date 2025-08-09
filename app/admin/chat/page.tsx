'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, User, Stethoscope, MessageCircle, Clock, Users, Activity } from 'lucide-react';

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

interface Doctor {
  id: number;
  name: string;
}
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminChatPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io('${API_URL}');

    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected:', socketRef.current?.id);
      socketRef.current?.emit('registerAdmin');
    });

    socketRef.current.on('newMessage', (msg: ChatMessage) => {
      if (msg.room_id === selectedRoomId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    fetch('${API_URL}/api/chat/rooms/unassigned')
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }, []);

  useEffect(() => {
    fetch('${API_URL}/api/doctors')
      .then((res) => res.json())
      .then((data) => setDoctors(data));
  }, []);

  useEffect(() => {
    if (!selectedRoomId) return;

    fetch(`${API_URL}/api/chat/${selectedRoomId}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data));

    socketRef.current?.emit('joinRoom', {
      room_id: selectedRoomId,
      role: 'admin',
    });
  }, [selectedRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !selectedRoomId) return;

    const newMessage = {
      room_id: selectedRoomId,
      sender_id: 1, // ID admin giả định
      sender_type: 'admin' as const,
      message: message.trim(),
      created_at: new Date().toISOString(),
      sender_name: 'Admin'
    };

    // Thêm tin nhắn vào UI ngay lập tức
    setMessages(prev => [...prev, newMessage]);

    socketRef.current?.emit('replyMessage', {
      room_id: selectedRoomId,
      sender_id: 1,
      sender_type: 'admin',
      message: message.trim(),
    });

    setMessage('');
  };

  const assignDoctor = () => {
    if (!selectedDoctorId || !selectedRoomId) return;

    fetch('${API_URL}/api/chat/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId: selectedRoomId,
        doctorId: selectedDoctorId,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert('✅ Gán bác sĩ thành công!');
        setRooms((prev) => prev.filter((r) => r.id !== selectedRoomId));
        setSelectedRoomId(null);
        setMessages([]);
      });
  };

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header với gradient và glass effect */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Quản Lý Chat
                </h1>
                <p className="text-slate-600 mt-1">Hệ thống hỗ trợ khách hàng</p>
              </div>
              <div className="ml-auto flex items-center gap-6">
                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Online</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">{rooms.length} phòng chờ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
          <div className="flex h-[75vh]">
            {/* Sidebar - Danh sách phòng */}
            <div className="w-80 bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200/50">
              <div className="p-4 border-b border-slate-200/50 bg-white/50">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Phòng chờ ({rooms.length})
                </h3>
              </div>
              
              <div className="overflow-y-auto h-full">
                {rooms.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500">Không có phòng chờ nào</p>
                  </div>
                ) : (
                  rooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`p-4 cursor-pointer transition-all duration-300 border-b border-slate-100 hover:bg-white/70 hover:shadow-md hover:transform hover:scale-[1.02] ${
                        selectedRoomId === room.id 
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500 shadow-md' 
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedRoomId === room.id 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">{room.customer_name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <p className="text-xs text-slate-500">
                              {new Date(room.updated_at).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                        {selectedRoomId === room.id && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 bg-gradient-to-r from-white via-blue-50 to-indigo-50 border-b border-slate-200/50">
                {selectedRoomId ? (
                  <div className="space-y-3">
                    {/* Room Info */}
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      <h3 className="font-bold text-xl text-slate-800">
                        {selectedRoom?.customer_name || `Phòng ${selectedRoomId}`}
                      </h3>
                      <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                        ID: #{selectedRoomId}
                      </span>
                    </div>
                    
                    {/* Doctor Assignment Section */}
                    <div className="flex items-center gap-3 bg-white/70 p-3 rounded-xl border border-slate-200/50">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Stethoscope className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium">Phân công bác sĩ:</span>
                      </div>
                      
                      <select
                        className="flex-1 max-w-xs px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
                        value={selectedDoctorId !== null ? String(selectedDoctorId) : ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedDoctorId(val ? parseInt(val) : null);
                        }}
                      >
                        <option value="">-- Chọn bác sĩ --</option>
                        {doctors.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            Dr. {doc.name}
                          </option>
                        ))}
                      </select>
                      
                      <button
                        onClick={assignDoctor}
                        disabled={!selectedDoctorId}
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed transform hover:scale-[1.02] text-sm font-medium"
                      >
                        <Stethoscope className="w-4 h-4" />
                        Gán bác sĩ
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <h3 className="font-bold text-xl text-slate-800">
                      Chọn phòng để bắt đầu hỗ trợ
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Chọn một phòng từ danh sách bên trái
                    </p>
                  </div>
                )}
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-slate-50/30 to-white/30 space-y-4">
                {!selectedRoomId ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageCircle className="w-10 h-10 text-blue-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-700 mb-2">Chọn phòng chat</h3>
                      <p className="text-slate-500">Chọn một phòng từ danh sách bên trái để bắt đầu hỗ trợ khách hàng</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500">Chưa có tin nhắn nào</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex animate-fade-in-up ${
                        msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'
                      }`}
                      style={{animationDelay: `${idx * 50}ms`}}
                    >
                      <div className={`max-w-[75%] ${msg.sender_type === 'admin' ? 'order-2' : 'order-1'}`}>
                        {/* Sender Label */}
                        <div className={`mb-1 px-2 ${msg.sender_type === 'admin' ? 'text-right' : 'text-left'}`}>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            msg.sender_type === 'admin' 
                              ? 'bg-blue-100 text-blue-800'
                              : msg.sender_type === 'doctor'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {msg.sender_type === 'admin' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                            {msg.sender_type === 'doctor' && <Stethoscope className="w-3 h-3" />}
                            {msg.sender_type === 'customer' && <User className="w-3 h-3" />}
                            <span>
                              {msg.sender_name || 
                                (msg.sender_type === 'admin' ? 'Admin' : 
                                 msg.sender_type === 'doctor' ? 'Bác sĩ' : 'Khách hàng')}
                            </span>
                          </div>
                        </div>
                        
                        {/* Message Bubble */}
                        <div
                          className={`p-4 rounded-2xl text-sm shadow-lg whitespace-pre-line leading-relaxed transition-all duration-200 hover:shadow-xl ${
                            msg.sender_type === 'admin'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md border-2 border-blue-400'
                              : msg.sender_type === 'doctor'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-bl-md border-2 border-green-400'
                              : 'bg-white border-2 border-orange-200 text-slate-800 rounded-bl-md hover:border-orange-300'
                          }`}
                        >
                          {msg.message}
                        </div>
                        
                        {/* Timestamp */}
                        <div
                          className={`text-xs text-slate-400 mt-1 px-2 ${
                            msg.sender_type === 'admin' ? 'text-right' : 'text-left'
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              {selectedRoomId && (
                <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-slate-200/50">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Nhập tin nhắn hỗ trợ..."
                      className="flex-1 p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!message.trim()}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 rounded-2xl disabled:from-gray-300 disabled:to-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-105"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}