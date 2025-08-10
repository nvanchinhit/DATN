'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  MessageCircle,
  X,
  Send,
  Stethoscope,
  Clock,
  Phone,
} from 'lucide-react';

interface ChatMessage {
  room_id?: number;
  sender_id?: number;
  sender_type: 'customer' | 'doctor' | 'admin' | 'bot';
  message: string;
  created_at: string;
  pending?: boolean;
}

let socket: Socket;
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lấy user ID
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    const parsedUser = JSON.parse(storedUser);
    setCustomerId(parsedUser.id);
  }, []);
// Tin nhắn bot chào mừng khi lần đầu mở chat
useEffect(() => {
  if (messages.length === 0) {
    setMessages([
      {
        sender_type: 'bot',
        message: 'Xin chào! Tôi là trợ lý ảo của Bệnh viện. Tôi có thể hỗ trợ bạn:',
        created_at: new Date().toISOString(),
      },
      {
        sender_type: 'bot',
        message:
          '• Thông tin khám bệnh và đặt lịch\n• Giờ làm việc và liên hệ\n• Dịch vụ y tế\n• Câu hỏi về sức khỏe',
        created_at: new Date().toISOString(),
      },
    ]);
  }
}, [messages.length]);

  // Kết nối socket khi có customerId
  useEffect(() => {
    if (!customerId) return;

    socket = io(API_URL, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('connected', (data) => {
      console.log('📡 Server confirmed:', data);
    });

    socket.on('newMessage', (msg: ChatMessage) => {
      setMessages((prev) => {
        // Xóa tin pending trùng nội dung & sender_type
        const filtered = prev.filter(
          (m) =>
            !(
              m.pending &&
              m.sender_type === msg.sender_type &&
              m.message === msg.message
            )
        );
        return [...filtered, msg];
      });
    });

    const initRoom = async () => {
      try {
        const res = await fetch(`${API_URL}/api/chat/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerId }),
        });

        const data = await res.json();
        if (data.roomId) {
          setRoomId(data.roomId);
          socket.emit('joinRoom', { room_id: data.roomId, role: 'customer' });
        }
      } catch (err) {
        console.error('❌ Lỗi tạo room:', err);
      }
    };

    initRoom();

    return () => {
      socket.disconnect();
      socket.off('newMessage');
    };
  }, [customerId]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = () => {
    if (!message.trim() || !roomId || !customerId) return;

    // Hiển thị tin nhắn ngay (pending)
    const tempMsg: ChatMessage = {
      room_id: roomId,
      sender_id: customerId,
      sender_type: 'customer',
      message,
      created_at: new Date().toISOString(),
      pending: true,
    };
    setMessages((prev) => [...prev, tempMsg]);

    // Gửi lên server
    socket.emit('sendMessage', {
      customer_id: customerId,
      room_id: roomId,
      message,
    });

    setMessage('');

    // Bot trả lời sau 1 giây (chỉ nếu chưa có bot trả lời cùng nội dung)
    setTimeout(() => {
      const botMsg: ChatMessage = {
        sender_type: 'bot',
        message:
          'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất. Để được hỗ trợ nhanh hơn, bạn có thể gọi hotline: 1900-1234',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => {
        if (prev.some((m) => m.message === botMsg.message && m.sender_type === 'bot')) {
          return prev;
        }
        return [...prev, botMsg];
      });
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      {/* Nút mở chat */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className={`bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all ${
            isOpen ? 'rotate-180' : 'hover:rotate-12'
          }`}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
        {!isOpen && (
          <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
            Online
          </div>
        )}
      </div>

      {/* Hộp chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Stethoscope size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Hỗ trợ y tế</h3>
                <p className="text-sm text-blue-100">Trực tuyến 24/7</p>
              </div>
            </div>
            <button onClick={toggleChat} className="hover:bg-white/10 p-1 rounded">
              <X size={20} />
            </button>
          </div>

          {/* Nút nhanh */}
          <div className="bg-blue-50 p-3 border-b flex gap-2">
            <button className="flex items-center gap-2 bg-white text-blue-600 px-3 py-2 rounded-lg text-sm border">
              <Clock size={16} /> Đặt lịch
            </button>
            <button className="flex items-center gap-2 bg-white text-blue-600 px-3 py-2 rounded-lg text-sm border">
              <Phone size={16} /> Hotline
            </button>
          </div>

          {/* Danh sách tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender_type === 'customer' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${msg.sender_type === 'customer' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`p-3 rounded-2xl whitespace-pre-line text-sm shadow-sm ${
                      msg.sender_type === 'customer'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : msg.sender_type === 'bot'
                        ? 'bg-yellow-100 text-gray-700 rounded-bl-md'
                        : 'bg-white text-gray-800 border rounded-bl-md'
                    }`}
                  >
                    {msg.pending ? 'Đang gửi...' : msg.message}
                  </div>
                  <div
                    className={`text-xs text-gray-500 mt-1 ${
                      msg.sender_type === 'customer' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Nhập tin nhắn */}
          <div className="border-t p-4 bg-white">
            <div className="flex space-x-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 p-3 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl disabled:bg-gray-300"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="mt-2 text-center text-xs text-gray-500">
              Được hỗ trợ bởi Bệnh viện ABC
            </div>
          </div>
        </div>
      )}
    </>
  );
}
