import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import LuggageIcon from "@mui/icons-material/Luggage";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import BlockIcon from "@mui/icons-material/Block";
import WifiIcon from "@mui/icons-material/Wifi";
import ReceiptIcon from "@mui/icons-material/Receipt";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import UsbIcon from "@mui/icons-material/Usb";
import { Link } from "react-router-dom";

const TicketMoreDetail = ({ show, onClose, ticketPkg }) => {
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
      <div
        onClick={onClose}
        className={`
      fixed inset-0 bg-black/20 z-[1020] transition-all duration-200 ease
      ${
        show
          ? "opacity-100 visible pointer-events-auto"
          : "opacity-0 invisible pointer-events-none"
      }
    `}
      />
      <div
        className={`
      fixed top-0 right-0 h-screen flex flex-col bg-white border border-white rounded-[5px] z-[1021] overflow-y-auto transition-transform duration-200 ease
      ${show ? "translate-x-0" : "translate-x-full"}
      w-[40%] max-w-[500px]
      max-md:w-[90%] max-md:right-[5%] max-md:top-[5vh] max-md:h-[90vh] max-md:rounded-[15px]
    `}
      >
        {/* Header */}
        <div className="flex items-center px-6 py-5 border-b border-gray-200 sticky top-0 bg-white z-10">
          <CloseIcon
            onClick={onClose}
            className="text-gray-600 cursor-pointer p-2 rounded-full transition-transform hover:scale-110 hover:bg-gray-100"
          />
          <div className="flex items-center gap-4 ml-4">
            <div className="w-[60px] h-[60px] rounded-[12px] overflow-hidden flex items-center justify-center">
              <img
                src="https://ik.imagekit.io/tvlk/image/imageResource/2022/12/20/1671519137608-e21126746f9e50f8f36235df003b3fb2.png?tr=h-128,q-75,w-128"
                alt="ticket icon"
                className="w-full h-full object-cover rounded-[12px]"
              />
            </div>
            <div>
              <h3 className="text-[1.4rem] font-semibold text-gray-900 mb-1">
                {goi_ve}
              </h3>
              <span className="text-[1.1rem] font-semibold text-orange-500">
                {Number(gia).toLocaleString()} VND/khách
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-5">
          {/* Hành lý */}
          <div className="mb-8">
            <h4 className="text-[1.1rem] font-semibold text-gray-800 mb-4">
              Hành lý
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <LuggageIcon className="text-gray-500 mt-[2px]" />
                <span className="text-[0.95rem] text-gray-700 leading-[1.5]">
                  Hành lý xách tay {so_kg_hanh_ly_xach_tay} kg
                </span>
              </div>
              <div className="flex items-start gap-3">
                <LuggageIcon className="text-gray-500 mt-[2px]" />
                <span className="text-[0.95rem] text-gray-700 leading-[1.5]">
                  Hành lý ký gửi {so_kg_hanh_ly_ky_gui} kg
                </span>
              </div>
            </div>
          </div>

          {/* Vé linh hoạt */}
          <div className="mb-8">
            <h4 className="text-[1.1rem] font-semibold text-gray-800 mb-4">
              Vé linh hoạt
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <SwapHorizIcon className="text-gray-500 mt-[2px]" />
                <span className="text-[0.95rem] text-gray-700 leading-[1.5]">
                  {changeable
                    ? "Đổi lịch miễn phí"
                    : "Phí đổi lịch bay 378.000 VND"}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <BlockIcon className="text-gray-500 mt-[2px]" />
                <span className="text-[0.95rem] text-gray-700 leading-[1.5]">
                  {refundable ? "Hoàn vé" : "Không áp dụng hoàn vé"}
                </span>
              </div>
            </div>
          </div>

          {/* Tiện nghi chuyến bay (mặc định) */}
          <div className="mb-8">
            <h4 className="text-[1.1rem] font-semibold text-gray-800 mb-4">
              Tiện nghi trên chuyến bay
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <RestaurantIcon className="text-gray-500 mt-[2px]" />
                <span className="text-[0.95rem] text-gray-700">
                  Không có suất ăn trên máy bay
                </span>
              </div>
              <div className="flex items-start gap-3">
                <RestaurantIcon className="text-gray-500 mt-[2px]" />
                <span className="text-[0.95rem] text-gray-700">
                  Không có giải trí trong chuyến bay
                </span>
              </div>
              <div className="flex items-start gap-3">
                <UsbIcon className="text-gray-500 mt-[2px]" />
                <span className="text-[0.95rem] text-gray-700">
                  Không có nguồn & cổng USB
                </span>
              </div>
              <div className="flex items-start gap-3">
                <WifiIcon className="text-gray-500 mt-[2px]" />
                <span className="text-[0.95rem] text-gray-700">
                  Không có WiFi
                </span>
              </div>
            </div>
          </div>

          {/* Hóa đơn VAT */}
          <div>
            <h4 className="text-[1.1rem] font-semibold text-gray-800 mb-4">
              Hóa đơn VAT
            </h4>
            <div className="flex items-start gap-3">
              <ReceiptIcon className="text-gray-500 mt-[2px]" />
              <div>
                <span className="block text-[0.95rem] text-gray-700 mb-1">
                  Có thể cung cấp hóa đơn VAT
                </span>
                <p className="text-[0.85rem] text-gray-500 leading-[1.4] m-0">
                  Với lựa chọn này, chúng tôi sẽ cung cấp hóa đơn VAT theo yêu
                  cầu.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Link
          to="/booking"
          className="px-6 py-5 border-t border-gray-200 bg-white"
        >
          <button className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold text-base rounded-md py-3 px-5 transition-all hover:shadow-[0_6px_20px_rgba(29,78,216,0.35)] cursor-pointer hover:-translate-y-[1px] active:translate-y-0">
            Chọn vé này
          </button>
        </Link>
      </div>
    </>
  );
};

export default TicketMoreDetail;
