import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TicketMoreDetail from "../ticketbook/TicketMoreDetail";
import FlightSection from "./FlightSection";
import PassengerSummary from "./PassengerSummary";
import {
  fetchSingleTicketPackage,
  createBooking,
} from "../../services/TicketOptionalsPanelService";

const RoundTripConfirmPanel = ({
  show,
  onClose,
  selectedOutbound,
  selectedReturn,
  passengers,
}) => {
  const navigate = useNavigate();
  const [outboundPackages, setOutboundPackages] = useState([]);
  const [returnPackages, setReturnPackages] = useState([]);
  const [selectedOutboundPackage, setSelectedOutboundPackage] = useState(null);
  const [selectedReturnPackage, setSelectedReturnPackage] = useState(null);
  const [showPackageDetail, setShowPackageDetail] = useState(false);
  const [selectedPackageDetail, setSelectedPackageDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [packagesLoaded, setPackagesLoaded] = useState(false);

  // Utility functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const getTotalPassengers = () => {
    return (
      (passengers?.Adult || 0) +
      (passengers?.Children || 0) +
      (passengers?.Infant || 0)
    );
  };

  // Effects
  useEffect(() => {
    if (show && !packagesLoaded) {
      loadAllPackages();
    }
  }, [show, selectedOutbound, selectedReturn]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  const loadAllPackages = async () => {
    if (!selectedOutbound?.ma_gia_ve || !selectedReturn?.ma_gia_ve) return;

    setLoading(true);
    try {
      const [outboundPkgs, returnPkgs] = await Promise.all([
        fetchSingleTicketPackage(selectedOutbound.ma_gia_ve),
        fetchSingleTicketPackage(selectedReturn.ma_gia_ve),
      ]);

      setOutboundPackages(outboundPkgs || []);
      setReturnPackages(returnPkgs || []);
      setPackagesLoaded(true);

      // Auto-select first package if available
      if (outboundPkgs?.length > 0 && !selectedOutboundPackage) {
        setSelectedOutboundPackage(outboundPkgs[0]);
      }
      if (returnPkgs?.length > 0 && !selectedReturnPackage) {
        setSelectedReturnPackage(returnPkgs[0]);
      }
    } catch (error) {
      console.error("Error loading packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOutboundPackageSelect = (pkg) => {
    setSelectedOutboundPackage(pkg);
  };

  const handleReturnPackageSelect = (pkg) => {
    setSelectedReturnPackage(pkg);
  };

  const handleConfirmBooking = async () => {
    if (!selectedOutboundPackage || !selectedReturnPackage) {
      alert("Vui lòng chọn gói vé cho cả chuyến đi và chuyến về.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const maKhachHang = user?.ma_khach_hang;

    if (!maKhachHang) {
      alert("Bạn cần đăng nhập để đặt vé.");
      return;
    }

    setIsBooking(true);

    try {
      const searchData = JSON.parse(localStorage.getItem("searchData") || "{}");
      const loaiChuyenDi = searchData.tripType || "Khứ hồi";

      const payload = {
        ngay_dat: new Date().toISOString().split("T")[0],
        trang_thai: "Chờ thanh toán",
        ma_khach_hang: maKhachHang,
        loai_chuyen_di: loaiChuyenDi,
        ma_hang_ve_di: selectedOutboundPackage?.ma_hang_ve,
        ma_tuyen_bay_di: selectedOutbound?.ma_tuyen_bay,
        ma_hang_ve_ve: selectedReturnPackage?.ma_hang_ve,
        ma_tuyen_bay_ve: selectedReturn?.ma_tuyen_bay,
      };

      const booking = await createBooking(payload);

      if (booking?.ma_dat_ve) {
        navigate("/booking", {
          state: {
            roundTrip: true,
            outboundFlight: selectedOutbound,
            returnFlight: selectedReturn,
            outboundPackage: selectedOutboundPackage,
            returnPackage: selectedReturnPackage,
            passengers,
            ma_dat_ve: booking.ma_dat_ve,
          },
        });
      } else {
        alert("Không thể đặt vé. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("❌ Lỗi khi tạo đặt vé khứ hồi:", err);
      alert("Lỗi khi gửi dữ liệu đặt vé.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleShowPackageDetail = (pkg) => {
    setSelectedPackageDetail(pkg);
    setShowPackageDetail(true);
  };

  const canProceed = selectedOutboundPackage && selectedReturnPackage;

  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-[1000] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Main Panel */}
      <div
        className={`fixed top-0 right-0 h-screen bg-white z-[1001] flex flex-col shadow-2xl transition-transform duration-300 ease-out w-full max-w-[900px] lg:w-[75%] ${
          show ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center px-4 py-3">
            <button
              onClick={onClose}
              className="mr-3 p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex-1">
              <h2 className="text-lg font-bold">Chọn gói vé khứ hồi</h2>
              <p className="text-blue-100 opacity-90 text-xs">
                Chọn gói vé phù hợp cho cả chuyến đi và chuyến về
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="px-4 pb-3">
            <div className="flex items-center space-x-3">
              <div
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                  selectedOutboundPackage
                    ? "bg-green-500 text-white"
                    : "bg-white/20 text-white"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold">
                  {selectedOutboundPackage ? "✓" : "1"}
                </div>
                <span>Chuyến đi</span>
              </div>

              <svg className="w-3 h-3 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>

              <div
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                  selectedReturnPackage
                    ? "bg-green-500 text-white"
                    : "bg-white/20 text-white"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold">
                  {selectedReturnPackage ? "✓" : "2"}
                </div>
                <span>Chuyến về</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="animate-spin w-6 h-6 text-blue-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600 text-sm">Đang tải gói vé...</p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Outbound Section */}
              <FlightSection
                title="Chuyến đi"
                flight={selectedOutbound}
                packages={outboundPackages}
                selectedPackage={selectedOutboundPackage}
                onPackageSelect={handleOutboundPackageSelect}
                type="outbound"
                formatTime={formatTime}
                formatPrice={formatPrice}
                formatDate={formatDate}
                onShowDetail={handleShowPackageDetail}
              />

              {/* Return Section */}
              <FlightSection
                title="Chuyến về"
                flight={selectedReturn}
                packages={returnPackages}
                selectedPackage={selectedReturnPackage}
                onPackageSelect={handleReturnPackageSelect}
                type="return"
                formatTime={formatTime}
                formatPrice={formatPrice}
                formatDate={formatDate}
                onShowDetail={handleShowPackageDetail}
              />

              {/* Passenger Summary */}
              <PassengerSummary
                passengers={passengers}
                getTotalPassengers={getTotalPassengers}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-white p-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-gray-700 text-sm">Tổng tiền vé:</span>
              <span className="text-2xl font-bold text-red-600">
                {formatPrice(
                  ((selectedOutboundPackage?.gia || 0) +
                    (selectedReturnPackage?.gia || 0)) *
                    getTotalPassengers()
                )}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Đã bao gồm thuế và phí • {getTotalPassengers()} hành khách
            </p>
          </div>

          <button
            onClick={handleConfirmBooking}
            disabled={!canProceed || isBooking}
            className={`w-full py-3 rounded-lg font-bold text-base transition-all duration-200 ${
              canProceed && !isBooking
                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isBooking ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </div>
            ) : !selectedOutboundPackage ? (
              "Chọn gói vé chuyến đi"
            ) : !selectedReturnPackage ? (
              "Chọn gói vé chuyến về"
            ) : (
              "Xác nhận đặt vé khứ hồi"
            )}
          </button>
        </div>
      </div>

      {/* Package Detail Modal */}
      {showPackageDetail && selectedPackageDetail && (
        <TicketMoreDetail
          show={showPackageDetail}
          onClose={() => setShowPackageDetail(false)}
          ticketPkg={selectedPackageDetail}
          passengers={passengers}
        />
      )}
    </>
  );
};

export default RoundTripConfirmPanel;
