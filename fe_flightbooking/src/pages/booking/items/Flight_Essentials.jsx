import React from "react";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import LuggageIcon from "@mui/icons-material/Luggage";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const Flight_Essentials = ({ onClickSelectLuggage, selectedLuggage }) => {
  return (
    <div
      className="rounded-xl p-5 space-y-5 shadow-sm border border-gray-100"
      style={{
        background: "linear-gradient(180deg, #f0f9ff 0%, #e6f4fe 100%)",
      }}
    >
      {/* Tiêu đề */}
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        Nhu yếu phẩm chuyến bay
      </h2>

      {/* Box hành lý */}
      <div className="bg-white rounded-xl p-4 shadow-md space-y-4 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        {/* Header hành lý */}
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <LuggageIcon className="text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-lg">Hành lý</p>
            <p className="text-sm text-gray-500">
              Sao bạn phải cố nhồi nhét? Thêm hành lý để chuyến đi thêm nhẹ nhàng.
            </p>
          </div>
        </div>

        {/* Thông tin hành lý */}
        <div className="pl-2 space-y-3">
          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Một hoặc nhiều chuyến đi chưa có hành lý
          </div>
          <div className="border border-gray-200 rounded-lg p-3 w-full space-y-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <div className="flex items-center gap-1 font-semibold text-gray-800">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">SGN</span>
              <TrendingFlatIcon className="text-gray-500 mx-1" />
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">HAN</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-2">
              <LuggageIcon className="text-gray-500 mr-2" />
              <span className={selectedLuggage ? "font-medium text-gray-800" : "text-gray-600"}>
                {selectedLuggage ? selectedLuggage.label : "0kg/khách"}
              </span>
            </div>
          </div>
        </div>

        {/* Chọn hành lý */}
        <div
          className={`flex items-center justify-between pt-3 border-t border-gray-100 transition-all duration-300 ease-in-out rounded-md ${
            selectedLuggage ? "bg-green-50 mt-2" : ""
          }`}
        >
          <p className="flex items-center gap-2 text-sm text-gray-700">
            Từ <span className="text-orange-500 font-bold">266.000 VND</span>
          </p>
          <button
            onClick={onClickSelectLuggage}
            className="flex items-center gap-1 text-blue-600 px-3 py-2 rounded-lg font-medium hover:no-underline cursor-pointer transition duration-300 ease-in-out hover:bg-blue-50 group"
          >
            <span className="font-medium">
              {selectedLuggage ? "Xem / Chọn lại" : "Thêm hành lý"}
            </span>
            <KeyboardArrowRightIcon className="text-blue-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flight_Essentials;