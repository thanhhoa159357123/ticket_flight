import React from "react";
import { Link } from "react-router-dom";
import styles from "./register.module.scss";

const Register = () => {
  return (
    <div className={styles.pageRegister}>
      <div className={styles.topHeader}>
        <Link to="/" className={styles.logoLink}>
          <span className={styles.logo}>Travelocka</span>
        </Link>
      </div>
      <div className={styles.registerWrapper}>
        <form className={styles.registerForm}>
          <div className={styles.formHeader}>
            <h1 className={styles.title}>Đăng kí</h1>
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

          <div className={styles.inputGroup}>
            <label htmlFor="password">Xác nhận mật khẩu</label>
            <input
              id="password"
              type="password"
              placeholder="Xác nhận mật khẩu"
              className={styles.inputField}
            />
          </div>

          <button type="submit" className={styles.registerButton}>
            Đăng kí
          </button>

          <div className={styles.loginPrompt}>
            <p>
              Bạn đã có tài khoản ?{" "}
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
