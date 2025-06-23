import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const TimeOption = ({ title, timeSlots }) => {
  const [selectedTime, setSelectedTime] = useState(null);

  const handleTimeClick = (index) => {
    setSelectedTime(selectedTime === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-sm font-medium text-[#333]">{title}</span>
      <div className="grid grid-cols-2 gap-3">
        {timeSlots.map((item, index) => {
          const isSelected = selectedTime === index;
          return (
            <div
              key={index}
              onClick={() => handleTimeClick(index)}
              className={`flex flex-col items-center border rounded-lg px-4 py-3 bg-white transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#3a86ff] border-[#3a86ff] shadow-md"
                  : "border-gray-200 hover:border-[#3a86ff] hover:shadow"
              }`}
            >
              <span
                className="text-xs font-medium mb-1"
              >
                {item.period}
              </span>
              <span
                className="`text-lg font-bold text-blue-600"
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

const TimeRangeSlider = () => {
  const [range, setRange] = useState([0, 12]);

  return (
    <div className="flex flex-col gap-2 p-2.5">
      <div className="flex justify-between text-sm font-medium text-[#333] px-1">
        <span>Thời gian bay</span>
        <span>
          {range[0]}h - {range[1]}h
        </span>
      </div>
      <div className="px-2 py-2">
        <Slider.Range
          min={0}
          max={12}
          step={1}
          defaultValue={[0, 12]}
          onChange={(val) => setRange(val)}
        />
      </div>
      <div className="flex justify-between text-[13px] text-[#999] px-1">
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
    <div className="flex flex-col gap-2 border-b border-black/10">
      {/* Header */}
      <div
        className="flex justify-between items-center py-3 text-[15px] font-semibold text-[#222] cursor-pointer select-none transition-all hover:text-[#3a86ff]"
        onClick={() => setIsTimeLineOpen(!isTimeLineOpen)}
      >
        <div>Thời gian bay</div>
        <KeyboardArrowUpIcon
          className={`transition-transform duration-300 text-[#666] text-[20px] ${
            isTimeLineOpen ? "rotate-180" : ""
          } hover:text-[#3a86ff]`}
        />
      </div>

      {/* Nội dung tùy chọn */}
      <div
        className={`flex flex-col gap-10 overflow-hidden transition-all duration-500 ease-in-out ${
          isTimeLineOpen
            ? "max-h-[1000px] opacity-100 pt-1 pb-4"
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
