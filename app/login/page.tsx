"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Chặn reload mặc định

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
  // 👉 Lưu token và user info nếu có
  localStorage.setItem("token", data.token); // backend cần trả về token
  localStorage.setItem("user", JSON.stringify(data.user)); // nếu trả về user

  alert("✅ Đăng nhập thành công!");
  router.push("/");
}
 else {
        alert(data.message || "❌ Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("❌ Đã xảy ra lỗi khi đăng nhập.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left - Form Login */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 bg-white">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-1">Đăng nhập</h2>
        <p className="text-sm text-center text-gray-500 mb-8">
          SMMAZ.NET dịch vụ mạng xã hội - bảng điều khiển SMM PANEL
        </p>

        <form onSubmit={handleLogin} className="space-y-5 w-full max-w-md mx-auto">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="h-12 bg-gray-100 focus:bg-white focus:outline-blue-600"
            required
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className="h-12 bg-gray-100 focus:bg-white pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <Link href="#" className="hover:underline">Quên mật khẩu?</Link>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-12 font-semibold">
            Đăng nhập
          </Button>

          <p className="text-sm text-center text-gray-500">
            Bạn chưa có tài khoản?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">Đăng ký tại đây</Link>
          </p>
        </form>
      </div>

      {/* Right - Banner */}
      <div className="hidden md:flex w-1/2 bg-[#0066ff] items-center justify-center relative overflow-hidden">
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
