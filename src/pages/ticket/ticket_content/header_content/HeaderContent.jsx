// === File: HeaderContent.jsx ===
import React, { useState } from "react";
import styles from "./HeaderContent.module.scss";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const HeaderContent = () => {
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [isNotiHovered, setIsNotiHovered] = useState(false);

  const dateOptions = [
    { date: "Thứ 7, 24 thg 5", price: "4.078.000 VND" },
    { date: "CN, 25 thg 5", price: "2.222.810 VND", selected: true },
    { date: "Thứ 2, 26 thg 5", price: "2.017.000 VND" },
    { date: "Thứ 3, 27 thg 5", price: "2.017.000 VND" },
    { date: "Thứ 4, 28 thg 5", price: "2.170.000 VND" },
  ];

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.ticketHeader}>
        <div className={styles.headerContent}>
          <div className={styles.leftContent}>
            <div className={styles.route}>
              <span className={styles.city}>TP HCM (SGN)</span>
              <TrendingFlatIcon className={styles.arrowIcon} />
              <span className={styles.city}>Hà Nội (HAN)</span>
            </div>
            <div className={styles.details}>
              <span>CN, 25 thg 5 2025</span>
              <span className={styles.divider}>|</span>
              <span>1 hành khách</span>
              <span className={styles.divider}>|</span>
              <span>Phổ thông</span>
            </div>
          </div>

          <div
            className={`${styles.midContent} ${
              isSearchHovered ? styles.hovered : ""
            }`}
            onMouseEnter={() => setIsSearchHovered(true)}
            onMouseLeave={() => setIsSearchHovered(false)}
          >
            <span className={styles.text}>Đổi tìm kiếm</span>
            <SearchIcon className={styles.icon} />
          </div>

          <div
            className={`${styles.rightContent} ${
              isNotiHovered ? styles.hovered : ""
            }`}
            onMouseEnter={() => setIsNotiHovered(true)}
            onMouseLeave={() => setIsNotiHovered(false)}
          >
            <span className={styles.text}>Theo dõi giá</span>
            <NotificationsIcon className={styles.icon} />
          </div>
        </div>

        <div className={styles.dateScrollBar}>
          {dateOptions.map((item, index) => (
            <div
              key={index}
              className={`${styles.dateItem} ${
                item.selected ? styles.selected : ""
              }`}
            >
              <div>{item.date}</div>
              <div className={styles.price}>{item.price}</div>
            </div>
          ))}
          <ArrowForwardIosIcon className={styles.arrowIconSmall} />
          <div className={styles.calendarButton}>
            <CalendarMonthIcon fontSize="small" />
            <span>Lịch</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderContent;
