import { useState } from "react";
import { loginUser, registerUser } from "../services/authService";

export const useAuth = () => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Đăng nhập
  const handleLogin = async (email, password) => {
    setErrors({});
    setLoading(true);

    const newErrors = {};
    if (!email.trim()) newErrors.email = "Vui lòng nhập Email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Email không đúng định dạng.";
    if (!password.trim()) newErrors.password = "Vui lòng nhập Mật khẩu.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return false;
    }

    try {
      const data = await loginUser(email, password);
      localStorage.setItem("user", JSON.stringify(data));
      return true; // ✅ thành công
    } catch (err) {
      console.error("Login error:", err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Đăng ký
  const handleRegister = async (payload, confirmPass) => {
    setErrors({});
    setLoading(true);

    const newErrors = {};
    if (!payload.ten_khach_hang) newErrors.ten = "Vui lòng nhập họ tên.";
    if (!payload.so_dien_thoai) newErrors.sdt = "Vui lòng nhập số điện thoại.";
    if (!payload.email) newErrors.email = "Vui lòng nhập Email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))
      newErrors.email = "Email không đúng định dạng.";
    if (!payload.matkhau) newErrors.password = "Vui lòng nhập Mật khẩu.";
    if (!confirmPass) newErrors.confirmPass = "Vui lòng xác nhận mật khẩu.";
    else if (payload.matkhau !== confirmPass)
      newErrors.confirmPass = "❌ Mật khẩu xác nhận không khớp.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return false;
    }

    try {
      await registerUser(payload);
      return true; // ✅ thành công
    } catch (err) {
      console.error("Register error:", err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, handleRegister, errors, loading };
};
