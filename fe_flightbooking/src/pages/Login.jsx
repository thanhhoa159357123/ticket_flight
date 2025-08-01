import React, { useState } from "react";
import { Link } from "react-router-dom";
import clouds from "../assets/clouds.jpg";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin, errors } = useAuth();

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password, () => {
      alert("🎉 Đăng nhập thành công");
      window.location.href = "/";
    });
  };

  return (
    <div
      className="min-h-screen relative flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${clouds})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/50 z-0" />

      {/* Header */}
      <div className="ml-5 mt-3 z-10">
        <Link to="/" className="inline-block">
          <span className="text-[40px] font-extrabold bg-[linear-gradient(to_right,#017EBE,#0085E4,#4A8DFF,#7E96FF)] bg-clip-text text-transparent no-underline tracking-tighter transition duration-300 ease-in-out hover:bg-[linear-gradient(to_left,#017EBE,#0085E4,#4A8DFF,#7E96FF)]">
            H&T
          </span>
        </Link>
      </div>

      {/* Form wrapper */}
      <div className="flex justify-center items-center flex-1 p-8 z-10">
        <form
          className="bg-white rounded-[20px] shadow-xl px-10 py-5 w-full max-w-[500px] animate-[fadeInUp_0.3s_ease-out]"
          onSubmit={onSubmit}
        >
          <div className="mb-4 text-center">
            <h1 className="text-[2rem] font-bold text-[#017EBE] mb-2">
              Đăng nhập
            </h1>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="block mb-2 font-medium text-[#017EBE] text-[0.9rem]">
              Email
            </label>
            <input
              type="text"
              placeholder="Nhập Email"
              className={`w-full px-3 py-4 border-b-2 text-base font-medium rounded-none
                transition-all duration-300
                caret-[#017EBE] text-[#1F2937] placeholder-[#9CA3AF]
                border-[#d1d5db] focus:border-[#4A8DFF] focus:outline-none
                ${errors.email ? "border-red-500 text-red-500 placeholder-red-400" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="block mb-2 font-medium text-[#017EBE] text-[0.9rem]">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập Mật khẩu"
              className={`w-full px-3 py-4 border-b-2 text-base font-medium rounded-none
                transition-all duration-300
                caret-[#017EBE] text-[#1F2937] placeholder-[#9CA3AF]
                border-[#d1d5db] focus:border-[#4A8DFF] focus:outline-none
                ${errors.password ? "border-red-500 text-red-500 placeholder-red-400" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-4 mt-4 bg-gradient-to-r from-[#017EBE] to-[#7E96FF] text-white rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0"
          >
            Đăng nhập
          </button>

          {/* Register link */}
          <div className="text-center mt-6 mb-4 text-[#7E96FF] font-semibold">
            <p>
              Bạn chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-[#4A8DFF] font-semibold relative transition-all duration-300 cursor-pointer after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#4A8DFF] after:transition-all after:duration-300 hover:after:w-full hover:text-[#4A8DFF]"
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
