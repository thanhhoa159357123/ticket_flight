import React, { useEffect, useRef } from "react";
import {
  XMarkIcon,
  TicketIcon,
  CalendarIcon,
  CreditCardIcon,
  TrashIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import FlightInfoCard from "./FlightInfoCard";
import PassengerList from "./PassengerList";
import { useTicketActions } from "../../hooks/useTicketActions";
import { getStatusBadge, formatVietnameseDate } from "../../utils/ticketUtils";

const Detail_History_Ticket = ({ ticket, onClose, show }) => {
  const drawerRef = useRef(null);
  const { handleCancelBooking, handlePayment, handleRefundTicket, loading } =
    useTicketActions(onClose);

  // Auto focus and handle ESC key
  useEffect(() => {
    if (show && drawerRef.current) {
      drawerRef.current.focus();
    }

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (show) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [show, onClose]);

  const isRoundTrip = ticket.loai_chuyen_di === "Khứ hồi";
  console.log("Ticket Details:", ticket);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-[1000] transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[1001] 
          transition-transform duration-300 ease-out focus:outline-none ${
            show ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <div className="flex items-center space-x-2">
            <TicketIcon className="h-5 w-5" />
            <div>
              <h2 className="text-lg font-bold">Chi tiết đặt vé</h2>
              <p className="text-blue-100 text-xs">
                {ticket.loai_chuyen_di || "Một chiều"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-140px)] overflow-y-auto p-4">
          {/* Ticket Info */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Mã đặt vé</p>
              <p className="font-semibold text-sm">{ticket.ma_dat_ve}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                  ticket.trang_thai
                )}`}
              >
                {ticket.trang_thai || "N/A"}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="text-xs text-gray-500 mb-1">Ngày đặt</p>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
              <p className="font-medium text-sm">
                {formatVietnameseDate(ticket.ngay_dat)}
              </p>
            </div>
          </div>

          {/* Flight Information */}
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-3 text-gray-800">
              Thông tin chuyến bay
            </h3>

            <FlightInfoCard
              departure={ticket?.chi_tiet_ve_dat?.[0]?.ten_san_bay_di || "N/A"}
              arrival={ticket?.chi_tiet_ve_dat?.[0]?.ten_san_bay_den || "N/A"}
              departureTime={ticket?.chi_tiet_ve_dat?.[0]?.thoi_gian_di}
              arrivalTime={ticket?.chi_tiet_ve_dat?.[0]?.thoi_gian_den}
              title="Chuyến đi"
              bgColor="bg-blue-50"
            />

            {isRoundTrip && (
              <FlightInfoCard
                departure={
                  ticket?.chi_tiet_ve_dat?.[1]?.ten_san_bay_di || "N/A"
                }
                arrival={ticket?.chi_tiet_ve_dat?.[1]?.ten_san_bay_den || "N/A"}
                departureTime={ticket?.chi_tiet_ve_dat?.[1]?.thoi_gian_di}
                arrivalTime={ticket?.chi_tiet_ve_dat?.[1]?.thoi_gian_den}
                title="Chuyến về"
                bgColor="bg-orange-50"
              />
            )}
          </div>

          {/* Seat Class */}
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-3 text-gray-800">
              Hạng vé
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                <span className="text-gray-600 text-sm">Chuyến đi:</span>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {ticket?.chi_tiet_ve_dat?.[0]?.ten_hang_ve || "N/A"}
                </span>
              </div>

              {isRoundTrip && (
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                  <span className="text-gray-600 text-sm">Chuyến về:</span>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                    {ticket?.chi_tiet_ve_dat?.[1]?.ten_hang_ve || "N/A"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Passengers */}
          <PassengerList
            passengers={Array.from(
              new Map(
                (
                  ticket.chi_tiet_ve_dat?.flatMap(
                    (v) => v.danh_sach_hanh_khach
                  ) || []
                ).map((hk) => [hk.ma_hanh_khach, hk])
              ).values()
            )}
          />
        </div>

        {/* Footer Actions - ✅ Updated with new status handling */}
        {["Chờ thanh toán", "Đã thanh toán", "Chờ duyệt hoàn vé"].includes(
          ticket.trang_thai
        ) && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
            <div className="flex space-x-2">
              {/* Chờ thanh toán */}
              {ticket.trang_thai === "Chờ thanh toán" && (
                <>
                  <button
                    onClick={() => handleCancelBooking(ticket)}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Hủy vé</span>
                  </button>
                  <button
                    onClick={() => handlePayment(ticket)}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                  >
                    <CreditCardIcon className="h-4 w-4" />
                    <span>Thanh toán</span>
                  </button>
                </>
              )}

              {/* Đã thanh toán */}
              {ticket.trang_thai === "Đã thanh toán" && (
                <>
                  <button
                    onClick={() => handleRefundTicket(ticket)}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors text-sm disabled:opacity-50"
                  >
                    <TicketIcon className="h-4 w-4" />
                    <span>{loading ? "Đang xử lý..." : "Yêu cầu hoàn vé"}</span>
                  </button>
                  <button
                    onClick={() =>
                      alert("🚧 Tính năng đổi chuyến bay đang phát triển")
                    }
                    disabled={loading}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors text-sm disabled:opacity-50"
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                    <span>Đổi chuyến</span>
                  </button>
                </>
              )}

              {/* Chờ duyệt hoàn vé */}
              {ticket.trang_thai === "Chờ duyệt hoàn vé" && (
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-700 text-sm font-medium">
                    ⏳ Yêu cầu hoàn vé đang được xử lý
                  </p>
                  <p className="text-blue-600 text-xs mt-1">
                    Thời gian xử lý: 24-48 giờ làm việc
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Detail_History_Ticket;
