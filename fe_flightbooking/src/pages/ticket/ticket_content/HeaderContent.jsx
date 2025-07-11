// === File: HeaderContent.jsx ===
import React from "react";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const HeaderContent = () => {
  return (
    <div className="relative w-full h-auto shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden">
      <div className="relative z-2 rounded-[10px_10px_0_0] bg-white flex flex-col">
        <div className="flex items-center bg-white px-[16px] py-[20px] w-fit max-w-full">
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
        </div>
      </div>
    </div>
  );
};

export default HeaderContent;
