import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import InputField from "../components/inputs/InputFieldAuth";
import AuthLayout from "../AuthLayout";

const Register = () => {
  const [ten, setTen] = useState("");
  const [sdt, setSdt] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const { handleRegister, errors, loading } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    const success = await handleRegister(
      {
        ten_khach_hang: ten,
        so_dien_thoai: sdt,
        email,
        matkhau: password,
      },
      confirmPass
    );

    if (success) {
      alert("🎉 Đăng ký thành công!");
      navigate("/login");
    } else {
      alert("❌ Đăng ký thất bại, vui lòng kiểm tra thông tin!");
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-[20px] shadow-xl px-10 py-2 w-full max-w-[500px] animate-[fadeInUp_0.2s_ease-out]"
      >
        <div className="mb-[1rem] text-center">
          <h1 className="text-[2rem] font-bold text-[#017EBE] mb-[0.5rem]">
            Đăng ký tài khoản
          </h1>
        </div>

        <InputField
          label="Họ tên"
          type="text"
          placeholder="Nhập tên đầy đủ"
          value={ten}
          onChange={(e) => setTen(e.target.value)}
          error={errors.ten}
          autoFocus
        />

        <InputField
          label="Số điện thoại"
          type="tel"
          placeholder="Nhập số điện thoại"
          value={sdt}
          onChange={(e) => setSdt(e.target.value)}
          error={errors.sdt}
        />

        <InputField
          label="Email"
          type="text"
          placeholder="Nhập Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <InputField
          label="Mật khẩu"
          type="password"
          placeholder="Nhập Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <InputField
          label="Xác nhận mật khẩu"
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          error={errors.confirmPass}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 mt-4 rounded-xl text-base font-semibold transition-all duration-300 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0 cursor-pointer ${
            loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-[#017EBE] to-[#7E96FF] text-white"
          }`}
        >
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>

        <div className="text-center mt-6 mb-4 text-[#7E96FF] font-semibold">
          <p>
            Bạn đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-[#4A8DFF] font-semibold relative transition-all duration-300 cursor-pointer after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#4A8DFF] after:transition-all after:duration-300 hover:after:w-full hover:text-[#4A8DFF]"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
