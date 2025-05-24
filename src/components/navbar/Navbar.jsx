import React from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.scss";

const Navbar = () => {
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
      </div>
    </nav>
  );
};

export default Navbar;
