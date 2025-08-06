"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, ArrowRight, Sparkles, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type FormErrors = {
  newPassword?: string;
  confirmPassword?: string;
};

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      toast({
        title: "❌ Đường dẫn không hợp lệ",
        description: "Đường dẫn không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.",
        variant: "destructive",
      });
      // Redirect to login immediately if no token
      setTimeout(() => {
        router.replace('/login');
      }, 2000);
    }
  }, [searchParams, router, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "newPassword":
        if (!value) return "Vui lòng nhập mật khẩu mới.";
        if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
        break;
      case "confirmPassword":
        if (!value) return "Vui lòng xác nhận mật khẩu.";
        if (form.newPassword && value !== form.newPassword) return "Mật khẩu xác nhận không khớp.";
        break;
    }
    return "";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error || undefined });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!token) {
      toast({
        title: "❌ Token không hợp lệ",
        description: "Token không hợp lệ. Vui lòng yêu cầu lại liên kết mới.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

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
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: form.newPassword }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setIsSuccess(true);
        toast({
          title: "🎉 Đặt lại mật khẩu thành công!",
          description: "Mật khẩu của bạn đã được cập nhật. Đang chuyển hướng đến trang đăng nhập...",
          variant: "default",
        });
        
        // Clear form and disable inputs
        setForm({ newPassword: "", confirmPassword: "" });
        
        // Redirect to login and replace current history entry
        setTimeout(() => {
          router.replace('/login');
        }, 2000);
      } else {
        toast({
          title: "❌ Đặt lại mật khẩu thất bại",
          description: data.msg || "Đã xảy ra lỗi. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Lỗi đặt lại mật khẩu:", err);
      toast({
        title: "❌ Lỗi kết nối",
        description: "Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If no token, show loading state
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra đường dẫn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Reset Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Đặt Lại Mật Khẩu
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Nhập mật khẩu mới để bảo vệ tài khoản của bạn
            </p>
          </div>

          {/* Form */}
          <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/20 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Nhập mật khẩu mới"
                    disabled={isSubmitting || isSuccess}
                    className={`h-12 pl-12 pr-12 bg-white/50 backdrop-blur-sm border-gray-200/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-300 disabled:opacity-50 ${
                      errors.newPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isSubmitting || isSuccess}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-xs ml-1 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Xác nhận mật khẩu mới"
                    disabled={isSubmitting || isSuccess}
                    className={`h-12 pl-12 pr-12 bg-white/50 backdrop-blur-sm border-gray-200/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-300 disabled:opacity-50 ${
                      errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isSubmitting || isSuccess}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs ml-1 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isSubmitting || isSuccess} 
                className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Đang xử lý...</span>
                  </div>
                ) : isSuccess ? (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Thành công!</span>
                    <Sparkles size={16} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Đặt lại mật khẩu</span>
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

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Nhớ mật khẩu?{" "}
                <Link 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom Text */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-xs">
              Bằng việc đặt lại mật khẩu, bạn đồng ý với{" "}
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
            src="https://i.imgur.com/qGWWpBN.jpeg"
            alt="Secure password reset"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 via-blue-600/70 to-indigo-600/80"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
          <div className="max-w-md">
            <h2 className="text-5xl font-bold leading-tight mb-6">
              Bảo Mật Tài Khoản,
              <br />
              <span className="text-green-200">Bảo Vệ Thông Tin</span>
            </h2>
            
            <div className="w-20 h-1 bg-gradient-to-r from-green-300 to-blue-300 rounded-full mb-8"></div>
            
            <p className="text-xl text-green-100 leading-relaxed mb-8">
              Đặt lại mật khẩu an toàn để bảo vệ tài khoản và thông tin cá nhân của bạn khỏi các rủi ro bảo mật.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span className="text-green-100">Mật khẩu mạnh và an toàn</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span className="text-green-100">Xác thực hai lớp bảo mật</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-indigo-300 rounded-full"></div>
                <span className="text-green-100">Mã hóa thông tin cá nhân</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-300/20 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-blue-300/15 rounded-full blur-md animate-pulse delay-500"></div>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}