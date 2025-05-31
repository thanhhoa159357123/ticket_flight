import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.scss";

const Navbar = () => {
  const [tenKhachHang, setTenKhachHang] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("tenKhachHang");
    if (name) {
      setTenKhachHang(name);
    }
  }, []);

  return (
    <nav className={styles.navbar}>
      {/* LEFT */}
      <div className={styles.navbarLeftContent}>
        <Link to="/" className={styles.logo}>
          Travelokaa
        </Link>
      </div>

      {/* RIGHT */}
      <div className={styles.navbarRightContent}>
        <Link to="#" className={styles.navLink}>
          Chuyến bay
        </Link>
        <Link to="/flight-ticket" className={styles.navLink}>
          Vé máy bay
        </Link>
        {tenKhachHang ? (
          <div className={styles.menuContainer}>
            <div className={styles.triggerArea}>
              <span className={styles.userName}>{tenKhachHang}</span>
            </div>

            <div className={styles.dropdownBox}>
              <Link to="#" className={styles.menuItem}>
                Thông tin cá nhân
              </Link>
              <button
                className={styles.menuItem}
                onClick={() => {
                  localStorage.removeItem("tenKhachHang");
                  window.location.href = "/";
                }}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login">
              <button className={`${styles.navButton} ${styles.login}`}>
                Đăng nhập
              </button>
            </Link>
            <Link to="/register">
              <button className={`${styles.navButton} ${styles.register}`}>
                Đăng kí
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
