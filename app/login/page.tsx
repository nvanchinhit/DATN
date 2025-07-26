"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

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
  const { toast } = useToast();

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
        
        toast({
          title: "🎉 Đăng nhập thành công!",
          description: "Chào mừng bạn trở lại với hệ thống y tế của chúng tôi.",
          variant: "default",
        });
        
        // Delay redirect để user thấy toast
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        if (data.msg?.includes("xác thực")) {
          setErrors({ password: data.msg });
          setShowResend(true);
          toast({
            title: "⚠️ Tài khoản chưa xác thực",
            description: "Vui lòng kiểm tra email và xác thực tài khoản của bạn.",
            variant: "destructive",
          });
        } else if (data.msg) {
          setErrors({ password: data.msg });
          toast({
            title: "❌ Đăng nhập thất bại",
            description: data.msg,
            variant: "destructive",
          });
        } else {
          toast({
            title: "❌ Đăng nhập thất bại",
            description: "Vui lòng kiểm tra lại thông tin đăng nhập.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      toast({
        title: "❌ Lỗi hệ thống",
        description: "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.",
        variant: "destructive",
      });
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
        toast({
          title: "📧 Email đã được gửi",
          description: "Vui lòng kiểm tra hộp thư và spam để xác thực tài khoản.",
          variant: "default",
        });
      } else {
        toast({
          title: "❌ Không thể gửi email",
          description: data.msg || "Vui lòng thử lại sau.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Lỗi gửi lại xác thực:", err);
      toast({
        title: "❌ Lỗi hệ thống",
        description: "Đã xảy ra lỗi khi gửi lại email xác thực.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Chào mừng trở lại
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Đăng nhập để tiếp tục hành trình chăm sóc sức khỏe
            </p>
          </div>

          {/* Form */}
          <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/20 p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </div>
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Nhập email của bạn"
                    className={`h-12 pl-12 pr-4 bg-white/50 backdrop-blur-sm border-gray-200/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-300 ${
                      errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs ml-1 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Nhập mật khẩu"
                    className={`h-12 pl-12 pr-12 bg-white/50 backdrop-blur-sm border-gray-200/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-300 ${
                      errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs ml-1 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.password}
                  </p>
                )}
                {showResend && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    Gửi lại email xác thực
                  </button>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Đăng nhập</span>
                    <ArrowRight size={16} />
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/70 text-gray-500 backdrop-blur-sm">hoặc</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Chưa có tài khoản?{" "}
                <Link 
                  href="/register" 
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom Text */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-xs">
              Bằng việc đăng nhập, bạn đồng ý với{" "}
              <Link href="/terms-of-service" className="hover:underline">
                Điều khoản sử dụng
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Medical professionals in modern hospital"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-purple-600/70 to-indigo-600/80"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
          <div className="max-w-md">
            <h2 className="text-5xl font-bold leading-tight mb-6">
              Sức Khỏe Của Bạn,
              <br />
              <span className="text-blue-200">Sứ Mệnh Của Chúng Tôi</span>
            </h2>
            
            <div className="w-20 h-1 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full mb-8"></div>
            
            <p className="text-xl text-blue-100 leading-relaxed mb-8">
              Nền tảng y tế số hàng đầu, kết nối bạn với đội ngũ y bác sĩ chuyên nghiệp một cách nhanh chóng và tiện lợi.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span className="text-blue-100">Đặt lịch khám trực tuyến 24/7</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                <span className="text-blue-100">Đội ngũ bác sĩ chuyên môn cao</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-indigo-300 rounded-full"></div>
                <span className="text-blue-100">Hệ thống thanh toán an toàn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-300/20 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-purple-300/15 rounded-full blur-md animate-pulse delay-500"></div>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
