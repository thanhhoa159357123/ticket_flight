import React, { useState } from "react";
import styles from "./price_ticket.module.scss";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Price_Ticket = () => {
  const [isPriceTicketOpen, setIsPriceTicketOpen] = useState(true);
  const [priceRange, setPriceRange] = useState([1784781, 3832390]);
  const minPrice = 1784781;
  const maxPrice = 3832390;

  const handleSliderChange = (value) => {
    setPriceRange(value);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VND";
  };

  return (
    <div className={styles.PriceTicket}>
      <div
        className={styles.PriceTicket__Title}
        onClick={() => setIsPriceTicketOpen(!isPriceTicketOpen)}
      >
        <div>Giá/hành khách</div>
        <KeyboardArrowUpIcon
          className={`${styles.arrowIcon} ${
            isPriceTicketOpen ? styles.rotate : ""
          }`}
        />
      </div>

      {isPriceTicketOpen && (
        <div className={styles.PriceTicket__Content}>
          <div className={styles.priceDisplay}>
            <span>{formatPrice(priceRange[0])}</span>
            <span className={styles.dash}>-</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
          
          <div className={styles.sliderContainer}>
            <Slider.Range
              range
              min={minPrice}
              max={maxPrice}
              defaultValue={[minPrice, maxPrice]}
              value={priceRange}
              onChange={handleSliderChange}
              trackStyle={[{ backgroundColor: "#3a86ff" }]}
              handleStyle={[
                {
                  backgroundColor: "#fff",
                  borderColor: "#3a86ff",
                  boxShadow: "0 0 4px rgba(58, 134, 255, 0.6)",
                  width: "18px",
                  height: "18px",
                  marginTop: "-7px"
                },
                {
                  backgroundColor: "#fff",
                  borderColor: "#3a86ff",
                  boxShadow: "0 0 4px rgba(58, 134, 255, 0.6)",
                  width: "18px",
                  height: "18px",
                  marginTop: "-7px"
                }
              ]}
              railStyle={{ backgroundColor: "#e0e0e0", height: "4px" }}
            />
          </div>
          
          <div className={styles.priceRange}>
            <span>{formatPrice(minPrice)}</span>
            <span>{formatPrice(maxPrice)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Price_Ticket;