import React from 'react';
import { Calendar, Clock, User, Phone, FileText } from 'lucide-react';

const BookingSection = () => {
  const specialties = [
    'Nhi khoa', 'Tim mạch', 'Da liễu', 'Sản phụ khoa', 
    'Nội tiết', 'Tai Mũi Họng', 'Mắt', 'Thần kinh'
  ];

  return (
    <section id="booking" className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-500 to-teal-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-5/12 text-white">
            <h2 className="text-3xl font-bold mb-4">Đặt lịch khám bệnh</h2>
            <p className="text-teal-50 mb-6">
              Tiết kiệm thời gian chờ đợi với dịch vụ đặt lịch khám trực tuyến. 
              Chọn bác sĩ, ngày giờ phù hợp và nhận tư vấn chuyên nghiệp.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Quy trình đặt lịch</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-teal-200 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-bold text-sm">1</div>
                  <p>Chọn chuyên khoa và bác sĩ phù hợp với nhu cầu</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-teal-200 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-bold text-sm">2</div>
                  <p>Chọn ngày và giờ khám, điền thông tin cá nhân</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-teal-200 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-bold text-sm">3</div>
                  <p>Nhận xác nhận lịch hẹn qua SMS và email</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-teal-200 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-bold text-sm">4</div>
                  <p>Đến khám đúng giờ, không cần xếp hàng chờ đợi</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">Hỗ trợ đặt lịch</h3>
              <p className="mb-3">Gọi hotline hỗ trợ 24/7:</p>
              <p className="text-2xl font-bold">1900-8888</p>
            </div>
          </div>
          
          <div className="md:w-7/12">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Thông tin đặt lịch</h3>
              
              <div className="grid gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên khoa</label>
                  <div className="relative">
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none">
                      <option value="">-- Chọn chuyên khoa --</option>
                      {specialties.map((specialty, index) => (
                        <option key={index} value={specialty}>{specialty}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày khám</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giờ khám</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <select className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                        <option value="">-- Chọn giờ --</option>
                        <option value="08:00">08:00 - 09:00</option>
                        <option value="09:00">09:00 - 10:00</option>
                        <option value="10:00">10:00 - 11:00</option>
                        <option value="13:30">13:30 - 14:30</option>
                        <option value="14:30">14:30 - 15:30</option>
                        <option value="15:30">15:30 - 16:30</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Nhập họ và tên"
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Triệu chứng</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      placeholder="Mô tả triệu chứng của bạn"
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 h-24"
                    ></textarea>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition mt-2"
                >
                  Xác nhận đặt lịch
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;