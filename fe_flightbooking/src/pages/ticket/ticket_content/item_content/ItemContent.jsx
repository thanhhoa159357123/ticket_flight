import React, { useState } from "react";
import DetailContent from "./DetailContent";
import TicketOptionsPanel from "../../../../components/ticketbook/TicketOptionalsPanel";
import TicketDetail from "../../../../components/ticketbook/TicketDetail";
import TicketMoreDetail from "../../../../components/ticketbook/TicketMoreDetail";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const TABS = [
  "Chi tiết",
  "Các lợi ích đi kèm",
  "Hoàn vé",
  "Đổi lịch",
  "Khuyến mãi ✈️",
];

const ItemContent = ({ flight }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [showMoreDetail, setShowMoreDetail] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleItemClick = () => {
    if (hoveredTab) {
      setActiveTab((prev) => (prev === hoveredTab ? null : hoveredTab));
    } else {
      setActiveTab((prev) => (prev === "Chi tiết" ? null : "Chi tiết"));
    }
  };

  const handleShowMoreDetail = (ticketType, price) => {
    setSelectedTicket({ type: ticketType, price });
    setShowMoreDetail(true);
  };

  const gioDi = dayjs(flight.gio_di);
  const gioDen = dayjs(flight.gio_den);
  const diff = gioDen.diff(gioDi, "minute"); // tổng số phút

  const durationFormatted = `${Math.floor(diff / 60)}h ${diff % 60}m`;

  return (
    <>
      <div
        className="w-full rounded-[12px] shadow-[0_4px_12px_rgba(0, 0, 0, 0.1)] overflow-hidden bg-white border-[1px] border-solid border-gray-200 mx-4 my-auto transition-all duration-200 ease hover:cursor-pointer hover:border-[#3b82f6] hover:shadow-[0_6px_16px_rgba(0, 0, 0, 0.12)]"
        onClick={handleItemClick}
      >
        <div className="flex items-center px-3 py-2 bg-[#f8fafc] border-[1px] border-solid border-[#e2e8f0]">
          <span className="text-[16px] font-semibold text-[#1e293b]">
            VietJet Air
          </span>
        </div>

        <div className="flex justify-between items-center p-4 border border-[#e2e8f0] flex-wrap">
          {/* Phần trái: giờ bay + timeline */}
          <div className="flex items-center gap-4 flex-1 min-w-[250px]">
            {/* Giờ đi */}
            <div className="flex flex-col items-center w-[80px]">
              <span className="text-[20px] font-bold text-[#1e293b]">
                {flight.gio_di?.substring(11, 16) || "--:--"}
              </span>
              <span className="text-[14px] text-[#64748b] font-medium">
                {flight.ma_san_bay_di || "---"}
              </span>
            </div>

            {/* Đường + Bay thẳng */}
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1 h-px bg-gray-300"></div>
              <div className="flex flex-col items-center min-w-[90px]">
                <span className="text-xs text-gray-500">
                  {durationFormatted}
                </span>
                <div className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full mt-1 font-medium">
                  Bay thẳng
                </div>
              </div>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Giờ đến */}
            <div className="flex flex-col items-center w-[80px]">
              <span className="text-[20px] font-bold text-[#1e293b]">
                {flight.gio_den?.substring(11, 16) || "--:--"}
              </span>
              <span className="text-[14px] text-[#64748b] font-medium">
                {flight.ma_san_bay_den || "---"}
              </span>
            </div>
          </div>

          {/* Phần phải: giá tiền */}
          <div className="text-right ml-4">
            <span className="text-[18px] font-bold text-[#dc2626]">
              {Number(flight.gia).toLocaleString()} VND/Khách
            </span>
          </div>
        </div>

        {/* <div className="flex flex-wrap gap-2 px-4 py-3 bg-white border-b border-gray-200">
          <span className="text-xs px-[10px] py-1 rounded-full font-medium whitespace-nowrap bg-blue-50 text-blue-600 border border-blue-400">
            ✈ BAYMEGA66NOIDIA giảm đến 66K
          </span>
          <span className="text-xs px-[10px] py-1 rounded-full font-medium whitespace-nowrap bg-yellow-100 text-yellow-700 border border-yellow-400">
            🔥 Giá đặc biệt 6.6
          </span>
          <span className="text-xs px-[10px] py-1 rounded-full font-medium whitespace-nowrap bg-red-100 text-red-700 border border-red-400">
            📄 Có thể cung cấp hóa đơn VAT
          </span>
        </div> */}

        <div
          className="flex justify-between items-center px-2.5 py-1 border-b-[1px] border-b-solid border-[#e2e8f0] text-[14px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-[24px] py-4">
            {TABS.map((tab, index) => (
              <span
                key={index}
                className={`relative inline-block text-[14px] font-medium text-[#6b7280] cursor-pointer px-2.5
transition-colors duration-200 ease hover:text-[#2563eb]
after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:h-0.5 after:w-0 
after:bg-[#2563eb] after:transition-all after:duration-200 after:ease 
hover:after:w-full

${activeTab === tab ? "text-[#2563eb] font-semibold after:w-full" : ""} ${
                  tab !== "Chi tiết" ? "!hidden" : ""
                }`}
                onMouseEnter={() => setHoveredTab(tab)}
                onMouseLeave={() => setHoveredTab(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab((prev) => (prev === tab ? null : tab));
                }}
              >
                {tab}
              </span>
            ))}
          </div>
          <button
            className="px-5 py-2.5 bg-[#3b82f6] text-white border-none rounded-[6px] font-semibold text-[16px] cursor-pointer transition-colors duration-200 ease hover:bg-[#2563eb]"
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions(true);
            }}
          >
            Chọn
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-out transform 
    ${
      activeTab === "Chi tiết"
        ? "max-h-[1000px] opacity-100 translate-y-0"
        : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
    }
  `}
          style={{ willChange: "transform, opacity, max-height" }}
        >
          <DetailContent
            flight={flight}
            durationFormatted={durationFormatted}
          />
        </div>
      </div>

      {/* Panel chọn vé */}
      <TicketOptionsPanel
        show={showOptions}
        onClose={() => setShowOptions(false)}
        onShowDetail={() => setShowTicketDetail(true)}
        onShowMoreDetail={handleShowMoreDetail}
        flight={flight}
        durationFormatted={durationFormatted}
      />

      {/* Panel chi tiết vé */}
      <>
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/30 z-[1010] transition-all duration-200 ease
      ${
        showTicketDetail
          ? "opacity-100 visible pointer-events-auto"
          : "opacity-0 invisible pointer-events-none"
      }`}
          onClick={() => setShowTicketDetail(false)}
        />

        {/* Panel */}
        <div
          className={`
      fixed top-0 right-0 h-screen bg-white z-[1011] overflow-y-auto transition-transform duration-200 ease-in-out w-[45%] max-w-[700px]
      md:w-[45%] md:top-0 md:right-0
      max-md:w-[85%] max-md:right-[7.5%] max-md:top-[7.5vh] max-md:h-[85vh] max-md:rounded-[15px]
      ${showTicketDetail ? "translate-x-0" : "translate-x-full"}`}
        >
          <TicketDetail
            onClose={() => setShowTicketDetail(false)}
            flight={flight}
            durationFormatted={durationFormatted}
          />
        </div>
      </>

      {/* Panel tìm hiểu thêm */}
      <>
        {/* Overlay */}
        <div
          className={`
      fixed inset-0 bg-black/20 z-[1020] transition-all duration-200 ease
      ${
        showMoreDetail
          ? "opacity-100 visible pointer-events-auto"
          : "opacity-0 invisible pointer-events-none"
      }
    `}
          onClick={() => setShowMoreDetail(false)}
        />

        {/* Panel */}
        <div
          className={`
      fixed top-0 right-0 h-screen bg-white border border-white rounded-[5px] z-[1021] overflow-y-auto transition-transform duration-200 ease
      ${showMoreDetail ? "translate-x-0" : "translate-x-full"}
      w-[40%] max-w-[500px]
      max-md:w-[90%] max-md:right-[5%] max-md:top-[5vh] max-md:h-[90vh] max-md:rounded-[15px]
    `}
        >
          <TicketMoreDetail
            onClose={() => setShowMoreDetail(false)}
            ticketType={selectedTicket?.type}
            price={selectedTicket?.price}
          />
        </div>
      </>
    </>
  );
};

export default ItemContent;
