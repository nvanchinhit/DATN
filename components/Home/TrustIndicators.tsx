import React from 'react';
import { Clock, Shield, Truck, Headphones } from 'lucide-react';

const TrustIndicators = () => {
  const indicators = [
    {
      icon: <Shield className="h-8 w-8 text-teal-600" />,
      title: 'Dịch vụ uy tín',
      description: 'Tất cả thuốc đều được kiểm duyệt và có nguồn gốc rõ ràng'
    },
    {
      icon: <Truck className="h-8 w-8 text-teal-600" />,
      title: 'Giao hàng nhanh',
      description: 'Giao thuốc trong 2 giờ tại các thành phố lớn'
    },
    {
      icon: <Headphones className="h-8 w-8 text-teal-600" />,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ tư vấn viên và bác sĩ luôn sẵn sàng hỗ trợ'
    },
    {
      icon: <Clock className="h-8 w-8 text-teal-600" />,
      title: 'Tiết kiệm thời gian',
      description: 'Đặt lịch khám trực tuyến, không cần xếp hàng chờ đợi'
    }
  ];

  return (
    <section className="bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {indicators.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-white to-teal-50 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4 p-3 bg-teal-50 rounded-full">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;