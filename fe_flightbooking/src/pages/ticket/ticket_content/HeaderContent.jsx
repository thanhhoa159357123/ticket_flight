// === File: HeaderContent.jsx ===
import React, { useState } from "react";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const HeaderContent = () => {
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [isNotiHovered, setIsNotiHovered] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

  const dateOptions = [
    { date: "Thứ 7, 24 thg 5", price: "4.078.000 VND" },
    { date: "CN, 25 thg 5", price: "2.222.810 VND", selected: true },
    { date: "Thứ 2, 26 thg 5", price: "2.017.000 VND" },
    { date: "Thứ 3, 27 thg 5", price: "2.017.000 VND" },
    { date: "Thứ 4, 28 thg 5", price: "2.170.000 VND" },
  ];

  return (
    <div className="relative w-full h-auto bg-[linear-gradient(135deg, #3a86ff, #2667cc)] rounded-[15px] p-0 shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden">
      <div className="relative z-2 bg-[#2f6fda] rounded-[15px] flex flex-col">
        <div className="flex items-center bg-white rounded-[15px_15px_0_0] px-[16px] py-[20px] w-fit max-w-full">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[18px] font-semibold">
              <span className="font-bold text-[#222]">TP HCM (SGN)</span>
              <TrendingFlatIcon className="text-[24px] text-[rgba(0, 0, 0, 0.7)] transition-transform duration-300 ease hover:transform hover:scale-[1.1]" />
              <span className="font-bold text-[#222]">Hà Nội (HAN)</span>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-[#666]">
              <span>CN, 25 thg 5 2025</span>
              <span className="text-[#ddd]">|</span>
              <span>1 hành khách</span>
              <span className="text-[#ddd]">|</span>
              <span>Phổ thông</span>
            </div>
          </div>

          {/* Cập nhật phần JSX */}
          <div className="flex gap-0 bg-white/80 rounded-[20px] p-1 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
            {/* Nút Đổi tìm kiếm */}
            <div className="relative">
              <div
                className={`flex items-center px-3 py-2 rounded-[16px] cursor-pointer transition-all duration-300 ease-in-out
        ${isSearchHovered ? "bg-[#3a86ff26]" : "bg-transparent"}
        text-[#3a86ff]`}
                onMouseEnter={() => setIsSearchHovered(true)}
                onMouseLeave={() => setIsSearchHovered(false)}
              >
                <span
                  className={`text-sm whitespace-nowrap transition-all duration-300 ease-in-out
          ${
            isSearchHovered
              ? "opacity-100 ml-2 inline w-auto"
              : "opacity-0 w-0 ml-0 hidden"
          }`}
                >
                  Đổi tìm kiếm
                </span>
                <SearchIcon
                  className={`text-[20px] transition-all duration-300 ease-in-out ${
                    isSearchHovered ? "ml-2" : "ml-0"
                  }`}
                />
              </div>
              <div
                className="absolute inset-0"
                onMouseEnter={() => setIsSearchHovered(true)}
                onMouseLeave={() => setIsSearchHovered(false)}
              />
            </div>

            {/* Nút Theo dõi giá */}
            <div className="relative">
              <div
                className={`flex items-center px-3 py-2 rounded-[16px] cursor-pointer transition-all duration-300 ease-in-out
        ${isNotiHovered ? "bg-[#4caf501f]" : "bg-transparent"}
        text-[#4CAF50]`}
                onMouseEnter={() => setIsNotiHovered(true)}
                onMouseLeave={() => setIsNotiHovered(false)}
              >
                <span
                  className={`text-sm whitespace-nowrap transition-all duration-300 ease-in-out
          ${
            isNotiHovered
              ? "opacity-100 ml-2 inline w-auto"
              : "opacity-0 w-0 ml-0 hidden"
          }`}
                >
                  Theo dõi giá
                </span>
                <NotificationsIcon
                  className={`text-[20px] transition-all duration-300 ease-in-out ${
                    isNotiHovered ? "ml-2" : "ml-0"
                  }`}
                />
              </div>
              <div
                className="absolute inset-0"
                onMouseEnter={() => setIsNotiHovered(true)}
                onMouseLeave={() => setIsNotiHovered(false)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2 px-5 py-[14px] bg-gradient-to-r from-[#3a86ff] to-[#2f6fda] text-white rounded-b-[15px]">
          {dateOptions.slice(0, 5).map((item, index) => (
            <div
              key={index}
              className={`
        flex flex-col items-center justify-center px-2 py-2 rounded-[10px] text-center cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]
        hover:bg-white/15 hover:-translate-y-[2px]
        ${
          item.selected
            ? 'bg-white/25 shadow-[0_2px_8px_rgba(0,0,0,0.1)] relative after:content-[""] after:absolute after:bottom-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-5 after:h-[3px] after:bg-white after:rounded-[2px]'
            : ""
        }
      `}
            >
              <div>{item.date}</div>
              <div className="font-semibold mt-1 text-[15px]">{item.price}</div>
            </div>
          ))}

          <div className="flex items-center justify-center gap-[6px] px-4 py-2 bg-white/15 rounded-[10px] font-medium cursor-pointer transition-all duration-300 ease hover:bg-white/25 hover:-translate-y-[2px]">
            <CalendarMonthIcon fontSize="small" />
            <span className="text-sm">Lịch</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderContent;
