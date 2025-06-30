import React from "react";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import LuggageIcon from "@mui/icons-material/Luggage";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const Flight_Essentials = ({ onClickSelectLuggage, selectedLuggage }) => {
  return (
    <div
      className="rounded-lg p-4 space-y-4"
      style={{
        background: "linear-gradient(180deg, #c5f0fa 0%, #d8f9f4 100%)",
      }}
    >
      {/* Tiêu đề */}
      <h2 className="text-lg font-bold text-gray-800">
        Nhu yếu phẩm chuyến bay
      </h2>

      {/* Box hành lý */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm space-y-4">
        {/* Header hành lý */}
        <div className="flex items-start gap-3">
          <img
            src="https://ik.imagekit.io/tvlk/image/imageResource/2024/01/22/1705920759471-3a25db9318404ffe13b436203b434c5c.png?tr=q-75"
            alt="Luggage Icon"
            className="w-8 h-8"
          />
          <div>
            <p className="font-bold text-gray-800">Hành lý</p>
            <p className="text-sm text-gray-600">
              Sao bạn phải cố nhồi nhét? Thêm hành lý để chuyến đi thêm nhẹ
              nhàng.
            </p>
          </div>
        </div>

        {/* Thông tin hành lý */}
        <div className="pl-2 space-y-2">
          <p className="text-sm text-[#d88700] font-medium">
            Một hoặc nhiều chuyến đi chưa có hành lý
          </p>
          <div className="border border-gray-300 rounded-lg p-3 w-full max-w-xs space-y-2">
            <div className="flex items-center gap-1 font-semibold text-gray-800">
              <span>SGN</span>
              <TrendingFlatIcon className="text-gray-600" />
              <span>HAN</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <LuggageIcon className="text-gray-600" />
              <span className="ml-2">
                {selectedLuggage ? selectedLuggage.label : "0kg/khách"}
              </span>
            </div>
          </div>
        </div>

        {/* Chọn hành lý */}
        <div
          className={`flex items-center justify-between pt-2 border-t border-gray-200 transition-all duration-300 rounded-md ${
            selectedLuggage ? "bg-green-100 mt-2" : ""
          }`}
        >
          <p className="flex items-center gap-2 text-sm text-gray-700">
            Từ <span className="text-[#f97316] font-semibold">266.000 VND</span>
          </p>
          <button
            onClick={onClickSelectLuggage}
            className="flex items-center gap-1 text-blue-600 px-2 py-2 rounded-[10px] font-medium hover:no-underline cursor-pointer transition duration-300 ease-in-out hover:bg-gray-100"
          >
            <span className="flex pl-2">
              {selectedLuggage ? "Xem / Chọn lại" : "Chọn"}
            </span>
            <KeyboardArrowRightIcon className="text-blue-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flight_Essentials;
