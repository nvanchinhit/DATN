import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin, Globe, HeartPulse, UserCheck, Stethoscope, Award, Clock, Users, Building2, Microscope, Shield, Target, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'HealthFirst Clinic | Phòng Khám Cá Nhân Uy Tín tại Liên Chiểu, Đà Nẵng',
  description: 'Tìm hiểu về HealthFirst Clinic, phòng khám cá nhân tận tâm tại 116 Nguyễn Huy Tưởng, Đà Nẵng. Chúng tôi cung cấp dịch vụ khám chữa bệnh hiện đại, cá nhân hóa. Đặt lịch ngay!',
  keywords: 'phòng khám đà nẵng, phòng khám liên chiểu, healthfirst clinic, đặt lịch khám online, bác sĩ cá nhân đà nẵng, khám sức khỏe tổng quát',
};

export default function AboutUsPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Về HealthFirst Clinic
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Nơi sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Sứ Mệnh Của Chúng Tôi
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Tại HealthFirst Clinic, chúng tôi tin rằng mỗi cá nhân xứng đáng nhận được sự chăm sóc y tế tận tâm, thấu đáo và được cá nhân hóa. Sứ mệnh của chúng tôi là trở thành người bạn đồng hành đáng tin cậy trên hành trình chăm sóc và bảo vệ sức khỏe của bạn và gia đình. Chúng tôi không chỉ điều trị bệnh, mà còn hướng đến việc xây dựng một lối sống khỏe mạnh và phòng ngừa bệnh tật một cách chủ động.
              </p>
            </section>

            <section className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Giá Trị Cốt Lõi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-500 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <HeartPulse size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Tận Tâm Với Bệnh Nhân</h3>
                  <p className="text-gray-600 text-sm">Luôn đặt lợi ích và sức khỏe của bệnh nhân lên trên hết.</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-500 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Stethoscope size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Chuyên Môn Vượt Trội</h3>
                  <p className="text-gray-600 text-sm">Đội ngũ y bác sĩ giàu kinh nghiệm, liên tục cập nhật kiến thức.</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-500 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <UserCheck size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Cá Nhân Hóa Điều Trị</h3>
                  <p className="text-gray-600 text-sm">Mỗi phác đồ điều trị được xây dựng dựa trên tình trạng sức khỏe riêng.</p>
                </div>
              </div>
            </section>

            <section className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/30 p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                Lịch Sử Phát Triển
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-400 p-3 rounded-full shadow-lg">
                    <Calendar size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">2020 - Thành lập</h3>
                    <p className="text-gray-600">HealthFirst Clinic được thành lập với mục tiêu mang đến dịch vụ y tế chất lượng cao cho cộng đồng Đà Nẵng.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-400 p-3 rounded-full shadow-lg">
                    <Users size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">2021 - Mở rộng đội ngũ</h3>
                    <p className="text-gray-600">Tuyển dụng thêm các bác sĩ chuyên khoa đầu ngành, đầu tư trang thiết bị hiện đại.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-400 p-3 rounded-full shadow-lg">
                    <Award size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">2023 - Chứng nhận chất lượng</h3>
                    <p className="text-gray-600">Đạt chứng nhận ISO 9001:2015 và được Bộ Y tế công nhận là phòng khám đạt chuẩn quốc tế.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/30 p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                Đội Ngũ Bác Sĩ & Chuyên Môn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Bác sĩ Nội khoa</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• BS. Nguyễn Văn A - Chuyên khoa Tim mạch (15 năm kinh nghiệm)</li>
                    <li>• BS. Trần Thị B - Chuyên khoa Tiêu hóa (12 năm kinh nghiệm)</li>
                    <li>• BS. Lê Văn C - Chuyên khoa Hô hấp (10 năm kinh nghiệm)</li>
                    <li>• BS. Phạm Thị D - Chuyên khoa Nội tiết (8 năm kinh nghiệm)</li>
                    <li>• BS. Hoàng Văn E - Chuyên khoa Thận (11 năm kinh nghiệm)</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Bác sĩ Ngoại khoa</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• BS. Vũ Văn F - Chuyên khoa Chấn thương (14 năm kinh nghiệm)</li>
                    <li>• BS. Nguyễn Thị G - Chuyên khoa Thần kinh (13 năm kinh nghiệm)</li>
                    <li>• BS. Trần Văn H - Chuyên khoa Tiết niệu (9 năm kinh nghiệm)</li>
                    <li>• BS. Lê Thị I - Chuyên khoa Phụ sản (16 năm kinh nghiệm)</li>
                    <li>• BS. Phạm Văn K - Chuyên khoa Tai mũi họng (7 năm kinh nghiệm)</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-2xl border border-green-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Đội ngũ hỗ trợ</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Điều dưỡng viên</h4>
                    <p>15 điều dưỡng viên có chứng chỉ hành nghề, được đào tạo chuyên sâu</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Kỹ thuật viên</h4>
                    <p>8 kỹ thuật viên xét nghiệm, chẩn đoán hình ảnh chuyên nghiệp</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Nhân viên y tế</h4>
                    <p>12 nhân viên hỗ trợ, tư vấn và chăm sóc bệnh nhân tận tâm</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/30 p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                Dịch Vụ Khám Chữa Bệnh
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-400 p-4 rounded-full shadow-lg mx-auto mb-3 w-16 h-16 flex items-center justify-center">
                    <HeartPulse size={28} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Khám sức khỏe tổng quát</h3>
                  <p className="text-gray-600 text-sm">Kiểm tra toàn diện sức khỏe, phát hiện sớm các bệnh lý. Bao gồm khám lâm sàng, xét nghiệm cơ bản, chẩn đoán hình ảnh.</p>
                </div>
                <div className="text-center p-4">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-400 p-4 rounded-full shadow-lg mx-auto mb-3 w-16 h-16 flex items-center justify-center">
                    <Microscope size={28} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Xét nghiệm chuyên sâu</h3>
                  <p className="text-gray-600 text-sm">Các xét nghiệm máu, nước tiểu, sinh hóa chính xác. Hỗ trợ chẩn đoán bệnh lý chính xác và theo dõi điều trị.</p>
                </div>
                <div className="text-center p-4">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-400 p-4 rounded-full shadow-lg mx-auto mb-3 w-16 h-16 flex items-center justify-center">
                    <Stethoscope size={28} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Tư vấn dinh dưỡng</h3>
                  <p className="text-gray-600 text-sm">Tư vấn chế độ ăn uống phù hợp với từng bệnh lý. Xây dựng thực đơn khoa học cho từng đối tượng.</p>
                </div>
                <div className="text-center p-4">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-400 p-4 rounded-full shadow-lg mx-auto mb-3 w-16 h-16 flex items-center justify-center">
                    <Clock size={28} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Khám theo lịch hẹn</h3>
                  <p className="text-gray-600 text-sm">Đặt lịch khám trực tuyến, tiết kiệm thời gian chờ đợi. Hỗ trợ đặt lịch 24/7 qua website và ứng dụng.</p>
                </div>
                <div className="text-center p-4">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-400 p-4 rounded-full shadow-lg mx-auto mb-3 w-16 h-16 flex items-center justify-center">
                    <Shield size={28} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Tiêm chủng</h3>
                  <p className="text-gray-600 text-sm">Dịch vụ tiêm chủng an toàn cho mọi lứa tuổi. Cung cấp đầy đủ các loại vaccine theo lịch tiêm chủng quốc gia.</p>
                </div>
                <div className="text-center p-4">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-400 p-4 rounded-full shadow-lg mx-auto mb-3 w-16 h-16 flex items-center justify-center">
                    <UserCheck size={28} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Theo dõi bệnh mãn tính</h3>
                  <p className="text-gray-600 text-sm">Quản lý và điều trị các bệnh mãn tính hiệu quả. Tư vấn lối sống và phòng ngừa biến chứng.</p>
                </div>
              </div>
              <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Dịch vụ chuyên khoa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Chuyên khoa Nội</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Tim mạch - Huyết áp - Đái tháo đường</li>
                      <li>• Tiêu hóa - Gan mật - Dạ dày</li>
                      <li>• Hô hấp - Phổi - Hen suyễn</li>
                      <li>• Nội tiết - Thận - Tiết niệu</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Chuyên khoa Ngoại</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Chấn thương chỉnh hình</li>
                      <li>• Thần kinh - Mạch máu</li>
                      <li>• Phụ sản - Sản khoa</li>
                      <li>• Tai mũi họng - Răng hàm mặt</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/30 p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                Cơ Sở Vật Chất & Trang Thiết Bị
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Trang thiết bị hiện đại</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Máy siêu âm 4D hiện đại - Chẩn đoán chính xác</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Máy X-quang kỹ thuật số - Giảm bức xạ</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Máy đo điện tim ECG - Theo dõi tim mạch</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Phòng xét nghiệm đạt chuẩn ISO</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Máy nội soi dạ dày, đại tràng</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Hệ thống xét nghiệm tự động</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Cơ sở vật chất</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Phòng khám sạch sẽ, thoáng mát</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Khu vực chờ đợi tiện nghi với TV, wifi</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Bãi đỗ xe rộng rãi, an toàn</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Hệ thống điều hòa toàn bộ</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Phòng vệ sinh sạch sẽ, hiện đại</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Khu vực tiếp đón chuyên nghiệp</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-2xl border border-green-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Hệ thống quản lý</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Hệ thống đặt lịch</h4>
                    <p>Website và ứng dụng di động cho phép đặt lịch 24/7</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Quản lý hồ sơ</h4>
                    <p>Hệ thống lưu trữ hồ sơ bệnh án điện tử an toàn</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Thanh toán</h4>
                    <p>Hỗ trợ thanh toán trực tuyến và tại chỗ</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/30 p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                Quy Trình Khám Bệnh
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">1</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Đặt lịch hẹn</h3>
                  <p className="text-gray-600 text-sm">Đặt lịch khám trực tuyến hoặc qua điện thoại</p>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">2</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Đăng ký khám</h3>
                  <p className="text-gray-600 text-sm">Làm thủ tục đăng ký và khai báo thông tin</p>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">3</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Khám bệnh</h3>
                  <p className="text-gray-600 text-sm">Bác sĩ khám và tư vấn điều trị</p>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">4</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Kết thúc</h3>
                  <p className="text-gray-600 text-sm">Nhận đơn thuốc và hẹn tái khám</p>
                </div>
              </div>
            </section>

            <section className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/30 p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                Cam Kết Chất Lượng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-green-400 to-blue-400 p-3 rounded-full shadow-lg">
                    <Shield size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">An toàn tuyệt đối</h3>
                    <p className="text-gray-600">Tuân thủ nghiêm ngặt các quy định về vệ sinh, khử trùng và an toàn y tế.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-green-400 to-blue-400 p-3 rounded-full shadow-lg">
                    <Clock size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Thời gian nhanh chóng</h3>
                    <p className="text-gray-600">Quy trình khám bệnh tối ưu, giảm thiểu thời gian chờ đợi.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-green-400 to-blue-400 p-3 rounded-full shadow-lg">
                    <Users size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Đội ngũ chuyên nghiệp</h3>
                    <p className="text-gray-600">Bác sĩ có chuyên môn cao, thường xuyên cập nhật kiến thức y khoa.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-green-400 to-blue-400 p-3 rounded-full shadow-lg">
                    <Award size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Chất lượng dịch vụ</h3>
                    <p className="text-gray-600">Cam kết mang đến trải nghiệm khám chữa bệnh tốt nhất cho bệnh nhân.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/30 p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                Thành Tựu & Chứng Nhận
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                  <Award size={48} className="text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">ISO 9001:2015</h3>
                  <p className="text-gray-600 text-sm">Chứng nhận hệ thống quản lý chất lượng quốc tế</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                  <Shield size={48} className="text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Bộ Y tế công nhận</h3>
                  <p className="text-gray-600 text-sm">Phòng khám đạt chuẩn quốc tế được Bộ Y tế công nhận</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                  <Users size={48} className="text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">10,000+ bệnh nhân</h3>
                  <p className="text-gray-600 text-sm">Đã phục vụ hơn 10,000 bệnh nhân với sự hài lòng cao</p>
                </div>
              </div>
            </section>

            <section className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/30 p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                Tầm Nhìn Tương Lai
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-400 p-3 rounded-full shadow-lg">
                    <Target size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Mở rộng quy mô</h3>
                    <p className="text-gray-600">Phát triển thành chuỗi phòng khám đa khoa chất lượng cao tại các quận huyện của Đà Nẵng.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-400 p-3 rounded-full shadow-lg">
                    <Building2 size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Đầu tư công nghệ</h3>
                    <p className="text-gray-600">Áp dụng công nghệ AI, telemedicine để nâng cao chất lượng khám chữa bệnh.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-400 p-3 rounded-full shadow-lg">
                    <Users size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Phát triển đội ngũ</h3>
                    <p className="text-gray-600">Tuyển dụng và đào tạo thêm các bác sĩ chuyên khoa đầu ngành.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="flex justify-center">
              <Link href="/specialty">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 font-semibold">
                        Đặt Lịch Hẹn Ngay
                    </Button>
                </Link>
            </section>
          </div>

          {/* Contact Card */}
          <aside className="bg-white rounded-lg shadow-sm border p-6 h-fit">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
              Thông Tin Liên Hệ
            </h3>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li className="flex items-start">
                <MapPin className="text-blue-500 mt-1 mr-3 flex-shrink-0" size={20} />
                <span>116 Nguyễn Huy Tưởng, Phường Hòa Minh, Quận Liên Chiểu, TP. Đà Nẵng</span>
              </li>
              <li className="flex items-center">
                <Phone className="text-blue-500 mr-3 flex-shrink-0" size={20} />
                <a href="tel:0344757955" className="hover:text-blue-600">0344 757 955</a>
              </li>
              <li className="flex items-center">
                <Mail className="text-blue-500 mr-3 flex-shrink-0" size={20} />
                <a href="mailto:chinhnvpd10204@gmail.com" className="hover:text-blue-600 break-all">chinhnvpd10204@gmail.com</a>
              </li>
              <li className="flex items-center">
                <Globe className="text-blue-500 mr-3 flex-shrink-0" size={20} />
                <a href="https://demo.abc" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">demo.abc</a>
              </li>
            </ul>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Giờ làm việc</h4>
              <div className="space-y-1 text-gray-600 text-sm">
                <div className="flex justify-between">
                  <span>Thứ 2 - Thứ 6:</span>
                  <span>7:00 - 20:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Thứ 7:</span>
                  <span>7:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Chủ nhật:</span>
                  <span>8:00 - 12:00</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Dịch vụ khẩn cấp</h4>
              <p className="text-gray-600 text-sm">Hỗ trợ tư vấn y tế 24/7 qua hotline: <span className="font-semibold text-red-600">0344 757 955</span></p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}