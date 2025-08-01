import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TicketOptionsPanel from "../ticketbook/TicketOptionalsPanel";
import TicketMoreDetail from "../ticketbook/TicketMoreDetail";
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
  const [currentStep, setCurrentStep] = useState("confirm");
  const [outboundPackages, setOutboundPackages] = useState([]);
  const [returnPackages, setReturnPackages] = useState([]);
  const [selectedOutboundPackage, setSelectedOutboundPackage] = useState(null);
  const [selectedReturnPackage, setSelectedReturnPackage] = useState(null);
  const [showPackageDetail, setShowPackageDetail] = useState(false);
  const [selectedPackageDetail, setSelectedPackageDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

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
      weekday: "short",
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

  const loadPackagesForFlight = async (flight) => {
    if (!flight?.ma_gia_ve) return [];
    setLoading(true);
    try {
      const packages = await fetchSingleTicketPackage(flight.ma_gia_ve);
      return packages;
    } catch (error) {
      console.error("Error loading packages:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOutboundPackages = async () => {
    const packages = await loadPackagesForFlight(selectedOutbound);
    setOutboundPackages(packages);
    setCurrentStep("outbound-packages");
  };

  const handleSelectReturnPackages = async () => {
    const packages = await loadPackagesForFlight(selectedReturn);
    setReturnPackages(packages);
    setCurrentStep("return-packages");
  };

  const handleOutboundPackageSelect = (pkg) => {
    setSelectedOutboundPackage(pkg);
    setCurrentStep("confirm");
  };

  const handleReturnPackageSelect = (pkg) => {
    setSelectedReturnPackage(pkg);
    setCurrentStep("confirm");
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

  const getStepTitle = () => {
    switch (currentStep) {
      case "outbound-packages":
        return "Chọn gói vé chuyến đi";
      case "return-packages":
        return "Chọn gói vé chuyến về";
      default:
        return "Xác nhận đặt vé khứ hồi";
    }
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
        className={`fixed top-0 right-0 h-screen bg-white z-[1001] flex flex-col shadow-2xl transition-transform duration-300 ease-out w-full max-w-[900px] lg:w-[65%] ${
          show ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ✅ Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white">
          <div className="flex items-center px-6 py-4">
            <button
              onClick={() => {
                if (currentStep !== "confirm") {
                  setCurrentStep("confirm");
                } else {
                  onClose();
                }
              }}
              className="mr-4 p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={currentStep !== "confirm" ? "M15 19l-7-7 7-7" : "M6 18L18 6M6 6l12 12"}
                />
              </svg>
            </button>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{getStepTitle()}</h2>
              <p className="text-blue-100 opacity-90 text-sm mt-1">
                {currentStep === "confirm"
                  ? "Kiểm tra thông tin trước khi đặt vé"
                  : "Chọn gói vé phù hợp với nhu cầu của bạn"}
              </p>
            </div>
          </div>

          {/* ✅ Progress Steps */}
          {currentStep === "confirm" && (
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      selectedOutboundPackage
                        ? "bg-green-500 text-white"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold">
                      {selectedOutboundPackage ? "✓" : "1"}
                    </div>
                    <span>Chuyến đi</span>
                  </div>

                  <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>

                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      selectedReturnPackage
                        ? "bg-green-500 text-white"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold">
                      {selectedReturnPackage ? "✓" : "2"}
                    </div>
                    <span>Chuyến về</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ✅ Content */}
        {currentStep === "confirm" ? (
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              
              {/* ✅ Flight Cards Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Outbound Flight Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">Chuyến đi</h3>
                        <p className="text-sm text-gray-600">{formatDate(selectedOutbound?.gio_di)}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleSelectOutboundPackages}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      {selectedOutboundPackage ? "Thay đổi" : "Chọn gói"}
                    </button>
                  </div>

                  {/* Flight Info */}
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {selectedOutbound?.logo_hang_bay && (
                          <img
                            src={selectedOutbound.logo_hang_bay}
                            alt={selectedOutbound.ten_hang_bay}
                            className="w-10 h-10 object-contain"
                          />
                        )}
                        <div>
                          <div className="font-semibold">{selectedOutbound?.ten_hang_bay}</div>
                          <div className="text-sm text-gray-500">{selectedOutbound?.so_hieu}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {formatPrice(selectedOutboundPackage?.gia || selectedOutbound?.gia || 0)}
                        </div>
                        <div className="text-xs text-gray-500">/khách</div>
                      </div>
                    </div>

                    {/* Flight Route */}
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{formatTime(selectedOutbound?.gio_di)}</div>
                        <div className="text-sm text-gray-600">{selectedOutbound?.ma_san_bay_di}</div>
                      </div>
                      <div className="flex-1 text-center mx-4">
                        <div className="text-xs text-gray-500 mb-1">2h 10m</div>
                        <div className="border-t border-gray-300"></div>
                        <div className="text-xs text-gray-400 mt-1">Bay thẳng</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{formatTime(selectedOutbound?.gio_den)}</div>
                        <div className="text-sm text-gray-600">{selectedOutbound?.ma_san_bay_den}</div>
                      </div>
                    </div>
                  </div>

                  {/* Selected Package */}
                  {selectedOutboundPackage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-green-700">{selectedOutboundPackage.goi_ve}</span>
                      </div>
                      <div className="text-sm text-gray-600 flex flex-wrap gap-4">
                        <span>Ký gửi: {selectedOutboundPackage.so_kg_hanh_ly_ky_gui || 0}kg</span>
                        <span>Xách tay: {selectedOutboundPackage.so_kg_hanh_ly_xach_tay || 0}kg</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Return Flight Card */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 border border-orange-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500 rounded-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">Chuyến về</h3>
                        <p className="text-sm text-gray-600">{formatDate(selectedReturn?.gio_di)}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleSelectReturnPackages}
                      className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                      {selectedReturnPackage ? "Thay đổi" : "Chọn gói"}
                    </button>
                  </div>

                  {/* Flight Info */}
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {selectedReturn?.logo_hang_bay && (
                          <img
                            src={selectedReturn.logo_hang_bay}
                            alt={selectedReturn.ten_hang_bay}
                            className="w-10 h-10 object-contain"
                          />
                        )}
                        <div>
                          <div className="font-semibold">{selectedReturn?.ten_hang_bay}</div>
                          <div className="text-sm text-gray-500">{selectedReturn?.so_hieu}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {formatPrice(selectedReturnPackage?.gia || selectedReturn?.gia || 0)}
                        </div>
                        <div className="text-xs text-gray-500">/khách</div>
                      </div>
                    </div>

                    {/* Flight Route */}
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{formatTime(selectedReturn?.gio_di)}</div>
                        <div className="text-sm text-gray-600">{selectedReturn?.ma_san_bay_di}</div>
                      </div>
                      <div className="flex-1 text-center mx-4">
                        <div className="text-xs text-gray-500 mb-1">2h 10m</div>
                        <div className="border-t border-gray-300"></div>
                        <div className="text-xs text-gray-400 mt-1">Bay thẳng</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{formatTime(selectedReturn?.gio_den)}</div>
                        <div className="text-sm text-gray-600">{selectedReturn?.ma_san_bay_den}</div>
                      </div>
                    </div>
                  </div>

                  {/* Selected Package */}
                  {selectedReturnPackage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-green-700">{selectedReturnPackage.goi_ve}</span>
                      </div>
                      <div className="text-sm text-gray-600 flex flex-wrap gap-4">
                        <span>Ký gửi: {selectedReturnPackage.so_kg_hanh_ly_ky_gui || 0}kg</span>
                        <span>Xách tay: {selectedReturnPackage.so_kg_hanh_ly_xach_tay || 0}kg</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ✅ Passenger Summary */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Thông tin hành khách
                </h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{getTotalPassengers()}</div>
                    <div className="text-gray-600">Tổng khách</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">{passengers?.Adult || 0}</div>
                    <div className="text-gray-600">Người lớn</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-orange-600">{passengers?.Children || 0}</div>
                    <div className="text-gray-600">Trẻ em</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">{passengers?.Infant || 0}</div>
                    <div className="text-gray-600">Em bé</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* ✅ Enhanced Footer */}
        {currentStep === "confirm" && (
          <div className="border-t bg-white p-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">Tổng tiền vé:</span>
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(
                    ((selectedOutboundPackage?.gia || selectedOutbound?.gia || 0) +
                      (selectedReturnPackage?.gia || selectedReturn?.gia || 0)) *
                      getTotalPassengers()
                  )}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Đã bao gồm thuế và phí dịch vụ • {getTotalPassengers()} hành khách
              </p>
            </div>

            <button
              onClick={handleConfirmBooking}
              disabled={!canProceed || isBooking}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                canProceed && !isBooking
                  ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isBooking ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
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
        )}
      </div>

      {/* Package Selection Panels */}
      {currentStep === "outbound-packages" && (
        <TicketOptionsPanel
          show={true}
          onClose={() => setCurrentStep("confirm")}
          flight={selectedOutbound}
          passengers={passengers}
          packages={outboundPackages}
          onShowMoreDetail={handleShowPackageDetail}
          onChoose={handleOutboundPackageSelect}
        />
      )}

      {currentStep === "return-packages" && (
        <TicketOptionsPanel
          show={true}
          onClose={() => setCurrentStep("confirm")}
          flight={selectedReturn}
          passengers={passengers}
          packages={returnPackages}
          onShowMoreDetail={handleShowPackageDetail}
          onChoose={handleReturnPackageSelect}
        />
      )}

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
