"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 1. Định nghĩa kiểu cho lỗi
type FormErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  
  // 2. Gom state vào một object để quản lý dễ hơn
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  
  // 3. Thêm state cho lỗi và trạng thái loading
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  // 4. Hàm xử lý thay đổi input chung
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  // 5. Hàm validate cho từng trường
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Vui lòng nhập email.";
        if (!/\S+@\S+\.\S+/.test(value)) return "Email không hợp lệ.";
        break;
      case "password":
        if (!value) return "Vui lòng nhập mật khẩu.";
        break;
      default:
        break;
    }
    return "";
  };
  
  // 6. Hàm xử lý sự kiện onBlur (validate khi rời khỏi input)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error || undefined,
    });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const validationErrors: FormErrors = {};
    Object.keys(form).forEach(key => {
        const error = validateField(key, form[key as keyof typeof form]);
        if (error) {
            validationErrors[key as keyof FormErrors] = error;
        }
    });

    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form), // Gửi object form
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("✅ Đăng nhập thành công!");
        router.push("/");
      } else {
        // Nếu server trả về lỗi cụ thể (vd: "Mật khẩu không chính xác!"), hiển thị lỗi đó
        if (data.msg) {
          setErrors({ password: data.msg });
        } else {
          alert("❌ Đăng nhập thất bại!");
        }
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("❌ Đã xảy ra lỗi khi đăng nhập.");
    } finally {
        setIsSubmitting(false); // Dừng loading
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
              name="email" // Thêm name
              value={form.email} // Sử dụng state object
              onChange={handleChange}
              onBlur={handleBlur} // Thêm onBlur
              placeholder="Email"
              className={`h-12 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password" // Thêm name
              value={form.password} // Sử dụng state object
              onChange={handleChange}
              onBlur={handleBlur} // Thêm onBlur
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
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <Link href="#" className="hover:underline">Quên mật khẩu?</Link>
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
        {/* 👉 FIX: Thêm đường dẫn ảnh hợp lệ, ví dụ mascot.png */}
        <Image src="/mascot.png" alt="Mascot" width={300} height={300} className="z-10" />
        <div className="absolute inset-0 bg-blue-800 bg-opacity-60 z-20 flex flex-col items-center justify-center p-6 text-white">
          <div className="flex space-x-3 items-center mb-3">
            <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold shadow">👍 500K+</div>
            <div className="bg-white text-pink-600 px-3 py-1 rounded-full text-sm font-bold shadow">❤️</div>
          </div>
          <div className="bg-white text-black px-4 py-2 rounded-xl text-sm font-semibold shadow mb-4">
            🎉 300K+ New Followers
          </div>
          <h2 className="text-2xl font-bold mb-3 text-center">Best SMM Panel for Social Media</h2>
          <p className="text-sm max-w-xs text-center text-white/80">
            Trang web của chúng tôi cung cấp giải pháp SMM rẻ và hiệu quả, giúp bạn cải thiện tốt hơn
            trong việc quản lý và phát triển mạng xã hội của mình.
          </p>
        </div>
      </div>
    </div>
  );
}