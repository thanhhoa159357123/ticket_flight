import React, { useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const AirlineFilter = () => {
  const [isAirlineOpen, setIsAirlineOpen] = useState(true);
  const [selectedAirlines, setSelectedAirlines] = useState([]);

  const airlines = ["Bamboo Airways", "VietJet Air", "VietJet Airlines"];

  const toggleAirline = (name) => {
    setSelectedAirlines((prev) =>
      prev.includes(name)
        ? prev.filter((airline) => airline !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="flex flex-col border-b border-black/10">
      <div
        className="flex justify-between items-center py-2 text-sm font-semibold text-[#222] cursor-pointer select-none transition hover:text-[#007bff]"
        onClick={() => setIsAirlineOpen(!isAirlineOpen)}
      >
        <span>Hãng hàng không</span>
        <KeyboardArrowUpIcon
          fontSize="small"
          className={`transition-transform duration-200 ease-in-out ${
            isAirlineOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`flex flex-col gap-[4px] overflow-hidden transition-all duration-200 ease-in-out ${
          isAirlineOpen ? "max-h-[300px] opacity-100 pt-1 pb-2" : "max-h-0 opacity-0"
        }`}
      >
        {airlines.map((airline, index) => (
          <div
            key={index}
            onClick={() => toggleAirline(airline)}
            className="flex items-center gap-2 px-1 py-[6px] rounded-md text-xs cursor-pointer transition hover:bg-[rgba(58,134,255,0.05)]"
          >
            <input
              type="checkbox"
              checked={selectedAirlines.includes(airline)}
              onChange={() => toggleAirline(airline)}
              onClick={(e) => e.stopPropagation()}
              className="w-3.5 h-3.5 accent-[#3a86ff] transition"
            />
            <span className="flex-1 text-[#111] font-medium">{airline}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirlineFilter;
