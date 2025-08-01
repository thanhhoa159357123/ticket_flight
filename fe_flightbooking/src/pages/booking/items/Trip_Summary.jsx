import React, { useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import "dayjs/locale/vi";
import DetailContent from "./../../../pages/ticket/ticket_content/item_content/DetailContent";

dayjs.extend(duration);
dayjs.locale("vi");

const Trip_Summary = ({ 
  flight, 
  returnFlight, 
  isRoundTrip, 
  selectedPackage, 
  returnPackage, 
  passengers 
}) => {
  const [showDetail, setShowDetail] = useState(false);
  const [animate, setAnimate] = useState(false);
  
  const totalPassengers = Array.isArray(passengers)
    ? passengers.length
    : (passengers?.Adult || 0) +
      (passengers?.Children || 0) +
      (passengers?.Infant || 0);

  // Tính tổng giá cho cả 2 chuyến (nếu là khứ hồi)
  const outboundPrice = selectedPackage?.gia || flight?.gia || 0;
  const returnPrice = isRoundTrip ? (returnPackage?.gia || returnFlight?.gia || 0) : 0;
  const totalPrice = (outboundPrice + returnPrice) * totalPassengers;

  const formatDate = (datetime) => {
    const day = dayjs(datetime).day();
    const dayMap = ["CN", "2", "3", "4", "5", "6", "7"];
    const prefix = `Th ${dayMap[day]}`;
    const rest = dayjs(datetime).format("DD [thg] M YYYY");
    return `${prefix}, ${rest}`;
  };

  const formatTime = (datetime) => dayjs(datetime).format("HH:mm");

  const calculateDuration = (start, end) => {
    const diffMinutes = dayjs(end).diff(dayjs(start), "minute");
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleShowDetail = () => {
    setShowDetail(true);
    setTimeout(() => setAnimate(true), 10);
  };

  const handleCloseDetail = () => {
    setAnimate(false);
    setTimeout(() => setShowDetail(false), 300);
  };

  // Component để hiển thị thông tin 1 chuyến bay
  const FlightCard = ({ flightData, title, icon, bgColor = "bg-gray-50" }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-4">
      {/* Card Header */}
      <div className={`flex justify-between items-center p-4 border-b border-gray-100 ${bgColor}`}>
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="font-semibold text-gray-800">{title}</h4>
        </div>
      </div>

      {/* Flight Details */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          {/* Departure */}
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {formatTime(flightData.gio_di)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatDate(flightData.gio_di)}
            </div>
            <div className="text-sm font-semibold text-gray-800 mt-2">
              {flightData.ma_san_bay_di}
            </div>
          </div>

          {/* Duration */}
          <div className="flex flex-col items-center px-2">
            <div className="relative">
              <div className="w-24 h-px bg-gray-300"></div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="text-xs font-medium text-gray-600 mt-1">
              {calculateDuration(flightData.gio_di, flightData.gio_den)}
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mt-1">
              Bay thẳng
            </span>
          </div>

          {/* Arrival */}
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {formatTime(flightData.gio_den)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatDate(flightData.gio_den)}
            </div>
            <div className="text-sm font-semibold text-gray-800 mt-2">
              {flightData.ma_san_bay_den}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-sm space-y-5">
      {/* Header với nút chi tiết */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          {isRoundTrip ? "Tóm tắt chuyến bay khứ hồi" : "Tóm tắt chuyến bay"}
        </h2>
        <button
          onClick={handleShowDetail}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer"
        >
          Chi tiết
        </button>
      </div>

      {/* Chuyến đi */}
      <FlightCard 
        flightData={flight} 
        title="Chuyến đi"
        bgColor="bg-blue-50"
        icon={
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        }
      />

      {/* Chuyến về (chỉ hiển thị khi là vé khứ hồi) */}
      {isRoundTrip && returnFlight && (
        <FlightCard 
          flightData={returnFlight} 
          title="Chuyến về"
          bgColor="bg-orange-50"
          icon={
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          }
        />
      )}

      {/* Price Summary Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-800">Tóm tắt giá</h3>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Số hành khách</span>
            <span className="text-sm font-medium text-gray-800">
              {totalPassengers} người
            </span>
          </div>

          {/* Chi tiết giá cho từng chuyến */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Chuyến đi</span>
              <span className="font-medium">
                {(outboundPrice * totalPassengers).toLocaleString()} VND
              </span>
            </div>
            {isRoundTrip && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Chuyến về</span>
                <span className="font-medium">
                  {(returnPrice * totalPassengers).toLocaleString()} VND
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-600">Tổng tiền</span>
            <span className="text-lg font-bold text-orange-600">
              {totalPrice.toLocaleString()} VND
            </span>
          </div>
        </div>
      </div>

      {/* Modal chi tiết */}
      {showDetail && (
        <>
          <div
            className={`fixed inset-0 bg-black/30 z-20 transition-opacity duration-300 ${
              animate ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleCloseDetail}
          />

          <div
            className={`fixed z-30 left-1/2 top-1/2 transform -translate-x-1/2 ${
              animate
                ? "-translate-y-1/2 opacity-100"
                : "translate-y-full opacity-0"
            } transition-all duration-300 ease-out
              bg-white rounded-2xl shadow-xl w-full max-w-[800px] overflow-hidden`}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">
                Chi tiết chuyến bay {isRoundTrip ? "khứ hồi" : ""}
              </h3>
              <button
                onClick={handleCloseDetail}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6">
              <DetailContent
                flight={flight}
                returnFlight={returnFlight}
                isRoundTrip={isRoundTrip}
                passengers={passengers}
                onClose={handleCloseDetail}
              />
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={handleCloseDetail}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Trip_Summary;
