import React, { useState } from "react";
import styles from "./iteminformation.module.scss";

const Item_Information = ({ user, onEditField }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.ItemInformation}>
      <div className={styles.ItemContainer}>
        <h3>Thông tin cá nhân</h3>

        <div>
          <div className={styles.infoGroup}>
            <strong>Họ tên:</strong>
            <span className={styles.infoValue}>{user?.ten_khach_hang}</span>
          </div>
          <div className={styles.buttonGroup}>
            <button onClick={() => onEditField("ten_khach_hang")}>
              Chỉnh sửa
            </button>
          </div>
        </div>

        <div>
          <div className={styles.infoGroup}>
            <strong>Email:</strong>
            <span className={styles.infoValue}>{user?.email}</span>
          </div>
          <div className={styles.buttonGroup}>
            <button onClick={() => onEditField("email")}>Chỉnh sửa</button>
          </div>
        </div>

        <div>
          <div className={styles.infoGroup}>
            <strong>SĐT:</strong>
            <span className={styles.infoValue}>{user?.so_dien_thoai}</span>
          </div>
          <div className={styles.buttonGroup}>
            <button onClick={() => onEditField("so_dien_thoai")}>
              Chỉnh sửa
            </button>
          </div>
        </div>

        <div className={styles.passwordField}>
          <div className={styles.infoGroup}>
            <strong>Mật khẩu:</strong>
            <span className={styles.infoValue}>
              {showPassword ? "Hiển thị tạm" : "••••••••"}
            </span>
          </div>
          <button
            className={styles.toggleVisibility}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
          <div className={styles.buttonGroup}>
            <button onClick={() => onEditField("matkhau")}>Chỉnh sửa</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item_Information;
