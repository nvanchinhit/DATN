"use client";
import Link from 'next/link';
import { ReactNode } from 'react';

// Một component nhỏ để định dạng các mục cho thống nhất
const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-200 pb-2 mb-4">
      {title}
    </h2>
    <div className="space-y-4 text-gray-700 leading-relaxed">
      {children}
    </div>
  </section>
);

export default function TermsOfServicePage() {
  const companyName = "HealthFirst Clinic";
  const contactEmail = "chinhnvpd10204@gmail.com";
  const effectiveDate = "26/06/2025";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-12 px-4 md:px-8">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-md">
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-4">
            Điều Khoản Dịch Vụ
          </h1>
          <p className="text-center text-gray-500 mb-10">
            Lần cập nhật cuối: {effectiveDate}
          </p>

          {/* Disclaimer Box */}
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-8 rounded-md" role="alert">
            <p className="font-bold">Lưu ý Quan trọng</p>
            <p>Bằng việc truy cập hoặc sử dụng Dịch vụ của chúng tôi, bạn đồng ý chịu sự ràng buộc của các Điều khoản này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản, bạn không được phép truy cập Dịch vụ.</p>
          </div>

          <Section title="1. Giới thiệu và Chấp nhận Điều khoản">
            <p>
              Chào mừng bạn đến với {companyName}. Các Điều Khoản Dịch Vụ này ("Điều khoản") chi phối việc bạn sử dụng trang web, ứng dụng di động và các dịch vụ liên quan (gọi chung là "Dịch vụ") do {companyName} cung cấp. Dịch vụ của chúng tôi cho phép người dùng ("Bạn" hoặc "Người dùng") tìm kiếm thông tin về các nhà cung cấp y tế, đặt lịch hẹn khám bệnh và thực hiện thanh toán cho các dịch vụ y tế.
            </p>
            <p>
              Việc bạn sử dụng Dịch vụ đồng nghĩa với việc bạn chấp nhận và đồng ý tuân thủ các Điều khoản này và <Link href="/privacy-policy" className="text-blue-600 hover:underline">Chính Sách Quyền Riêng Tư</Link> của chúng tôi.
            </p>
          </Section>

          <Section title="2. Dịch Vụ Của Chúng Tôi">
            <p>
              {companyName} là một nền tảng công nghệ trung gian, kết nối Người dùng với các cơ sở y tế, phòng khám và bác sĩ ("Nhà cung cấp Y tế").
            </p>
            <p>
              <strong>Lưu ý:</strong> {companyName} <strong>KHÔNG</strong> phải là một tổ chức y tế và <strong>KHÔNG</strong> cung cấp dịch vụ tư vấn, chẩn đoán hay điều trị y khoa. Mọi thông tin trên nền tảng chỉ mang tính chất tham khảo. Mối quan hệ giữa bạn và Nhà cung cấp Y tế là mối quan hệ độc lập. Chúng tôi không chịu trách nhiệm về chất lượng dịch vụ y tế, chẩn đoán, hay phác đồ điều trị mà bạn nhận được.
            </p>
          </Section>

          <Section title="3. Tài Khoản Người Dùng">
            <p>
              Để sử dụng một số tính năng của Dịch vụ, bạn cần phải đăng ký một tài khoản. Bạn đồng ý:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Cung cấp thông tin chính xác, cập nhật và đầy đủ về bản thân theo yêu cầu của biểu mẫu đăng ký.</li>
              <li>Chịu hoàn toàn trách nhiệm về việc bảo mật mật khẩu và tài khoản của mình.</li>
              <li>Thông báo ngay lập tức cho chúng tôi về bất kỳ hành vi sử dụng trái phép nào đối với tài khoản của bạn.</li>
              <li>Bạn phải đủ 18 tuổi hoặc có sự giám hộ của cha mẹ/người bảo hộ hợp pháp để tạo tài khoản và sử dụng Dịch vụ.</li>
            </ul>
          </Section>

          <Section title="4. Đặt Lịch Hẹn">
            <p>
              Bạn có thể đặt lịch hẹn với các Nhà cung cấp Y tế thông qua Dịch vụ của chúng tôi. Việc đặt lịch hẹn sẽ được xác nhận qua email hoặc thông báo trên ứng dụng.
            </p>
            <p>
              <strong>Chính sách Hủy lịch:</strong> Bạn có thể hủy hoặc thay đổi lịch hẹn theo chính sách của từng Nhà cung cấp Y tế, được hiển thị rõ ràng trong quá trình đặt lịch. Việc hủy lịch muộn hoặc không đến khám có thể bị tính phí theo quy định của Nhà cung cấp Y tế.
            </p>
          </Section>

          <Section title="5. Thanh Toán, Phí và Hoàn Tiền">
            <p>
              <strong>Phí Dịch vụ:</strong> Một số dịch vụ có thể yêu cầu thanh toán trước, bao gồm phí khám, phí tư vấn, hoặc các gói dịch vụ khác. Tất cả các khoản phí sẽ được niêm yết rõ ràng trước khi bạn xác nhận thanh toán.
            </p>
            <p>
              <strong>Cổng Thanh Toán:</strong> Chúng tôi sử dụng các nhà cung cấp dịch vụ thanh toán thứ ba (ví dụ: Stripe, PayPal, VNPay, Momo) để xử lý các giao dịch. Bằng cách thực hiện thanh toán, bạn đồng ý tuân thủ các điều khoản và điều kiện của cổng thanh toán đó. Chúng tôi không lưu trữ thông tin thẻ tín dụng hoặc thông tin tài chính nhạy cảm của bạn.
            </p>
            <p>
              <strong>Chính sách Hoàn tiền:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Việc hoàn tiền cho các dịch vụ đã thanh toán sẽ tuân theo chính sách hủy lịch. Nếu bạn hủy lịch trong khoảng thời gian cho phép được hoàn tiền, khoản tiền sẽ được xử lý và trả lại cho bạn thông qua phương thức thanh toán ban đầu (có thể trừ phí giao dịch của bên thứ ba).</li>
              <li>Trường hợp Nhà cung cấp Y tế hủy lịch hẹn của bạn, bạn sẽ được hoàn lại 100% số tiền đã thanh toán.</li>
              <li>Chúng tôi không hoàn tiền cho các trường hợp không đến khám mà không thông báo hoặc hủy lịch sau thời gian quy định.</li>
            </ul>
          </Section>

          <Section title="6. Giới Hạn Trách Nhiệm">
            <p>
              Trong phạm vi tối đa được pháp luật cho phép, {companyName} và các giám đốc, nhân viên, đối tác của mình sẽ không chịu trách nhiệm pháp lý cho bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, do hậu quả hoặc mang tính trừng phạt nào, bao gồm nhưng không giới hạn ở việc mất lợi nhuận, dữ liệu, hoặc các tổn thất vô hình khác phát sinh từ:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li> Việc bạn truy cập hoặc sử dụng hoặc không thể truy cập hoặc sử dụng Dịch vụ;</li>
              <li> Bất kỳ hành vi hoặc nội dung nào của bất kỳ bên thứ ba nào trên Dịch vụ, bao gồm cả chất lượng chuyên môn của Nhà cung cấp Y tế;</li>
              <li> Mọi nội dung thu được từ Dịch vụ;</li>
              <li> Việc truy cập, sử dụng hoặc thay đổi trái phép các nội dung của bạn.</li>
            </ul>
          </Section>
          
          <Section title="7. Thay Đổi Điều Khoản">
            <p>
              Chúng tôi có quyền, theo quyết định riêng của mình, sửa đổi hoặc thay thế các Điều khoản này vào bất kỳ lúc nào. Nếu một bản sửa đổi là quan trọng, chúng tôi sẽ cố gắng cung cấp thông báo ít nhất 30 ngày trước khi bất kỳ điều khoản mới nào có hiệu lực. Việc bạn tiếp tục sử dụng Dịch vụ sau khi các thay đổi có hiệu lực đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
            </p>
          </Section>

          <Section title="8. Liên Hệ">
            <p>
              Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản này, vui lòng liên hệ với chúng tôi qua email: <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:underline">{contactEmail}</a>.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}