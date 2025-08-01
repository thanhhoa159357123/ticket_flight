import React, { useState, useMemo, useCallback } from "react";
import DetailContent from "./DetailContent";
import TicketOptionsPanel from "../../../../components/ticketbook/TicketOptionalsPanel";
import TicketDetail from "../../../../components/ticketbook/TicketDetail";
import TicketMoreDetail from "../../../../components/ticketbook/TicketMoreDetail";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { ClockIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { useSearchContext } from "../../../../contexts/SearchContext";

dayjs.extend(duration);

const TABS = [{ id: "detail", label: "Chi tiết", icon: InformationCircleIcon }];

const ItemContent = ({
  flight,
  packages = [],
  variantCount = 1,
  allVariants = [],
  onFlightSelect = null,
  selectedFlight = null,
  flightType = null,
  isRoundTripMode = false,
}) => {
  const { passengers } = useSearchContext();
  const [activeTab, setActiveTab] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [showMoreDetail, setShowMoreDetail] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const { gioDi, gioDen, durationFormatted, priceRange } = useMemo(() => {
    const departure = dayjs(flight.gio_di).subtract(7, "hour");
    const arrival = dayjs(flight.gio_den).subtract(7, "hour");
    const diff = arrival.diff(departure, "minute");
    const duration = `${Math.floor(diff / 60)}h ${diff % 60}m`;

    const prices = allVariants.map((v) => v.gia || 0).filter((p) => p > 0);
    const minPrice = Math.min(...prices, flight.gia || 0);
    const maxPrice = Math.max(...prices, flight.gia || 0);

    return {
      gioDi: departure,
      gioDen: arrival,
      durationFormatted: duration,
      priceRange: { min: minPrice, max: maxPrice },
    };
  }, [flight.gio_di, flight.gio_den, flight.gia, allVariants]);

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  }, []);

  const handleItemClick = useCallback(() => {
    if (isRoundTripMode && onFlightSelect) {
      // ✅ Round trip mode: select flight on card click
      onFlightSelect(flight);
    } else {
      // ✅ Normal mode: toggle detail tab
      setActiveTab(activeTab === "detail" ? null : "detail");
    }
  }, [activeTab, isRoundTripMode, onFlightSelect, flight]);

  const handleShowOptions = useCallback(
    (e) => {
      e.stopPropagation();

      if (isRoundTripMode && onFlightSelect) {
        // ✅ Round trip mode: select flight directly
        onFlightSelect(flight);
      } else {
        // ✅ Normal mode: show options panel
        setShowOptions(true);
      }
    },
    [isRoundTripMode, onFlightSelect, flight]
  );

  // ✅ Check if this flight is selected in round trip mode
  const isSelected = selectedFlight?.ma_gia_ve === flight.ma_gia_ve;

  const handleShowMoreDetail = useCallback((pkg) => {
    setSelectedTicket(pkg);
    setShowMoreDetail(true);
  }, []);

  const handleTabClick = useCallback(
    (e, tabId) => {
      e.stopPropagation();
      if (!isRoundTripMode) {
        setActiveTab(activeTab === tabId ? null : tabId);
      }
    },
    [activeTab, isRoundTripMode]
  );

  return (
    <>
      {/* ✅ Responsive Flight Card */}
      <div
        className={`bg-white rounded-lg lg:rounded-xl shadow-sm overflow-hidden border transition-all duration-200 mb-3 lg:mb-4 ${
          isRoundTripMode ? 'cursor-pointer' : 'cursor-pointer'
        } ${
          isSelected
            ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200"
            : "border-gray-200 hover:border-blue-500 hover:shadow-md"
        }`}
        onClick={handleItemClick}
      >
        {/* ✅ Airline Header - Responsive */}
        <div className={`flex items-center justify-between px-3 lg:px-4 py-2 lg:py-3 border-b border-gray-200 ${
          isSelected 
            ? 'bg-gradient-to-r from-blue-100 to-blue-200' 
            : 'bg-gradient-to-r from-blue-50 to-blue-100'
        }`}>
          <div className="flex items-center space-x-2 lg:space-x-3">
            {/* ✅ Airline Logo */}
            {flight.logo_hang_bay && (
              <img 
                src={flight.logo_hang_bay} 
                alt={flight.ten_hang_bay}
                className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            
            <div>
              <h3 className="font-semibold text-sm lg:text-base text-gray-800 truncate">
                {flight.ten_hang_bay}
              </h3>
              {flight.so_hieu && (
                <p className="text-xs text-gray-500">{flight.so_hieu}</p>
              )}
            </div>
            
            {/* ✅ Variant Count Badge - Responsive */}
            {variantCount > 1 && (
              <span className="text-xs bg-blue-500 text-white px-2 py-0.5 lg:py-1 rounded-full whitespace-nowrap">
                {variantCount} tùy chọn
              </span>
            )}
            
            {/* ✅ Selected Badge for Round Trip */}
            {isSelected && isRoundTripMode && (
              <span className="text-xs bg-green-500 text-white px-2 py-0.5 lg:py-1 rounded-full whitespace-nowrap flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Đã chọn
              </span>
            )}
          </div>
          
          <span className="text-xs lg:text-sm font-medium bg-white px-2 py-1 rounded-full border border-gray-200 whitespace-nowrap">
            {flight.vi_tri_ngoi}
          </span>
        </div>

        {/* ✅ Flight Info - Mobile Stack, Desktop Grid */}
        <div className="p-3 lg:p-4">
          {/* Desktop: 3 columns */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 items-center">
            {/* Departure */}
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 mb-1">
                Khởi hành
              </p>
              <p className="text-xl font-bold text-gray-800">
                {gioDi.format("HH:mm")}
              </p>
              <p className="text-sm font-medium text-gray-600 mt-1">
                {flight.ma_san_bay_di}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {gioDi.format("DD/MM/YYYY")}
              </p>
            </div>

            {/* Duration */}
            <div className="flex flex-col items-center">
              <div className="w-full flex items-center">
                <div className="border-t border-gray-300 flex-grow"></div>
                <div className="px-2 flex flex-col items-center">
                  <ClockIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-500 mt-1">
                    {durationFormatted}
                  </span>
                </div>
                <div className="border-t border-gray-300 flex-grow"></div>
              </div>
              <span className="text-sm font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full mt-1">
                Bay thẳng
              </span>
            </div>

            {/* Arrival */}
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 mb-1">Đến nơi</p>
              <p className="text-xl font-bold text-gray-800">
                {gioDen.format("HH:mm")}
              </p>
              <p className="text-sm font-medium text-gray-600 mt-1">
                {flight.ma_san_bay_den}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {gioDen.format("DD/MM/YYYY")}
              </p>
            </div>
          </div>

          {/* ✅ Mobile: Stacked Layout */}
          <div className="md:hidden space-y-3">
            {/* Times Row */}
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Khởi hành</p>
                <p className="text-lg font-bold text-gray-800">
                  {gioDi.format("HH:mm")}
                </p>
                <p className="text-xs text-gray-600">{flight.ma_san_bay_di}</p>
                <p className="text-xs text-gray-400">{gioDi.format("DD/MM")}</p>
              </div>

              <div className="flex-1 flex flex-col items-center mx-4">
                <ClockIcon className="h-4 w-4 text-gray-500 mb-1" />
                <span className="text-xs text-gray-500">
                  {durationFormatted}
                </span>
                <div className="w-full border-t border-gray-300 my-1"></div>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  Bay thẳng
                </span>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Đến nơi</p>
                <p className="text-lg font-bold text-gray-800">
                  {gioDen.format("HH:mm")}
                </p>
                <p className="text-xs text-gray-600">{flight.ma_san_bay_den}</p>
                <p className="text-xs text-gray-400">{gioDen.format("DD/MM")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Price and Action - Responsive */}
        <div className="border-t border-gray-200 px-3 lg:px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="flex flex-col w-full sm:w-auto">
            {priceRange.min !== priceRange.max ? (
              <>
                <div className="flex items-baseline flex-wrap">
                  <span className="text-base lg:text-lg font-bold text-red-600">
                    {formatPrice(priceRange.min)}
                  </span>
                  <span className="text-sm text-gray-500 mx-1">-</span>
                  <span className="text-base lg:text-lg font-bold text-red-600">
                    {formatPrice(priceRange.max)}
                  </span>
                  <span className="text-xs lg:text-sm font-medium text-gray-500 ml-1">
                    / khách
                  </span>
                </div>
                <span className="text-xs text-blue-600 font-medium mt-1">
                  {variantCount} tùy chọn vé
                </span>
              </>
            ) : (
              <>
                <div className="flex items-baseline flex-wrap">
                  <span className="text-base lg:text-lg font-bold text-red-600">
                    {formatPrice(flight.gia)}
                  </span>
                  <span className="text-xs lg:text-sm font-medium text-gray-500 ml-1">
                    / khách
                  </span>
                </div>
                {variantCount > 1 && (
                  <span className="text-xs text-blue-600 font-medium mt-1">
                    {variantCount} tùy chọn vé
                  </span>
                )}
              </>
            )}
          </div>

          <button
            className={`w-full sm:w-auto px-4 py-2 lg:py-2.5 rounded-lg font-medium transition-colors cursor-pointer text-sm lg:text-base ${
              isSelected && isRoundTripMode
                ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            onClick={handleShowOptions}
          >
            {isSelected && isRoundTripMode ? (
              <span className="flex items-center gap-2 justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Đã chọn
              </span>
            ) : isRoundTripMode ? (
              "Chọn chuyến bay"
            ) : (
              "Chọn vé"
            )}
          </button>
        </div>

        {/* ✅ Tabs - Only show in normal mode */}
        {!isRoundTripMode && (
          <>
            <div className="border-t border-gray-200 px-2 lg:px-3 py-2">
              <div className="flex overflow-x-auto hide-scrollbar">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    className={`relative flex items-center px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-blue-600 cursor-pointer"
                    }`}
                    onClick={(e) => handleTabClick(e, tab.id)}
                  >
                    <tab.icon className="h-3 lg:h-4 w-3 lg:w-4 mr-1 lg:mr-2" />
                    {tab.label}
                    <span
                      className={`absolute bottom-0 left-1/2 h-[2px] bg-blue-600 rounded-t-md transition-transform duration-300 ease-in-out ${
                        activeTab === tab.id
                          ? "w-[80%] -translate-x-1/2 scale-x-100 origin-center"
                          : "w-[80%] -translate-x-1/2 scale-x-0 origin-center"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-out transform ${
                activeTab === "detail"
                  ? "max-h-[1000px] opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
              }`}
              style={{ willChange: "transform, opacity, max-height" }}
            >
              <div className="p-3 lg:p-4">
                <DetailContent
                  flight={flight}
                  durationFormatted={durationFormatted}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ✅ Modals - Only show in normal mode */}
      {!isRoundTripMode && (
        <>
          <TicketOptionsPanel
            show={showOptions}
            packages={packages}
            allVariants={allVariants}
            onClose={() => setShowOptions(false)}
            onShowDetail={() => setShowTicketDetail(true)}
            onShowMoreDetail={handleShowMoreDetail}
            flight={flight}
            passengers={passengers}
            durationFormatted={durationFormatted}
          />

          <TicketDetail
            show={showTicketDetail}
            onClose={() => setShowTicketDetail(false)}
            flight={flight}
            durationFormatted={durationFormatted}
          />

          <TicketMoreDetail
            show={showMoreDetail}
            passengers={passengers}
            flight={flight}
            onClose={() => setShowMoreDetail(false)}
            ticketPkg={selectedTicket}
          />
        </>
      )}

      {/* Custom CSS */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default React.memo(ItemContent);
