import React from 'react';
import { ArrowRight } from 'lucide-react';

const TopSpecialties = () => {
  const specialties = [
    {
      id: 1,
      name: 'Nhi khoa',
      icon: '👶',
      description: 'Chăm sóc sức khỏe tổng quát cho trẻ em từ sơ sinh đến 18 tuổi',
      doctorCount: 24,
      color: 'bg-blue-100'
    },
    {
      id: 2,
      name: 'Tim mạch',
      icon: '❤️',
      description: 'Chẩn đoán và điều trị các bệnh lý về tim và mạch máu',
      doctorCount: 18,
      color: 'bg-red-100'
    },
    {
      id: 3,
      name: 'Da liễu',
      icon: '🧴',
      description: 'Chăm sóc và điều trị các vấn đề về da, tóc và móng',
      doctorCount: 15,
      color: 'bg-orange-100'
    },
    {
      id: 4,
      name: 'Sản phụ khoa',
      icon: '👩‍🍼',
      description: 'Chăm sóc sức khỏe sinh sản và thai kỳ cho phụ nữ',
      doctorCount: 20,
      color: 'bg-pink-100'
    },
    {
      id: 5,
      name: 'Nội tiết',
      icon: '⚖️',
      description: 'Chẩn đoán và điều trị các rối loạn nội tiết và chuyển hóa',
      doctorCount: 12,
      color: 'bg-purple-100'
    },
    {
      id: 6,
      name: 'Tai Mũi Họng',
      icon: '👂',
      description: 'Chăm sóc các vấn đề liên quan đến tai, mũi, họng và cổ',
      doctorCount: 16,
      color: 'bg-green-100'
    }
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Chuyên khoa nổi bật</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Đa dạng chuyên khoa với đội ngũ bác sĩ giàu kinh nghiệm, sẵn sàng đáp ứng nhu cầu khám chữa bệnh
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((specialty) => (
            <div 
              key={specialty.id} 
              className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="p-6">
                <div className={`w-14 h-14 flex items-center justify-center rounded-full ${specialty.color} text-2xl mb-4`}>
                  {specialty.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {specialty.name}
                </h3>
                <p className="text-gray-600 mb-3">{specialty.description}</p>
                <p className="text-sm text-gray-500 mb-4">{specialty.doctorCount} bác sĩ chuyên khoa</p>
                <a 
                  href="#booking" 
                  className="inline-flex items-center text-teal-600 font-medium hover:text-teal-700"
                >
                  Đặt lịch khám
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSpecialties;