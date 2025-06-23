import React, { useState } from "react";
import { Link } from "react-router-dom";
import clouds from "../assets/clouds.jpg";

const Register = () => {
  const [ten, setTen] = useState("");
  const [sdt, setSdt] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPass) {
      alert("❌ Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ten_khach_hang: ten,
          email: email,
          so_dien_thoai: sdt,
          matkhau: password,
        }),
      });

      const data = await response.json();
      console.log("✅ Phản hồi ĐĂNG KÝ từ server:", data);

      if (response.ok) {
        alert("🎉 Đăng ký thành công!");
        window.location.href = "/login";
      } else {
        alert("❌ " + (data.detail || "Đăng ký thất bại"));
      }
    } catch (err) {
      console.error("🚫 Lỗi khi kết nối tới API:", err);
      alert("🚫 Không thể kết nối tới máy chủ");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col
        relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${clouds})` }}
    >
      <div className="absolute inset-0 bg-white/50 z-0" />

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

      <div className="flex justify-center items-center flex-1 p-8 z-10">
        <form
          className="bg-white rounded-[20px] shadow-xl px-10 py-2 w-full max-w-[500px] animate-[fadeInUp_0.5s_ease-out]"
          onSubmit={handleRegister}
        >
          <div className="mb-[1rem] text-center">
            <h1 className="text-[2rem] font-bold text-[#2c3e50] mb-[0.5rem]">
              Đăng ký tài khoản
            </h1>
          </div>

          <div className="mb-[0.5rem]">
            <label className="block mb-[0.5rem] font-medium text-[#2c3e50] text-[0.9rem]">
              Họ tên
            </label>
            <input
              type="text"
              placeholder="Nhập tên đầy đủ"
              className="w-[100%] px-[0.8rem] py-[1rem] border-2 border-[#e0e0e0] rounded-xl"
              value={ten}
              onChange={(e) => setTen(e.target.value)}
              required
            />
          </div>

          <div className="mb-[0.5rem]">
            <label className="block mb-[0.5rem] font-medium text-[#2c3e50] text-[0.9rem]">
              Số điện thoại
            </label>
            <input
              type="tel"
              placeholder="Nhập số điện thoại"
              className="w-[100%] px-[0.8rem] py-[1rem] border-2 border-[#e0e0e0] rounded-xl"
              value={sdt}
              onChange={(e) => setSdt(e.target.value)}
              required
            />
          </div>

          <div className="mb-[0.5rem]">
            <label className="block mb-[0.5rem] font-medium text-[#2c3e50] text-[0.9rem]">
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập Email"
              className="w-[100%] px-[0.8rem] py-[1rem] border-2 border-[#e0e0e0] rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-[0.5rem]">
            <label className="block mb-[0.5rem] font-medium text-[#2c3e50] text-[0.9rem]">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập Mật khẩu"
              className="w-[100%] px-[0.8rem] py-[1rem] border-2 border-[#e0e0e0] rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-[0.5rem]">
            <label className="block mb-[0.5rem] font-medium text-[#2c3e50] text-[0.9rem]">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              className="w-[100%] px-[0.8rem] py-[1rem] border-2 border-[#e0e0e0] rounded-xl"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-4 bg-gradient-to-br from-blue-500 to-blue-700 text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0"
          >
            Đăng kí
          </button>

          <div className="text-center mt-4 mb-4 text-[#7f8c8d] text-sm">
            <p>
              Bạn đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-[#3a86ff] font-semibold no-underline transition-all duration-300 relative cursor-pointer
        after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#3a86ff] after:transition-all after:duration-300 hover:after:w-full hover:text-blue-600"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
