import React, { useState } from "react";
import styles from "./AirlineFilter.module.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const AirlineFilter = () => {
  const [isAirlineOpen, setIsAirlineOpen] = useState(true);

  return (
    <div className={styles.Airline}>
      <div
        className={styles.Airline__Title}
        onClick={() => setIsAirlineOpen(!isAirlineOpen)}
      >
        <div>Hãng hàng không</div>
        <KeyboardArrowUpIcon
          className={`${styles.arrowIcon} ${
            isAirlineOpen ? styles.rotate : ""
          }`}
        />
      </div>

      <div
        className={`${styles.Airline__Content} ${
          isAirlineOpen ? styles.open : styles.closed
        }`}
      >
        <div className={styles.stopRow}>
          <input type="checkbox" />
          <span className={styles.stopAirline}>Bamboo Airways</span>
        </div>
        <div className={styles.stopRow}>
          <input type="checkbox" />
          <span className={styles.stopAirline}>VietJet Air</span>
        </div>
        <div className={styles.stopRow}>
          <input type="checkbox" />
          <span className={styles.stopAirline}>VietJet Airlines</span>
        </div>
      </div>
    </div>
  );
};

export default AirlineFilter;
