"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type FormErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Vui lòng nhập email.";
        if (!/\S+@\S+\.\S+/.test(value)) return "Email không hợp lệ.";
        break;
      case "password":
        if (!value) return "Vui lòng nhập mật khẩu.";
        break;
    }
    return "";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error || undefined });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowResend(false);

    const validationErrors: FormErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key as keyof typeof form]);
      if (error) validationErrors[key as keyof FormErrors] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("✅ Đăng nhập thành công!");
        router.push("/");
      } else {
        if (data.msg?.includes("xác thực")) {
          setErrors({ password: data.msg });
          setShowResend(true);
        } else if (data.msg) {
          setErrors({ password: data.msg });
        } else {
          alert("❌ Đăng nhập thất bại!");
        }
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("❌ Đã xảy ra lỗi khi đăng nhập.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư!");
      } else {
        alert(`❌ ${data.msg || "Không thể gửi lại xác thực!"}`);
      }
    } catch (err) {
      console.error("Lỗi gửi lại xác thực:", err);
      alert("❌ Đã xảy ra lỗi khi gửi lại xác thực.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left - Form Login */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 bg-white">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-1">Đăng nhập</h2>
        <p className="text-sm text-center text-gray-500 mb-8">
          Website Đặt Lịch Khám Và Mua Thuốc Uy Tín Số 1 Việt Nam
        </p>

        <form onSubmit={handleLogin} className="space-y-5 w-full max-w-md mx-auto">
          <div>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email"
              className={`h-12 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Mật khẩu"
              className={`h-12 bg-gray-100 focus:bg-white pr-10 focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            {showResend && (
              <button
                type="button"
                onClick={handleResendVerification}
                className="text-sm text-blue-600 hover:underline mt-1"
              >
                Gửi lại email xác thực
              </button>
            )}
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <Link href="/forgot-password" className="hover:underline">Quên mật khẩu?</Link>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-12 font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed">
            {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>

          <p className="text-sm text-center text-gray-500">
            Bạn chưa có tài khoản?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">Đăng ký tại đây</Link>
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
  );
}
