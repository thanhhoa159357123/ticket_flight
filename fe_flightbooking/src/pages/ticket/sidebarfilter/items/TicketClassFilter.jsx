import React, { useState, useEffect } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import axios from "axios";

const TicketClassFilter = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [options, setOptions] = useState([]);

  const toggleClass = (label) => {
    const updated = selectedClasses.includes(label)
      ? selectedClasses.filter((item) => item !== label)
      : [...selectedClasses, label];

    setSelectedClasses(updated);
    onFilterChange(updated); // gọi lên cha
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/hang-ve");
        const uniqueOptions = res.data
          .filter((item) => !item.ma_hang_ve.includes("+"))
          .map((item) => ({
            value: item.ma_hang_ve, // dùng để filter
            label: item.vi_tri_ngoi, // dùng để hiển thị
          }))
          .filter(
            (value, index, self) =>
              self.findIndex((v) => v.value === value.value) === index
          );

        setOptions(uniqueOptions);
      } catch (error) {
        console.error("Lỗi fetch hạng vé:", error);
      }
    };
    fetchOptions();
  }, []);

  return (
    <div className="flex flex-col border-b border-black/10">
      <div
        className="flex justify-between items-center py-2 text-sm font-semibold text-[#222] cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Hạng vé</span>
        <KeyboardArrowUpIcon
          fontSize="small"
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`flex flex-col gap-[4px] overflow-hidden transition-all ${
          isOpen ? "max-h-[300px] opacity-100 pt-1 pb-2" : "max-h-0 opacity-0"
        }`}
      >
        {options.map((opt, index) => (
          <div
            key={index}
            onClick={() => toggleClass(opt.value)}
            className="flex items-center gap-2 px-1 py-[6px] rounded-md text-xs cursor-pointer hover:bg-[rgba(58,134,255,0.05)]"
          >
            <input
              type="checkbox"
              checked={selectedClasses.includes(opt.value)}
              onChange={() => toggleClass(opt.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-3.5 h-3.5 accent-[#3a86ff]"
            />
            <span className="flex-1 text-[#111] font-medium">{opt.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketClassFilter;
