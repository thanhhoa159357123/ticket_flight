import { useState } from "react";

const useLogin = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng nhập ở đây (gọi API)
    if (!form.username || !form.password) {
      setError("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
      return;
    }
    // Demo: kiểm tra tài khoản mẫu
    if (form.username !== "admin" || form.password !== "admin123") {
      setError("Tài khoản hoặc mật khẩu không đúng.");
      return;
    }
    // Đăng nhập thành công: chuyển hướng hoặc lưu token
    alert("Đăng nhập thành công!");
  };

  return {
    form,
    error,
    handleChange,
    handleSubmit,
  };
};

export default useLogin;