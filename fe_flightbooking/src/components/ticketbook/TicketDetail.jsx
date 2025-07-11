import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import DetailContent from "../../pages/ticket/ticket_content/item_content/DetailContent";

const TicketDetail = ({ show, onClose, flight, durationFormatted }) => {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/20 z-[1020] transition-all duration-200 ease
      ${
        show
          ? "opacity-100 visible pointer-events-auto"
          : "opacity-0 invisible pointer-events-none"
      }`}
      />
      <div
        className={`
      fixed top-0 right-0 h-screen bg-white z-[1021] overflow-y-auto transition-transform duration-200 ease-in-out w-[45%] max-w-[700px]
      md:w-[45%] md:top-0 md:right-0
      max-md:w-[85%] max-md:right-[7.5%] max-md:top-[7.5vh] max-md:h-[85vh] max-md:rounded-[15px]
      ${show ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center px-6 py-[13px] bg-gradient-to-br from-blue-700 to-blue-500 text-white sticky top-0 z-10">
          <CloseIcon
            onClick={onClose}
            className="mr-5 cursor-pointer transition-all duration-200 ease-in-out text-white/90 bg-white/15 rounded-full p-2 flex items-center justify-center hover:rotate-90 hover:bg-white/25 hover:text-white"
          />
          <h3 className="text-xl font-semibold tracking-tight">
            Tóm tắt chuyến đi
          </h3>
        </div>

        {/* Route Info */}
        <div className="bg-[#f8f9fa] px-6 py-3 border-b border-[#f0f0f0]">
          <div className="text-blue-700 text-[1.1rem] font-semibold">
            TP HCM (SGN) → Hà Nội (HAN)
          </div>
          <p className="mt-2 mb-1 text-sm text-gray-600">CN, 15 tháng 6 2025</p>

          {/* Tab Header */}
          <div className="flex gap-4 mt-4 border-b border-gray-200 pb-2">
            <span className="py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600 cursor-pointer">
              Chi tiết
            </span>
            {/* Thêm tab khác nếu cần */}
          </div>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto">
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
