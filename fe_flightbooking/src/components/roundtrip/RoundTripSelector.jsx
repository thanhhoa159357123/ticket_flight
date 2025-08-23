import React from "react";
import FlightSummaryCard from "./FlightSummaryCard";

const RoundTripSelector = ({ 
  selectedOutbound, 
  selectedReturn, 
  passengers, 
  onContinue 
}) => {
  const getTotalPassengers = () =>
    (passengers?.Adult || 0) + (passengers?.Children || 0) + (passengers?.Infant || 0);

  const totalPassengers = getTotalPassengers();
  const totalPrice =
    (selectedOutbound?.gia_ve || 0) + (selectedReturn?.gia_ve || 0);

  return (
    <div className="bg-white rounded-xl p-4 lg:p-6 shadow-lg border border-gray-200 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 lg:mb-6">
        <div className="p-2 lg:p-3 bg-blue-100 rounded-full">
          <svg
            className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg lg:text-xl font-bold text-gray-900">
            Chuyến bay khứ hồi
          </h3>
          <p className="text-sm text-gray-500">Chọn vé cho cả 2 chiều</p>
        </div>
      </div>

      {/* Flight Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FlightSummaryCard
          title="Chuyến đi"
          flight={selectedOutbound}
          highlightColor="blue"
        />
        <FlightSummaryCard
          title="Chuyến về"
          flight={selectedReturn}
          highlightColor="orange"
        />
      </div>

      {/* Total Price */}
      {selectedOutbound && selectedReturn && (
        <div className="mt-4 lg:mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900 text-sm lg:text-base">
              Tổng cộng ({totalPassengers} khách):
            </span>
            <span className="text-xl lg:text-2xl font-bold text-red-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0,
              }).format(totalPrice * totalPassengers)}
            </span>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="mt-4">
        <button
          onClick={onContinue}
          disabled={!selectedOutbound || !selectedReturn}
          className={`w-full py-3 rounded-lg font-bold text-base transition-all duration-200 ${
            selectedOutbound && selectedReturn
              ? "bg-gradient-to-r from-orange-500 to-red-500 hover:scale-[1.02] hover:shadow-xl text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default RoundTripSelector;
