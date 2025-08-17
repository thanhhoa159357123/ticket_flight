import React, { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTicketOptionsPanel } from "./../../hooks/TicketOptionalsPanelHook";
import TicketPackageCard from "./TicketPackageCard";
import TicketInfoHeader from "./TicketInfoHeader";
import TicketMoreDetail from "./TicketMoreDetail";
import { fetchSingleTicketPackage } from "../../services/TicketOptionalsPanelService";

// 🆕 Lazy load TicketDetail
const TicketDetail = lazy(() => import("./TicketDetail"));

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
  // ✅ Internal state cho packages
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 🆕 Thêm state cho animation với delay
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // 🆕 State cho TicketDetail
  const [showTicketDetail, setShowTicketDetail] = useState(false);

  // 🆕 State cho TicketMoreDetail
  const [showMoreDetail, setShowMoreDetail] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const {
    optionListRef,
    gioDiVN,
    gioDenVN,
    showLeftArrow,
    showRightArrow,
    scrollLeft,
    scrollRight,
  } = useTicketOptionsPanel(flight, passengers, packages);

  // 🆕 Animation effect nhanh hơn - UPDATED
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // 🔥 Giảm delay để show nhanh hơn
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 30); // Giảm từ 100ms xuống 30ms
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setShowTicketDetail(false);
        setShowMoreDetail(false);
        setSelectedPackage(null);
      }, 350); // 🔥 Giảm từ 800ms xuống 350ms
      return () => clearTimeout(timer);
    }
  }, [show]);

  // 🆕 Cải thiện body scroll management
  useEffect(() => {
    if (show) {
      const scrollY = window.scrollY;
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      requestAnimationFrame(() => {
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      });

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [show]);

  // 🆕 Handle close nhanh hơn - UPDATED
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 350); // 🔥 Giảm từ 800ms xuống 350ms để match với useEffect
  };

  // 🆕 Handle show ticket detail
  const handleShowTicketDetail = () => {
    setShowTicketDetail(true);
  };

  // 🆕 Handle close ticket detail
  const handleCloseTicketDetail = () => {
    setShowTicketDetail(false);
  };

  // 🆕 Handle show more detail cho package
  const handleShowMoreDetail = (packageData) => {
    setSelectedPackage(packageData);
    setShowMoreDetail(true);
  };

  // 🆕 Handle close more detail
  const handleCloseMoreDetail = () => {
    setShowMoreDetail(false);
    setSelectedPackage(null);
  };

  // ✅ Fetch packages khi flight thay đổi
  useEffect(() => {
    const fetchPackages = async () => {
      if (!flight) return;

      const flightId = flight.ma_ve || flight.ma_gia_ve || flight.id;
      if (!flightId) {
        console.error("❌ No flight ID found");
        setError("Không tìm thấy mã vé");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const realPackages = await fetchSingleTicketPackage(flightId);

        if (realPackages && realPackages.length > 0) {
          setPackages(realPackages);
        } else {
          setPackages([]);
          setError("Không có gói vé khả dụng cho chuyến bay này");
        }
      } catch (error) {
        console.error("❌ Error fetching packages:", error);
        setError("Không thể tải gói vé từ server");
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    if (show && flight) {
      fetchPackages();
    }
  }, [show, flight]);

  // ✅ Handle package selection
  const handlePackageSelection = async (pkg) => {
    try {
      // 🔥 Call onChoose nếu có (để parent handle)
      if (onChoose) {
        await onChoose(pkg);
        return;
      }

      // 🔥 Default behavior: Navigate to booking
      const bookingData = {
        flight: flight,
        selected_package: pkg,
        passengers: passengers || [],
        // 🔥 Pass search params for round trip
        isRoundTrip: searchParams?.roundTrip || false,
        departureCity: searchParams?.departureCity,
        arrivalCity: searchParams?.arrivalCity,
        departureDate: searchParams?.departureDate,
        returnDate: searchParams?.returnDate,
      };
      // 🔥 Close panel first
      handleClose();
      // 🔥 Navigate với delay để animation hoàn thành
      setTimeout(() => {
        navigate("/booking", {
          state: bookingData,
        });
      }, 350);
    } catch (error) {
      console.error("❌ Error handling package selection:", error);
      alert("Có lỗi xảy ra khi chọn gói vé. Vui lòng thử lại.");
    }
  };

  // ✅ Calculate flight duration nếu không có durationFormatted
  const calculateDuration = () => {
    if (durationFormatted) return durationFormatted;

    if (gioDiVN && gioDenVN) {
      const duration = gioDenVN.diff(gioDiVN, "minute");
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return `${hours}g ${minutes}p`;
    }

    return "N/A";
  };

  // ✅ Early returns for invalid states
  if (!isVisible) {
    return null;
  }

  if (!flight) {
    return (
      <>
        <div
          onClick={handleClose}
          className={`fixed inset-0 bg-black/50 z-[1000] transition-opacity duration-300 ease-out ${
            isAnimating ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`fixed top-0 right-0 h-screen bg-white z-[1001] flex flex-col shadow-2xl transition-transform duration-300 ease-out w-full max-w-[800px] lg:w-[65%] md:w-[75%] ${
            isAnimating ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white sticky top-0 z-10">
            <button
              onClick={handleClose}
              className="mr-3 p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold">Chọn gói vé</h2>
              <p className="text-sm text-blue-100 opacity-90">
                Đang tải thông tin chuyến bay...
              </p>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Đang tải dữ liệu chuyến bay...</p>
              <button
                onClick={handleClose}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* 🆕 Improved Overlay nhanh hơn */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/50 z-[1000] transition-opacity duration-300 ease-out ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* 🆕 Improved Panel nhanh hơn */}
      <div
        className={`fixed top-0 right-0 h-screen bg-white z-[1001] flex flex-col shadow-2xl transition-transform duration-300 ease-out w-full max-w-[800px] lg:w-[65%] md:w-[75%] ${
          isAnimating ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white sticky top-0 z-10">
          <button
            onClick={handleClose}
            className="mr-3 p-1.5 rounded-full hover:bg-white/20 transition-colors"
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

        {/* 🆕 Flight Info - Pass handler cho show detail */}
        <TicketInfoHeader
          flight={flight}
          gioDiVN={gioDiVN}
          gioDenVN={gioDenVN}
          durationFormatted={calculateDuration()}
          onShowDetail={handleShowTicketDetail}
        />

        {/* Packages section */}
        <div className="flex-1 overflow-y-auto">
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
                  {loading
                    ? "Đang tải..."
                    : error
                    ? "Có lỗi xảy ra"
                    : packages.length > 0
                    ? `${packages.length} gói lựa chọn`
                    : "Không có gói vé"}
                </p>
              </div>
            </div>

            {/* Navigation buttons */}
            {packages.length > 0 && !loading && (
              <div className="flex gap-2">
                <button
                  onClick={scrollLeft}
                  disabled={!showLeftArrow}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all duration-200 ${
                    showLeftArrow
                      ? "border-gray-300 bg-white text-gray-600 hover:bg-blue-50 hover:border-blue-400 hover:scale-105 active:scale-95 cursor-pointer"
                      : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                  aria-label="Cuộn trái"
                >
                  <ArrowBackIcon className="w-5 h-5" />
                </button>

                <button
                  onClick={scrollRight}
                  disabled={!showRightArrow}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all duration-200 ${
                    showRightArrow
                      ? "border-gray-300 bg-white text-gray-600 hover:bg-blue-50 hover:border-blue-400 hover:scale-105 active:scale-95 cursor-pointer"
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
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-500 ml-3">Đang tải gói vé...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-700 mb-1">
                  Lỗi tải gói vé
                </h4>
                <p className="text-gray-500 max-w-xs mb-4">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    setPackages([]);
                    if (flight) {
                      setLoading(true);
                      const flightId =
                        flight.ma_ve || flight.ma_gia_ve || flight.id;
                      fetchSingleTicketPackage(flightId)
                        .then((packages) => {
                          if (packages && packages.length > 0) {
                            setPackages(packages);
                          } else {
                            setError(
                              "Không có gói vé khả dụng cho chuyến bay này"
                            );
                          }
                        })
                        .catch((err) => {
                          setError(err.message || "Không thể tải gói vé");
                        })
                        .finally(() => {
                          setLoading(false);
                        });
                    }
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            ) : packages.length > 0 ? (
              <div className="relative">
                <div
                  className="flex gap-5 pb-2 overflow-x-auto scroll-smooth"
                  ref={optionListRef}
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {packages.map((pkg, idx) => (
                    <TicketPackageCard
                      key={`${pkg.ma_ve || pkg.ma_gia_ve || "pkg"}_${idx}`}
                      pkg={pkg}
                      onShowMoreDetail={handleShowMoreDetail}
                      onChoose={handlePackageSelection}
                    />
                  ))}
                </div>
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

      {/* 🆕 TicketDetail Component - Conditional render */}
      {showTicketDetail && flight && (
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black/50 z-[1030] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          }
        >
          <TicketDetail
            show={showTicketDetail}
            onClose={handleCloseTicketDetail}
            flight={flight}
            durationFormatted={calculateDuration()}
          />
        </Suspense>
      )}

      {/* 🆕 TicketMoreDetail Component - Conditional render */}
      {showMoreDetail && selectedPackage && (
        <TicketMoreDetail
          show={showMoreDetail}
          onClose={handleCloseMoreDetail}
          ticketPkg={selectedPackage}
          passengers={passengers}
        />
      )}
    </>
  );
};

export default React.memo(TicketOptionsPanel);
