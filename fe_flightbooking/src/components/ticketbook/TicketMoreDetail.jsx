import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import LuggageIcon from "@mui/icons-material/Luggage";
import FlightIcon from "@mui/icons-material/Flight";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import BlockIcon from "@mui/icons-material/Block";
import WifiIcon from "@mui/icons-material/Wifi";
import ReceiptIcon from "@mui/icons-material/Receipt";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import UsbIcon from "@mui/icons-material/Usb";
import { Link } from "react-router-dom";

const TicketMoreDetail = ({ onClose, ticketType = "Nguyên bản", price = "2.814.578 VND" }) => {
  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
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
            <h3 className="text-[1.4rem] font-semibold text-gray-900 mb-1">{ticketType}</h3>
            <span className="text-[1.1rem] font-semibold text-orange-500">{price}/khách</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-5">
        {/* Section 1 */}
        <div className="mb-8">
          <h4 className="text-[1.1rem] font-semibold text-gray-800 mb-4">Hành lý</h4>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <LuggageIcon className="text-gray-500 mt-[2px]" />
              <span className="text-[0.95rem] text-gray-700 leading-[1.5]">Hành lý xách tay 7 kg</span>
            </div>
            <div className="flex items-start gap-3">
              <LuggageIcon className="text-gray-500 mt-[2px]" />
              <span className="text-[0.95rem] text-gray-700 leading-[1.5]">Hành lý ký gửi 0 kg</span>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="mb-8">
          <h4 className="text-[1.1rem] font-semibold text-gray-800 mb-4">Vé linh hoạt</h4>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <SwapHorizIcon className="text-gray-500 mt-[2px]" />
              <div className="flex justify-between items-center w-full">
                <span className="text-[0.95rem] text-gray-700 leading-[1.5]">
                  phí đổi lịch bay của hãng hàng không 378.000 VND
                </span>
                <button className="text-gray-400 text-[1.2rem] px-1 rounded hover:bg-gray-100 hover:text-gray-600">›</button>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BlockIcon className="text-gray-500 mt-[2px]" />
              <div className="flex justify-between items-center w-full">
                <span className="text-[0.95rem] text-gray-700 leading-[1.5]">Không áp dụng hoàn vé</span>
                <button className="text-gray-400 text-[1.2rem] px-1 rounded hover:bg-gray-100 hover:text-gray-600">›</button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="mb-8">
          <h4 className="text-[1.1rem] font-semibold text-gray-800 mb-4">Tiện nghi trên chuyến bay</h4>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <RestaurantIcon className="text-gray-500 mt-[2px]" />
              <span className="text-[0.95rem] text-gray-700">Không có suất ăn trên máy bay</span>
            </div>
            <div className="flex items-start gap-3">
              <RestaurantIcon className="text-gray-500 mt-[2px]" />
              <span className="text-[0.95rem] text-gray-700">Không có giải trí trong chuyến bay</span>
            </div>
            <div className="flex items-start gap-3">
              <UsbIcon className="text-gray-500 mt-[2px]" />
              <span className="text-[0.95rem] text-gray-700">Không có nguồn & cổng USB</span>
            </div>
            <div className="flex items-start gap-3">
              <WifiIcon className="text-gray-500 mt-[2px]" />
              <span className="text-[0.95rem] text-gray-700">Không có WiFi</span>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div>
          <h4 className="text-[1.1rem] font-semibold text-gray-800 mb-4">Hóa đơn VAT</h4>
          <div className="flex items-start gap-3">
            <ReceiptIcon className="text-gray-500 mt-[2px]" />
            <div>
              <span className="block text-[0.95rem] text-gray-700 mb-1">Có thể cung cấp hóa đơn VAT</span>
              <p className="text-[0.85rem] text-gray-500 leading-[1.4] m-0">
                Với lựa chọn này, chúng tôi sẽ cung cấp hóa đơn VAT theo yêu cầu.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Link to="/booking" className="px-6 py-5 border-t border-gray-200 bg-white">
        <button className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold text-base rounded-md py-3 px-5 transition-all hover:shadow-[0_6px_20px_rgba(29,78,216,0.35)] cursor-pointer hover:-translate-y-[1px] active:translate-y-0">
          Chọn vé này
        </button>
      </Link>
    </div>
  );
};

export default TicketMoreDetail;
