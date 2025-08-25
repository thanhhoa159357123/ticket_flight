import React, { useState, lazy, Suspense } from "react";
import { parseUTCDate } from "../../../../utils/dateUtils";

const DetailContent = lazy(() => import("./DetailContent"));

const ItemContent = ({ flight, onFlightSelect, passengers }) => {
  const [showDetail, setShowDetail] = useState(false);

  if (!flight) return null;

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price || 0) + "₫";

  const getDuration = () => {
    const dep = parseUTCDate(flight.thoi_gian_di);
    const arr = parseUTCDate(flight.thoi_gian_den);
    if (!dep || !arr) return "N/A";
    const diff = arr.diff(dep, "minute");
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow hover:shadow-lg transition-all duration-200">
      {/* --- Thông tin chính --- */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          {/* Hãng bay */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {flight.ten_hang_bay || "Unknown Airline"}
              </h3>
              <p className="text-sm text-gray-500">{flight.ten_hang_ve}</p>
            </div>
          </div>

          {/* Giá vé */}
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              {formatPrice(flight.gia_ve || flight.gia)}
            </p>
            <p className="text-xs text-gray-500">/ khách</p>
          </div>
        </div>

        {/* --- Hành trình bay --- */}
        <div className="flex items-center justify-between">
          {/* Điểm đi */}
          <FlightTime
            time={parseUTCDate(flight.thoi_gian_di)?.format("HH:mm")}
            code={flight.ma_san_bay_di}
            date={parseUTCDate(flight.thoi_gian_di)?.format("DD/MM")}
          />

          {/* Khoảng cách */}
          <div className="flex-1 mx-8">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2">{getDuration()}</p>
              <div className="w-full flex items-center relative">
                <div className="h-px bg-gray-300 flex-1" />
                <div className="mx-3 bg-white px-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div className="h-px bg-gray-300 flex-1" />
              </div>
              <p className="text-xs text-gray-400 mt-2">Bay thẳng</p>
            </div>
          </div>

          {/* Điểm đến */}
          <FlightTime
            time={parseUTCDate(flight.thoi_gian_den)?.format("HH:mm")}
            code={flight.ma_san_bay_den}
            date={parseUTCDate(flight.thoi_gian_den)?.format("DD/MM")}
          />
        </div>
      </div>

      {/* --- Nút hành động --- */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex items-center justify-between">
        <button
          onClick={() => setShowDetail((prev) => !prev)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 cursor-pointer"
        >
          {showDetail ? "Ẩn chi tiết" : "Xem chi tiết"}
        </button>
        <button
          onClick={() => onFlightSelect(flight)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
        >
          Chọn chuyến bay
        </button>
      </div>

      {/* --- Chi tiết vé --- */}
      {showDetail && (
        <Suspense fallback={<p className="p-4 text-gray-400">Đang tải...</p>}>
          <DetailContent
            flight={flight}
            durationFormatted={getDuration()}
            passengers={passengers}
          />
        </Suspense>
      )}
    </div>
  );
};

const FlightTime = ({ time, code, date }) => (
  <div className="text-center">
    <p className="text-2xl font-bold text-gray-900">{time}</p>
    <p className="text-sm font-medium text-gray-600 mt-1">{code}</p>
    <p className="text-xs text-gray-400">{date}</p>
  </div>
);

export default React.memo(ItemContent);
