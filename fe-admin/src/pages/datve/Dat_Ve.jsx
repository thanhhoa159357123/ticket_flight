import React from "react";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaTicketAlt,
  FaSearch,
} from "react-icons/fa";
import useTickets from "../../hooks/useTicket";

// Hiển thị trạng thái vé
const StatusIcon = ({ status }) => {
  switch (status) {
    case "Đã thanh toán":
      return (
        <span className="flex items-center gap-1 text-green-600 font-semibold">
          <FaCheckCircle /> Đã thanh toán
        </span>
      );
    case "Đã hủy":
      return (
        <span className="flex items-center gap-1 text-red-600 font-semibold">
          <FaTimesCircle /> Đã hủy
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1 text-yellow-600 font-semibold">
          <FaTicketAlt /> Đang xử lý
        </span>
      );
  }
};

// Thẻ hiển thị vé
const TicketCard = ({ ticket, onSelect }) => (
  <div
    onClick={() => onSelect(ticket)}
    className="bg-white rounded-2xl border border-blue-100 hover:shadow-lg transition-all p-5 w-full shadow-sm cursor-pointer"
  >
    <div className="flex justify-between items-center border-b pb-3 mb-3">
      <div className="flex items-center gap-2 text-blue-600 font-bold">
        <FaTicketAlt /> <span>{ticket.ma_dat_ve}</span>
      </div>
      <span className="text-base font-medium text-gray-900">
        {new Date(ticket.ngay_dat).toLocaleDateString()}
      </span>
    </div>

    <div className="flex justify-between items-center">
      <div className="text-sm text-gray-600 space-y-1">
        <div className="flex items-center gap-2">
          <FaPlaneDeparture className="text-blue-500" />
          <span>{ticket.loai_chuyen_di}</span>
        </div>
        {ticket.ma_chuyen_bay && (
          <div className="flex items-center gap-2">
            <FaPlaneArrival className="text-green-500" />
            <span>Chuyến: {ticket.ma_chuyen_bay}</span>
          </div>
        )}
      </div>
      <StatusIcon status={ticket.trang_thai} />
    </div>
  </div>
);

// Panel chi tiết
const TicketDetailPanel = ({ ticket, onClose }) => {
  if (!ticket) return null;
  return (
    <div className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-white shadow-2xl z-50 flex flex-col border-l border-blue-100 animate-slide-in">
      <div className="flex justify-between items-center p-6 border-b bg-blue-50">
        <h2 className="text-2xl font-bold text-blue-700">
          Vé #{ticket.ma_dat_ve}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Thông tin khách hàng
          </h3>
          <div className="bg-gray-50 p-4 rounded-xl space-y-1">
            <p>
              <span className="font-medium">Mã KH:</span> {ticket.ma_khach_hang}
            </p>
            <p>
              <span className="font-medium">Ngày đặt:</span>{" "}
              {new Date(ticket.ngay_dat).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Loại chuyến:</span>{" "}
              {ticket.loai_chuyen_di}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Thông tin chuyến bay
          </h3>
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <FaPlaneDeparture className="text-blue-600" />
              <span className="font-medium">Mã chuyến bay:</span>{" "}
              {ticket.ma_chuyen_bay}
            </div>
            {ticket.san_bay_di && ticket.san_bay_den && (
              <div className="flex items-center gap-2">
                <FaPlaneDeparture className="text-green-600" />
                <span>{ticket.san_bay_di}</span>
                <span className="mx-2">→</span>
                <FaPlaneArrival className="text-red-600" />
                <span>{ticket.san_bay_den}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Thanh toán
          </h3>
          <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
            <StatusIcon status={ticket.trang_thai} />
            {ticket.tong_tien && (
              <div className="text-xl font-bold text-blue-700">
                {ticket.tong_tien.toLocaleString("vi-VN")} ₫
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Trang danh sách vé
const TicketListPage = () => {
  const {
    selectedTicket,
    setSelectedTicket,
    search,
    setSearch,
    filteredTickets,
    total,
    daThanhToan,
    daHuy,
  } = useTickets();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-8 drop-shadow">
          Lịch sử đặt vé
        </h1>

        {/* Search + Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo mã đặt vé..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-blue-200 rounded-xl w-full focus:ring-2 focus:ring-blue-400 outline-none bg-white"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
            <div className="bg-white rounded-xl p-4 border border-blue-100 shadow text-center">
              <div className="text-sm text-gray-500">Tổng vé</div>
              <div className="text-lg font-bold text-blue-700">{total}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-blue-100 shadow text-center">
              <div className="text-sm text-gray-500">Đã thanh toán</div>
              <div className="text-lg font-bold text-green-600">
                {daThanhToan}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-blue-100 shadow text-center">
              <div className="text-sm text-gray-500">Đã hủy</div>
              <div className="text-lg font-bold text-red-600">{daHuy}</div>
            </div>
          </div>
        </div>

        {/* Danh sách vé */}
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.ma_dat_ve}
              ticket={ticket}
              onSelect={setSelectedTicket}
            />
          ))}
        </div>
      </div>

      {selectedTicket && (
        <>
          <TicketDetailPanel
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
          />
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setSelectedTicket(null)}
          />
        </>
      )}
    </div>
  );
};

export default TicketListPage;
