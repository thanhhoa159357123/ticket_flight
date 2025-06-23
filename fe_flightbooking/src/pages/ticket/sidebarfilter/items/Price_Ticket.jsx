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
    <div className="flex flex-col gap-2 border-b border-black/10">
      {/* Title */}
      <div
        className="flex justify-between items-center py-3 text-[15px] font-semibold text-[#222] cursor-pointer select-none transition-all hover:text-[#3a86ff]"
        onClick={() => setIsPriceTicketOpen(!isPriceTicketOpen)}
      >
        <div>Giá/hành khách</div>
        <KeyboardArrowUpIcon
          className={`transition-transform duration-300 text-[#666] text-[20px] ${
            isPriceTicketOpen ? "rotate-180" : ""
          } hover:text-[#3a86ff]`}
        />
      </div>

      {/* Content */}
      <div
        className={`flex flex-col gap-4 overflow-hidden transition-all duration-400 ease-in-out px-2 ${
          isPriceTicketOpen
            ? "max-h-[500px] opacity-100 pt-1 pb-4"
            : "max-h-0 opacity-0"
        }`}
      >
        {/* Hiển thị giá đã chọn */}
        <div className="flex items-center justify-center gap-2 text-[15px] font-semibold text-[#333]">
          <span>{formatPrice(priceRange[0])}</span>
          <span className="text-[#666]">-</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>

        {/* Slider */}
        <div className="px-2 my-3">
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
                marginTop: "-7px",
              },
              {
                backgroundColor: "#fff",
                borderColor: "#3a86ff",
                boxShadow: "0 0 4px rgba(58, 134, 255, 0.6)",
                width: "18px",
                height: "18px",
                marginTop: "-7px",
              },
            ]}
            railStyle={{ backgroundColor: "#e0e0e0", height: "4px" }}
          />
        </div>

        {/* Min/Max label */}
        <div className="flex justify-between text-[13px] text-[#666]">
          <span>{formatPrice(minPrice)}</span>
          <span>{formatPrice(maxPrice)}</span>
        </div>
      </div>
    </div>
  );
};

export default Price_Ticket;
