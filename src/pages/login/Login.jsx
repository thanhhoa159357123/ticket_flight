import React from "react";
import styles from "./login.module.scss";
import { Link } from "react-router-dom";

const Login= () => {
  return (
    <div className={styles.pageLogin}>
      <div className={styles.topHeader}>
        <Link to="/" className={styles.logoLink}>
          <span className={styles.logo}>Travelocka</span>
        </Link>
      </div>

      <div className={styles.loginWrapper}>
        <form className={styles.loginForm}>
          <div className={styles.formHeader}>
            <h1 className={styles.title}>Đăng nhập</h1>
            <p className={styles.subtitle}>Chào mừng trở lại</p>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Nhập Email"
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              placeholder="Nhập Mật khẩu"
              className={styles.inputField}
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
}

export default Login;
