import React from 'react';
import { Clock, Shield, Truck, Headphones } from 'lucide-react';

const TrustIndicators = () => {
  const indicators = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: 'Dịch vụ uy tín',
      description: 'Đối tác y tế và nhà thuốc được kiểm duyệt, nguồn gốc rõ ràng.'
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: 'Bảo mật thông tin',
      description: 'Thông tin cá nhân và lịch sử khám bệnh của bạn được bảo vệ tuyệt đối.'
    },
    {
      icon: <Headphones className="h-8 w-8 text-blue-600" />,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ tư vấn viên và bác sĩ luôn sẵn sàng hỗ trợ bạn.'
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: 'Tiết kiệm thời gian',
      description: 'Đặt lịch khám trực tuyến, không cần xếp hàng chờ đợi.'
    }
  ];

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {indicators.map((item, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="mb-4 inline-flex p-4 bg-blue-100 rounded-full">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;