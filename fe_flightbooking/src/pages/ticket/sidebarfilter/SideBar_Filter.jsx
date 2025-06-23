import React from "react";
import NumberOfStops from "./items/NumberOfStops";
import AirlineFilter from "./items/AirlineFilter";
import Time_Line from "./items/Time_Line";
import Utilities from "./items/Utilities";
import Price_Ticket from "./items/Price_Ticket";

const SideBar_Filter = () => {
  return (
    <div className="w-[400px] min-w-[280px] p-5">
      <div className="flex justify-between items-center pb-4 text-[16px] font-semibold text-[#333]">
        <div>Bộ lọc :</div>
        <div
          className="relative font-bold text-[#007bff] cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
        hover:text-[#0056b3] after:content-[''] after:absolute after:bottom-[-2px] after:left-0
        after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 after:ease-[cubic-bezier(0.4,0,0.2,1)]
        hover:after:w-full"
        >
          Đặt lại
        </div>
      </div>

      <NumberOfStops />
      <AirlineFilter />
      <Time_Line />
      <Utilities />
      <Price_Ticket />
    </div>
  );
};

export default SideBar_Filter;
