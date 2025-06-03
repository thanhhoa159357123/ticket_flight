import React, { useState } from "react";
import styles from "./login.module.scss";
import { Link } from "react-router-dom";

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
    <div className={styles.pageLogin}>
      <div className={styles.topHeader}>
        <Link to="/" className={styles.logoLink}>
          <span className={styles.logo}>Travelocka</span>
        </Link>
      </div>

      <div className={styles.loginWrapper}>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div className={styles.formHeader}>
            <h1 className={styles.title}>Đăng nhập</h1>
            <p className={styles.subtitle}>Chào mừng trở lại</p>
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập Email"
              className={styles.inputField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập Mật khẩu"
              className={styles.inputField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.loginButton}>
            Đăng nhập
          </button>

          <div className={styles.registerPrompt}>
            <p>
              Bạn chưa có tài khoản ?{" "}
              <Link to="/register" className={styles.registerLink}>
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
