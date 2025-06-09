"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4">
      <h1 className="text-3xl font-bold text-blue-700 text-center">Chào Mừng</h1>
      <p className="text-sm text-blue-600 text-center mt-1 mb-6">
        Vui lòng đăng nhập để sử dụng dịch vụ
      </p>

      <Card className="w-full max-w-md bg-white shadow-2xl rounded-2xl border border-blue-200">
        <CardContent className="p-8">
          {/* Logo giả lập */}
          <div className="w-full h-16 bg-blue-600 rounded-xl mb-6 flex items-center justify-center">
            <span className="text-white text-lg font-bold tracking-wider">LOGO</span>
          </div>

          {/* Form nhập */}
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Vui lòng nhập Email ..."
              required
              className="focus:outline-blue-600 focus:ring focus:ring-blue-200"
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Vui lòng nhập mật khẩu..."
                required
                className="pr-10 focus:outline-blue-600 focus:ring focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Liên kết phụ */}
          <div className="flex justify-between text-xs text-blue-500 mt-2 mb-6">
            <a href="#" className="hover:underline">Quên mật khẩu</a>
            <a href="#" className="hover:underline">Tạo tài khoản</a>
          </div>

          {/* Nút đăng nhập */}
          <Button className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white py-2 font-semibold tracking-wider transition">
            Đăng Nhập
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
