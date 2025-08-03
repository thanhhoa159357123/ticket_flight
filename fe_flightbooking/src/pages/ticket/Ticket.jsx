import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideBar_Filter from "./sidebarfilter/SideBar_Filter";
import Ticket_Content from "./ticket_content/Ticket_Content";
import RoundTripSelector from "../../components/roundtrip/RoundTripSelector";
import RoundTripConfirmPanel from "../../components/roundtrip/RoundTripConfirmPanel";
import { Tickets } from "../../hooks/TicketHook";
import { useSearchContext } from "../../contexts/SearchContext";

const Ticket = () => {
  const { flightResults, loading } = Tickets();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    passengers, 
    from, 
    to, 
    departureDate, 
    returnDate, 
    selectedWay, 
    selected 
  } = useSearchContext();

  // ✅ Round trip states
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showConfirmPanel, setShowConfirmPanel] = useState(false);
  const [currentStep, setCurrentStep] = useState('outbound'); // 'outbound' | 'return' | 'confirm'
  
  // ✅ Filter states
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedTicketTypes, setSelectedTicketTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 0]);

  // ✅ Detect search type
  const searchType = location.state?.searchType || (selectedWay === "Khứ hồi" ? "roundtrip" : "oneway");
  const outboundFlights = location.state?.outboundFlights || location.state?.results || flightResults;
  const returnFlights = location.state?.returnFlights || [];
  const searchInfo = location.state?.searchInfo || { from, to, departureDate, returnDate, selectedWay, selected };

  const fallbackPassengers = location.state?.passengers || {
    Adult: 1,
    Children: 0,
    Infant: 0,
  };

  const hasSearchData = from && to && departureDate;

  useEffect(() => {
    if (!hasSearchData && !location.state?.outboundFlights && !location.state?.results) {
      navigate("/");
    }
  }, [hasSearchData, location.state, navigate]);

  const currentPassengers = (passengers && 
    (passengers.Adult || passengers.Children || passengers.Infant))
    ? passengers
    : fallbackPassengers;

  // ✅ Get current flights based on step
  const getCurrentFlights = () => {
    if (currentStep === 'outbound') {
      return outboundFlights || [];
    } else if (currentStep === 'return') {
      return returnFlights || [];
    }
    return [];
  };

  // ✅ Filter flights
  const filteredFlights = getCurrentFlights().filter((flight) => {
    const airlineMatch = selectedAirlines.length === 0 || selectedAirlines.includes(flight.ten_hang_bay);
    const classMatch = selectedTicketTypes.length === 0 || selectedTicketTypes.includes(flight.ma_hang_ve);
    const priceMatch = flight.gia >= priceRange[0] && flight.gia <= priceRange[1];
    return airlineMatch && classMatch && priceMatch;
  });

  // ✅ Handle flight selection for round trip
  const handleFlightSelect = (flight) => {
    if (currentStep === 'outbound') {
      setSelectedOutbound(flight);
      // Auto proceed to return flight selection
      if (searchType === "roundtrip" || selectedWay === "Khứ hồi") {
        setTimeout(() => setCurrentStep('return'), 500);
      }
    } else if (currentStep === 'return') {
      setSelectedReturn(flight);
      // Auto proceed to confirmation
      setTimeout(() => setCurrentStep('confirm'), 500);
    }
  };

  // ✅ Handle step navigation
  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  // ✅ Handle continue button
  const handleContinue = () => {
    if (selectedOutbound && selectedReturn) {
      setShowConfirmPanel(true);
    }
  };

  // ✅ Get current step info
  const getStepInfo = () => {
    switch (currentStep) {
      case 'outbound':
        return {
          title: 'Chọn chuyến đi',
          subtitle: `${searchInfo.from} → ${searchInfo.to}`,
          icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8',
          color: 'blue'
        };
      case 'return':
        return {
          title: 'Chọn chuyến về',
          subtitle: `${searchInfo.to} → ${searchInfo.from}`,
          icon: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6',
          color: 'orange'
        };
      case 'confirm':
        return {
          title: 'Xác nhận đặt vé',
          subtitle: 'Kiểm tra thông tin trước khi đặt vé',
          icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
          color: 'green'
        };
      default:
        return getStepInfo();
    }
  };

  if (!hasSearchData && !location.state?.outboundFlights && !location.state?.results) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  const stepInfo = getStepInfo();
  const isRoundTrip = searchType === "roundtrip" || selectedWay === "Khứ hồi";

  return (
    <>
      <div className="pt-[30px] flex items-start justify-center gap-[10px] w-full max-w-[1500px] mx-auto min-h-[calc(100vh-100px)]">
        <SideBar_Filter
          flights={getCurrentFlights()}
          selectedAirlines={selectedAirlines}
          setSelectedAirlines={setSelectedAirlines}
          onSeatClassChange={setSelectedTicketTypes}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
        <div className="w-[1px] h-full bg-black/10 rounded-md" />
        
        <div className="flex-1 max-w-[800px]">
          {loading ? (
            <p className="text-center text-gray-500 mt-10">Đang tải dữ liệu...</p>
          ) : (
            <>
              {isRoundTrip ? (
                <div className="space-y-6">
                  {/* ✅ Round Trip Progress */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    {/* Progress Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full bg-${stepInfo.color}-100`}>
                          <svg className={`w-6 h-6 text-${stepInfo.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stepInfo.icon} />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{stepInfo.title}</h2>
                          <p className="text-sm text-gray-600">{stepInfo.subtitle}</p>
                        </div>
                      </div>
                      
                      {currentStep === 'confirm' && (
                        <button
                          onClick={handleContinue}
                          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
                        >
                          Tiếp tục đặt vé
                        </button>
                      )}
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div 
                        className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all ${
                          currentStep === 'outbound' 
                            ? 'bg-blue-500 text-white shadow-lg' 
                            : selectedOutbound 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-500'
                        }`}
                        onClick={() => handleStepChange('outbound')}
                      >
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                          {selectedOutbound ? '✓' : '1'}
                        </div>
                        <span className="font-medium">Chuyến đi</span>
                      </div>

                      <div className="w-8 h-0.5 bg-gray-300"></div>

                      <div 
                        className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all ${
                          currentStep === 'return' 
                            ? 'bg-orange-500 text-white shadow-lg' 
                            : selectedReturn 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : !selectedOutbound 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        onClick={() => selectedOutbound && handleStepChange('return')}
                      >
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                          {selectedReturn ? '✓' : '2'}
                        </div>
                        <span className="font-medium">Chuyến về</span>
                      </div>

                      <div className="w-8 h-0.5 bg-gray-300"></div>

                      <div 
                        className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all ${
                          currentStep === 'confirm' 
                            ? 'bg-green-500 text-white shadow-lg' 
                            : selectedOutbound && selectedReturn 
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={() => selectedOutbound && selectedReturn && handleStepChange('confirm')}
                      >
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                          {selectedOutbound && selectedReturn ? '✓' : '3'}
                        </div>
                        <span className="font-medium">Xác nhận</span>
                      </div>
                    </div>

                    {/* Selected Flights Summary */}
                    {(selectedOutbound || selectedReturn) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        {selectedOutbound && (
                          <div className="bg-white rounded-lg p-3 border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                              <span className="font-medium text-gray-800">Chuyến đi đã chọn</span>
                            </div>
                            <p className="text-sm text-gray-600">{selectedOutbound.ten_hang_bay}</p>
                            <p className="text-sm text-gray-600">{selectedOutbound.ma_san_bay_di} → {selectedOutbound.ma_san_bay_den}</p>
                            <p className="text-lg font-bold text-blue-600">
                              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(selectedOutbound.gia)}
                            </p>
                          </div>
                        )}
                        
                        {selectedReturn && (
                          <div className="bg-white rounded-lg p-3 border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                              </svg>
                              <span className="font-medium text-gray-800">Chuyến về đã chọn</span>
                            </div>
                            <p className="text-sm text-gray-600">{selectedReturn.ten_hang_bay}</p>
                            <p className="text-sm text-gray-600">{selectedReturn.ma_san_bay_di} → {selectedReturn.ma_san_bay_den}</p>
                            <p className="text-lg font-bold text-orange-600">
                              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(selectedReturn.gia)}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ✅ Flight Content */}
                  {currentStep !== 'confirm' && (
                    <Ticket_Content 
                      flights={filteredFlights} 
                      passengers={currentPassengers}
                      searchInfo={currentStep === 'return' ? 
                        {...searchInfo, from: searchInfo.to, to: searchInfo.from} : 
                        searchInfo
                      }
                      onFlightSelect={handleFlightSelect}
                      selectedFlight={currentStep === 'outbound' ? selectedOutbound : selectedReturn}
                      flightType={currentStep}
                      isRoundTripMode={true}
                    />
                  )}

                  {/* ✅ Confirmation Step */}
                  {currentStep === 'confirm' && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Sẵn sàng đặt vé!</h3>
                        <p className="text-gray-600 mb-6">
                          Bạn đã chọn xong cả chuyến đi và chuyến về. Click "Tiếp tục đặt vé" để chọn gói dịch vụ.
                        </p>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-4 mb-6">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">Tổng tiền ước tính</p>
                            <p className="text-3xl font-bold text-red-600">
                              {new Intl.NumberFormat("vi-VN", { 
                                style: "currency", 
                                currency: "VND" 
                              }).format((selectedOutbound?.gia || 0) + (selectedReturn?.gia || 0))}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Cho 1 hành khách • Chưa bao gồm phí dịch vụ
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // ✅ One-way flights
                <Ticket_Content 
                  flights={filteredFlights} 
                  passengers={currentPassengers}
                  searchInfo={searchInfo}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* ✅ Round Trip Confirm Panel */}
      <RoundTripConfirmPanel 
        show={showConfirmPanel}
        onClose={() => setShowConfirmPanel(false)}
        selectedOutbound={selectedOutbound}
        selectedReturn={selectedReturn}
        passengers={currentPassengers}
      />
    </>
  );
};

export default Ticket;
