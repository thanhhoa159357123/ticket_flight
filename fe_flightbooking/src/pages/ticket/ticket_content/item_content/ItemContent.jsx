import React, { useState } from "react";
import styles from "./ItemContent.module.scss";
import DetailContent from "./DetailContent/DetailContent";
import TicketOptionsPanel from "../../../../components/ticketbook/TicketOptionsPanel/TicketOptionalsPanel";
import TicketDetail from "../../../../components/ticketbook/TicketDetail/TicketDetail";
import TicketMoreDetail from "../../../../components/ticketbook/TicketMoreDetail/TicketMoreDetail";

const TABS = [
  "Chi tiết",
  "Các lợi ích đi kèm",
  "Hoàn vé",
  "Đổi lịch",
  "Khuyến mãi ✈️",
];

const ItemContent = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [showMoreDetail, setShowMoreDetail] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleItemClick = () => {
    if (hoveredTab) {
      setActiveTab((prev) => (prev === hoveredTab ? null : hoveredTab));
    } else {
      setActiveTab((prev) => (prev === "Chi tiết" ? null : "Chi tiết"));
    }
  };

  const handleShowMoreDetail = (ticketType, price) => {
    setSelectedTicket({ type: ticketType, price });
    setShowMoreDetail(true);
  };

  return (
    <>
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

        <div
          className={styles.actionLinks}
          onClick={(e) => e.stopPropagation()}
        >
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
              setShowOptions(true);
            }}
          >
            Chọn
          </button>
        </div>

        {activeTab === "Chi tiết" && <DetailContent />}
      </div>

      {/* Panel chọn vé */}
      <TicketOptionsPanel
        show={showOptions}
        onClose={() => setShowOptions(false)}
        onShowDetail={() => setShowTicketDetail(true)}
        onShowMoreDetail={handleShowMoreDetail}
      />

      {/* Panel chi tiết vé */}
      <>
        <div
          className={`${styles.ticketDetailOverlay} ${
            showTicketDetail ? styles.show : ""
          }`}
          onClick={() => setShowTicketDetail(false)}
        />
        <div
          className={`${styles.ticketDetailPanel} ${
            showTicketDetail ? styles.show : ""
          }`}
        >
          <TicketDetail onClose={() => setShowTicketDetail(false)} />
        </div>
      </>

      {/* Panel tìm hiểu thêm */}
      <>
        <div
          className={`${styles.ticketMoreDetailOverlay} ${
            showMoreDetail ? styles.show : ""
          }`}
          onClick={() => setShowMoreDetail(false)}
        />
        <div
          className={`${styles.ticketMoreDetailPanel} ${
            showMoreDetail ? styles.show : ""
          }`}
        >
          <TicketMoreDetail
            onClose={() => setShowMoreDetail(false)}
            ticketType={selectedTicket?.type}
            price={selectedTicket?.price}
          />
        </div>
      </>
    </>
  );
};

export default ItemContent;
