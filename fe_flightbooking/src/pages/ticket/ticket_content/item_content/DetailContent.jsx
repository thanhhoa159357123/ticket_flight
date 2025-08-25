import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import LuggageIcon from "@mui/icons-material/Luggage";
import WorkIcon from "@mui/icons-material/Work";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import AirlineSeatLegroomReducedIcon from "@mui/icons-material/AirlineSeatLegroomReduced";

dayjs.extend(utc);
dayjs.extend(timezone);

const DetailContent = ({ flight, durationFormatted }) => {
  if (!flight) return null;

  const formatTime = (date) =>
    dayjs.utc(date).tz("Asia/Ho_Chi_Minh").format("HH:mm");
  const formatDate = (date) =>
    dayjs.utc(date).tz("Asia/Ho_Chi_Minh").format("DD [thg] M");

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 text-gray-800">
      {/* Thời gian bay */}
      <div className="flex items-center justify-between mb-6">
        <FlightTimeline
          start={formatTime(flight.thoi_gian_di)}
          startDate={formatDate(flight.thoi_gian_di)}
          duration={durationFormatted}
          end={formatTime(flight.thoi_gian_den)}
          endDate={formatDate(flight.thoi_gian_den)}
          flightCode={flight.ma_chuyen_bay}
        />
      </div>

      {/* Thông tin chuyến bay */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="font-bold text-blue-900 text-lg mb-3">
          {flight.ten_hang_bay}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <InfoCard
            icon={<LuggageIcon />}
            title="Hành lý ký gửi"
            value={`${flight.so_kg_hanh_ly_ky_gui || 0} kg`}
          />
          <InfoCard
            icon={<WorkIcon />}
            title="Hành lý xách tay"
            value={`${flight.so_kg_hanh_ly_xach_tay || 0} kg`}
          />
          <InfoCard
            icon={<AirlineSeatReclineNormalIcon />}
            title="Sơ đồ ghế"
            value={flight.so_do_ghe || "3-3"}
          />
          <InfoCard
            icon={<AirlineSeatLegroomReducedIcon />}
            title="Khoảng cách ghế"
            value={flight.khoang_cach_ghe || "28 inch"}
          />
        </div>

        <div className="mt-4 text-xs grid grid-cols-2 gap-y-2">
          <p>
            <span className="text-gray-500">Hạng vé:</span>{" "}
            <span className="font-medium">{flight.ten_hang_ve}</span>
          </p>
          <p>
            <span className="text-gray-500">Quốc gia:</span>{" "}
            <span className="font-medium">{flight.quoc_gia}</span>
          </p>
          <p>
            <span className="text-gray-500">Hoàn vé:</span>{" "}
            <span className="font-medium">
              {flight.refundable ? "Có" : "Không"}
            </span>
          </p>
          {/* <p>
            <span className="text-gray-500">Đổi lịch bay:</span>{" "}
            <span className="font-medium">
              {flight.changeable ? "Có" : "Không"}
            </span>
          </p> */}
        </div>
      </div>
    </div>
  );
};

const FlightTimeline = ({
  start,
  startDate,
  duration,
  end,
  endDate,
  flightCode,
}) => (
  <div className="flex flex-col items-center flex-1">
    <div className="flex items-center justify-between w-full">
      <TimePoint time={start} date={startDate} />
      <div className="flex flex-col items-center mx-6">
        <span className="text-xs text-gray-500">{duration}</span>
        <div className="w-32 h-px bg-gray-300 my-1 relative">
          <div className="absolute left-1/2 top-[-4px] w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2"></div>
        </div>
        <span className="text-xs text-blue-600 font-medium">
          {flightCode || "Bay thẳng"}
        </span>
      </div>
      <TimePoint time={end} date={endDate} />
    </div>
  </div>
);

const TimePoint = ({ time, date }) => (
  <div className="flex flex-col items-center">
    <span className="text-lg font-bold text-blue-800">{time}</span>
    <span className="text-sm text-gray-500">{date}</span>
  </div>
);

const InfoCard = ({ icon, title, value }) => (
  <div className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm border border-gray-100">
    <div className="text-gray-600">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  </div>
);

export default React.memo(DetailContent);
