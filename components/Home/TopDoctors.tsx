import React from 'react';
import { Star, Calendar } from 'lucide-react';

const TopDoctors = () => {
  const doctors = [
    {
      id: 1,
      name: 'BS. Nguyễn Thị Minh',
      specialty: 'Nhi khoa',
      image: 'https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 4.9,
      experience: '15 năm kinh nghiệm',
      availability: 'Thứ 2-6: 8:00 - 17:00'
    },
    {
      id: 2,
      name: 'BS. Trần Văn Đức',
      specialty: 'Tim mạch',
      image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 4.8,
      experience: '12 năm kinh nghiệm',
      availability: 'Thứ 3-7: 9:00 - 18:00'
    },
    {
      id: 3,
      name: 'BS. Lê Hoàng Nam',
      specialty: 'Da liễu',
      image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 4.7,
      experience: '10 năm kinh nghiệm',
      availability: 'Thứ 2-6: 8:00 - 17:00'
    },
    {
      id: 4,
      name: 'BS. Phạm Thị Hương',
      specialty: 'Sản phụ khoa',
      image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 4.9,
      experience: '18 năm kinh nghiệm',
      availability: 'Thứ 2-7: 7:30 - 17:00'
    }
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bác sĩ nổi bật</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Đội ngũ bác sĩ hàng đầu với nhiều năm kinh nghiệm, sẵn sàng tư vấn và điều trị cho bạn</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <div 
              key={doctor.id} 
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
            >
              <div className="h-56 overflow-hidden">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium ml-1 text-gray-700">{doctor.rating}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                <p className="text-sm text-teal-600 font-medium mb-2">Chuyên khoa {doctor.specialty}</p>
                <p className="text-sm text-gray-600 mb-4">{doctor.experience}</p>
                <p className="text-sm text-gray-500 flex items-center mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  {doctor.availability}
                </p>
                <a 
                  href="#booking" 
                  className="block w-full text-center py-2.5 px-4 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition font-medium"
                >
                  Đặt lịch khám
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <a 
            href="#doctors" 
            className="inline-flex items-center text-teal-600 font-medium hover:text-teal-700"
          >
          </a>
        </div>
      </div>
    </section>
  );
};

export default TopDoctors;