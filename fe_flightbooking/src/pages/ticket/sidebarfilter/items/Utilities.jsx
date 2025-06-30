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
    <div className="flex flex-col border-b border-black/10">
      {/* Header */}
      <div
        className="flex justify-between items-center py-2 text-sm font-semibold text-[#222] cursor-pointer select-none transition hover:text-[#3a86ff]"
        onClick={() => setIsUtilitiesOpen(!isUtilitiesOpen)}
      >
        <span>Tiện ích</span>
        <KeyboardArrowUpIcon
          fontSize="small"
          className={`transition-transform duration-200 ${
            isUtilitiesOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Content */}
      <div
        className={`flex flex-col gap-1 overflow-hidden transition-all duration-300 ease-in-out ${
          isUtilitiesOpen
            ? "max-h-[500px] opacity-100 pt-1 pb-2"
            : "max-h-0 opacity-0"
        }`}
      >
        {utilitiesData.map(({ id, label, Icon, disabled }) => {
          const isSelected = selectedUtilities.includes(id);
          return (
            <div
              key={id}
              className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-md transition-all cursor-pointer ${
                disabled
                  ? "opacity-50 pointer-events-none"
                  : isSelected
                  ? "bg-[#3a86ff]/10"
                  : "hover:bg-[#3a86ff]/5"
              }`}
              onClick={() => !disabled && toggleUtility(id)}
            >
              {/* Checkbox + Label */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={disabled}
                  readOnly
                  className={`w-4 h-4 accent-[#3a86ff] transition-all ${
                    !disabled && "checked:shadow-[0_0_0_2px_rgba(58,134,255,0.2)]"
                  }`}
                />
                <span
                  className={`text-sm ${
                    disabled
                      ? "text-[#999]"
                      : isSelected
                      ? "text-[#3a86ff] font-semibold"
                      : "text-[#333]"
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* Icon */}
              {Icon && (
                <Icon
                  fontSize="small"
                  className={`${
                    disabled
                      ? "text-[#ccc]"
                      : isSelected
                      ? "text-[#3a86ff]"
                      : "text-[#666]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Utilities;
