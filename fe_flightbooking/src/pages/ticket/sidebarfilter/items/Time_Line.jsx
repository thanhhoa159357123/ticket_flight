import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// eslint-disable-next-line react-refresh/only-export-components
const TimeOption = ({ title, timeSlots }) => {
  const [selectedTime, setSelectedTime] = useState(null);

  const handleTimeClick = (index) => {
    setSelectedTime(selectedTime === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-[#333]">{title}</span>
      <div className="grid grid-cols-2 gap-2">
        {timeSlots.map((item, index) => {
          const isSelected = selectedTime === index;
          return (
            <div
              key={index}
              onClick={() => handleTimeClick(index)}
              className={`flex flex-col items-center border rounded-[8px] px-3 py-2 bg-white text-center transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#3a86ff] border-[#3a86ff] shadow"
                  : "border-gray-200 hover:border-[#3a86ff] hover:shadow-sm"
              }`}
            >
              <span
                className={`text-[11px] mb-0.5 ${
                  isSelected ? "" : "text-[#333]"
                }`}
              >
                {item.period}
              </span>
              <span
                className={`text-sm font-semibold ${
                  isSelected ? "text-[#007bff]" : "text-[#007bff]"
                }`}
              >
                {item.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
const TimeRangeSlider = () => {
  const [range, setRange] = useState([0, 12]);

  return (
    <div className="flex flex-col gap-1 px-2">
      <div className="flex justify-between text-xs font-medium text-[#333]">
        <span>Thời gian bay</span>
        <span>
          {range[0]}h - {range[1]}h
        </span>
      </div>
      <div className="px-1 py-1">
        <Slider.Range
          min={0}
          max={12}
          step={1}
          defaultValue={[0, 12]}
          onChange={(val) => setRange(val)}
          trackStyle={[{ backgroundColor: "#3a86ff", height: 4 }]}
          handleStyle={[
            {
              backgroundColor: "#fff",
              borderColor: "#3a86ff",
              width: "14px",
              height: "14px",
              marginTop: "-5px",
              boxShadow: "0 0 3px rgba(58, 134, 255, 0.4)",
            },
            {
              backgroundColor: "#fff",
              borderColor: "#3a86ff",
              width: "14px",
              height: "14px",
              marginTop: "-5px",
              boxShadow: "0 0 3px rgba(58, 134, 255, 0.4)",
            },
          ]}
          railStyle={{ backgroundColor: "#e0e0e0", height: "4px" }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-[#888] px-1">
        <span>0h</span>
        <span>12h</span>
      </div>
    </div>
  );
};

const Time_Line = () => {
  const [isTimeLineOpen, setIsTimeLineOpen] = useState(true);

  const timeData = [
    { period: "Đêm đến sáng", time: "00:00 - 06:00" },
    { period: "Sáng đến trưa", time: "06:00 - 12:00" },
    { period: "Trưa đến tối", time: "12:00 - 18:00" },
    { period: "Tối đến đêm", time: "18:00 - 24:00" },
  ];

  return (
    <div className="flex flex-col border-b border-black/10">
      <div
        className="flex justify-between items-center py-2 text-sm font-semibold text-[#222] cursor-pointer select-none transition hover:text-[#007bff]"
        onClick={() => setIsTimeLineOpen(!isTimeLineOpen)}
      >
        <span>Thời gian bay</span>
        <KeyboardArrowUpIcon
          fontSize="small"
          className={`transition-transform duration-200 ${
            isTimeLineOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`flex flex-col gap-4 overflow-hidden transition-all duration-300 ease-in-out px-1 ${
          isTimeLineOpen
            ? "max-h-[700px] opacity-100 pt-1 pb-3"
            : "max-h-0 opacity-0"
        }`}
      >
        <TimeOption title="Giờ cất cánh" timeSlots={timeData} />
        <TimeOption title="Giờ hạ cánh" timeSlots={timeData} />
        <TimeRangeSlider />
      </div>
    </div>
  );
};

export default Time_Line;
