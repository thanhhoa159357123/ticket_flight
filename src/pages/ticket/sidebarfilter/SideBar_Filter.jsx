import React from "react";
import styles from "./sidebar_filter.module.scss";
import NumberOfStops from "./items/NumberOfStops/NumberOfStops";
import AirlineFilter from "./items/AirlineFilter/AirlineFilter";
import Time_Line from "./items/Time_Line/Time_Line";
import Utilities from "./items/Utilities/Utilities";
import Price_Ticket from "./items/PriceTicket/Price_Ticket";

const SideBar_Filter = () => {
  return (
    <div className={styles.SideBarFilter}>
      <div className={styles.TopContent}>
        <div>Bộ lọc :</div>
        <div className={styles.TextReset}>Đặt lại</div>
      </div>

      <NumberOfStops />
      <AirlineFilter />
      <Time_Line />
      <Utilities />
      <Price_Ticket />
    </div>
  );
};

export default SideBar_Filter;
