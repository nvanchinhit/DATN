import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin, Globe, HeartPulse, UserCheck, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Giả sử bạn đang dùng component Button từ shadcn/ui

// **CHUẨN META CHO SEO**
export const metadata: Metadata = {
  title: 'HealthFirst Clinic | Phòng Khám Cá Nhân Uy Tín tại Liên Chiểu, Đà Nẵng',
  description: 'Tìm hiểu về HealthFirst Clinic, phòng khám cá nhân tận tâm tại 116 Nguyễn Huy Tưởng, Đà Nẵng. Chúng tôi cung cấp dịch vụ khám chữa bệnh hiện đại, cá nhân hóa. Đặt lịch ngay!',
  keywords: 'phòng khám đà nẵng, phòng khám liên chiểu, healthfirst clinic, đặt lịch khám online, bác sĩ cá nhân đà nẵng, khám sức khỏe tổng quát',
};

export default function AboutUsPage() {
  return (
    <main className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-blue-600 text-white flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
          alt="Đội ngũ bác sĩ HealthFirst Clinic đang làm việc"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Về HealthFirst Clinic</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
            Nơi sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Sứ Mệnh Của Chúng Tôi</h2>
              <p className="text-gray-600 leading-relaxed">
                Tại HealthFirst Clinic, chúng tôi tin rằng mỗi cá nhân xứng đáng nhận được sự chăm sóc y tế tận tâm, thấu đáo và được cá nhân hóa. Sứ mệnh của chúng tôi là trở thành người bạn đồng hành đáng tin cậy trên hành trình chăm sóc và bảo vệ sức khỏe của bạn và gia đình. Chúng tôi không chỉ điều trị bệnh, mà còn hướng đến việc xây dựng một lối sống khỏe mạnh và phòng ngừa bệnh tật một cách chủ động.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Giá Trị Cốt Lõi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                    <HeartPulse size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Tận Tâm Với Bệnh Nhân</h3>
                    <p className="text-gray-600 mt-1">Luôn đặt lợi ích và sức khỏe của bệnh nhân lên trên hết, lắng nghe và thấu hiểu từng nhu cầu.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                    <Stethoscope size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Chuyên Môn Vượt Trội</h3>
                    <p className="text-gray-600 mt-1">Đội ngũ y bác sĩ giàu kinh nghiệm, liên tục cập nhật kiến thức và công nghệ y khoa tiên tiến.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                    <UserCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Cá Nhân Hóa Điều Trị</h3>
                    <p className="text-gray-600 mt-1">Mỗi phác đồ điều trị được xây dựng dựa trên tình trạng sức khỏe và cơ địa riêng của từng người.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
                <Link href="/booking">
                    <Button size="lg" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
                        Đặt Lịch Hẹn Ngay
                    </Button>
                </Link>
            </section>
          </div>
          <aside className="bg-white p-6 rounded-lg shadow-lg h-fit">
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Thông Tin Liên Hệ</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <MapPin className="text-blue-600 mt-1 mr-3 flex-shrink-0" size={20} />
                <span>116 Nguyễn Huy Tưởng, Phường Hòa Minh, Quận Liên Chiểu, TP. Đà Nẵng</span>
              </li>
              <li className="flex items-center">
                <Phone className="text-blue-600 mr-3 flex-shrink-0" size={20} />
                <a href="tel:0344757955" className="hover:text-blue-600">0344 757 955</a>
              </li>
              <li className="flex items-center">
                <Mail className="text-blue-600 mr-3 flex-shrink-0" size={20} />
                <a href="mailto:chinhnvpd10204@gmail.com" className="hover:text-blue-600 break-all">chinhnvpd10204@gmail.com</a>
              </li>
              <li className="flex items-center">
                <Globe className="text-blue-600 mr-3 flex-shrink-0" size={20} />
                <a href="https://demo.abc" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">demo.abc</a>
              </li>
            </ul>

            <div className="mt-6 rounded-lg overflow-hidden">
              {/* Lấy mã nhúng từ Google Maps cho địa chỉ của bạn */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.844750125433!2d108.15852831533005!3d16.07355524367981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314218d68dff8e2b%3A0x253245848a8e1329!2zMTE2IE5ndXnhu4VuIEh1eSBUxrDhu59uZywgSG_DoCBNaW5oLCBMacOqbiBDaGnhu4N1LCDEkMOgIE7hurVuZywgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1678886655443!5m2!1svi!2s"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ vị trí HealthFirst Clinic"
              ></iframe>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}