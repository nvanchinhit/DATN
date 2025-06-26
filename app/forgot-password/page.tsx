"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ModalContent = {
  title: string;
  description: string;
  type: "success" | "error";
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State để điều khiển modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  const showModal = (content: ModalContent) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      showModal({
        title: "Thông báo lỗi",
        description: "Vui lòng nhập email của bạn.",
        type: "error",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        showModal({
          title: "Yêu cầu thành công",
          description: data.msg || "Chúng tôi đã gửi một liên kết đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư.",
          type: "success",
        });
      } else {
        showModal({
          title: "Đã có lỗi xảy ra",
          description: data.msg || "Email không tồn tại hoặc đã có lỗi. Vui lòng thử lại.",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Lỗi gửi yêu cầu quên mật khẩu:", err);
      showModal({
        title: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 bg-white">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Quên mật khẩu
          </h2>
          <p className="text-sm text-center text-gray-500 mb-8">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
            <div>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="h-12 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-12 font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </Button>

            <p className="text-sm text-center text-gray-500">
              Đã nhớ ra mật khẩu?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Đăng nhập tại đây
              </Link>
            </p>
          </form>
        </div>

        {/* Right - Banner */}
        <div className="hidden md:flex w-1/2 bg-[#0066ff] items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://www.shutterstock.com/shutterstock/photos/2608071701/display_1500/stock-photo-lab-scientist-and-people-with-medical-research-high-five-and-colleagues-with-sticky-notes-or-2608071701.jpg"
              alt="Bác sĩ thân thiện tại phòng khám"
              layout="fill"
              objectFit="cover"
              className="opacity-20"
            />
          </div>
          <div className="relative z-10 flex flex-col items-start p-16 text-white">
            <h3 className="text-4xl lg:text-5xl font-bold leading-tight">
              Sức Khỏe Của Bạn,
              <br />
              Sứ Mệnh Của Chúng Tôi.
            </h3>
            <div className="w-24 h-1.5 bg-white rounded-full mt-6 mb-8"></div>
            <p className="text-lg text-white/90 max-w-md">
              Nền tảng y tế số hàng đầu, kết nối bạn với đội ngũ y bác sĩ chuyên nghiệp một cách nhanh chóng và tiện lợi.
            </p>
          </div>
        </div>
      </div>

      {/* --- Modal Tự Tạo --- */}
      {isModalOpen && modalContent && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
          // onClick={() => setIsModalOpen(false)} // Tùy chọn: Đóng khi click ra ngoài
        >
          <div 
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()} // Ngăn việc đóng modal khi click vào nội dung bên trong
          >
            <h3 className={`text-xl font-bold mb-4 ${
              modalContent.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {modalContent.title}
            </h3>
            <p className="text-sm text-gray-700 mb-6">
              {modalContent.description}
            </p>
            <div className="flex justify-end">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}