import React from 'react';
import { Hospital, Video, Check, ArrowRight } from 'lucide-react';

const BookingSection = () => {
  const directBookingSteps = [
    'Chọn chuyên khoa, bác sĩ và khung giờ.',
    'Nhận xác nhận lịch hẹn tức thì.',
    'Đến phòng khám đúng giờ, không cần chờ đợi.',
  ];

  const onlineConsultationSteps = [
    'Chọn bác sĩ và đặt lịch tư vấn online.',
    'Kết nối qua video call an toàn, bảo mật.',
    'Nhận đơn thuốc điện tử qua email.',
  ];

  return (
    <section id="booking" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold">Dịch vụ linh hoạt</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Chọn Hình Thức Khám Bệnh Phù Hợp
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mt-4">
            Dù bạn muốn gặp bác sĩ trực tiếp hay cần tư vấn nhanh chóng tại nhà, chúng tôi đều có giải pháp tối ưu cho nhu cầu sức khỏe của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Khám tại phòng khám */}
          <div className="rounded-2xl flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white border">
            <div className="h-56">
                <img 
                    src="https://images.pexels.com/photos/3992870/pexels-photo-3992870.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Khám bệnh tại phòng khám" 
                    className="w-full h-full object-cover" 
                />
            </div>
            <div className="p-8 flex flex-col flex-grow bg-blue-50/30">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white text-blue-600 rounded-lg flex items-center justify-center shadow-md">
                        <Hospital className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">Khám tại phòng khám</h3>
                        <p className="text-gray-600">Gặp gỡ và nhận chẩn đoán trực tiếp từ bác sĩ.</p>
                    </div>
                </div>
                <div className="flex-grow">
                    <ul className="space-y-3 mt-4 mb-8">
                        {directBookingSteps.map((step, index) => (
                        <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5 mr-3" />
                            <span className="text-gray-700">{step}</span>
                        </li>
                        ))}
                    </ul>
                </div>
                <a
                    href="/dat-lich-kham"
                    className="mt-auto block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                    Đặt lịch hẹn <ArrowRight className="inline ml-2 h-4 w-4" />
                </a>
            </div>
          </div>

          {/* Card 2: Tư vấn từ xa */}
          <div className="rounded-2xl flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gray-800">
            <div className="h-56">
                <img 
                    src="https://images.pexels.com/photos/4099467/pexels-photo-4099467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Tư vấn bác sĩ từ xa" 
                    className="w-full h-full object-cover" 
                />
            </div>
            <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white/10 text-white rounded-lg flex items-center justify-center">
                        <Video className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">Tư vấn từ xa</h3>
                        <p className="text-gray-400">Tiện lợi, mọi lúc mọi nơi, ngay tại nhà bạn.</p>
                    </div>
                </div>
                <div className="flex-grow">
                    <ul className="space-y-3 mt-4 mb-8">
                        {onlineConsultationSteps.map((step, index) => (
                        <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5 mr-3" />
                            <span className="text-gray-300">{step}</span>
                        </li>
                        ))}
                    </ul>
                </div>
                <a
                    href="/tu-van-online"
                    className="mt-auto block w-full text-center bg-white text-gray-800 hover:bg-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                    Bắt đầu tư vấn <ArrowRight className="inline ml-2 h-4 w-4" />
                </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BookingSection;