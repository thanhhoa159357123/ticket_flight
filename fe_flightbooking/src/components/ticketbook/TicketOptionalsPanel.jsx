import React, { useRef, useState, useEffect } from "react";
import TicketDetail from "./TicketDetail";
import CloseIcon from "@mui/icons-material/Close";
import LuggageIcon from "@mui/icons-material/Luggage";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BlockIcon from "@mui/icons-material/Block";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";

const TicketOptionsPanel = ({
  onClose,
  onShowDetail,
  onShowMoreDetail,
  show,
}) => {
  const optionListRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (optionListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = optionListRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (optionListRef.current) {
      optionListRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (optionListRef.current) {
      optionListRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const currentRef = optionListRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScroll);
      checkScroll();
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed top-0 left-0 w-full h-screen bg-black/60 z-[1000] transition-all duration-300 ease-out ${
          show ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 right-0 w-full max-w-[1200px] h-screen bg-white z-[1001] flex flex-col transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
          show ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center p-6 bg-gradient-to-br from-blue-700 to-blue-500 text-white sticky top-0 z-10">
          <CloseIcon
            onClick={onClose}
            className="mr-5 cursor-pointer p-2 rounded-full bg-white/15 text-white/90 transition-all duration-200 ease-in-out hover:rotate-90 hover:bg-white/25 hover:text-white flex items-center justify-center"
          />
          <h2 className="m-0 text-[1.5rem] font-semibold tracking-[-0.3px]">
            Chuyến đi của bạn
          </h2>
        </div>

        <div className="p-[24px] bg-[#f8fafc] border-b-[1px] border-b-solid border-b-[#e5e7eb]">
          <div className="flex flex-col gap-3 p-4 bg-[#f8fafc] rounded-[10px] border-[1px] border-solid border-[#e5e7eb]">
            <div className="flex items-center flex-wrap gap-5">
              <h3 className="inline-flex items-center bg-green-500 text-white px-[14px] py-[6px] rounded text-sm font-semibold uppercase whitespace-nowrap m-0">
                Khởi hành
              </h3>
              <span className="text-[1.2rem] font-bold text-gray-900 whitespace-nowrap">
                TP HCM – Hà Nội
              </span>
              <p className="text-gray-500 font-medium flex items-center gap-2 m-0 whitespace-nowrap">
                Sun, 15 Jun 2025
              </p>
            </div>

            <span className="text-[1.1rem] font-bold text-[#1d4ed8]">
              VietJet Air
            </span>
            <div className="relative flex items-center justify-between gap-4 py-3">
              {/* Đường kẻ ngang dưới background */}
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[linear-gradient(90deg,_transparent_0%,_#999a9b_75%,_transparent_100%)] z-[1]" />

              {/* Giờ đi */}
              <div className="z-[2] flex flex-col items-center bg-[#f8fafc] px-3 text-center">
                <strong className="text-[1.3rem] font-bold text-gray-900">
                  20:00
                </strong>
                <span className="text-sm text-gray-500 mt-1">SGN</span>
              </div>

              {/* Thời lượng + thông tin chuyến bay */}
              <div className="z-[2] bg-[#f8fafc] px-4 text-center flex flex-col items-center">
                <span className="text-gray-600 font-medium">2h 10m</span>
                <span className="bg-blue-700 text-white text-xs px-[10px] py-[4px] rounded-full mt-1 inline-block">
                  Bay thẳng
                </span>
              </div>

              {/* Giờ đến */}
              <div className="z-[2] flex flex-col items-center bg-[#f8fafc] px-3 text-center">
                <strong className="text-[1.3rem] font-bold text-gray-900">
                  22:10
                </strong>
                <span className="text-sm text-gray-500 mt-1">HAN</span>
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowDetail();
                }}
                className="inline-flex items-center gap-2 px-4 py-[10px] rounded-lg bg-blue-100 text-blue-700 font-semibold text-[0.95rem] shadow-[0_2px_6px_rgba(29,78,216,0.1)] cursor-pointer transition-all duration-300 hover:bg-blue-200 hover:shadow-[0_4px_10px_rgba(29,78,216,0.15)] active:translate-y-0 group"
              >
                Chi tiết
                <span className="transition-transform duration-200 group-hover:translate-x-[5px] font-bold">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center px-[20px] py-[24px] bg-white sticky top-0 z-[5] shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <span className="text-[1.1rem] font-semibold text-[#111827]">
            Chọn loại vé của bạn
          </span>
          <div className="flex gap-3">
            <button
              onClick={scrollLeft}
              disabled={!showLeftArrow}
              aria-label="Scroll left"
              className={`w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-[0_2px_6px_rgba(0,0,0,0.05)] transition-all duration-200
      ${
        showLeftArrow
          ? "hover:bg-gray-100 hover:border-gray-300 hover:text-blue-700 hover:scale-105"
          : "opacity-50 cursor-not-allowed"
      }`}
            >
              <ArrowBackIcon />
            </button>

            <button
              onClick={scrollRight}
              disabled={!showRightArrow}
              aria-label="Scroll right"
              className={`w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-[0_2px_6px_rgba(0,0,0,0.05)] transition-all duration-200
      ${
        showRightArrow
          ? "hover:bg-gray-100 hover:border-gray-300 hover:text-blue-700 hover:scale-105"
          : "opacity-50 cursor-not-allowed"
      }`}
            >
              <ArrowForwardIcon />
            </button>
          </div>
        </div>

        <div
          className="flex gap-6 px-6 py-4 overflow-x-auto scroll-smooth scroll-snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          ref={optionListRef}
        >
          {/* Option 1 - Nguyên bản */}
          <div className="scroll-snap-start min-w-[340px] border-[1px] border-solid border-[#e5e7eb] rounded-[16px] p-6 bg-white shadow-[0_6px_18px_rgba(0,0,0,0.04)] transition-all duration-300 ease flex flex-col">
            <div className="mb-5 pb-4 text-[15px] flex items-center justify-between border-b-[1px] border-b-dashed border-b-[#e5e7eb]">
              <h3 className="m-0 text-[#1d4ed8] font-bold tracking-tight leading-[1.4]">
                Nguyên bản
              </h3>
              <span className="flex flex-col items-end font-bold text-[#f97316]">
                1.200.000 VND/khách
              </span>
            </div>
            <ul className="flex-1 mb-6 pr-2 overflow-y-auto">
              <li className="flex items-start py-3">
                <LuggageIcon className="text-blue-700 text-[1.2rem] min-w-[24px] text-center mt-[2px] mr-[14px]" />
                <span className="text-[0.97rem] text-gray-700 leading-[1.5]">
                  Hành lý xách tay 7 kg
                </span>
              </li>
              <li className="flex items-start py-3">
                <LuggageIcon className="text-blue-700 text-[1.2rem] min-w-[24px] text-center mt-[2px] mr-[14px]" />
                <span className="text-[0.97rem] text-gray-700 leading-[1.5]">
                  Hành lý ký gửi 0 kg
                </span>
              </li>
              <li className="flex items-start py-3">
                <SwapHorizIcon className="text-blue-700 text-[1.2rem] min-w-[24px] text-center mt-[2px] mr-[14px]" />
                <span className="text-[0.97rem] text-gray-700 leading-[1.5]">
                  Phí đổi lịch bay 378.000 VND
                </span>
              </li>
              <li className="flex items-start py-3">
                <BlockIcon className="text-blue-700 text-[1.2rem] min-w-[24px] text-center mt-[2px] mr-[14px]" />
                <span className="text-[0.97rem] text-gray-700 leading-[1.5]">
                  Không hoàn vé
                </span>
              </li>
              <li className="flex items-start py-3 border-0">
                <ReceiptIcon className="text-blue-700 text-[1.2rem] min-w-[24px] text-center mt-[2px] mr-[14px]" />
                <span className="text-[0.97rem] text-gray-700 leading-[1.5]">
                  Có hóa đơn VAT
                </span>
              </li>
            </ul>

            <div>
              <button
                className="w-full bg-[rgba(29, 78, 216, 0.05)] text-[#1d4ed8] border-none rounded-[8px] p-3.5 font-medium mb-3 transition-all duration-200 text-[0.95rem] hover:bg-[rgba(29, 78, 216, 0.1)] cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onShowMoreDetail &&
                    onShowMoreDetail("Nguyên bản", "1.200.000 VND");
                }}
              >
                Tìm hiểu thêm
              </button>
              <Link
                to="/booking"
                className="relative block w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-[8px] p-4 text-[1.05rem] font-semibold text-center no-underline shadow-[0_4px_14px_rgba(29,78,216,0.25)] transition-all duration-300 ease overflow-hidden cursor-pointer hover:shadow-[0_6px_20px_rgba(29,78,216,0.35)] after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(to_right,rgba(255,255,255,0.1),rgba(255,255,255,0))] after:pointer-events-none after:z-0 z-[1]"
              >
                <span className="relative z-[1]">Chọn</span>
              </Link>
            </div>
          </div>

          {/* Option 2 - Economy Deluxe */}
          <div className="scroll-snap-start min-w-[340px] border-[1px] border-solid border-[#e5e7eb] rounded-[16px] p-6 bg-white shadow-[0_6px_18px_rgba(0,0,0,0.04)] transition-all duration-300 ease flex flex-col">
            <div className="mb-5 pb-4 text-[15px] flex items-center justify-between border-b-[1px] border-b-dashed border-b-[#e5e7eb]">
              <h3 className="m-0 text-[#1d4ed8] font-bold tracking-tight leading-[1.4]">
                Economy Deluxe
              </h3>
              <span className="flex flex-col items-end font-bold text-[#f97316]">
                3.200.000 VND/khách
              </span>
            </div>
            <ul className="flex-1 mb-6 pr-2 overflow-y-auto">
              <li className="flex items-start py-3">
                <LuggageIcon className="text-blue-700 text-[1.2rem] min-w-[24px] text-center mt-[2px] mr-[14px]" />
                <span className="text-[0.97rem] text-gray-700 leading-[1.5]">
                  Hành lý xách tay 7 kg
                </span>
              </li>
              <li className="flex items-start py-3">
                <LuggageIcon className="text-blue-700 text-[1.2rem] min-w-[24px] text-center mt-[2px] mr-[14px]" />
                <span className="text-[0.97rem] text-gray-700 leading-[1.5]">
                  Hành lý ký gửi 0 kg
                </span>
              </li>
              <li className="flex items-start py-3">
                <SwapHorizIcon className="text-blue-700 text-[1.2rem] min-w-[24px] text-center mt-[2px] mr-[14px]" />
                <span className="text-[0.97rem] text-gray-700 leading-[1.5]">
                  Đổi lịch miễn phí
                </span>
              </li>
              <li className="flex items-start py-3">
                <BlockIcon className="text-blue-700 text-[1.2rem] min-w-[24px] text-center mt-[2px] mr-[14px]" />
                <span className="text-[0.97rem] text-gray-700 leading-[1.5]">
                  Không hoàn vé
                </span>
              </li>
              <li className="flex items-start py-3 border-0">
                <ReceiptIcon className="text-blue-700 text-[1.2rem] min-w-[24px] text-center mt-[2px] mr-[14px]" />
                <span className="text-[0.97rem] text-gray-700 leading-[1.5]">
                  Có hóa đơn VAT
                </span>
              </li>
            </ul>
            <div>
              <button
                className="w-full bg-[rgba(29, 78, 216, 0.05)] text-[#1d4ed8] border-none rounded-[8px] p-3.5 font-medium mb-3 transition-all duration-200 text-[0.95rem] hover:bg-[rgba(29, 78, 216, 0.1)] cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onShowMoreDetail &&
                    onShowMoreDetail("Economy Deluxe", "3.200.000 VND");
                }}
              >
                Tìm hiểu thêm
              </button>
              <Link
                to="/booking"
                className="relative block w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-[8px] p-4 text-[1.05rem] font-semibold text-center no-underline shadow-[0_4px_14px_rgba(29,78,216,0.25)] transition-all duration-300 ease overflow-hidden cursor-pointer hover:shadow-[0_6px_20px_rgba(29,78,216,0.35)] after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(to_right,rgba(255,255,255,0.1),rgba(255,255,255,0))] after:pointer-events-none after:z-0 z-[1]"
              >
                <span className="relative z-[1]">Chọn</span>
              </Link>
            </div>
          </div>

          {/* Option 3 - Premium Economy */}
          <div className="scroll-snap-start min-w-[340px] border-[1px] border-solid border-[#e5e7eb] rounded-[16px] p-6 bg-white shadow-[0_6px_18px_rgba(0,0,0,0.04)] transition-all duration-300 ease flex flex-col">
            <div className="mb-5 pb-4 text-[15px] flex items-center justify-between border-b-[1px] border-b-dashed border-b-[#e5e7eb]">
              <h3 className="m-0 text-[#1d4ed8] font-bold tracking-tight leading-[1.4]">
                Premium Economy
              </h3>
              <span className="flex flex-col items-end font-bold text-[#f97316]">
                3.500.000 VND/khách
              </span>
            </div>
            <ul className="flex-1 mb-6 pr-2 overflow-y-auto">
              <li className="flex items-start py-3">
                <LuggageIcon className="text-blue-700 text-[1.2rem] min-w-[24px] text-center mt-[2px] mr-[14px]" />
                <span className="text-[0.97rem] text-gray-700 leading-[1.5]">
                  Hành lý xách tay 10 kg
                </span>
              </li>
              <li className="flex items-start py-3">
                <LuggageIcon className="text-blue-700 text-[1.2rem] min-w-[24px] text-center mt-[2px] mr-[14px]" />
                <span className="text-[0.97rem] text-gray-700 leading-[1.5]">
                  Hành lý ký gửi 30 kg
                </span>
              </li>
              <li className="flex items-start py-3">
                <SwapHorizIcon className="text-blue-700 text-[1.2rem] min-w-[24px] text-center mt-[2px] mr-[14px]" />
                <span className="text-[0.97rem] text-gray-700 leading-[1.5]">
                  Đổi lịch miễn phí
                </span>
              </li>
              <li className="flex items-start py-3">
                <BlockIcon className="text-blue-700 text-[1.2rem] min-w-[24px] text-center mt-[2px] mr-[14px]" />
                <span className="text-[0.97rem] text-gray-700 leading-[1.5]">
                  Không hoàn vé
                </span>
              </li>
              <li className="flex items-start py-3 border-0">
                <ReceiptIcon className="text-blue-700 text-[1.2rem] min-w-[24px] text-center mt-[2px] mr-[14px]" />
                <span className="text-[0.97rem] text-gray-700 leading-[1.5]">
                  Có hóa đơn VAT
                </span>
              </li>
            </ul>
            <div>
              <button
                className="w-full bg-[rgba(29, 78, 216, 0.05)] text-[#1d4ed8] border-none rounded-[8px] p-3.5 font-medium mb-3 transition-all duration-200 text-[0.95rem] hover:bg-[rgba(29, 78, 216, 0.1)] cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onShowMoreDetail &&
                    onShowMoreDetail("Premium Economy", "3.500.000 VND");
                }}
              >
                Tìm hiểu thêm
              </button>
              <Link
                to="/booking"
                className="relative block w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-[8px] p-4 text-[1.05rem] font-semibold text-center no-underline shadow-[0_4px_14px_rgba(29,78,216,0.25)] transition-all duration-300 ease overflow-hidden cursor-pointer hover:shadow-[0_6px_20px_rgba(29,78,216,0.35)] after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(to_right,rgba(255,255,255,0.1),rgba(255,255,255,0))] after:pointer-events-none after:z-0 z-[1]"
              >
                <span className="relative z-[1]">Chọn</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketOptionsPanel;
