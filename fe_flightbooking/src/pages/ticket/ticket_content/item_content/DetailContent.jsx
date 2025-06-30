import React from "react";
import LuggageIcon from "@mui/icons-material/Luggage";
import WorkIcon from "@mui/icons-material/Work";
import AirlinesIcon from "@mui/icons-material/Airlines";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import AirlineSeatLegroomReducedIcon from "@mui/icons-material/AirlineSeatLegroomReduced";

const DetailContent = () => {
  return (
    <div className="flex bg-white rounded-lg shadow-sm p-4 text-gray-800">
      {/* Timeline section */}
      <div className="flex flex-col items-center justify-between pr-4 min-w-[100px]">
        <div className="flex flex-col items-center mb-2">
          <strong className="text-xl font-bold text-blue-800">20:05</strong>
          <span className="text-sm text-gray-500 mt-1">28 thg 5</span>
        </div>

        <div
          className="flex flex-col items-center mx-2 relative 
  before:absolute before:content-[''] before:w-px before:h-12 before:bg-gray-200 before:top-[-3rem]
  after:absolute after:content-[''] after:w-px after:h-12 after:bg-gray-200 after:bottom-[-3rem]"
        >
          <span className="text-xs text-gray-500">2h 5m</span>
          <div className="text-xs bg-blue-50 text-blue-600 px-1 py-0.5 rounded-full mt-1 font-medium">
            Bay thẳng
          </div>
        </div>

        <div className="flex flex-col items-center mb-2">
          <strong className="text-xl font-bold text-blue-800">22:10</strong>
          <span className="text-sm text-gray-500 mt-1">28 thg 5</span>
        </div>
      </div>

      {/* Vertical divider */}
      <div className="w-px bg-gray-200 my-2"></div>

      {/* Content section */}
      <div className="flex-1 flex flex-col gap-3 pl-4">
        {/* Departure info */}
        <div>
          <strong className="text-base font-semibold text-gray-800">
            TP HCM (SGN)
          </strong>
          <span className="block text-xs text-gray-500 mt-1">
            Sân bay Tân Sơn Nhất - Nhà ga 1
          </span>
        </div>

        {/* Flight details card */}
        <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-base font-bold text-blue-900">
              VietJet Air
            </span>
            <span className="text-xs font-medium text-white bg-green-500 px-2 py-0.5 rounded-full">
              VJ-1176 - Khuyến mãi
            </span>
          </div>

          <div className="grid gap-2 grid-cols-2">
            {/* Luggage info */}
            <div className="flex items-center gap-2 p-2 bg-white rounded-md shadow-xs">
              <LuggageIcon className="text-gray-600 !text-base" />
              <div>
                <div className="text-xs text-gray-500">Hành lý ký gửi</div>
                <div className="text-sm font-semibold">0 kg</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-white rounded-md shadow-xs">
              <WorkIcon className="text-gray-600 !text-base" />
              <div>
                <div className="text-xs text-gray-500">Hành lý xách tay</div>
                <div className="text-sm font-semibold">7 kg</div>
              </div>
            </div>

            {/* Plane info */}
            <div className="flex items-center gap-2 p-2 bg-white rounded-md shadow-xs">
              <AirlinesIcon className="text-gray-600 !text-base" />
              <div>
                <div className="text-xs text-gray-500">Loại máy bay</div>
                <div className="text-sm font-semibold">Airbus A321</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-white rounded-md shadow-xs">
              <AirlineSeatReclineNormalIcon className="text-gray-600 !text-base" />
              <div>
                <div className="text-xs text-gray-500">Sơ đồ ghế</div>
                <div className="text-sm font-semibold">3-3</div>
              </div>
            </div>

            {/* Seat info */}
            <div className="flex items-center gap-2 p-2 bg-white rounded-md shadow-xs">
              <AirlineSeatLegroomReducedIcon className="text-gray-600 !text-base" />
              <div>
                <div className="text-xs text-gray-500">Khoảng cách ghế</div>
                <div className="text-sm font-semibold">
                  28" (dưới tiêu chuẩn)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Arrival info */}
        <div>
          <strong className="text-base font-semibold text-gray-800">
            Hà Nội (HAN)
          </strong>
          <span className="block text-xs text-gray-500 mt-1">
            Sân bay Nội Bài - Nhà ga 1
          </span>
        </div>
      </div>
    </div>
  );
};

export default DetailContent;
