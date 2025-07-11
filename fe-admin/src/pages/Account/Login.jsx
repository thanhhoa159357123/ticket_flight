import React from "react";
import { FaUserShield, FaLock } from "react-icons/fa";
import useLogin from "../../hooks/loginHandle"; // Đường dẫn tới file hook bạn vừa tạo

const Login = () => {
  const { form, error, handleChange, handleSubmit } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <FaUserShield className="text-blue-600 text-4xl mb-2" />
          <h2 className="text-2xl font-bold text-blue-700 mb-1">Admin Login</h2>
          <p className="text-gray-500 text-sm">Quản trị hệ thống đặt vé máy bay</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1">Tài khoản</label>
            <div className="relative">
              <FaUserShield className="absolute left-3 top-3 text-blue-400" />
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Nhập tài khoản admin"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Mật khẩu</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-blue-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
            </div>
          </div>
          {error && (
            <div className="text-red-600 text-sm font-semibold">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-bold py-2 rounded-lg shadow hover:from-blue-600 hover:to-cyan-500 transition"
          >
            Đăng nhập
          </button>
        </form>
        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <button className="hover:underline">Quên mật khẩu?</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
