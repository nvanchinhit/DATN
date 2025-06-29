import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Tư vấn sức khỏe từ xa',
      description: 'Nhận tư vấn từ các bác sĩ chuyên khoa hàng đầu ngay tại nhà thông qua cuộc gọi video, giải đáp mọi thắc mắc sức khỏe một cách nhanh chóng.',
      image: 'https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      features: [
        'Tiết kiệm thời gian và chi phí đi lại',
        'Lựa chọn bác sĩ theo chuyên khoa mong muốn',
        'Bảo mật thông tin cuộc gọi tuyệt đối',
        'Nhận đơn thuốc điện tử tiện lợi sau buổi tư vấn'
      ],
      link: "/tu-van-online"
    },
    {
      id: 2,
      title: 'Đặt lịch khám tại phòng khám',
      description: 'Chủ động đặt lịch hẹn khám trực tiếp tại các bệnh viện, phòng khám uy tín trong hệ thống của chúng tôi để không cần xếp hàng chờ đợi.',
      image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      features: [
        'Chủ động chọn giờ khám phù hợp với lịch trình',
        'Xem thông tin, kinh nghiệm của bác sĩ trước khi đặt',
        'Nhận nhắc nhở lịch hẹn tự động qua SMS & Email',
        'Quản lý tất cả lịch hẹn trên một nền tảng duy nhất'
      ],
      link: "/dat-lich-kham"
    },
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-blue-600 font-semibold">Dịch vụ của chúng tôi</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Chăm sóc sức khỏe trong tầm tay</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            TDCARE cung cấp các dịch vụ y tế thông minh, giúp bạn và gia đình luôn khỏe mạnh một cách tiện lợi và hiệu quả.
          </p>
        </div>
        
        <div className="space-y-20">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}
            >
              <div className="md:w-1/2">
                <div className="relative">
                   <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-[400px] object-cover rounded-xl shadow-xl"
                  />
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-100 rounded-full z-0 hidden md:block"></div>
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 text-lg">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a 
                  href={service.link}
                  className="mt-8 inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Tìm hiểu thêm <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;