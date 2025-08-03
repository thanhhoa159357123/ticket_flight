import React, { useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Price_Ticket = ({ flights, priceRange, setPriceRange }) => {
  const [isPriceTicketOpen, setIsPriceTicketOpen] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    if (flights?.length > 0) {
      const prices = flights.map((f) => f.gia);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setMinPrice(min);
      setMaxPrice(max);
      setPriceRange([min, max]);
    }
  }, [flights, setPriceRange]);

  const handleSliderChange = (value) => {
    setPriceRange(value);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + " VND";

  return (
    <div className="flex flex-col border-b border-black/10">
      <div
        className="flex justify-between items-center py-2 text-sm font-semibold text-[#222] cursor-pointer hover:text-[#007bff] select-none"
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

      <div
        className={`transition-all duration-300 ease-in-out px-2 ${
          isPriceTicketOpen
            ? "max-h-[300px] opacity-100 pt-1 pb-3"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex justify-center gap-2 text-xs font-medium text-[#333]">
          <span>{formatPrice(priceRange[0])}</span>
          <span className="text-[#666]">-</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>

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

        <div className="flex justify-between text-[11px] text-[#888]">
          <span>{formatPrice(minPrice)}</span>
          <span>{formatPrice(maxPrice)}</span>
        </div>
      </div>
    </div>
  );
};

export default Price_Ticket;
