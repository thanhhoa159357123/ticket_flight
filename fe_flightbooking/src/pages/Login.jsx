import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../AuthLayout";
import InputField from "../components/inputs/InputFieldAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin, errors, loading } = useAuth();
  const navigate = useNavigate();

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const success = await handleLogin(email, password);

      if (success) {
        alert("🎉 Đăng nhập thành công!");
        navigate("/");
      } else {
        alert("❌ Đăng nhập thất bại, vui lòng kiểm tra thông tin!");
      }
    },
    [email, password, handleLogin, navigate]
  );

  return (
    <AuthLayout>
      <form
        className="bg-white rounded-[20px] shadow-xl px-10 py-5 w-full max-w-[500px] animate-[fadeInUp_0.2s_ease-out]"
        onSubmit={onSubmit}
      >
        <div className="mb-4 text-center">
          <h1 className="text-[2rem] font-bold text-[#017EBE] mb-2">
            Đăng nhập
          </h1>
        </div>

        <InputField
          label="Email"
          type="text"
          placeholder="Nhập Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoFocus
        />

        <InputField
          label="Mật khẩu"
          type="password"
          placeholder="Nhập Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
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
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>

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
    </AuthLayout>
  );
};

export default Login;
