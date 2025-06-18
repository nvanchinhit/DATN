import React from 'react';
import HeroSection from './HeroSection';
import TrustIndicators from './TrustIndicators';
import Services from './Services';
import TopDoctors from './TopDoctors';
import TopSpecialties from './TopSpecialties';
import TopMedicines from './TopMedicines';
import BookingSection from './BookingSection';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main>
        <HeroSection />
        <TrustIndicators />
        <TopDoctors />
        <TopSpecialties />
        <Services />
        <TopMedicines />
        <BookingSection />
        
        {/* Contact Section */}
        <section id="contact" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Liên hệ với chúng tôi</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Đội ngũ tư vấn viên luôn sẵn sàng hỗ trợ bạn 24/7 với mọi vấn đề sức khỏe
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 border border-gray-100 rounded-lg hover:shadow-md transition">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 text-teal-600 rounded-full mb-4">
                    <Phone className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Hotline</h3>
                  <p className="text-gray-600 mb-2">Hỗ trợ 24/7</p>
                  <p className="text-teal-600 font-bold">1900-8888</p>
                </div>
                
                <div className="text-center p-6 border border-gray-100 rounded-lg hover:shadow-md transition">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 text-teal-600 rounded-full mb-4">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <p className="text-gray-600 mb-2">Phản hồi trong 24 giờ</p>
                  <p className="text-teal-600 font-bold">support@medicare.vn</p>
                </div>
                
                <div className="text-center p-6 border border-gray-100 rounded-lg hover:shadow-md transition">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 text-teal-600 rounded-full mb-4">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Địa chỉ</h3>
                  <p className="text-gray-600 mb-2">Văn phòng chính</p>
                  <p className="text-teal-600 font-bold">123 Đường Sức Khỏe, Hà Nội</p>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-5 rounded-lg transition inline-flex items-center">
                  Gửi tin nhắn cho chúng tôi
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;