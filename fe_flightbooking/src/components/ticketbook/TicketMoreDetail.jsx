import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import LuggageIcon from "@mui/icons-material/Luggage";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import WifiIcon from "@mui/icons-material/Wifi";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";

// 🔹 Tái sử dụng component Section
const DetailSection = ({ icon, title, children }) => (
  <div className="mb-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">{icon}</div>
      <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
    </div>
    <div className="space-y-3 pl-14">{children}</div>
  </div>
);

const TicketMoreDetail = ({ show, onClose, ticketPkg, passengers }) => {
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // 🟢 Điều khiển animation
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsAnimating(true), 30);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 350);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 350);
  };

  const handleChooseTicket = () => {
    setIsAnimating(false);
    setTimeout(() => {
      navigate("/booking", { state: { ticketPkg, passengers } });
    }, 200);
  };

  if (!isVisible || !ticketPkg) return null;

  const {
    ten_hang_ve,
    goi_ve,
    gia_ve,
    gia,
    so_kg_hanh_ly_xach_tay,
    so_kg_hanh_ly_ky_gui,
    changeable,
    refundable,
  } = ticketPkg;

  const packageName = ten_hang_ve || goi_ve || "Gói vé";
  const price = gia_ve || gia || 0;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={handleClose}
        className={`fixed inset-0 bg-black/30 z-[1020] transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-screen flex flex-col bg-white shadow-2xl z-[1021] overflow-y-auto transition-transform duration-300 ease-out
          w-full max-w-[500px]
          max-md:w-full max-md:h-full max-md:rounded-t-2xl
          ${isAnimating ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-gray-100 flex items-center gap-4">
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition"
            aria-label="Đóng"
          >
            <CloseIcon className="text-gray-600" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <img
                src="https://ik.imagekit.io/tvlk/image/imageResource/2022/12/20/1671519137608-e21126746f9e50f8f36235df003b3fb2.png?tr=h-64,q-75,w-64"
                alt="ticket icon"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{packageName}</h3>
              <p className="text-blue-600 font-semibold">
                {Number(price).toLocaleString()} VND / khách
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-4">
          {/* Hành lý */}
          <DetailSection
            icon={<LuggageIcon fontSize="small" />}
            title="Hành lý"
          >
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="text-green-500 mt-0.5" fontSize="small" />
              <div>
                <p className="text-gray-800 font-medium">Hành lý xách tay</p>
                <p className="text-gray-600 text-sm">
                  {so_kg_hanh_ly_xach_tay || 0} kg
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="text-green-500 mt-0.5" fontSize="small" />
              <div>
                <p className="text-gray-800 font-medium">Hành lý ký gửi</p>
                <p className="text-gray-600 text-sm">
                  {so_kg_hanh_ly_ky_gui || 0} kg
                </p>
              </div>
            </div>
          </DetailSection>

          {/* Linh hoạt */}
          <DetailSection
            icon={<SwapHorizIcon fontSize="small" />}
            title="Tính linh hoạt"
          >
            <div className="flex items-start gap-3">
              {changeable ? (
                <CheckCircleIcon className="text-green-500 mt-0.5" fontSize="small" />
              ) : (
                <CancelIcon className="text-gray-400 mt-0.5" fontSize="small" />
              )}
              <div>
                <p className="text-gray-800 font-medium">Đổi lịch bay</p>
                <p className="text-gray-600 text-sm">
                  {changeable ? "Miễn phí" : "Phí 378.000 VND"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              {refundable ? (
                <CheckCircleIcon className="text-green-500 mt-0.5" fontSize="small" />
              ) : (
                <CancelIcon className="text-gray-400 mt-0.5" fontSize="small" />
              )}
              <div>
                <p className="text-gray-800 font-medium">Hoàn vé</p>
                <p className="text-gray-600 text-sm">
                  {refundable ? "Được phép hoàn vé" : "Không hoàn vé"}
                </p>
              </div>
            </div>
          </DetailSection>

          {/* Dịch vụ đi kèm */}
          <DetailSection
            icon={<WifiIcon fontSize="small" />}
            title="Dịch vụ đi kèm"
          >
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="text-green-500 mt-0.5" fontSize="small" />
              <div>
                <p className="text-gray-800 font-medium">Wifi miễn phí</p>
                <p className="text-gray-600 text-sm">Toàn bộ chuyến bay</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="text-green-500 mt-0.5" fontSize="small" />
              <div>
                <p className="text-gray-800 font-medium">Ghế ngồi tiêu chuẩn</p>
                <p className="text-gray-600 text-sm">Chọn ghế miễn phí</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RestaurantIcon className="text-gray-400 mt-0.5" fontSize="small" />
              <div>
                <p className="text-gray-800 font-medium">Suất ăn</p>
                <p className="text-gray-600 text-sm">Mua thêm trên máy bay</p>
              </div>
            </div>
          </DetailSection>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
          <button
            onClick={handleChooseTicket}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg hover:scale-[1.02] active:scale-100 transition-all duration-200"
          >
            Chọn vé này
          </button>
        </div>
      </div>
    </>
  );
};

export default TicketMoreDetail;
