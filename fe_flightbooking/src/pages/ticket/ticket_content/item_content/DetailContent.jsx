import React from "react";
import LuggageIcon from "@mui/icons-material/Luggage";
import WorkIcon from "@mui/icons-material/Work";
import AirlinesIcon from "@mui/icons-material/Airlines";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import AirlineSeatLegroomReducedIcon from "@mui/icons-material/AirlineSeatLegroomReduced";
import dayjs from "dayjs";

const DetailContent = ({ flight, durationFormatted }) => {
  if (!flight) return null;

  const {
    gio_di,
    gio_den,
    ma_san_bay_di,
    ma_san_bay_den,
    ten_chuyen_di,
    ten_hang_bay,
    so_kg_hanh_ly_ky_gui,
    so_kg_hanh_ly_xach_tay,
    so_do_ghe,
    khoang_cach_ghe,
  } = flight;
  const getTenHangBay = (maHangBay) => {
    switch (maHangBay) {
      case "VNA":
        return "Vietnam Airlines";
      case "VJA":
        return "Vietjet Air";
      case "BBA":
        return "Bamboo Airways";
      default:
        return "Hãng bay khác";
    }
  };

  const gioDiVN = dayjs(gio_di).subtract(7, "hour");
  const gioDenVN = dayjs(gio_den).subtract(7, "hour");

  const formatTime = (d) => d.format("HH:mm");
  const formatDate = (d) => d.format("DD [thg] M");

  return (
    <div className="flex bg-white rounded-lg shadow-sm p-4 text-gray-800">
      {/* Timeline section */}
      <div className="flex flex-col items-center justify-between pr-4 min-w-[100px]">
        <div className="flex flex-col items-center mb-2">
          <strong className="text-xl font-bold text-blue-800">
            {formatTime(gioDiVN)}
          </strong>
          <span className="text-sm text-gray-500 mt-1">
            {formatDate(gioDiVN)}
          </span>
        </div>

        <div className="flex flex-col items-center mx-2 relative before:absolute before:content-[''] before:w-px before:h-12 before:bg-gray-200 before:top-[-3rem] after:absolute after:content-[''] after:w-px after:h-12 after:bg-gray-200 after:bottom-[-3rem]">
          <span className="text-xs text-gray-500">{durationFormatted}</span>
          <div className="text-xs bg-blue-50 text-blue-600 px-1 py-0.5 rounded-full mt-1 font-medium">
            {ten_chuyen_di || "Bay thẳng"}
          </div>
        </div>

        <div className="flex flex-col items-center mb-2">
          <strong className="text-xl font-bold text-blue-800">
            {formatTime(gioDenVN)}
          </strong>
          <span className="text-sm text-gray-500 mt-1">
            {formatDate(gioDenVN)}
          </span>
        </div>
      </div>

      {/* Vertical divider */}
      <div className="w-px bg-gray-200 my-2"></div>

      {/* Content section */}
      <div className="flex-1 flex flex-col gap-3 pl-4">
        <div>
          <strong className="text-base font-semibold text-gray-800">
            {ma_san_bay_di || "SGN"}
          </strong>
          <span className="block text-xs text-gray-500 mt-1">
            {flight.ten_san_bay_di || "Sân bay đi"} - Nhà ga 1
          </span>
        </div>

        {/* Flight details card */}
        <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-base font-bold text-blue-900">
              {ten_hang_bay || getTenHangBay(flight.ma_hang_bay)}
            </span>
          </div>

          <div className="grid gap-2 grid-cols-2">
            <div className="flex items-center gap-2 p-2 bg-white rounded-md shadow-xs">
              <LuggageIcon className="text-gray-600 !text-base" />
              <div>
                <div className="text-xs text-gray-500">Hành lý ký gửi</div>
                <div className="text-sm font-semibold">
                  {so_kg_hanh_ly_ky_gui ?? 0} kg
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-white rounded-md shadow-xs">
              <WorkIcon className="text-gray-600 !text-base" />
              <div>
                <div className="text-xs text-gray-500">Hành lý xách tay</div>
                <div className="text-sm font-semibold">
                  {so_kg_hanh_ly_xach_tay ?? 0} kg
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-white rounded-md shadow-xs">
              <AirlineSeatReclineNormalIcon className="text-gray-600 !text-base" />
              <div>
                <div className="text-xs text-gray-500">Sơ đồ ghế</div>
                <div className="text-sm font-semibold">{so_do_ghe || "-"}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-white rounded-md shadow-xs">
              <AirlineSeatLegroomReducedIcon className="text-gray-600 !text-base" />
              <div>
                <div className="text-xs text-gray-500">Khoảng cách ghế</div>
                <div className="text-sm font-semibold">
                  {khoang_cach_ghe || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <strong className="text-base font-semibold text-gray-800">
            {ma_san_bay_den || "HAN"}
          </strong>
          <span className="block text-xs text-gray-500 mt-1">
            {flight.ten_san_bay_den || "Sân bay đến"} - Nhà ga 1
          </span>
        </div>
      </div>
    </div>
  );
};

export default DetailContent;
