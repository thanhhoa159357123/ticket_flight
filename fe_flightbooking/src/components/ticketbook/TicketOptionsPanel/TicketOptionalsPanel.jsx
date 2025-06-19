import React, { useRef, useState, useEffect } from "react";
import styles from "./TicketOptionalsPanel.module.scss";
import TicketDetail from "../TicketDetail/TicketDetail";
import CloseIcon from "@mui/icons-material/Close";
import LuggageIcon from "@mui/icons-material/Luggage";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BlockIcon from "@mui/icons-material/Block";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const TicketOptionsPanel = ({
  onClose,
  onShowDetail,
  onShowMoreDetail,
  show,
}) => {
  const optionListRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (optionListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = optionListRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (optionListRef.current) {
      optionListRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (optionListRef.current) {
      optionListRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const currentRef = optionListRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScroll);
      checkScroll();
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  return (
    <>
      <div
        className={`${styles.ticketOptionsOverlay} ${show ? styles.show : ""}`}
        onClick={onClose}
      />
      <div
        className={`${styles.ticketOptionsPanel} ${show ? styles.show : ""}`}
      >
        <div className={styles.panelHeader}>
          <CloseIcon className={styles.closeIcon} onClick={onClose} />
          <h2>Chuyến đi của bạn</h2>
        </div>

        <div className={styles.flightInfo}>
          <div className={styles.flightRoute}>
            <div className={styles.flightSummary}>
              <h3>Khởi hành</h3>
              <span>TP HCM – Hà Nội</span>
              <p>Sun, 15 Jun 2025</p>
            </div>

            <span>VietJet Air</span>
            <div className={styles.flightDetails}>
              <div className={styles.flightTime}>
                <strong>20:00</strong>
                <span>SGN</span>
              </div>

              <div className={styles.duration}>
                <span>2h 10m</span>
                <span>Bay thẳng</span>
              </div>

              <div className={styles.flightTime}>
                <strong>22:10</strong>
                <span>HAN</span>
              </div>
            </div>

            <div className={styles.promotion}>
              <button
                className={styles.detailButton}
                onClick={(e) => {
                  e.stopPropagation();
                  onShowDetail();
                }}
              >
                Chi tiết
              </button>
            </div>
          </div>
        </div>

        <div className={styles.optionsHeader}>
          <span>Chọn loại vé của bạn</span>
          <div className={styles.scrollControls}>
            <button
              className={`${styles.scrollButton} ${
                !showLeftArrow ? styles.disabled : ""
              }`}
              onClick={scrollLeft}
              disabled={!showLeftArrow}
              aria-label="Scroll left"
            >
              <ArrowBackIcon />
            </button>
            <button
              className={`${styles.scrollButton} ${
                !showRightArrow ? styles.disabled : ""
              }`}
              onClick={scrollRight}
              disabled={!showRightArrow}
              aria-label="Scroll right"
            >
              <ArrowForwardIcon />
            </button>
          </div>
        </div>

        <div className={styles.optionList} ref={optionListRef}>
          {/* Option 1 - Nguyên bản */}
          <div className={styles.optionItem}>
            <div className={styles.optionHeader}>
              <h3>Nguyên bản</h3>
              <span className={styles.price}>1.200.000 VND/khách</span>
            </div>
            <ul className={styles.featureList}>
              <li>
                <LuggageIcon className={styles.featureIcon} />
                Hành lý xách tay 7 kg
              </li>
              <li>
                <LuggageIcon className={styles.featureIcon} />
                Hành lý ký gửi 0 kg
              </li>
              <li>
                <SwapHorizIcon className={styles.featureIcon} />
                Phí đổi lịch bay 378.000 VND
              </li>
              <li>
                <BlockIcon className={styles.featureIcon} />
                Không hoàn vé
              </li>
              <li>
                <ReceiptIcon className={styles.featureIcon} />
                Có hóa đơn VAT
              </li>
            </ul>
            <div className={styles.actionSection}>
              <button
                className={styles.moreInfoButton}
                onClick={(e) => {
                  e.stopPropagation();
                  onShowMoreDetail &&
                    onShowMoreDetail("Nguyên bản", "1.200.000 VND");
                }}
              >
                Tìm hiểu thêm
              </button>
              <button className={styles.selectButton}>Chọn</button>
            </div>
          </div>

          {/* Option 2 - Economy Deluxe */}
          <div className={styles.optionItem}>
            <div className={styles.optionHeader}>
              <h3>Economy Deluxe</h3>
              <span className={styles.price}>3.200.000 VND/khách</span>
            </div>
            <ul className={styles.featureList}>
              <li>
                <LuggageIcon className={styles.featureIcon} />
                Hành lý xách tay 7 kg
              </li>
              <li>
                <LuggageIcon className={styles.featureIcon} />
                Hành lý ký gửi 0 kg
              </li>
              <li>
                <SwapHorizIcon className={styles.featureIcon} />
                Đổi lịch miễn phí
              </li>
              <li>
                <BlockIcon className={styles.featureIcon} />
                Không hoàn vé
              </li>
              <li>
                <ReceiptIcon className={styles.featureIcon} />
                Có hóa đơn VAT
              </li>
            </ul>
            <div className={styles.actionSection}>
              <button
                className={styles.moreInfoButton}
                onClick={(e) => {
                  e.stopPropagation();
                  onShowMoreDetail &&
                    onShowMoreDetail("Economy Deluxe", "3.200.000 VND");
                }}
              >
                Tìm hiểu thêm
              </button>
              <button className={styles.selectButton}>Chọn</button>
            </div>
          </div>

          {/* Option 3 - Premium Economy */}
          <div className={styles.optionItem}>
            <div className={styles.optionHeader}>
              <h3>Premium Economy</h3>
              <span className={styles.price}>3.500.000 VND/khách</span>
            </div>
            <ul className={styles.featureList}>
              <li>
                <LuggageIcon className={styles.featureIcon} />
                Hành lý xách tay 10 kg
              </li>
              <li>
                <LuggageIcon className={styles.featureIcon} />
                Hành lý 30 kg
              </li>
              <li>
                <SwapHorizIcon className={styles.featureIcon} />
                Đổi lịch miễn phí
              </li>
              <li>
                <BlockIcon className={styles.featureIcon} />
                Không hoàn vé
              </li>
              <li>
                <ReceiptIcon className={styles.featureIcon} />
                Có hóa đơn VAT
              </li>
            </ul>
            <div className={styles.actionSection}>
              <button
                className={styles.moreInfoButton}
                onClick={(e) => {
                  e.stopPropagation();
                  onShowMoreDetail &&
                    onShowMoreDetail("Premium Economy", "3.500.000 VND");
                }}
              >
                Tìm hiểu thêm
              </button>
              <button className={styles.selectButton}>Chọn</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketOptionsPanel;
