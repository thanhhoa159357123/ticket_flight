import React, { useEffect, useState, lazy, Suspense, useCallback } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useTicketOptionsPanel } from "./hooks/TicketOptionalsPanelHook";
import useTicketPackages from "./hooks/useTicketPackages";
import TicketInfoHeader from "./components/TicketInfoHeader";
import PackagesSection from "./components/PackagesSection";
import TicketMoreDetail from "../TicketMoreDetail";

const TicketDetail = lazy(() => import("../TicketDetail"));

const TicketOptionsPanel = ({
  onClose,
  show,
  flight,
  durationFormatted,
  passengers,
  onChoose,
  searchParams,
}) => {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [showMoreDetail, setShowMoreDetail] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const { packages, loading, error } = useTicketPackages(show, flight);

  const {
    optionListRef,
    gioDiVN,
    gioDenVN,
    showLeftArrow,
    showRightArrow,
    scrollLeft,
    scrollRight,
  } = useTicketOptionsPanel(flight, packages);

  // Animation mở / đóng panel
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsAnimating(true), 30);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setShowTicketDetail(false);
        setShowMoreDetail(false);
        setSelectedPackage(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  const handlePackageSelection = async (pkg) => {
    try {
      if (onChoose) return await onChoose(pkg);
      const bookingData = {
        flight,
        selected_package: pkg,
        passengers,
        isRoundTrip: searchParams?.roundTrip || false,
        ...searchParams,
      };
      handleClose();
      setTimeout(() => navigate("/booking", { state: bookingData }), 300);
    } catch {
      alert("Có lỗi xảy ra khi chọn gói vé. Vui lòng thử lại.");
    }
  };

  const calculateDuration = () => {
    if (durationFormatted) return durationFormatted;
    if (gioDiVN && gioDenVN) {
      const diff = gioDenVN.diff(gioDiVN, "minute");
      return `${Math.floor(diff / 60)}g ${diff % 60}p`;
    }
    return "N/A";
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/50 z-[1000] transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-screen bg-white z-[1001] flex flex-col shadow-2xl transition-transform duration-300 ease-out w-full max-w-[800px] lg:w-[65%] md:w-[75%] ${
          isAnimating ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white sticky top-0 z-10">
          <button
            onClick={handleClose}
            className="mr-3 p-1.5 rounded-full hover:bg-white/20"
            aria-label="Đóng"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold">Chọn gói vé</h2>
            <p className="text-sm text-blue-100 opacity-90">
              {loading
                ? "Đang tải gói vé..."
                : "Chọn loại vé phù hợp với nhu cầu của bạn"}
            </p>
          </div>
        </div>

        {/* Flight info */}
        <TicketInfoHeader
          flight={flight}
          gioDiVN={gioDiVN}
          gioDenVN={gioDenVN}
          durationFormatted={calculateDuration()}
          onShowDetail={() => setShowTicketDetail(true)}
        />

        {/* Packages */}
        <PackagesSection
          packages={packages}
          loading={loading}
          error={error}
          optionListRef={optionListRef}
          showLeftArrow={showLeftArrow}
          showRightArrow={showRightArrow}
          scrollLeft={scrollLeft}
          scrollRight={scrollRight}
          onShowMoreDetail={(pkg) => {
            setSelectedPackage(pkg);
            setShowMoreDetail(true);
          }}
          onChoose={handlePackageSelection}
        />
      </div>

      {/* Ticket detail */}
      {showTicketDetail && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 z-[1030]" />}>
          <TicketDetail
            show={showTicketDetail}
            onClose={() => setShowTicketDetail(false)}
            flight={flight}
            durationFormatted={calculateDuration()}
          />
        </Suspense>
      )}

      {/* More detail modal */}
      {showMoreDetail && selectedPackage && (
        <TicketMoreDetail
          show={showMoreDetail}
          onClose={() => setShowMoreDetail(false)}
          ticketPkg={selectedPackage}
          passengers={passengers}
        />
      )}
    </>
  );
};

export default React.memo(TicketOptionsPanel);
