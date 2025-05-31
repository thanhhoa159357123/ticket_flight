import React, { useState, useEffect } from "react";
import styles from "./ItemContent.module.scss";
import DetailContent from "./DetailContent/DetailContent";
import BenefitContent from "./BenefitContent/BenefitContent";
import TicketOptionsPanel from "../../../../components/ticketbook/TicketOptionsPanel/TicketOptionalsPanel";

const TABS = [
  "Chi tiết",
  "Các lợi ích đi kèm",
  "Hoàn vé",
  "Đổi lịch",
  "Khuyến mãi ✈️",
];

const ItemContent = ({ onOpenOptions }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showTicketDetail, setShowTicketDetail] = useState(false);

  useEffect(() => {
    if (showOptions) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showOptions]);

  const handleItemClick = () => {
    if (hoveredTab) {
      // Nếu click vào và đang hover 1 tab → toggle tab đó
      setActiveTab((prev) => (prev === hoveredTab ? null : hoveredTab));
    } else {
      // Nếu click vào vùng item bình thường → toggle "Chi tiết"
      setActiveTab((prev) => (prev === "Chi tiết" ? null : "Chi tiết"));
    }
  };

  return (
    <div className={styles.itemContainer} onClick={handleItemClick}>
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

      <div className={styles.actionLinks} onClick={(e) => e.stopPropagation()}>
        <div className={styles.linkGroup}>
          {TABS.map((tab, index) => (
            <span
              key={index}
              className={`${styles.link} ${
                activeTab === tab ? styles.active : ""
              } ${tab !== "Chi tiết" ? styles.hidden : ""}`}
              onMouseEnter={() => setHoveredTab(tab)}
              onMouseLeave={() => setHoveredTab(null)}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab((prev) => (prev === tab ? null : tab));
              }}
            >
              {tab}
            </span>
          ))}
        </div>
        <button
          className={styles.selectButton}
          onClick={(e) => {
            e.stopPropagation();
            onOpenOptions(); // gọi hàm từ cha
          }}
        >
          Chọn
        </button>
      </div>

      {activeTab === "Chi tiết" && <DetailContent />}

      {showOptions && (
        <TicketOptionsPanel
          onClose={() => setShowOptions(false)}
          onShowDetail={() => setShowTicketDetail(true)}
        />
      )}
    </div>
  );
};

export default ItemContent;
