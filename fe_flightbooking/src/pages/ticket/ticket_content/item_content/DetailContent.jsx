import React from "react";
import LuggageIcon from "@mui/icons-material/Luggage";
import WorkIcon from "@mui/icons-material/Work";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import AirlineSeatLegroomReducedIcon from "@mui/icons-material/AirlineSeatLegroomReduced";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// ✅ Enable timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const DetailContent = ({ flight, durationFormatted }) => {
  if (!flight) return null;

  console.log("Dữ liệu máy bay: ", flight);

  // ✅ Format time and date functions with Vietnam timezone
  const formatTime = (dateTime) => {
    if (!dateTime) return "N/A";
    return dayjs(dateTime).subtract(7, "hour").format("HH:mm");
  };

  const formatDate = (dateTime) => {
    if (!dateTime) return "N/A";
    return dayjs(dateTime).subtract(7, "hour").format("DD [thg] M");
  };

  return (
    <div className="flex bg-white rounded-lg shadow-sm p-4 text-gray-800">
      {/* Timeline section */}
      <div className="flex flex-col items-center justify-between pr-4 min-w-[100px]">
        <div className="flex flex-col items-center mb-2">
          <strong className="text-xl font-bold text-blue-800">
            {formatTime(flight.thoi_gian_di)}
          </strong>
          <span className="text-sm text-gray-500 mt-1">
            {formatDate(flight.thoi_gian_di)}
          </span>
        </div>

        <div className="flex flex-col items-center mx-2 relative before:absolute before:content-[''] before:w-px before:h-12 before:bg-gray-200 before:top-[-3rem] after:absolute after:content-[''] after:w-px after:h-12 after:bg-gray-200 after:bottom-[-3rem]">
          <span className="text-xs font-semibold text-gray-500">
            {durationFormatted || "N/A"}
          </span>
          <div className="text-xs bg-blue-50 text-blue-600 px-1 py-0.5 rounded-full mt-1 font-medium">
            {flight.ma_chuyen_bay || "Bay thẳng"}
          </div>
        </div>

        <div className="flex flex-col items-center mb-2">
          <strong className="text-xl font-bold text-blue-800">
            {formatTime(flight.thoi_gian_den)}
          </strong>
          <span className="text-sm text-gray-500 mt-1">
            {formatDate(flight.thoi_gian_den)}
          </span>
        </div>
      </div>

      {/* Vertical divider */}
      <div className="w-px bg-gray-200 my-2"></div>

      {/* Content section */}
      <div className="flex-1 flex flex-col gap-3 pl-4">
        {/* Departure info */}
        <div>
          <strong className="text-base font-semibold text-gray-800">
            {flight.ten_thanh_pho_di || "Thành phố đi"} -{" "}
            {flight.ma_san_bay_di || "N/A"}
          </strong>
          <span className="block text-xs font-semibold text-gray-500 mt-1">
            {flight.ten_san_bay_di || "Sân bay đi"} - Nhà ga 1
          </span>
        </div>

        {/* Flight details card */}
        <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-base font-bold text-blue-900">
              {flight.ten_hang_bay || "Vietnam Airlines"}
            </span>
          </div>

          <div className="grid gap-2 grid-cols-2">
            <div className="flex items-center gap-2 p-2 bg-white rounded-md shadow-xs">
              <LuggageIcon className="text-gray-600 !text-base" />
              <div>
                <div className="text-xs font-semibold text-gray-500">
                  Hành lý ký gửi
                </div>
                <div className="text-sm font-semibold">
                  {flight.so_kg_hanh_ly_ky_gui || 0} kg
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-white rounded-md shadow-xs">
              <WorkIcon className="text-gray-600 !text-base" />
              <div>
                <div className="text-xs font-semibold text-gray-500">
                  Hành lý xách tay
                </div>
                <div className="text-sm font-semibold">
                  {flight.so_kg_hanh_ly_xach_tay || 0} kg
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-white rounded-md shadow-xs">
              <AirlineSeatReclineNormalIcon className="text-gray-600 !text-base" />
              <div>
                <div className="text-xs font-semibold text-gray-500">
                  Sơ đồ ghế
                </div>
                <div className="text-sm font-semibold">
                  {flight.so_do_ghe || "3-3"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-white rounded-md shadow-xs">
              <AirlineSeatLegroomReducedIcon className="text-gray-600 !text-base" />
              <div>
                <div className="text-xs font-semibold text-gray-500">
                  Khoảng cách ghế
                </div>
                <div className="text-sm font-semibold">
                  {flight.khoang_cach_ghe || "28 inch"}
                </div>
              </div>
            </div>
          </div>

          {/* Additional flight info */}
          <div className="mt-3 pt-2 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Hạng vé:</span>
                <span className="ml-1 font-medium">
                  {flight.ten_hang_ve || "Economy"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Quốc gia:</span>
                <span className="ml-1 font-medium">
                  {flight.quoc_gia || "Vietnam"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Có thể hoàn:</span>
                <span className="ml-1 font-medium">
                  {flight.refundable ? "Có" : "Không"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Có thể đổi lịch bay:</span>
                <span className="ml-1 font-medium">
                  {flight.changeable ? "Có" : "Không"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Arrival info */}
        <div>
          <strong className="text-base font-semibold text-gray-800">
            {flight.ten_thanh_pho_den || "Thành phố đến"} -{" "}
            {flight.ma_san_bay_den || "N/A"}
          </strong>
          <span className="block text-xs font-semibold text-gray-500 mt-1">
            {flight.ten_san_bay_den || "Sân bay đến"} - Nhà ga 1
          </span>
        </div>
      </div>
    </div>
  );
};

export default DetailContent;
