import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DetailContent from "../../pages/ticket/ticket_content/item_content/DetailContent";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

const TicketDetail = ({ show, onClose, flight, durationFormatted }) => {
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);
  
  // 🆕 Thêm animation states
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // 🆕 Animation effect với duration chậm hơn
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // 🔥 Tăng delay để animation mượt hơn
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 50); // Tăng từ requestAnimationFrame lên 50ms
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 500); // 🔥 Tăng từ 300ms lên 500ms
      return () => clearTimeout(timer);
    }
  }, [show]);

  // 🆕 Handle close với animation chậm hơn
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 500); // 🔥 Tăng từ 300ms lên 500ms
  };

  useEffect(() => {
    if (drawerRef.current && overlayRef.current) {
      drawerRef.current.getBoundingClientRect();
      overlayRef.current.getBoundingClientRect();
    }
  }, []);

  // ✅ Early return nếu không visible
  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* 🆕 Overlay với animation chậm hơn */}
      <div
        ref={overlayRef}
        onClick={handleClose}
        className={`fixed inset-0 bg-black/30 z-[1020] transition-opacity duration-300 ease-in-out ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
      />
      
      {/* 🆕 Drawer với animation chậm hơn */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-screen bg-white z-[1021] overflow-y-auto transition-transform duration-300 ease-in-out shadow-xl
          w-full max-w-[600px]
          md:w-[45%]
          max-md:w-[90%] max-md:right-[5%] max-md:top-[5vh] max-md:h-[90vh] max-md:rounded-xl
          ${isAnimating ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 flex items-center gap-4">
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors duration-200"
            aria-label="Đóng"
          >
            <CloseIcon className="text-white" />
          </button>
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FlightTakeoffIcon fontSize="small" />
              Tóm tắt chuyến đi
            </h3>
            <p className="text-sm text-blue-100 opacity-90 mt-1">
              Chi tiết hành trình bay của bạn
            </p>
          </div>
        </div>

        {/* Route Info */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-gray-900">
                {flight.ten_thanh_pho_di} ({flight.ma_san_bay_di}) → {flight.ten_thanh_pho_den} ({flight.ma_san_bay_den})
              </h4>
              <p className="text-gray-600 text-sm mt-1">CN, 15 tháng 6 2025</p>
            </div>
            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {flight.ten_hang_bay}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 border-b border-gray-200">
            <div className="flex">
              <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600 transition-colors duration-200">
                Chi tiết chuyến bay
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <DetailContent
            flight={flight}
            durationFormatted={durationFormatted}
          />
        </div>
      </div>
    </>
  );
};

export default TicketDetail;