import React, { useState, lazy, Suspense } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import DetailContent from "./DetailContent";

const TicketDetail = lazy(() =>
  import("../../../../components/ticketbook/TicketDetail")
);

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

const ItemContent = ({
  flight,
  onFlightSelect,
  passengers = { Adult: 1, Child: 0, Infant: 0 },
}) => {
  const [showTicketDetail, setShowTicketDetail] = useState(false);

  // ✅ Calculate flight duration với timezone conversion
  const getFlightDuration = () => {
    if (flight.thoi_gian_di && flight.thoi_gian_den) {
      const departure = dayjs(flight.thoi_gian_di).subtract(7, "hour");
      const arrival = dayjs(flight.thoi_gian_den).subtract(7, "hour");
      const diffInMinutes = arrival.diff(departure, "minute");
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
    return "N/A";
  };

  // ✅ Handle flight selection
  const handleFlightSelect = () => {
    if (onFlightSelect) {
      onFlightSelect(flight);
    }
  };

  if (!flight) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      {/* ✅ Main flight info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          {/* Airline info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
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
              <h3 className="font-semibold text-gray-900">
                {flight.ten_hang_bay || "Unknown Airline"}
              </h3>
              <p className="text-sm text-gray-500">
                {flight.ten_hang_ve || "Economy"}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              {(flight.gia_ve || flight.gia || 0).toLocaleString("vi-VN")}₫
            </p>
            <p className="text-sm text-gray-500">/ khách</p>
          </div>
        </div>

        {/* ✅ Flight route với timezone conversion */}
        <div className="flex items-center justify-between">
          {/* Departure */}
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {flight.thoi_gian_di
                ? dayjs(flight.thoi_gian_di).subtract(7, "hour").format("HH:mm")
                : "N/A"}
            </p>
            <p className="text-sm font-medium text-gray-600 mt-1">
              {flight.ma_san_bay_di}
            </p>
            <p className="text-xs text-gray-500">
              {flight.thoi_gian_di
                ? dayjs(flight.thoi_gian_di).subtract(7, "hour").format("DD/MM")
                : ""}
            </p>
          </div>

          {/* Flight duration and route */}
          <div className="flex-1 mx-8">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2">
                {getFlightDuration()}
              </p>

              <div className="w-full relative flex items-center">
                <div className="h-px bg-gray-300 flex-1"></div>
                <div className="mx-3 bg-white px-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>

              <p className="text-xs text-gray-500 mt-2">Bay thẳng</p>
            </div>
          </div>

          {/* Arrival */}
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {flight.thoi_gian_den
                ? dayjs(flight.thoi_gian_den).subtract(7, "hour").format("HH:mm")
                : "N/A"}
            </p>
            <p className="text-sm font-medium text-gray-600 mt-1">
              {flight.ma_san_bay_den}
            </p>
            <p className="text-xs text-gray-500">
              {flight.thoi_gian_den
                ? dayjs(flight.thoi_gian_den).subtract(7, "hour").format("DD/MM")
                : ""}
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Actions */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex items-center justify-between">
        <button
          onClick={() => setShowTicketDetail(!showTicketDetail)}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {showTicketDetail ? "Ẩn chi tiết" : "Xem chi tiết"}
        </button>

        <button
          onClick={handleFlightSelect}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
        >
          Chọn chuyến bay
        </button>
      </div>

      {/* ✅ Expandable ticket detail */}
      {showTicketDetail && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <DetailContent
            flight={flight}
            durationFormatted={getFlightDuration()}
            passengers={passengers}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(ItemContent);
