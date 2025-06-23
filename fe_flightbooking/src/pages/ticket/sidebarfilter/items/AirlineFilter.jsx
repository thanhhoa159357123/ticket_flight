import React, { useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const AirlineFilter = () => {
  const [isAirlineOpen, setIsAirlineOpen] = useState(true);

  return (
    <div className="flex flex-col gap-2 border-b-[1px] border-solid border-black/10">
      <div
        className="flex justify-between items-center py-[12px] text-[15px]
        font-semibold text-[#222] cursor-pointer select-none transition-all duration-200 ease hover:text-[#007bff]"
        onClick={() => setIsAirlineOpen(!isAirlineOpen)}
      >
        <div>Hãng hàng không</div>
        <KeyboardArrowUpIcon
          className={`transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) text-[#666] text-[20px] hover:text-[#007bff] ${
            isAirlineOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`flex flex-col gap-3 overflow-hidden transition-all duration-400 ease-in-out ${
          isAirlineOpen
            ? "max-h-[500px] opacity-100 pt-1 pb-2"
            : "max-h-0 opacity-0"
        }`}
      >
        {["Bamboo Airways", "VietJet Air", "VietJet Airlines"].map(
          (airline, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-1 py-2 rounded-md transition-all duration-200 hover:bg-[rgba(58,134,255,0.05)]"
            >
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#3a86ff] cursor-pointer transition-all duration-200 checked:shadow-[0_0_0_2px_rgba(58,134,255,0.2)]"
              />
              <span className="flex-1 text-[#111] text-sm font-medium">
                {airline}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AirlineFilter;
