import React from "react";
import FlightSection from "../FlightSection";
import SummarySidebar from "./SummarySidebar";
import LoadingSpinner from "./LoadingSpinner";
import PackageDetailModal from "./PackageDetailModal";
import RoundTripHeader from "./RoundTripHeader";
import useRoundTripConfirm from "./hooks/useRoundTripConfirm";
import { formatPrice, formatTime, formatDate } from "../../../utils/format";

const RoundTripConfirmPanel = (props) => {
  const {
    packageState,
    setPackageState,
    outboundPackages,
    returnPackages,
    loading,
    isVisible,
    isAnimating,
    handleClose,
    handleConfirmBooking,
    getTotalPassengers,
  } = useRoundTripConfirm(props);

  const {
    selectedOutbound,
    selectedReturn,
    passengers,
  } = props;

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-[1000] transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-screen bg-white z-[1001] flex flex-col shadow-2xl transition-transform duration-300 ease-out w-full max-w-[1000px] lg:w-[80%] ${
          isAnimating ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <RoundTripHeader onClose={handleClose} />

        {/* Content */}
        <div className="flex flex-1 overflow-y-auto">
          {/* LEFT COLUMN */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                {/* Chuyến đi */}
                <FlightSection
                  title="Chuyến đi"
                  flight={selectedOutbound}
                  packages={outboundPackages}
                  selectedPackage={packageState.outbound}
                  onPackageSelect={(pkg) =>
                    setPackageState((prev) => ({ ...prev, outbound: pkg }))
                  }
                  formatTime={formatTime}
                  formatPrice={formatPrice}
                  formatDate={formatDate}
                  onShowDetail={(pkg) =>
                    setPackageState((prev) => ({
                      ...prev,
                      detail: pkg,
                      showDetail: true,
                    }))
                  }
                />

                {/* Chuyến về */}
                <FlightSection
                  title="Chuyến về"
                  flight={selectedReturn}
                  packages={returnPackages}
                  selectedPackage={packageState.return}
                  onPackageSelect={(pkg) =>
                    setPackageState((prev) => ({ ...prev, return: pkg }))
                  }
                  formatTime={formatTime}
                  formatPrice={formatPrice}
                  formatDate={formatDate}
                  onShowDetail={(pkg) =>
                    setPackageState((prev) => ({
                      ...prev,
                      detail: pkg,
                      showDetail: true,
                    }))
                  }
                />
              </>
            )}
          </div>

          {/* RIGHT COLUMN - SUMMARY */}
          <SummarySidebar
            passengers={passengers}
            selectedOutboundPackage={packageState.outbound}
            selectedReturnPackage={packageState.return}
            getTotalPassengers={getTotalPassengers}
            formatPrice={formatPrice}
            onConfirm={handleConfirmBooking}
            canProceed={packageState.outbound && packageState.return}
          />
        </div>
      </div>

      {/* Package Detail Modal */}
      <PackageDetailModal
        show={packageState.showDetail}
        onClose={() =>
          setPackageState((prev) => ({
            ...prev,
            showDetail: false,
            detail: null,
          }))
        }
        ticketPkg={packageState.detail}
        passengers={passengers}
      />
    </>
  );
};

export default React.memo(RoundTripConfirmPanel);
