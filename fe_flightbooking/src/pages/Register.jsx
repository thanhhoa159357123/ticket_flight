import React, { useState } from "react";
import { Link } from "react-router-dom";
import clouds from "../assets/clouds.jpg";

const Register = () => {
  const [ten, setTen] = useState("");
  const [sdt, setSdt] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [errors, setErrors] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!ten.trim()) newErrors.ten = "Vui lòng nhập họ tên.";
    if (!sdt.trim()) newErrors.sdt = "Vui lòng nhập số điện thoại.";
    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập Email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không đúng định dạng.";
    }

    if (!password.trim()) newErrors.password = "Vui lòng nhập Mật khẩu.";
    if (!confirmPass.trim()) newErrors.confirmPass = "Vui lòng xác nhận mật khẩu.";
    else if (password !== confirmPass)
      newErrors.confirmPass = "❌ Mật khẩu xác nhận không khớp.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // Clear error trước khi gọi API

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ten_khach_hang: ten,
          email,
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
    <div className="min-h-screen flex flex-col relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${clouds})` }}>
      <div className="absolute inset-0 bg-white/50 z-0" />
      <div className="ml-5 mt-3 z-1">
        <Link to="/" className="inline-block">
          <span className="text-[2rem] font-extrabold text-[#3a86ff]" style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
            Travelockaa
          </span>
        </Link>
      </div>

      <div className="flex justify-center items-center flex-1 p-8 z-10">
        <form onSubmit={handleRegister} className="bg-white rounded-[20px] shadow-xl px-10 py-2 w-full max-w-[500px] animate-[fadeInUp_0.5s_ease-out]">
          <div className="mb-[1rem] text-center">
            <h1 className="text-[2rem] font-bold text-[#2c3e50] mb-[0.5rem]">Đăng ký tài khoản</h1>
          </div>

          {/* Họ tên */}
          <div className="mb-[0.5rem]">
            <label className="block mb-[0.5rem] font-medium text-[#2c3e50] text-[0.9rem]">Họ tên</label>
            <input
              type="text"
              placeholder="Nhập tên đầy đủ"
              className={`w-full px-3 py-3 border border-[#e0e0e0] rounded-xl text-base transition focus:border-[#3a86ff] focus:outline-none caret-[#2c3e50] ${errors.ten ? "border-red-500" : "border-[#e0e0e0]"}`}
              value={ten}
              onChange={(e) => setTen(e.target.value)}
            />
            {errors.ten && <p className="text-red-500 text-sm mt-1">{errors.ten}</p>}
          </div>

          {/* SĐT */}
          <div className="mb-[0.5rem]">
            <label className="block mb-[0.5rem] font-medium text-[#2c3e50] text-[0.9rem]">Số điện thoại</label>
            <input
              type="tel"
              placeholder="Nhập số điện thoại"
              className={`w-full px-3 py-3 border border-[#e0e0e0] rounded-xl text-base transition focus:border-[#3a86ff] focus:outline-none caret-[#2c3e50] ${errors.sdt ? "border-red-500" : "border-[#e0e0e0]"}`}
              value={sdt}
              onChange={(e) => setSdt(e.target.value)}
            />
            {errors.sdt && <p className="text-red-500 text-sm mt-1">{errors.sdt}</p>}
          </div>

          {/* Email */}
          <div className="mb-[0.5rem]">
            <label className="block mb-[0.5rem] font-medium text-[#2c3e50] text-[0.9rem]">Email</label>
            <input
              type="text"
              placeholder="Nhập Email"
              className={`w-full px-3 py-3 border border-[#e0e0e0] rounded-xl text-base transition focus:border-[#3a86ff] focus:outline-none caret-[#2c3e50] ${errors.email ? "border-red-500" : "border-[#e0e0e0]"}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Mật khẩu */}
          <div className="mb-[0.5rem]">
            <label className="block mb-[0.5rem] font-medium text-[#2c3e50] text-[0.9rem]">Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập Mật khẩu"
              className={`w-full px-3 py-3 border border-[#e0e0e0] rounded-xl text-base transition focus:border-[#3a86ff] focus:outline-none caret-[#2c3e50] ${errors.password ? "border-red-500" : "border-[#e0e0e0]"}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="mb-[0.5rem]">
            <label className="block mb-[0.5rem] font-medium text-[#2c3e50] text-[0.9rem]">Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              className={`w-full px-3 py-3 border border-[#e0e0e0] rounded-xl text-base transition focus:border-[#3a86ff] focus:outline-none caret-[#2c3e50] ${errors.confirmPass ? "border-red-500" : "border-[#e0e0e0]"}`}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            {errors.confirmPass && <p className="text-red-500 text-sm mt-1">{errors.confirmPass}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-4 bg-gradient-to-br from-blue-500 to-blue-700 text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0"
          >
            Đăng kí
          </button>

          <div className="text-center mt-4 mb-4 text-[#7f8c8d] font-semibold">
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
