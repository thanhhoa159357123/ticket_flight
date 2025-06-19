import React from "react";
import styles from "./TicketDetail.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import DetailContent from "../../../pages/ticket/ticket_content/item_content/DetailContent/DetailContent";

const TicketDetail = ({ onClose }) => {
  return (
    <div className={styles.ticketDetail}>
      <div className={styles.header}>
        <CloseIcon className={styles.closeIcon} onClick={onClose} />
        <h3>Tóm tắt chuyến đi</h3>
      </div>

      <div className={styles.routeInfo}>
        <strong>TP HCM (SGN)</strong> → <strong>Hà Nội (HAN)</strong>
        <p>CN, 15 tháng 6 2025 • 1 hành khách • 1 hành lý xách tay</p>
        <div className={styles.tabHeader}>
          <span className={styles.active}>Chi tiết</span>
        </div>
      </div>

      <div className={styles.timeline}>
        {/* <div className={styles.timeBlock}>
          <span className={styles.time}>20:00</span>
          <div>
            <div>TP HCM (SGN) – Sân bay Tân Sơn Nhất – Nhà ga 1</div>
            <div>✈ VietJet Air • VJ-176 – Khuyến mãi</div>
            <ul className={styles.features}>
              <li>🧳 Hành lý xách tay 7kg</li>
              <li>📦 Hành lý ký gửi 0kg</li>
              <li>📋 Quy định hành lý đặc biệt</li>
              <li>🛩 Airbus A330</li>
              <li>🪑 3-3 sơ đồ ghế ngồi, 28 inches chỗ ngồi</li>
            </ul>
          </div>
        </div>

        <div className={styles.timeBlock}>
          <span className={styles.time}>22:10</span>
          <div>Hà Nội (HAN) – Sân bay Nội Bài – Nhà ga 1</div>
        </div> */}
        <DetailContent />
      </div>
    </div>
  );
};

export default TicketDetail;
