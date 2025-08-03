import React, { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTicketOptionsPanel } from "./../../hooks/TicketOptionalsPanelHook";
import TicketPackageCard from "./TicketPackageCard";
import TicketInfoHeader from "./TicketInfoHeader";

const TicketOptionsPanel = ({
  onClose,
  onShowDetail,
  onShowMoreDetail,
  show,
  flight,
  durationFormatted,
  passengers,
  packages = [],
  onChoose
}) => {
  const {
    optionListRef,
    gioDiVN,
    gioDenVN,
    showLeftArrow,
    showRightArrow,
    scrollLeft,
    scrollRight,
    handleChoosePackage,
    checkScroll,
  } = useTicketOptionsPanel(flight, passengers);

  const handlePackageSelection = onChoose || handleChoosePackage;

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(checkScroll, 100);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "unset";
      };
    }
  }, [show, checkScroll]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-[1000] transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-screen bg-white z-[1001] flex flex-col shadow-2xl transition-transform duration-300 ease-out w-full max-w-[1000px] lg:w-[65%] md:w-[75%] ${
          show ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white sticky top-0 z-10">
          <button
            onClick={onClose}
            className="mr-3 p-1.5 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Đóng"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold">Chọn gói vé</h2>
            <p className="text-sm text-blue-100 opacity-90">
              Chọn loại vé phù hợp với nhu cầu của bạn
            </p>
          </div>
        </div>

        {/* Flight Info */}
        <TicketInfoHeader
          flight={flight}
          gioDiVN={gioDiVN}
          gioDenVN={gioDenVN}
          durationFormatted={durationFormatted}
          onShowDetail={onShowDetail}
        />

        {/* Packages section */}
        <div className="flex-1 overflow-y-auto">
          {/* Packages header */}
          <div className="sticky top-0 z-10 bg-white px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Các gói vé có sẵn
                </h3>
                <p className="text-sm text-gray-500">
                  {packages.length > 0
                    ? `${packages.length} gói lựa chọn`
                    : "Đang tải gói vé..."}
                </p>
              </div>
            </div>

            {/* Navigation buttons - only show when packages exist */}
            {packages.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={scrollLeft}
                  disabled={!showLeftArrow}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                    showLeftArrow
                      ? "border-gray-300 bg-white text-gray-600 hover:bg-blue-50 hover:border-blue-400"
                      : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                  aria-label="Cuộn trái"
                >
                  <ArrowBackIcon className="w-5 h-5" />
                </button>

                <button
                  onClick={scrollRight}
                  disabled={!showRightArrow}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                    showRightArrow
                      ? "border-gray-300 bg-white text-gray-600 hover:bg-blue-50 hover:border-blue-400"
                      : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                  aria-label="Cuộn phải"
                >
                  <ArrowForwardIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Packages list */}
          <div className="px-5 py-4">
            {packages.length > 0 ? (
              <div className="relative">
                <div
                  className="flex gap-5 pb-2 overflow-x-auto scroll-smooth"
                  ref={optionListRef}
                  style={{
                    scrollbarWidth: "none" /* Firefox */,
                    msOverflowStyle: "none" /* IE 10+ */,
                  }}
                >
                  {packages.map((pkg, idx) => (
                    <TicketPackageCard
                      key={`${pkg.ma_gia_ve}_${idx}`}
                      pkg={pkg}
                      onShowMoreDetail={onShowMoreDetail}
                      onChoose={handlePackageSelection}
                    />
                  ))}
                </div>
                {/* Thêm pseudo-element để ẩn scrollbar trên WebKit */}
                <style jsx>{`
                  div[ref="${optionListRef?.current?.id ||
                    ""}"]::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-700 mb-1">
                  Không có gói vé nào
                </h4>
                <p className="text-gray-500 max-w-xs">
                  Hiện không có gói vé nào khả dụng cho chuyến bay này
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(TicketOptionsPanel);
