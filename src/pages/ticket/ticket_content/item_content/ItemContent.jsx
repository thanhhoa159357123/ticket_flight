import React from "react";
import styles from "./ItemContent.module.scss";

const ItemContent = () => {
  return (
    <div className={styles.itemContainer}>
      <div className={styles.airlineHeader}>
        <span className={styles.airlineName}>VietJet Air</span>
      </div>

      <div className={styles.flightInfo}>
        <div className={styles.timeInfo}>
          <span className={styles.time}>20:05</span>
          <span className={styles.airportCode}>SGN</span>
        </div>

        <div className={styles.durationInfo}>
          <span className={styles.duration}>2h 5m</span>
          <span className={styles.flightType}>Bay thẳng</span>
        </div>

        <div className={styles.timeInfo}>
          <span className={styles.time}>22:10</span>
          <span className={styles.airportCode}>HAN</span>
        </div>

        <div className={styles.priceBlock}>
          <span className={styles.price}>1.830.413 VND</span>
          <span className={styles.perPerson}>/khách</span>
        </div>
      </div>

      <div className={styles.promoBanner}>
        <span className={`${styles.badge} ${styles.blue}`}>
          ✈ BAYMEGA66NOIDIA giảm đến 66K
        </span>
        <span className={`${styles.badge} ${styles.yellow}`}>
          🔥 Giá đặc biệt 6.6
        </span>
        <span className={`${styles.badge} ${styles.red}`}>
          📄 Có thể cung cấp hóa đơn VAT
        </span>
      </div>

      <div className={styles.actionLinks}>
        <div className={styles.linkGroup}>
          <span className={styles.link}>Chi tiết</span>
          <span className={styles.link}>Các lợi ích đi kèm</span>
          <span className={styles.link}>Hoàn vé</span>
          <span className={styles.link}>Đổi lịch</span>
          <span className={styles.link}>Khuyến mãi ✈️</span>
        </div>
        <button className={styles.selectButton}>Chọn</button>
      </div>
    </div>
  );
};

export default ItemContent;
