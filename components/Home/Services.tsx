import React from 'react';
import { CheckCircle } from 'lucide-react';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Khám bệnh trực tuyến',
      description: 'Tư vấn với bác sĩ qua video call mọi lúc mọi nơi',
      image: 'https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      features: [
        'Tiết kiệm thời gian di chuyển',
        'Hỗ trợ 24/7 với các vấn đề khẩn cấp',
        'Bác sĩ chuyên khoa giàu kinh nghiệm',
        'Kê đơn thuốc trực tuyến nếu cần thiết'
      ]
    },
    {
      id: 2,
      title: 'Mua thuốc online',
      description: 'Đặt mua thuốc theo đơn và giao hàng tận nơi',
      image: 'https://images.pexels.com/photos/4046999/pexels-photo-4046999.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      features: [
        'Giao hàng nhanh trong 2 giờ',
        'Đảm bảo thuốc chính hãng, rõ nguồn gốc',
        'Hỗ trợ tư vấn trước khi mua',
        'Đặt hàng định kỳ cho bệnh mãn tính'
      ]
    },
    {
      id: 3,
      title: 'Xét nghiệm tận nơi',
      description: 'Lấy mẫu xét nghiệm tại nhà, nhận kết quả online',
      image: 'https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      features: [
        'Đội ngũ kỹ thuật viên chuyên nghiệp',
        'Kết quả chính xác, nhanh chóng',
        'Đa dạng loại xét nghiệm',
        'Phù hợp cho người già, trẻ nhỏ hoặc người bận rộn'
      ]
    }
  ];

  return (
    <section id="services" className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dịch vụ của chúng tôi</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Medicare cung cấp đa dạng dịch vụ y tế từ xa và tại chỗ, giúp chăm sóc sức khỏe của bạn mọi lúc mọi nơi
          </p>
        </div>
        
        <div className="space-y-12">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}
            >
              <div className="md:w-1/2">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-[350px] object-cover rounded-xl shadow-md"
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a 
                  href="#" 
                  className="mt-6 inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-5 rounded-lg transition"
                >
                  Tìm hiểu thêm
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