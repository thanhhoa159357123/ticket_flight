import React from "react";

const FlightSummaryCard = ({ 
  title, 
  flight, 
  onSelect, 
  highlightColor = "blue" 
}) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div
      onClick={onSelect}
      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
        flight
          ? `border-${highlightColor}-300 bg-${highlightColor}-50 hover:shadow-lg`
          : "border-gray-200 bg-gray-50 hover:border-gray-300"
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`p-2 bg-${highlightColor}-100 rounded-lg`}
        >
          <svg
            className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600"
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
        <h4 className="font-bold text-gray-800 text-sm lg:text-base">{title}</h4>
      </div>

      {flight ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {flight.logo_hang_bay && (
              <img
                src={flight.logo_hang_bay}
                alt={flight.ten_hang_bay}
                className="w-5 h-5 lg:w-6 lg:h-6 object-contain"
              />
            )}
            <span className="font-medium text-gray-800 text-sm lg:text-base">
              {flight.ten_hang_bay}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {flight.ma_san_bay_di} → {flight.ma_san_bay_den}
          </p>
          <p className="text-xs lg:text-sm text-gray-500">
            {new Date(flight.thoi_gian_di).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {new Date(flight.thoi_gian_den).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-base lg:text-lg font-bold text-green-600">
            {formatPrice(flight.gia_ve)}
          </p>
        </div>
      ) : (
        <div className="text-center py-4 lg:py-6">
          <p className="text-gray-500 text-xs lg:text-sm">
            Chưa chọn chuyến bay
          </p>
        </div>
      )}
    </div>
  );
};

export default FlightSummaryCard;
