import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaTicketAlt,
  FaSearch,
} from "react-icons/fa";

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
    className="bg-white rounded-2xl border border-blue-100 hover:shadow-lg transition-all p-5 w-full shadow-sm"
  >
    <div className="flex justify-between items-center">
      <div className="text-sm text-gray-500">Mã đặt vé</div>
      <div className="font-semibold text-blue-600">{ticket.ma_dat_ve}</div>
    </div>
    <div className="mt-3 flex justify-between items-center">
      <div>
        <div className="text-blue-700 font-medium text-sm">
          <FaPlaneDeparture className="inline mr-1 text-blue-500" />{" "}
          {ticket.ma_tuyen_bay_di}
        </div>
        <div className="text-blue-700 text-sm">
          <FaPlaneArrival className="inline mr-1 text-blue-500" />{" "}
          {ticket.ma_tuyen_bay_ve || "-"}
        </div>
      </div>
      <div className="text-right text-xs text-gray-600">
        <div>{new Date(ticket.ngay_dat).toLocaleDateString()}</div>
        <div>{ticket.loai_chuyen_di}</div>
      </div>
    </div>
    <div className="mt-4 flex justify-end items-center">
      <StatusIcon status={ticket.trang_thai} />
    </div>
  </div>
);

// Panel chi tiết
const TicketDetailPanel = ({ ticket, onClose }) => {
  if (!ticket) return null;
  return (
    <div className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-lg p-6 z-50 overflow-y-auto animate-slide-in border-l border-blue-100">
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 flex items-center gap-2 mb-4"
      >
        <FaTimes /> Đóng
      </button>
      <h2 className="text-xl font-bold text-blue-700 mb-4">
        Chi tiết vé {ticket.ma_dat_ve}
      </h2>
      <ul className="space-y-2 text-sm text-blue-900">
        <li>
          <strong>Khách hàng:</strong> {ticket.ma_khach_hang}
        </li>
        <li>
          <strong>Ngày đặt:</strong>{" "}
          {new Date(ticket.ngay_dat).toLocaleDateString()}
        </li>
        <li>
          <strong>Loại chuyến:</strong> {ticket.loai_chuyen_di}
        </li>
        <li>
          <strong>Trạng thái:</strong> {ticket.trang_thai}
        </li>
        <li>
          <strong>Chuyến đi:</strong> {ticket.ma_tuyen_bay_di} -{" "}
          {ticket.ma_hang_ve_di}
        </li>
        <li>
          <strong>Chuyến về:</strong> {ticket.ma_tuyen_bay_ve || "-"} -{" "}
          {ticket.ma_hang_ve_ve || "-"}
        </li>
      </ul>
    </div>
  );
};

// Trang danh sách vé
const TicketListPage = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/dat_ve/admin/all")
      .then((res) => {
        console.log("✅ Received data:", res.data);
        setTickets(Array.isArray(res.data) ? res.data : []);
      })
      .catch((error) => {
        console.error("❌ Error fetching tickets:", error);
        setTickets([]);
      });
  }, []);

  const filteredTickets = tickets.filter((t) =>
    t.ma_dat_ve.toLowerCase().includes(search.toLowerCase())
  );

  const total = tickets.length;
  const daThanhToan = tickets.filter(
    (t) => t.trang_thai === "Đã thanh toán"
  ).length;
  const daHuy = tickets.filter((t) => t.trang_thai === "Đã hủy").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-8 drop-shadow">
          Lịch sử đặt vé
        </h1>

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
