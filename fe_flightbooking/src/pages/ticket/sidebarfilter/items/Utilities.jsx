import React, { useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Luggage as LuggageIcon,
  Restaurant as RestaurantIcon,
  LiveTv as LiveTvIcon,
  Wifi as WifiIcon,
  Cable as CableIcon,
} from "@mui/icons-material";

const utilitiesData = [
  { id: "luggage", label: "Hành lý", Icon: LuggageIcon },
  { id: "meal", label: "Suất ăn", Icon: RestaurantIcon },
  { id: "entertainment", label: "Giải trí", Icon: LiveTvIcon },
  { id: "wifi", label: "WiFi", Icon: WifiIcon, disabled: true },
  { id: "charging", label: "Nguồn sạc / cổng USB", Icon: CableIcon },
];

const Utilities = () => {
  const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(true);
  const [selectedUtilities, setSelectedUtilities] = useState([]);

  const toggleUtility = (utility) => {
    setSelectedUtilities((prev) =>
      prev.includes(utility)
        ? prev.filter((item) => item !== utility)
        : [...prev, utility]
    );
  };

  return (
    <div className="flex flex-col gap-2 border-b border-black/10">
      <div
        className="flex justify-between items-center py-3 text-[15px] font-semibold text-[#222] cursor-pointer select-none transition-all duration-200 hover:text-[#3a86ff]"
        onClick={() => setIsUtilitiesOpen(!isUtilitiesOpen)}
      >
        <div>Tiện ích</div>
        <KeyboardArrowUpIcon
          className={`transition-transform duration-300 text-[#666] text-[20px] hover:text-[#3a86ff] ${
            isUtilitiesOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Content */}
      <div
        className={`flex flex-col gap-1 overflow-hidden transition-all duration-400 ease-in-out ${
          isUtilitiesOpen
            ? "max-h-[500px] opacity-100 pt-1 pb-3"
            : "max-h-0 opacity-0"
        }`}
      >
        {utilitiesData.map(({ id, label, Icon, disabled }) => {
          const isSelected = selectedUtilities.includes(id);
          return (
            <div
              key={id}
              className={`flex items-center justify-between rounded-lg bg-white py-3 transition-all duration-200 border ${
                disabled
                  ? "bg-black/5 opacity-60 pointer-events-none border-transparent"
                  : isSelected
                  ? "bg-[#3a86ff]/10 border-[#3a86ff]/30"
                  : "hover:bg-[#3a86ff]/5 hover:border-[#3a86ff]/10 border-transparent"
              } active:opacity-80 cursor-pointer`}
              onClick={() => !disabled && toggleUtility(id)}
            >
              {/* Left row */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={disabled}
                  readOnly
                  className={`w-[18px] h-[18px] accent-[#3a86ff] cursor-pointer transition-all ${
                    disabled ? "pointer-events-none opacity-50" : ""
                  }`}
                />
                <span
                  className={`text-sm transition-all ${
                    disabled
                      ? "text-[#999]"
                      : isSelected
                      ? "text-[#3a86ff] font-semibold"
                      : "text-[#333] font-medium"
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* Right icon */}
              <Icon
                className={`text-[20px] mr-1 transition-all ${
                  disabled
                    ? "text-[#ccc]"
                    : isSelected
                    ? "text-[#3a86ff]"
                    : "text-[#666]"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Utilities;
