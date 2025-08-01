import React, { useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import LuggageIcon from "@mui/icons-material/Luggage";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import BlockIcon from "@mui/icons-material/Block";
import WifiIcon from "@mui/icons-material/Wifi";
import ReceiptIcon from "@mui/icons-material/Receipt";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import UsbIcon from "@mui/icons-material/Usb";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const TicketMoreDetail = ({ show, onClose, ticketPkg, passengers }) => {
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (drawerRef.current && overlayRef.current) {
      drawerRef.current.getBoundingClientRect();
      overlayRef.current.getBoundingClientRect();
    }
  }, []);

  if (!ticketPkg) return null;

  const {
    goi_ve,
    gia,
    so_kg_hanh_ly_xach_tay,
    so_kg_hanh_ly_ky_gui,
    changeable,
    refundable,
  } = ticketPkg;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 z-[1020] transition-all duration-300 ease-out ${
          show ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      />
      
      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-screen flex flex-col bg-white shadow-xl z-[1021] overflow-y-auto transition-all duration-300 ease-out
          w-full max-w-[500px]
          max-md:w-[90%] max-md:right-[5%] max-md:top-[5vh] max-md:h-[90vh] max-md:rounded-xl
          ${show ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-gray-100 flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
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
              <h3 className="text-lg font-bold text-gray-900">{goi_ve}</h3>
              <p className="text-blue-600 font-semibold">
                {Number(gia).toLocaleString()} VND/khách
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-4">
          {/* Baggage Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <LuggageIcon fontSize="small" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800">Hành lý</h4>
            </div>
            <div className="space-y-3 pl-14">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="text-green-500 mt-0.5" fontSize="small" />
                <div>
                  <p className="text-gray-800 font-medium">Hành lý xách tay</p>
                  <p className="text-gray-600 text-sm">{so_kg_hanh_ly_xach_tay || 0} kg</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="text-green-500 mt-0.5" fontSize="small" />
                <div>
                  <p className="text-gray-800 font-medium">Hành lý ký gửi</p>
                  <p className="text-gray-600 text-sm">{so_kg_hanh_ly_ky_gui || 0} kg</p>
                </div>
              </div>
            </div>
          </div>

          {/* Flexibility Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <SwapHorizIcon fontSize="small" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800">Tính linh hoạt</h4>
            </div>
            <div className="space-y-3 pl-14">
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
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
          <button
            onClick={() => navigate("/booking", { state: { ticketPkg, passengers } })}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-md transition-all hover:translate-y-[-2px] active:translate-y-0"
          >
            Chọn vé này
          </button>
        </div>
      </div>
    </>
  );
};

export default TicketMoreDetail;