import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./register.module.scss";

const Register = () => {
  const [ten, setTen] = useState("");
  const [sdt, setSdt] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("📤 Gửi yêu cầu ĐĂNG KÝ:", { email, password });

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
    <div className={styles.pageRegister}>
      <div className={styles.topHeader}>
        <Link to="/" className={styles.logoLink}>
          <span className={styles.logo}>Travelocka</span>
        </Link>
      </div>

      <div className={styles.registerWrapper}>
        <form className={styles.registerForm} onSubmit={handleRegister}>
          <div className={styles.formHeader}>
            <h1 className={styles.title}>Đăng kí</h1>
          </div>

          <div className={styles.inputGroup}>
            <label>Họ tên</label>
            <input
              type="text"
              placeholder="Nhập tên đầy đủ"
              className={styles.inputField}
              value={ten}
              onChange={(e) => setTen(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Số điện thoại</label>
            <input
              type="tel"
              placeholder="Nhập số điện thoại"
              className={styles.inputField}
              value={sdt}
              onChange={(e) => setSdt(e.target.value)}
              required
            />
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

          <div className={styles.inputGroup}>
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              className={styles.inputField}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.registerButton}>
            Đăng kí
          </button>

          <div className={styles.loginPrompt}>
            <p>
              Bạn đã có tài khoản?{" "}
              <Link to="/login" className={styles.loginLink}>
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
