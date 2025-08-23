import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

const TicketInfoHeader = ({
  flight,
  gioDiVN,
  gioDenVN,
  durationFormatted,
  onShowDetail,
}) => {
  return (
    <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 bg-blue-50 flex items-center gap-3">
          <span className="inline-flex items-center bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide">
            <FlightTakeoffIcon fontSize="small" className="mr-1" />
            Khởi hành
          </span>
          <h3 className="text-lg font-bold text-gray-900 truncate">
            Sân bay {flight?.ten_san_bay_di || ""} → Sân bay {flight?.ten_san_bay_den || ""}
          </h3>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Flight timeline */}
          <div className="relative mb-4">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-200 z-0"></div>
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
                <div className="text-sm font-medium text-gray-700">
                  {durationFormatted}
                </div>
                <div className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full mt-1">
                  {flight?.ten_chuyen_di === "Bay thẳng" ? "Bay thẳng" : "Quá cảnh"}
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
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
            >
              Xem chi tiết chuyến bay →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketInfoHeader;
