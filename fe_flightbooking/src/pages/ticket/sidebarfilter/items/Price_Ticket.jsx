import React, { useState } from "react";
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
    <div className="flex flex-col border-b border-black/10">
      {/* Title */}
      <div
        className="flex justify-between items-center py-2 text-sm font-semibold text-[#222] cursor-pointer select-none transition hover:text-[#3a86ff]"
        onClick={() => setIsPriceTicketOpen(!isPriceTicketOpen)}
      >
        <span>Giá/hành khách</span>
        <KeyboardArrowUpIcon
          fontSize="small"
          className={`transition-transform duration-300 ${
            isPriceTicketOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Content */}
      <div
        className={`flex flex-col gap-3 overflow-hidden transition-all duration-300 ease-in-out px-2 ${
          isPriceTicketOpen ? "max-h-[300px] opacity-100 pt-1 pb-3" : "max-h-0 opacity-0"
        }`}
      >
        {/* Giá đã chọn */}
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#333]">
          <span>{formatPrice(priceRange[0])}</span>
          <span className="text-[#666]">-</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>

        {/* Slider */}
        <div className="px-2 my-2">
          <Slider.Range
            range
            min={minPrice}
            max={maxPrice}
            value={priceRange}
            onChange={handleSliderChange}
            trackStyle={[{ backgroundColor: "#3a86ff", height: 4 }]}
            handleStyle={[
              {
                backgroundColor: "#fff",
                borderColor: "#3a86ff",
                boxShadow: "0 0 3px rgba(58, 134, 255, 0.5)",
                width: "14px",
                height: "14px",
                marginTop: "-5px",
              },
              {
                backgroundColor: "#fff",
                borderColor: "#3a86ff",
                boxShadow: "0 0 3px rgba(58, 134, 255, 0.5)",
                width: "14px",
                height: "14px",
                marginTop: "-5px",
              },
            ]}
            railStyle={{ backgroundColor: "#e0e0e0", height: "4px" }}
          />
        </div>

        {/* Min/Max label */}
        <div className="flex justify-between text-[11px] text-[#888]">
          <span>{formatPrice(minPrice)}</span>
          <span>{formatPrice(maxPrice)}</span>
        </div>
      </div>
    </div>
  );
};

export default Price_Ticket;
