import React from "react";
import PassengerSummary from "./PassengerSummary";

const SummarySidebar = ({
  passengers,
  selectedOutboundPackage,
  selectedReturnPackage,
  getTotalPassengers,
  formatPrice,
  onConfirm,
  canProceed,
}) => {
  return (
    <div className="hidden lg:flex flex-col w-[300px] border-l p-4 bg-gray-50 sticky top-0">
      {/* Hành khách */}
      <PassengerSummary
        passengers={passengers}
        getTotalPassengers={getTotalPassengers}
      />

      {/* Tổng tiền */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md border border-blue-200">
        <div className="flex justify-between mb-2">
          <span className="font-medium text-gray-700 text-sm">Tổng tiền vé:</span>
          <span className="text-xl font-bold text-red-600">
            {formatPrice(
              ((selectedOutboundPackage?.gia_ve || 0) +
                (selectedReturnPackage?.gia_ve || 0)) *
                getTotalPassengers()
            )}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          Đã bao gồm thuế & phí • {getTotalPassengers()} hành khách
        </p>
      </div>

      {/* Nút xác nhận */}
      <button
        onClick={onConfirm}
        disabled={!canProceed}
        className={`mt-6 w-full py-3 rounded-lg font-bold text-base transition-all duration-200 ${
          canProceed
            ? "bg-gradient-to-r from-orange-500 to-red-500 hover:scale-105 text-white shadow-lg hover:shadow-xl"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {!selectedOutboundPackage
          ? "Chọn gói vé chuyến đi"
          : !selectedReturnPackage
          ? "Chọn gói vé chuyến về"
          : "Tiếp tục đặt vé"}
      </button>
    </div>
  );
};

export default SummarySidebar;
