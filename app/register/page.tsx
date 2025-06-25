"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 1. Bỏ `address` khỏi kiểu FormErrors
// THAY ĐỔI: Thêm `terms` vào kiểu lỗi để xác thực checkbox điều khoản
type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  terms?: string;
};

export default function RegisterPage() {
  // 2. Bỏ `address` khỏi state của form
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });
  
  // THAY ĐỔI: Thêm state cho checkbox điều khoản
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  // THAY ĐỔI: Thêm hàm xử lý cho checkbox
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setTermsAccepted(isChecked);
    // Xóa lỗi nếu người dùng đã check vào ô
    if (isChecked && errors.terms) {
      setErrors(prevErrors => ({ ...prevErrors, terms: undefined }));
    }
  };

  // 3. Bỏ `address` khỏi hàm validate
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Vui lòng nhập họ và tên.";
        if (value.trim().length < 6) return "Họ và tên phải có ít nhất 6 ký tự.";
        break;
      case "email":
        if (!value.trim()) return "Vui lòng nhập email.";
        if (!/\S+@\S+\.\S+/.test(value)) return "Email không hợp lệ.";
        break;
      case "password":
        if (!value) return "Vui lòng nhập mật khẩu.";
        if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
        break;
      case "confirmPassword":
        if (!value) return "Vui lòng nhập lại mật khẩu.";
        if (value !== form.password) return "Mật khẩu nhập lại không khớp.";
        break;
      case "phone":
        if (!value.trim()) return "Vui lòng nhập số điện thoại.";
        if (!/^(0[3|5|7|8|9])+([0-9]{8})\b/.test(value)) return "Số điện thoại không hợp lệ.";
        break;
      default:
        break;
    }
    return "";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    const error = validateField(name, value);
    newErrors[name as keyof FormErrors] = error || undefined;
    
    if (name === 'password' && form.confirmPassword) {
      const confirmError = validateField('confirmPassword', form.confirmPassword);
      newErrors.confirmPassword = confirmError || undefined;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors: FormErrors = {};
    Object.keys(form).forEach(key => {
      const error = validateField(key, form[key as keyof typeof form]);
      if (error) {
        validationErrors[key as keyof FormErrors] = error;
      }
    });
    
    // THAY ĐỔI: Thêm logic xác thực cho checkbox điều khoản
    if (!termsAccepted) {
      validationErrors.terms = "Bạn phải đồng ý với điều khoản và dịch vụ.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    const { confirmPassword, ...dataToSend } = form;

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await res.json();

      if (res.ok) {
        alert("🎉 Đăng ký thành công!");
        window.location.href = "/login";
      } else {
        alert(data.message || "❌ Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Đăng ký lỗi:", error);
      alert("❌ Lỗi kết nối đến server!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left - Form Register */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 bg-white py-12">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-1">Tạo Tài Khoản</h2>
        <p className="text-sm text-center text-blue-600 mb-8">
          Website Đặt Lịch Khám Và Mua Thuốc Uy Tín Số 1 Việt Nam
        </p>

        {/* 4. Bỏ ô input "Địa chỉ" khỏi form */}
        {/* THAY ĐỔI: Tăng khoảng cách các ô nhập liệu từ space-y-4 -> space-y-5 */}
        <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md mx-auto">
          <div>
            {/* THAY ĐỔI: Chuyển nền xám sang nền trắng có viền */}
            <Input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Họ và tên (ít nhất 6 ký tự)"
              className={`h-12 border border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email"
              className={`h-12 border border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Mật khẩu"
              className={`h-12 border border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <Input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nhập lại mật khẩu"
              className={`h-12 border border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          <div>
            <Input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Số điện thoại"
              className={`h-12 border border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
 <div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={handleTermsChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Tôi đồng ý với các{" "}
                <Link href="/terms-of-service" className="text-blue-600 hover:underline">
                  Điều khoản và Dịch vụ
                </Link>
                .
              </label>
            </div>
            {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-12 font-semibold mt-6 disabled:bg-blue-400 disabled:cursor-not-allowed">
            {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
          </Button>

          <p className="text-sm text-center text-gray-500 pt-2">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">Đăng nhập ngay</Link>
          </p>
        </form>
      </div>
      {/* Right - Banner */}
<div className="hidden md:flex w-1/2 bg-[#0066ff] items-center justify-center relative overflow-hidden">
  {/* Image Background with Overlay */}
  <div className="absolute inset-0 z-0">
    <Image
      src="https://www.shutterstock.com/shutterstock/photos/2608071701/display_1500/stock-photo-lab-scientist-and-people-with-medical-research-high-five-and-colleagues-with-sticky-notes-or-2608071701.jpg"
      alt="Bác sĩ thân thiện tại phòng khám"
      layout="fill"
      objectFit="cover"
      className="opacity-20" // Điều chỉnh độ mờ của ảnh để lớp phủ màu xanh nổi bật
    />
  </div>

  {/* Content */}
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