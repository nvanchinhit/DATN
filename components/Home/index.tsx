import React from 'react';
import HeroSection from './HeroSection';
import TrustIndicators from './TrustIndicators';
import Services from './Services';
import TopDoctors from './TopDoctors';
import TopSpecialties from './TopSpecialties';
import BookingSection from './BookingSection';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

// Một component nhỏ cho các thẻ thông tin liên hệ
const ContactInfoCard = ({ icon, title, description, link, linkText }: any) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold text-gray-800">{title}</h4>
      <p className="text-gray-500 text-sm">{description}</p>
      <a href={link} className="text-blue-600 font-bold hover:underline text-sm">
        {linkText}
      </a>
    </div>
  </div>
);


function Home() {
  return (
    <main className="bg-white">
      {/* 1. Hero Section - Giới thiệu chính */}
      <HeroSection />
      
      {/* 2. Trust Indicators - Xây dựng niềm tin */}
      <TrustIndicators />

      {/* 3. Top Specialties - Giới thiệu chuyên khoa */}
      <TopSpecialties />

      {/* 4. Top Doctors - Giới thiệu bác sĩ */}
      <TopDoctors />

      {/* 5. Services - Chi tiết các dịch vụ */}
      <Services />

      {/* 6. Booking Section - Kêu gọi hành động chính */}
      <BookingSection />
      
      {/* 7. Contact Section - Hỗ trợ & Liên hệ */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold">Get In Touch</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Liên hệ với chúng tôi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              Chúng tôi luôn sẵn lòng lắng nghe. Gửi tin nhắn cho chúng tôi hoặc liên hệ trực tiếp qua thông tin bên dưới.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-2xl shadow-xl">
            {/* Cột trái: Thông tin */}
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Thông tin liên hệ</h3>
                <div className="space-y-8">
                  <ContactInfoCard 
                    icon={<Phone className="h-6 w-6" />}
                    title="Hotline 24/7"
                    description="Hỗ trợ khẩn cấp và tư vấn"
                    link="tel:19008888"
                    linkText="1900-8888"
                  />
                  <ContactInfoCard 
                    icon={<Mail className="h-6 w-6" />}
                    title="Email"
                    description="Phản hồi trong vòng 24 giờ"
                    link="mailto:support@tdcare.vn"
                    linkText="support@tdcare.vn"
                  />
                  <ContactInfoCard 
                    icon={<MapPin className="h-6 w-6" />}
                    title="Địa chỉ"
                    description="Văn phòng chính của chúng tôi"
                    link="#"
                    linkText="123 Đường Sức Khỏe, Hà Nội"
                  />
                </div>
              </div>
            </div>

            {/* Cột phải: Form liên hệ */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Gửi tin nhắn cho chúng tôi</h3>
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                    <input type="text" id="name" placeholder="Nguyễn Văn A" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"/>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" id="email" placeholder="email@example.com" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"/>
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Chủ đề</label>
                  <input type="text" id="subject" placeholder="Về vấn đề bạn cần hỗ trợ" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"/>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Tin nhắn</label>
                  <textarea id="message" rows={4} placeholder="Nội dung tin nhắn của bạn..." className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"></textarea>
                </div>
                <div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-base inline-flex items-center justify-center">
                    Gửi tin nhắn
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;