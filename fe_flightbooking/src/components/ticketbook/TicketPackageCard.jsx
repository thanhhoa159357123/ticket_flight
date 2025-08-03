import React from "react";
import LuggageIcon from "@mui/icons-material/Luggage";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import BlockIcon from "@mui/icons-material/Block";

const TicketPackageCard = ({ pkg, onShowMoreDetail, onChoose }) => {
  return (
    <div className="scroll-snap-start w-full max-w-[320px] min-w-[280px] border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-300 ease-in-out flex flex-col">
      {/* Header */}
      <div className="mb-4 pb-3 flex items-center justify-between border-b border-dashed border-gray-200">
        <h3 className="m-0 text-blue-700 font-bold text-lg tracking-tight line-clamp-1">
          {pkg.goi_ve}
        </h3>
        <span className="flex flex-col items-end font-bold text-orange-500 text-lg whitespace-nowrap">
          {Number(pkg.gia).toLocaleString()} VND
        </span>
      </div>
      
      {/* Features list */}
      <ul className="flex-1 mb-5 space-y-2.5">
        <li className="flex items-start">
          <LuggageIcon className="text-blue-600 text-[1.1rem] mr-2.5 mt-0.5 flex-shrink-0" />
          <span className="text-gray-700 text-sm leading-snug">
            Hành lý xách tay <span className="font-medium">{pkg.so_kg_hanh_ly_xach_tay || 0} kg</span>
          </span>
        </li>

        <li className="flex items-start">
          <LuggageIcon className="text-blue-600 text-[1.1rem] mr-2.5 mt-0.5 flex-shrink-0" />
          <span className="text-gray-700 text-sm leading-snug">
            Hành lý ký gửi <span className="font-medium">{pkg.so_kg_hanh_ly_ky_gui || 0} kg</span>
          </span>
        </li>

        <li className="flex items-start">
          <SwapHorizIcon className="text-blue-600 text-[1.1rem] mr-2.5 mt-0.5 flex-shrink-0" />
          <span className="text-gray-700 text-sm leading-snug">
            {pkg.changeable ? (
              <span className="text-green-600 font-medium">Đổi lịch miễn phí</span>
            ) : (
              "Phí đổi lịch 378.000 VND"
            )}
          </span>
        </li>
        
        <li className="flex items-start">
          <BlockIcon className="text-blue-600 text-[1.1rem] mr-2.5 mt-0.5 flex-shrink-0" />
          <span className="text-gray-700 text-sm leading-snug">
            {pkg.refundable ? (
              <span className="text-green-600 font-medium">Được hoàn vé</span>
            ) : (
              <span className="text-red-500 font-medium">Không hoàn vé</span>
            )}
          </span>
        </li>
      </ul>

      {/* Buttons */}
      <div className="mt-auto space-y-2.5">
        <button
          className="w-full bg-blue-50 text-blue-700 border border-blue-100 rounded-lg py-2.5 px-4 font-medium text-sm hover:bg-blue-100 transition-colors duration-200 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onShowMoreDetail && onShowMoreDetail(pkg);
          }}
        >
          Chi tiết gói vé
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChoose(pkg);
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg py-3 px-4 font-semibold text-sm hover:from-blue-700 hover:to-blue-600 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          Chọn gói này
        </button>
      </div>
    </div>
  );
};

export default TicketPackageCard;