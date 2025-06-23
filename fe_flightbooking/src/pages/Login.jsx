import React, { useState } from "react";
import { Link } from "react-router-dom";
import clouds from "../assets/clouds.jpg"; // Chứa keyframes fadeInUp nếu bạn muốn dùng cách 1

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8000/auth/login?email=${encodeURIComponent(
          email
        )}&matkhau=${encodeURIComponent(password)}`,
        { method: "POST" }
      );

      const data = await response.json();
      console.log("✅ Phản hồi ĐĂNG NHẬP từ server:", data);

      if (response.ok) {
        alert("🎉 " + data.message);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ten_khach_hang: data.ten_khach_hang,
            email: data.email,
            so_dien_thoai: data.so_dien_thoai,
            matkhau: data.matkhau,
          })
        );
        window.location.href = "/";
      } else {
        alert("❌ " + (data.detail || "Đăng nhập thất bại"));
      }
    } catch (error) {
      console.error("🚫 Lỗi khi kết nối tới API:", error);
      alert("🚫 Lỗi kết nối máy chủ");
    }
  };

  return (
    <div
      className="min-h-screen relative flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${clouds})` }}
    >
      {/* ✅ Cách 1: Overlay bằng div */}
      <div className="absolute inset-0 bg-white/50 z-0" />

      {/* Header */}
      <div className="p-[2rem] z-1">
        <Link to="/" className="inline-block">
          <span
            className="text-[2.5rem] font-extrabold text-[#3a86ff]"
            style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
          >
            Travelockaa
          </span>
        </Link>
      </div>

      {/* Form wrapper */}
      <div className="flex justify-center items-center flex-1 p-8 z-10">
        <form
          className="bg-white rounded-[20px] shadow-xl px-10 py-5 w-full max-w-[500px] animate-[fadeInUp_0.5s_ease-out]"
          onSubmit={handleLogin}
        >
          <div className="mb-4 text-center">
            <h1 className="text-[2rem] font-bold text-[#2c3e50] mb-2">
              Đăng nhập
            </h1>
            <p className="text-[1rem] text-[#7f8c8d]">Chào mừng trở lại</p>
          </div>

          <div className="mb-3">
            <label className="block mb-2 font-medium text-[#2c3e50] text-[0.9rem]">
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập Email"
              className="w-full px-3 py-4 border border-[#e0e0e0] rounded-xl text-base transition focus:border-[#3a86ff] focus:outline-none shadow-[0_0_0_3px_rgba(58,134,255,0.2)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-2 font-medium text-[#2c3e50] text-[0.9rem]">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập Mật khẩu"
              className="w-full px-3 py-4 border border-[#e0e0e0] rounded-xl text-base transition focus:border-[#3a86ff] focus:outline-none shadow-[0_0_0_3px_rgba(58,134,255,0.2)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-4 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0"
          >
            Đăng nhập
          </button>

          <div className="text-center mt-6 mb-4 text-[#7f8c8d] text-sm">
            <p>
              Bạn chưa có tài khoản? {" "}
              <Link
                to="/register"
                className="text-[#3a86ff] font-semibold relative transition-all duration-300 cursor-pointer after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#3a86ff] after:transition-all after:duration-300 hover:after:w-full hover:text-blue-600"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
