import React, { useState } from "react";
import styles from "./NumberOfStops.module.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const NumberOfStops = () => {
  const [isStopOpen, setIsStopOpen] = useState(true);

  return (
    <div className={styles.NumberOfStops}>
      <div
        className={styles.NumberOfStops__Title}
        onClick={() => setIsStopOpen(!isStopOpen)}
        
      >
        <div>Số điểm dừng</div>
        <KeyboardArrowUpIcon
          className={`${styles.arrowIcon} ${isStopOpen ? styles.rotate : ""}`}
        />
      </div>

      <div
        className={`${styles.NumberOfStops__Content} ${
          isStopOpen ? styles.open : styles.closed
        }`}
      >
        <div className={styles.stopRow}>
          <input type="checkbox" />
          <span className={styles.stopLabel}>Bay thẳng</span>
          <span className={styles.stopPrice}>1.823.909 VND</span>
        </div>
        <div className={styles.stopRow}>
          <input type="checkbox" />
          <span className={styles.stopLabel}>1 điểm dừng</span>
          <span className={styles.stopPrice}>2.345.148 VND</span>
        </div>
        <div className={`${styles.stopRow} ${styles.disabled}`}>
          <input type="checkbox" disabled />
          <span className={styles.stopLabel}>2+ transits</span>
          <span className={styles.stopPrice}>—</span>
        </div>
      </div>
    </div>
  );
};

export default NumberOfStops;
