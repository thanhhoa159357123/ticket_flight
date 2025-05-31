import React from "react";
import styles from "./TicketOptionalsPanel.module.scss";

const TicketOptionsPanel = ({ onClose, onShowDetail }) => {
  return (
    <>
      <div className={`${styles.ticketOptionsOverlay} ${styles.show}`} onClick={onClose} />
      <div className={`${styles.ticketOptionsPanel} ${styles.show}`}>
        <div className={styles.panelHeader}>
          <h2>Chọn vé</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.optionItem}>
          <h3>Vé tiêu chuẩn</h3>
          <p>Hành lý xách tay 7kg</p>
          <p>Không bao gồm hành lý ký gửi</p>
          <p className={styles.price}>1.830.413 VND</p>
          <button className={styles.detailButton} onClick={onShowDetail}>
            Xem chi tiết
          </button>
        </div>

        <div className={styles.optionItem}>
          <h3>Vé tiết kiệm</h3>
          <p>Hành lý xách tay 7kg + 20kg ký gửi</p>
          <p>Ưu tiên chỗ ngồi</p>
          <p className={styles.price}>2.150.000 VND</p>
          <button className={styles.detailButton} onClick={onShowDetail}>
            Xem chi tiết
          </button>
        </div>

        <div className={styles.optionItem}>
          <h3>Vé linh hoạt</h3>
          <p>Hành lý xách tay 7kg + 30kg ký gửi</p>
          <p>Ưu tiên chỗ ngồi + Đổi lịch miễn phí</p>
          <p className={styles.price}>2.500.000 VND</p>
          <button className={styles.detailButton} onClick={onShowDetail}>
            Xem chi tiết
          </button>
        </div>

        <button className={styles.confirmButton}>Xác nhận chọn vé</button>
      </div>
    </>
  );
};

export default TicketOptionsPanel;
