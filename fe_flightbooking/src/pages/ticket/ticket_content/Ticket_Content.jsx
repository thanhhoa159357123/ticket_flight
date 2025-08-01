import React, { useState, useEffect, useMemo, useCallback } from "react";
import HeaderContent from "./HeaderContent";
import ItemContent from "./item_content/ItemContent";
import TicketOptionsPanel from "../../../components/ticketbook/TicketOptionalsPanel";
import BookingModal from "./BookingModal";
import FilterContent from "./FilterContent";
import { fetchMultipleTicketPackages } from "../../../services/TicketOptionalsPanelService";
import {
  getDisplayFlights,
  groupFlightsByBase,
} from "../../../utils/flightUtils";

const Ticket_Content = ({
  flights,
  passengers,
  searchInfo,
  onFlightSelect = null,
  selectedFlight = null,
  flightType = null,
  isRoundTripMode = false,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [ticketPackagesMap, setTicketPackagesMap] = useState({});

  // ✅ Memoize display flights để tránh re-compute
  const { displayFlights, flightGroups } = useMemo(() => {
    if (!Array.isArray(flights) || flights.length === 0) {
      return { displayFlights: [], flightGroups: {} };
    }

    const groups = groupFlightsByBase(flights);
    const display = getDisplayFlights(flights);

    return { displayFlights: display, flightGroups: groups };
  }, [flights]);

  const uniqueMaGiaVes = useMemo(() => {
    if (!Array.isArray(flights)) return [];
    return [...new Set(flights.map((f) => f.ma_gia_ve).filter(Boolean))];
  }, [flights]);

  const handleSearchDone = useCallback(() => {
    setShowBookingModal(false);
  }, []);

  useEffect(() => {
    const loadAllPackages = async () => {
      if (uniqueMaGiaVes.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadingProgress(0);

      const totalFlights = uniqueMaGiaVes.length;
      let loadedCount = 0;

      const updateProgress = () => {
        loadedCount++;
        const targetProgress = Math.min(
          95,
          Math.round((loadedCount / totalFlights) * 100)
        );

        const animateProgress = () => {
          setLoadingProgress((prev) => {
            const next = prev + 1;
            if (next < targetProgress) {
              setTimeout(animateProgress, 30); // ✅ Giảm delay animation
            }
            return Math.min(next, targetProgress);
          });
        };

        animateProgress();
      };

      try {
        const result = await fetchMultipleTicketPackages(
          uniqueMaGiaVes,
          updateProgress
        );

        // ✅ Group packages theo base code thay vì exact ma_gia_ve
        const grouped = result.reduce((acc, pkg) => {
          const baseCode = pkg.ma_gia_ve.split("+")[0];
          if (!acc[baseCode]) acc[baseCode] = [];
          acc[baseCode].push(pkg);
          return acc;
        }, {});

        setTicketPackagesMap(grouped);

        // ✅ Complete progress animation
        const completeProgress = () => {
          setLoadingProgress(100);
          setTimeout(() => setIsLoading(false), 200);
        };

        setTimeout(completeProgress, 500);
      } catch (error) {
        console.error("❌ Error loading packages:", error);
        setIsLoading(false);
      }
    };

    loadAllPackages();
  }, [uniqueMaGiaVes]);

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {!isRoundTripMode && <HeaderContent searchInfo={searchInfo} />}
      {!isRoundTripMode && <FilterContent onSearchAgain={() => setShowBookingModal(true)} />}

      {/* ✅ Flight Summary - Responsive */}
      {displayFlights.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 lg:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 lg:gap-4">
              <span className="text-base lg:text-lg font-semibold text-blue-900">
                📋 Tìm thấy {displayFlights.length} chuyến bay
              </span>
              <span className="text-xs lg:text-sm text-blue-700 bg-blue-100 px-2 lg:px-3 py-1 rounded-full">
                {flights.length} tùy chọn vé
              </span>
            </div>
            <span className="text-xs lg:text-sm text-blue-600">
              {Object.keys(flightGroups).length} nhóm chuyến bay
            </span>
          </div>
        </div>
      )}

      {/* ✅ Loading Progress Bar - Responsive */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-sm p-3 lg:p-4">
          <div className="mb-2 flex justify-between items-center">
            <span className="text-xs lg:text-sm font-medium text-gray-700">
              Đang tải {uniqueMaGiaVes.length} gói vé...
            </span>
            <span className="text-xs lg:text-sm font-medium text-blue-600">
              {loadingProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 lg:h-2.5">
            <div
              className="bg-blue-600 h-2 lg:h-2.5 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Flight Tickets */}
      <div
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        {displayFlights.length > 0 ? (
          displayFlights.map((flight, index) => (
            <ItemContent
              key={`${flight.ma_gia_ve}_${index}`}
              flight={flight}
              passengers={passengers}
              packages={ticketPackagesMap[flight.ma_gia_ve.split("+")[0]] || []}
              loading={isLoading}
              variantCount={flight.variantCount}
              allVariants={flight.allVariants}
              onFlightSelect={onFlightSelect}
              selectedFlight={selectedFlight}
              flightType={flightType}
              isRoundTripMode={isRoundTripMode}
            />
          ))
        ) : (
          <div className="text-center py-8 lg:py-12">
            <div className="text-4xl lg:text-6xl mb-3 lg:mb-4">✈️</div>
            <p className="text-gray-500 text-base lg:text-lg mb-2">
              Không tìm thấy chuyến bay nào
            </p>
            <p className="text-gray-400 text-sm mb-4">
              Hãy thử thay đổi tiêu chí tìm kiếm
            </p>
            <button
              onClick={() => setShowBookingModal(true)}
              className="px-4 lg:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
            >
              Tìm kiếm lại
            </button>
          </div>
        )}
      </div>

      {showOptions && (
        <TicketOptionsPanel onClose={() => setShowOptions(false)} />
      )}

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSearchDone={handleSearchDone}
      />
    </div>
  );
};

export default React.memo(Ticket_Content);
