// TicketInfoHeader.jsx
import React from "react";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';

const TicketInfoHeader = ({
  flight,
  gioDiVN,
  gioDenVN,
  durationFormatted,
  onShowDetail,
}) => {
  return (
    <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Flight route header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <span className="inline-flex items-center bg-green-600 text-white px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide">
            <FlightTakeoffIcon className="mr-1.5" fontSize="small" />
            Khởi hành
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {flight?.ten_san_bay_di || ""} → {flight?.ten_san_bay_den || ""}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {gioDiVN?.format("dddd, DD/MM/YYYY") || "Ngày khởi hành"}
            </p>
          </div>
        </div>

        {/* Flight details */}
        <div className="p-4">
          {/* Airline */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <span className="font-semibold text-gray-800">
                {flight?.ten_hang_bay || "Hãng bay"}
              </span>
            </div>
          </div>

          {/* Flight timeline */}
          <div className="relative mb-4">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-300 z-0"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              {/* Departure */}
              <div className="flex flex-col items-center bg-white px-2">
                <div className="text-lg font-bold text-gray-900">
                  {gioDiVN ? gioDiVN.format("HH:mm") : "--:--"}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {flight?.ma_san_bay_di || "---"}
                </div>
              </div>

              {/* Duration */}
              <div className="flex flex-col items-center bg-white px-3">
                <div className="text-sm font-medium text-gray-600">
                  {durationFormatted}
                </div>
                <div className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full mt-1">
                  {flight?.ten_chuyen_di === "Bay thẳng" ? (
                    "Bay thẳng"
                  ) : (
                    <span className="flex items-center">
                      <FlightLandIcon fontSize="small" className="mr-1" />
                      Quá cảnh
                    </span>
                  )}
                </div>
              </div>

              {/* Arrival */}
              <div className="flex flex-col items-center bg-white px-2">
                <div className="text-lg font-bold text-gray-900">
                  {gioDenVN ? gioDenVN.format("HH:mm") : "--:--"}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {flight?.ma_san_bay_den || "---"}
                </div>
              </div>
            </div>
          </div>

          {/* Details button */}
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShowDetail();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Xem chi tiết chuyến bay
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketInfoHeader;