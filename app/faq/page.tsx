'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, MessageCircle, Phone, Mail, Clock, Shield, Heart, Star } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Làm thế nào để đặt lịch khám bệnh?",
    answer: "Bạn có thể đặt lịch khám bệnh bằng cách: 1) Chọn chuyên khoa và bác sĩ phù hợp, 2) Chọn ngày và giờ khám thuận tiện, 3) Điền thông tin cá nhân và triệu chứng, 4) Xác nhận đặt lịch và thanh toán.",
    category: "Đặt lịch"
  },
  {
    id: 2,
    question: "Tôi có thể hủy lịch khám không?",
    answer: "Có, bạn có thể hủy lịch khám trước 24 giờ so với giờ hẹn. Vui lòng vào trang 'Lịch hẹn' trong tài khoản cá nhân để hủy hoặc liên hệ hotline 1900-8888 để được hỗ trợ.",
    category: "Đặt lịch"
  },
  {
    id: 3,
    question: "Chi phí khám bệnh như thế nào?",
    answer: "Chi phí khám bệnh phụ thuộc vào chuyên khoa và bác sĩ bạn chọn. Thông thường từ 200.000đ - 500.000đ cho lần khám đầu tiên. Bạn có thể xem chi tiết giá khi chọn bác sĩ và đặt lịch.",
    category: "Chi phí"
  },
  {
    id: 4,
    question: "Tôi có thể thanh toán bằng cách nào?",
    answer: "Chúng tôi hỗ trợ nhiều phương thức thanh toán: thẻ tín dụng/ghi nợ, chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay), và tiền mặt tại phòng khám.",
    category: "Thanh toán"
  },
  {
    id: 5,
    question: "Làm sao để tôi nhận được kết quả khám bệnh?",
    answer: "Kết quả khám bệnh sẽ được gửi qua email và có thể xem trong tài khoản cá nhân. Với các xét nghiệm cần thời gian, kết quả sẽ có trong vòng 24-48 giờ.",
    category: "Kết quả"
  },
  {
    id: 6,
    question: "Tôi có thể chat với bác sĩ không?",
    answer: "Có, chúng tôi cung cấp dịch vụ tư vấn trực tuyến với bác sĩ. Bạn có thể chat với bác sĩ trong giờ hành chính hoặc đặt lịch tư vấn riêng.",
    category: "Tư vấn"
  },
  {
    id: 7,
    question: "Website có bảo mật thông tin cá nhân không?",
    answer: "Tuyệt đối có! Chúng tôi tuân thủ nghiêm ngặt các quy định về bảo mật thông tin y tế. Tất cả dữ liệu được mã hóa và chỉ những người được ủy quyền mới có thể truy cập.",
    category: "Bảo mật"
  },
  {
    id: 8,
    question: "Tôi có thể đặt lịch cho người khác không?",
    answer: "Có, bạn có thể đặt lịch khám cho người thân hoặc bạn bè. Chỉ cần điền thông tin chính xác của người cần khám bệnh khi đặt lịch.",
    category: "Đặt lịch"
  },
  {
    id: 9,
    question: "Làm sao để đánh giá bác sĩ sau khi khám?",
    answer: "Sau khi khám bệnh, bạn sẽ nhận được email yêu cầu đánh giá. Bạn có thể đánh giá bác sĩ dựa trên chất lượng khám, thái độ phục vụ và hiệu quả điều trị.",
    category: "Đánh giá"
  },
  {
    id: 10,
    question: "Tôi có thể xem lịch sử khám bệnh ở đâu?",
    answer: "Bạn có thể xem toàn bộ lịch sử khám bệnh trong phần 'Hồ sơ y tế' của tài khoản cá nhân. Thông tin này được lưu trữ an toàn và có thể truy cập bất cứ lúc nào.",
    category: "Hồ sơ"
  }
];

const categories = [
  { id: "all", label: "Tất cả", icon: HelpCircle },
  { id: "Đặt lịch", label: "Đặt lịch", icon: Clock },
  { id: "Chi phí", label: "Chi phí", icon: Heart },
  { id: "Thanh toán", label: "Thanh toán", icon: Shield },
  { id: "Tư vấn", label: "Tư vấn", icon: MessageCircle },
  { id: "Bảo mật", label: "Bảo mật", icon: Shield },
  { id: "Hồ sơ", label: "Hồ sơ", icon: Star }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Câu hỏi thường gặp
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Tìm câu trả lời cho những thắc mắc của bạn về dịch vụ khám bệnh trực tuyến
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-2xl bg-white shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
                  }`}
                >
                  <Icon size={18} />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-medium text-gray-600 mb-2">Không tìm thấy câu hỏi</h3>
              <p className="text-gray-500">Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <span className="inline-block px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                        {faq.category}
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {openItems.includes(faq.id) ? (
                        <ChevronUp className="text-blue-600" size={24} />
                      ) : (
                        <ChevronDown className="text-gray-400" size={24} />
                      )}
                    </div>
                  </button>
                  
                  {openItems.includes(faq.id) && (
                    <div className="px-8 pb-6">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Vẫn còn thắc mắc?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <Phone className="text-blue-600 mb-3" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Gọi điện</h3>
                <p className="text-gray-600 text-sm">1900-8888</p>
                <p className="text-gray-500 text-xs">24/7</p>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <Mail className="text-blue-600 mb-3" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 text-sm">support@tdcare.vn</p>
                <p className="text-gray-500 text-xs">Phản hồi trong 2h</p>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <MessageCircle className="text-blue-600 mb-3" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Chat trực tuyến</h3>
                <p className="text-gray-600 text-sm">Hỗ trợ ngay lập tức</p>
                <p className="text-gray-500 text-xs">Trong giờ hành chính</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Liên hệ ngay
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-200"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
