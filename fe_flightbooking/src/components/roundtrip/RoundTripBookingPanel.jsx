import React, { useState } from "react";
import { useSearchContext } from "../../contexts/SearchContext";

const RoundTripBookingPanel = ({ 
  outboundFlights = [], 
  returnFlights = [], 
  onContinue,
  onClose 
}) => {
  const { passengers, from, to, departureDate, returnDate } = useSearchContext();
  
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showPanel, setShowPanel] = useState(false);

  const handleFlightSelect = (flight, type) => {
    if (type === 'outbound') {
      setSelectedOutbound(flight);
    } else {
      setSelectedReturn(flight);
    }
  };

  const handleContinue = () => {
    if (selectedOutbound && selectedReturn) {
      setShowPanel(true);
      if (onContinue) {
        onContinue({
          outbound: selectedOutbound,
          return: selectedReturn
        });
      }
    }
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-[1000] transition-opacity duration-300 ${
          showPanel ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-screen bg-white z-[1001] flex flex-col shadow-2xl transition-transform duration-300 ease-out w-full max-w-[1200px] lg:w-[80%] ${
          showPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <button
            onClick={onClose}
            className="mr-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div>
            <h2 className="text-2xl font-bold">Chọn chuyến bay khứ hồi</h2>
            <p className="text-blue-100 opacity-90">
              {from?.ten_san_bay} ⇄ {to?.ten_san_bay}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            
            {/* Outbound Flights */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Chuyến đi - {departureDate}
              </h3>
              
              <div className="space-y-3">
                {outboundFlights.length > 0 ? (
                  outboundFlights.map((flight, idx) => (
                    <div
                      key={`out-${idx}`}
                      onClick={() => handleFlightSelect(flight, 'outbound')}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedOutbound?.id === flight.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <img 
                            src={flight.logo_hang_bay} 
                            alt={flight.ten_hang_bay}
                            className="w-8 h-8 object-contain"
                          />
                          <div>
                            <div className="font-medium">{flight.ten_hang_bay}</div>
                            <div className="text-sm text-gray-500">{flight.so_hieu}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="font-semibold">{formatTime(flight.gio_di)}</div>
                            <div className="text-sm text-gray-500">{flight.san_bay_di}</div>
                          </div>
                          
                          <div className="flex-1 text-center">
                            <div className="text-sm text-gray-500">{flight.thoi_gian_bay}</div>
                            <div className="border-t border-gray-300 my-1"></div>
                            <div className="text-xs text-gray-400">Bay thẳng</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-semibold">{formatTime(flight.gio_den)}</div>
                            <div className="text-sm text-gray-500">{flight.san_bay_den}</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {formatPrice(flight.gia)}
                          </div>
                          <div className="text-sm text-gray-500">/khách</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Không có chuyến bay nào cho ngày này
                  </div>
                )}
              </div>
            </div>

            {/* Return Flights */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                Chuyến về - {returnDate}
              </h3>
              
              <div className="space-y-3">
                {returnFlights.length > 0 ? (
                  returnFlights.map((flight, idx) => (
                    <div
                      key={`ret-${idx}`}
                      onClick={() => handleFlightSelect(flight, 'return')}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedReturn?.id === flight.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <img 
                            src={flight.logo_hang_bay} 
                            alt={flight.ten_hang_bay}
                            className="w-8 h-8 object-contain"
                          />
                          <div>
                            <div className="font-medium">{flight.ten_hang_bay}</div>
                            <div className="text-sm text-gray-500">{flight.so_hieu}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="font-semibold">{formatTime(flight.gio_di)}</div>
                            <div className="text-sm text-gray-500">{flight.san_bay_di}</div>
                          </div>
                          
                          <div className="flex-1 text-center">
                            <div className="text-sm text-gray-500">{flight.thoi_gian_bay}</div>
                            <div className="border-t border-gray-300 my-1"></div>
                            <div className="text-xs text-gray-400">Bay thẳng</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-semibold">{formatTime(flight.gio_den)}</div>
                            <div className="text-sm text-gray-500">{flight.san_bay_den}</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {formatPrice(flight.gia)}
                          </div>
                          <div className="text-sm text-gray-500">/khách</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Không có chuyến bay nào cho ngày này
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-6">
          <div className="flex justify-between items-center">
            <div>
              {selectedOutbound && selectedReturn && (
                <div className="text-sm text-gray-600">
                  <div>Tổng cộng: <span className="font-bold text-lg text-blue-600">
                    {formatPrice((selectedOutbound.gia + selectedReturn.gia) * passengers.Adult)}
                  </span></div>
                  <div>Cho {passengers.Adult} hành khách</div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleContinue}
              disabled={!selectedOutbound || !selectedReturn}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                selectedOutbound && selectedReturn
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoundTripBookingPanel;