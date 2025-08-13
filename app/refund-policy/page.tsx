import React from 'react';
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiInfo, 
  FiPhone, 
  FiMail, 
  FiClock, 
  FiMapPin,
  FiAlertTriangle,
  FiCreditCard,
  FiHome,
  FiUserCheck,
  FiFileText,
  FiDollarSign,
  FiShield,
  FiHeart,
  FiStar
} from 'react-icons/fi';

export default function RefundPolicyPage() {
  const lastUpdatedDate = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section với hình ảnh */}
        <header className="text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white shadow-xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-20 right-20 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute bottom-10 left-1/4 w-16 h-16 bg-white rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-8 backdrop-blur-sm">
              <FiShield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight mb-6">
              Chính Sách Hoàn Tiền
            </h1>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
              Cam kết của TDCARE về sự minh bạch và quyền lợi của khách hàng. 
              Chúng tôi đảm bảo mọi giao dịch đều được bảo vệ và xử lý công bằng.
            </p>
            
            {/* Trust indicators */}
            <div className="flex justify-center items-center gap-8 text-blue-100">
              <div className="flex items-center gap-2">
                <FiHeart className="w-5 h-5 text-red-300" />
                <span>100% An toàn</span>
              </div>
              <div className="flex items-center gap-2">
                <FiStar className="w-5 h-5 text-yellow-300" />
                <span>Uy tín hàng đầu</span>
              </div>
              <div className="flex items-center gap-2">
                <FiShield className="w-5 h-5 text-green-300" />
                <span>Bảo mật tuyệt đối</span>
              </div>
            </div>
          </div>
        </header>

        <main className="space-y-12">
          {/* 1. Tổng Quan với hình ảnh */}
          <section className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full opacity-50 -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                  <FiInfo className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">1. Tổng quan</h2>
              </div>
              <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                <p>
                  Tại TDCARE, chúng tôi luôn đặt sự hài lòng và tin tưởng của khách hàng lên hàng đầu. 
                  Chính sách hoàn tiền này được xây dựng để đảm bảo quyền lợi của bạn được bảo vệ một cách tốt nhất 
                  khi sử dụng dịch vụ của chúng tôi.
                </p>
                
                <p>
                  Chúng tôi hiểu rằng việc đặt lịch hẹn khám bệnh và thanh toán trực tuyến có thể gây ra những lo ngại về tính minh bạch và an toàn. 
                  Do đó, TDCARE cam kết cung cấp một hệ thống hoàn tiền công bằng, minh bạch và dễ hiểu, 
                  đảm bảo rằng mọi khách hàng đều được đối xử công bằng trong mọi tình huống.
                </p>

                <p>
                  Chính sách này được thiết kế dựa trên các nguyên tắc cơ bản: <strong>công bằng</strong>, <strong>minh bạch</strong>, 
                  <strong>nhanh chóng</strong> và <strong>dễ tiếp cận</strong>. Chúng tôi cam kết xử lý mọi yêu cầu hoàn tiền 
                  trong thời gian sớm nhất có thể, với quy trình rõ ràng và thông tin đầy đủ cho khách hàng.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <FiShield className="w-5 h-5" />
                      Cam kết của chúng tôi
                    </h4>
                    <ul className="space-y-2 text-blue-800 text-sm">
                      <li>• Xử lý hoàn tiền trong vòng 24-48 giờ</li>
                      <li>• Thông báo trạng thái rõ ràng, minh bạch</li>
                      <li>• Hỗ trợ khách hàng 24/7 qua nhiều kênh</li>
                      <li>• Không thu phí xử lý hoàn tiền</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <FiHeart className="w-5 h-5" />
                      Lợi ích cho khách hàng
                    </h4>
                    <ul className="space-y-2 text-purple-800 text-sm">
                      <li>• Bảo vệ quyền lợi tối đa</li>
                      <li>• Quy trình đơn giản, dễ hiểu</li>
                      <li>• Hỗ trợ đa dạng các phương thức thanh toán</li>
                      <li>• Đội ngũ CSKH chuyên nghiệp</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl shadow-lg">
                    <FiInfo className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-900 mb-2 text-lg">Lưu ý quan trọng</p>
                    <p className="text-blue-800 mb-3">
                      Chính sách này áp dụng cho tất cả các dịch vụ y tế và thanh toán được thực hiện trên nền tảng TDCARE, 
                      bao gồm: đặt lịch khám bệnh, tư vấn trực tuyến, mua thuốc, và các dịch vụ y tế khác.
                    </p>
                    <p className="text-blue-700 text-sm">
                      <strong>Phạm vi áp dụng:</strong> Toàn bộ hệ thống TDCARE tại Việt Nam, các đối tác y tế, 
                      và mọi khách hàng sử dụng dịch vụ của chúng tôi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Điều Kiện Hoàn Tiền với hình ảnh */}
          <section className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-green-100 rounded-full opacity-50 -translate-y-20 -translate-x-20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                  <FiUserCheck className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">2. Điều kiện hoàn tiền</h2>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Cột Được Hoàn Tiền */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl shadow-lg mb-4">
                      <FiCheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-green-800">Trường hợp được hoàn tiền</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      'Lịch hẹn bị hủy bởi bác sĩ hoặc phòng khám',
                      'Lỗi kỹ thuật từ hệ thống TDCARE khiến lịch hẹn không thể diễn ra',
                      'Dịch vụ không được cung cấp đúng như mô tả hoặc cam kết',
                      'Bác sĩ không thể thực hiện khám vì lý do khách quan',
                      'Khách hàng hủy lịch hẹn trước thời điểm hẹn tối thiểu 24 giờ'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                        <FiCheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-green-800 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Cột Không Được Hoàn Tiền */}
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 border border-red-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-2xl shadow-lg mb-4">
                      <FiXCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-red-800">Trường hợp không được hoàn tiền</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      'Khách hàng hủy lịch hẹn trong vòng 24 giờ trước thời điểm hẹn',
                      'Khách hàng không đến khám (no-show) mà không thông báo',
                      'Dịch vụ đã được thực hiện đầy đủ và đúng chất lượng',
                      'Lịch hẹn bị hủy do lỗi từ phía khách hàng'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                        <FiXCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-red-800 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
          
          {/* 3. Quy Trình Hoàn Tiền - Card Design với hình ảnh */}
          <section className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-100 rounded-full opacity-50 translate-y-16 -translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <FiFileText className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">3. Quy trình yêu cầu hoàn tiền</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { 
                    title: "Gửi yêu cầu", 
                    description: "Liên hệ CSKH qua Hotline hoặc Email, cung cấp mã lịch hẹn và lý do chi tiết.",
                    icon: FiMail,
                    color: "blue",
                    step: "01",
                    bgGradient: "from-blue-500 to-cyan-500"
                  },
                  { 
                    title: "Xem xét & Xác minh", 
                    description: "TDCARE tiếp nhận, kiểm tra thông tin và đối chiếu với các bên liên quan.",
                    icon: FiUserCheck,
                    color: "yellow",
                    step: "02",
                    bgGradient: "from-yellow-500 to-orange-500"
                  },
                  { 
                    title: "Phê duyệt & Xử lý", 
                    description: "Nếu hợp lệ, tiến hành thủ tục hoàn tiền về phương thức thanh toán gốc.",
                    icon: FiCheckCircle,
                    color: "green",
                    step: "03",
                    bgGradient: "from-green-500 to-emerald-500"
                  },
                  { 
                    title: "Hoàn tất", 
                    description: "Thông báo khi giao dịch hoàn tiền hoàn tất. Thời gian nhận tiền tùy thuộc ngân hàng.",
                    icon: FiDollarSign,
                    color: "purple",
                    step: "04",
                    bgGradient: "from-purple-500 to-pink-500"
                  }
                ].map((step, index) => (
                  <div key={index} className={`bg-gradient-to-br from-${step.color}-50 to-${step.color}-100 rounded-2xl p-6 border border-${step.color}-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative`}>
                    {/* Step number badge */}
                    <div className="absolute -top-3 -right-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${step.bgGradient} rounded-full flex items-center justify-center shadow-lg border-4 border-white`}>
                        <span className="text-white font-bold text-lg">{step.step}</span>
                      </div>
                    </div>
                    
                    {/* Icon container */}
                    <div className="text-center mb-6 pt-4">
                      <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${step.bgGradient} rounded-2xl shadow-lg mb-4`}>
                        <step.icon className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="text-center">
                      <h4 className="font-bold text-gray-900 mb-4 text-lg leading-tight">{step.title}</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Thời Gian & Phí Hoàn Tiền với hình ảnh */}
          <section className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 w-24 h-24 bg-orange-100 rounded-full opacity-50 -translate-y-12"></div>
            <div className="relative z-10">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg">
                      <FiClock className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">4. Thời gian xử lý</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { icon: FiCreditCard, title: "Thẻ tín dụng/ghi nợ", time: "5-10 ngày làm việc", color: "blue", bgGradient: "from-blue-500 to-indigo-500" },
                      { icon: FiHome, title: "Chuyển khoản ngân hàng", time: "3-7 ngày làm việc", color: "green", bgGradient: "from-green-500 to-emerald-500" },
                      { icon: FiMapPin, title: "Ví điện tử (Momo, ZaloPay)", time: "1-3 ngày làm việc", color: "purple", bgGradient: "from-purple-500 to-pink-500" }
                    ].map((item, index) => (
                      <div key={index} className={`flex items-center gap-4 p-6 bg-gradient-to-r from-${item.color}-50 to-${item.color}-100 rounded-2xl border border-${item.color}-200 hover:shadow-lg transition-all duration-300`}>
                        <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-r ${item.bgGradient} rounded-2xl shadow-lg`}>
                          <item.icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-lg">{item.title}</p>
                          <p className="text-gray-600">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                      <FiDollarSign className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">5. Về phí hoàn tiền</h2>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200 shadow-lg text-center">
                    <div className="text-6xl mb-6">💚</div>
                    <p className="text-emerald-800 font-bold mb-4 text-xl">
                      TDCARE <strong>không thu bất kỳ khoản phí nào</strong> cho việc xử lý hoàn tiền.
                    </p>
                    <p className="text-emerald-700 text-lg">
                      Tuy nhiên, ngân hàng hoặc đơn vị cung cấp ví điện tử của bạn có thể áp dụng phí giao dịch theo chính sách riêng của họ.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* 5. Liên Hệ Hỗ Trợ với hình ảnh */}
          <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <FiPhone className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold">6. Cần hỗ trợ?</h2>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-6 text-blue-100">Liên hệ chúng tôi</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl">
                        <FiPhone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-blue-100">Hotline</p>
                        <p className="text-blue-200 text-lg">1900-1234</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl">
                        <FiMail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-blue-100">Email</p>
                        <p className="text-blue-200 text-lg">support@tdcare.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors">
                      <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-xl">
                        <FiClock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-blue-100">Giờ làm việc</p>
                        <p className="text-blue-200 text-lg">8:00 - 18:00 (T2 - CN)</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-6 text-blue-100">Thông tin cần cung cấp</h3>
                  <div className="space-y-3">
                    {[
                      'Mã lịch hẹn (ví dụ: TDCARE-12345)',
                      'Thông tin thanh toán đã sử dụng',
                      'Lý do yêu cầu hoàn tiền chi tiết',
                      'Hình ảnh, video bằng chứng (nếu có)'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors">
                        <FiCheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                        <span className="text-blue-100">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Lưu ý cuối với hình ảnh */}
          <section className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-amber-100 rounded-full opacity-50 -translate-y-14 translate-x-14"></div>
            <div className="relative z-10">
              <div className="flex items-start gap-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg flex-shrink-0">
                  <FiAlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">7. Điều khoản bổ sung</h3>
                  <ul className="space-y-4 text-gray-700">
                    <li className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <FiCheckCircle className="h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">TDCARE có quyền cập nhật, sửa đổi chính sách này.</span>
                    </li>
                    <li className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <FiCheckCircle className="h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Mọi thay đổi sẽ được thông báo đến khách hàng trước khi có hiệu lực.</span>
                    </li>
                    <li className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <FiCheckCircle className="h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Các trường hợp đặc biệt sẽ được xem xét và giải quyết theo từng tình huống cụ thể.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer với thông tin cập nhật */}
        <footer className="mt-16 bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FiInfo className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Thông tin cập nhật</h4>
            <p className="text-blue-600 font-medium">
              Chính sách này được cập nhật lần cuối: {lastUpdatedDate}
            </p>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} TDCARE. Tất cả quyền được bảo lưu.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Phiên bản: 2.0 | Mã chính sách: TDCARE-REFUND-2024
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}