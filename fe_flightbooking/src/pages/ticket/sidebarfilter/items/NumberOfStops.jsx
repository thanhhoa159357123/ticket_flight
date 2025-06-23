import React, { useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const NumberOfStops = () => {
  const [isStopOpen, setIsStopOpen] = useState(true);

  return (
    <div className="flex flex-col gap-2 border-b-[1px] border-solid border-black/10">
      <div
        className="flex justify-between items-center py-[12px] text-[15px]
        font-semibold text-[#222] cursor-pointer select-none transition-all duration-200 ease hover:text-[#007bff]"
        onClick={() => setIsStopOpen(!isStopOpen)}
      >
        <div>Số điểm dừng</div>
        <KeyboardArrowUpIcon
          className={`transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) text-[#666] text-[20px] hover:text-[#007bff] ${
            isStopOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`flex flex-col gap-3 overflow-hidden transition-all duration-400 ease-in-out ${
          isStopOpen
            ? "max-h-[500px] opacity-100 pt-1 pb-2"
            : "max-h-0 opacity-0"
        }`}
      >
        {[
          { label: "Bay thẳng", price: "1.823.909 VND", disabled: false },
          { label: "1 điểm dừng", price: "2.345.148 VND", disabled: false },
          { label: "2+ transits", price: "—", disabled: true },
        ].map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 px-1 py-2 rounded-md transition-all duration-200 ${
              item.disabled
                ? "opacity-50 pointer-events-none"
                : "hover:bg-[rgba(58,134,255,0.05)]"
            }`}
          >
            <input
              type="checkbox"
              disabled={item.disabled}
              className={`w-4 h-4 accent-[#3a86ff] cursor-pointer transition-all duration-200 ${
                item.disabled
                  ? ""
                  : "checked:shadow-[0_0_0_2px_rgba(58,134,255,0.2)]"
              }`}
            />
            <span
              className={`flex-1 text-sm font-medium ${
                item.disabled ? "text-[#999]" : "text-[#111]"
              }`}
            >
              {item.label}
            </span>
            <span
              className={`text-[13px] whitespace-nowrap ${
                item.disabled ? "text-[#999]" : "text-[#666]"
              }`}
            >
              {item.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NumberOfStops;
