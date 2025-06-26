"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Kiểu dữ liệu để quản lý thông báo
type MessageState = {
  text: string;
  type: "success" | "error" | "";
};

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<MessageState>({ text: "", type: "" });
  const [token, setToken] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
        setMessage({ text: "Đường dẫn không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.", type: "error" });
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (message.text) {
        setMessage({ text: "", type: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
        if (!token) {
      setMessage({ text: "Token không hợp lệ. Vui lòng yêu cầu lại liên kết mới.", type: "error" });
      return;
    }
    if (!form.newPassword || !form.confirmPassword) {
        setMessage({ text: "Vui lòng nhập đầy đủ mật khẩu mới và xác nhận.", type: "error" });
        return;
    }
    if (form.newPassword.length < 6) {
        setMessage({ text: "Mật khẩu phải có ít nhất 6 ký tự.", type: "error" });
        return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setMessage({ text: "Mật khẩu xác nhận không khớp.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: form.newPassword }),
      });
      const data = await res.json();
      
      if(res.ok) {
        setMessage({ text: data.msg || "Đặt lại mật khẩu thành công! Đang chuyển hướng đến trang đăng nhập...", type: "success" });
        // Chuyển hướng về trang đăng nhập sau 3 giây
        setTimeout(() => {
            router.push('/login');
        }, 3000);
      } else {
        setMessage({ text: data.msg || "Đã xảy ra lỗi. Vui lòng thử lại.", type: "error" });
      }

    } catch (err) {
      console.error("Lỗi đặt lại mật khẩu:", err);
      setMessage({ text: "Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 bg-white">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Đặt Lại Mật Khẩu
        </h2>
        <p className="text-sm text-center text-gray-500 mb-8">
          Vui lòng nhập mật khẩu mới của bạn.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md mx-auto">
            {/* New Password Input */}
            <div className="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    placeholder="Mật khẩu mới"
                    className={`h-12 bg-gray-100 focus:bg-white pr-10 focus:ring-2 focus:ring-blue-500 ${message.type === 'error' ? 'border-red-500' : ''}`}
                    disabled={isSubmitting || message.type === 'success'}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
          
            {/* Confirm Password Input */}
            <div className="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Xác nhận mật khẩu mới"
                    className={`h-12 bg-gray-100 focus:bg-white pr-10 focus:ring-2 focus:ring-blue-500 ${message.type === 'error' ? 'border-red-500' : ''}`}
                    disabled={isSubmitting || message.type === 'success'}
                />
            </div>

            {/* Message Area */}
            {message.text && (
                <p className={`text-sm text-center font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                {message.text}
                </p>
            )}

            <Button 
                type="submit" 
                disabled={isSubmitting || !token || message.type === 'success'} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-12 font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>

            {message.type !== 'success' && (
                 <p className="text-sm text-center text-gray-500">
                    Quay lại trang{" "}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            )}
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
  );
}