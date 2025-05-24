import React from "react";
import styles from "./footer.module.scss";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

const Footer = () => {
  const handleDownloadApp = () => {
    return alert("App sẽ hoàn thiện trong thời gian sớm nhất");
  };

  return (
    <div className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.mainTitle}>
          <div className={styles.mainLabel}>Về Travelocka</div>
          <div className={styles.mainLabel}>Sản phẩm</div>
          <div className={styles.mainLabel}>Khác</div>
          <div className={styles.mainLabel}>Theo dõi chúng tôi</div>
          <div className={styles.mainLabel}>Tải ứng dụng Travelocka</div>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.mainContentLabel}>Cách đặt chỗ</div>
          <div className={styles.mainContentLabel}>Vé máy bay</div>
          <div className={styles.mainContentLabel}>Quy chế hoạt động</div>
          <div className={styles.mainContentIcon}>
            <div className={styles.contactSocial}>
              <FacebookIcon />
              <span>Facebook</span>
            </div>
            <div className={styles.contactSocial}>
              <InstagramIcon />
              <span>Instagram</span>
            </div>
            <div className={styles.contactSocial}>
              <YouTubeIcon />
              <span>Youtube</span>
            </div>
          </div>
          <div className={styles.qrWrapper} onClick={() => handleDownloadApp()}>
            <img
              importance="low"
              loading="lazy"
              src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v3/f/f519939e72eccefffb6998f1397901b7.svg"
              decoding="async"
              alt="QR Download App"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
