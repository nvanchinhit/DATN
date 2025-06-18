"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
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
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left - Form Register */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 bg-white">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-1">Tạo Tài Khoản</h2>
        <p className="text-sm text-center text-blue-600 mb-8">
          Nhập thông tin để bắt đầu sử dụng dịch vụ SMMAZ.NET
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md mx-auto">
          <Input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Họ và tên"
            className="h-12 bg-gray-100 focus:bg-white focus:outline-blue-600"
            required
          />
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="h-12 bg-gray-100 focus:bg-white"
            required
          />
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Mật khẩu"
            className="h-12 bg-gray-100 focus:bg-white"
            required
          />
          <Input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Số điện thoại"
            className="h-12 bg-gray-100 focus:bg-white"
            required
          />
          <Input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Địa chỉ"
            className="h-12 bg-gray-100 focus:bg-white"
            required
          />

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-12 font-semibold">
            Đăng ký
          </Button>

          <p className="text-sm text-center text-gray-500">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">Đăng nhập ngay</Link>
          </p>
        </form>
      </div>

      {/* Right - Banner */}
      <div className="hidden md:flex w-1/2 bg-[#0066ff] items-center justify-center relative overflow-hidden">
        <Image
          src="/mascot.png"
          alt="Mascot"
          width={300}
          height={300}
          className="z-10"
        />

        <div className="absolute inset-0 bg-blue-800 bg-opacity-60 z-20 flex flex-col items-center justify-center p-6 text-white">
          <div className="flex space-x-3 items-center mb-3">
            <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold shadow">
              👍 500K+
            </div>
            <div className="bg-white text-pink-600 px-3 py-1 rounded-full text-sm font-bold shadow">
              ❤️
            </div>
          </div>

          <div className="bg-white text-black px-4 py-2 rounded-xl text-sm font-semibold shadow mb-4">
            🎉 Tạo tài khoản để nhận ưu đãi
          </div>

          <h2 className="text-2xl font-bold mb-3 text-center">Đồng hành cùng SMMAZ.NET</h2>
          <p className="text-sm max-w-xs text-center text-white/80">
            Hệ thống SMM Panel nhanh chóng, đơn giản và hiệu quả cho cá nhân và doanh nghiệp phát triển mạng xã hội.
          </p>
        </div>
      </div>
    </div>
  );
}
