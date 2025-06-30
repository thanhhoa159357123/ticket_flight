import React, { useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const NumberOfStops = () => {
  const [isStopOpen, setIsStopOpen] = useState(true);
  const [checkedStops, setCheckedStops] = useState([]);

  const stops = [
    { label: "Bay thẳng", price: "1.823.909 VND", disabled: false },
    { label: "1 điểm dừng", price: "2.345.148 VND", disabled: false },
    { label: "2+ transits", price: "—", disabled: true },
  ];

  const toggleStop = (label) => {
    setCheckedStops((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  return (
    <div className="flex flex-col border-b border-black/10">
      {/* Header */}
      <div
        className="flex justify-between items-center py-2 text-sm font-semibold text-[#222] cursor-pointer select-none transition hover:text-[#007bff]"
        onClick={() => setIsStopOpen(!isStopOpen)}
      >
        <span>Số điểm dừng</span>
        <KeyboardArrowUpIcon
          fontSize="small"
          className={`transition-transform duration-200 ${
            isStopOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Body */}
      <div
        className={`flex flex-col gap-[4px] overflow-hidden transition-all duration-200 ease-in-out ${
          isStopOpen ? "max-h-[300px] opacity-100 pt-1 pb-2" : "max-h-0 opacity-0"
        }`}
      >
        {stops.map((item, index) => (
          <div
            key={index}
            onClick={() => !item.disabled && toggleStop(item.label)}
            className={`flex items-center gap-2 px-1 py-[6px] rounded-md text-xs transition cursor-pointer ${
              item.disabled
                ? "opacity-50 pointer-events-none"
                : "hover:bg-[rgba(58,134,255,0.05)]"
            }`}
          >
            <input
              type="checkbox"
              disabled={item.disabled}
              checked={checkedStops.includes(item.label)}
              onChange={() => toggleStop(item.label)}
              onClick={(e) => e.stopPropagation()}
              className={`w-3.5 h-3.5 accent-[#3a86ff] transition ${
                item.disabled
                  ? ""
                  : "checked:shadow-[0_0_0_2px_rgba(58,134,255,0.2)]"
              }`}
            />
            <span
              className={`flex-1 font-medium ${
                item.disabled ? "text-[#999]" : "text-[#111]"
              }`}
            >
              {item.label}
            </span>
            <span
              className={`whitespace-nowrap ${
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
