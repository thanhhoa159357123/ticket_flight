import React, { useState } from "react";
import FlightSummaryCard from "./FlightSummaryCard";

const RoundTripBookingPanel = ({ 
  outboundFlights = [], 
  returnFlights = [], 
  passengers = { Adult: 1 },
  from = {},
  to = {},
  departureDate = "",
  returnDate = "",
  onContinue,
  onClose 
}) => {
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-[1000]"
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-screen bg-white z-[1001] flex flex-col shadow-2xl w-full max-w-[1200px] lg:w-[80%]">
        {/* Header */}
        <div className="flex items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <button
            onClick={onClose}
            className="mr-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
          <div>
            <h2 className="text-2xl font-bold">Chọn chuyến bay khứ hồi</h2>
            <p className="text-blue-100 opacity-90">
              {from?.ten_san_bay} ⇄ {to?.ten_san_bay}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <FlightSummaryCard
            title={`Chuyến đi - ${departureDate}`}
            flight={selectedOutbound}
            highlightColor="blue"
          />
          <FlightSummaryCard
            title={`Chuyến về - ${returnDate}`}
            flight={selectedReturn}
            highlightColor="orange"
          />
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4 flex justify-between items-center z-50">
          <div>
            {selectedOutbound && selectedReturn ? (
              <>
                <p className="text-gray-600 text-sm">
                  Tổng cộng ({passengers.Adult} khách):
                </p>
                <p className="text-xl font-bold text-red-600">
                  {formatPrice(
                    (selectedOutbound.gia + selectedReturn.gia) * passengers.Adult
                  )}
                </p>
              </>
            ) : (
              <p className="text-gray-500 text-sm">
                Hãy chọn chuyến đi và chuyến về
              </p>
            )}
          </div>
          <button
            onClick={() =>
              onContinue?.({ outbound: selectedOutbound, return: selectedReturn })
            }
            disabled={!selectedOutbound || !selectedReturn}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              selectedOutbound && selectedReturn
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md hover:shadow-lg hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </>
  );
};

export default RoundTripBookingPanel;
