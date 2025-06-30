// === File: HeaderContent.jsx ===
import React from "react";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const HeaderContent = () => {
  const dateOptions = [
    { date: "Thứ 7, 24 thg 5", price: "4.078.000 VND" },
    { date: "CN, 25 thg 5", price: "2.222.810 VND", selected: true },
    { date: "Thứ 2, 26 thg 5", price: "2.017.000 VND" },
    { date: "Thứ 3, 27 thg 5", price: "2.017.000 VND" },
    { date: "Thứ 4, 28 thg 5", price: "2.170.000 VND" },
  ];

  return (
    <div className="relative w-full h-auto ml-4 p-0 shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden">
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

        <div className="flex px-3 py-2 bg-gradient-to-r from-[#3a86ff] to-[#2f6fda] text-white gap-2">
          {/* Danh sách ngày: 80% */}
          <div className="flex w-[80%] gap-1">
            {dateOptions.slice(0, 5).map((item, index) => (
              <div
                key={index}
                className={`flex-1 flex flex-col items-center justify-center px-2 py-[6px] rounded-md text-center cursor-pointer transition-all duration-200 ease-in-out hover:bg-white/15 hover:-translate-y-[1px] ${
                  item.selected
                    ? 'bg-white/25 shadow-sm relative after:content-[""] after:absolute after:bottom-[-3px] after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[2px] after:bg-white after:rounded-sm'
                    : ""
                }`}
              >
                <div className="font-medium text-xs">{item.date}</div>
                <div className="font-semibold mt-[2px] text-[12px]">
                  {item.price}
                </div>
              </div>
            ))}
          </div>

          {/* Nút lịch: 20% */}
          <div className="flex w-[20%] items-center justify-center gap-[4px] px-3 py-[6px] bg-white/15 rounded-md font-medium cursor-pointer transition-all duration-200 ease-in-out hover:bg-white/25 hover:-translate-y-[1px] text-xs">
            <CalendarMonthIcon fontSize="inherit" className="text-sm" />
            <span>Lịch</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderContent;
