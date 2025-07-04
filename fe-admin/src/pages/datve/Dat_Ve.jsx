import React, { useState } from "react";
import { FaPlaneDeparture, FaPlaneArrival, FaTimes, FaCheckCircle, FaTimesCircle, FaTicketAlt } from "react-icons/fa";

const flightTickets = [
  {
    id: "FT001",
    flightNumber: "VN123",
    price: 2200000,
    departure: "Hà Nội",
    destination: "TP.HCM",
    date: "2025-07-10",
    time: "08:00",
    status: "available",
    
  },
  {
    id: "FT002",
    flightNumber: "VJ456",
    price: 1800000,
    departure: "TP.HCM",
    destination: "Đà Nẵng",
    date: "2025-07-12",
    time: "15:30",
    status: "booked",
  },
  // ... thêm vé khác
];

const StatusIcon = ({ status }) => {
  switch (status) {
    case "available":
      return <span className="flex items-center gap-1 text-green-600 font-semibold"><FaCheckCircle /> Còn vé</span>;
    case "booked":
      return <span className="flex items-center gap-1 text-yellow-600 font-semibold"><FaTicketAlt /> Đã đặt</span>;
    case "cancelled":
      return <span className="flex items-center gap-1 text-red-600 font-semibold"><FaTimesCircle /> Đã hủy</span>;
    default:
      return null;
  }
};

const TicketCard = ({ ticket, onSelect }) => (
  <div
    onClick={() => onSelect(ticket)}
    className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-xl transition flex flex-col md:flex-row items-center gap-6 w-full"
  >
    {/* Icon chuyến bay */}
    <div className="flex flex-col items-center min-w-[60px]">
      <FaPlaneDeparture className="text-blue-500 text-3xl mb-2" />
      <span className="font-bold text-blue-700">{ticket.flightNumber}</span>
    </div>
    {/* Thông tin chuyến bay */}
    <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 w-full">
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-gray-700">
            <FaPlaneDeparture /> <span>{ticket.departure}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <FaPlaneArrival /> <span>{ticket.destination}</span>
          </div>
        </div>
        <div className="text-gray-600 text-sm">
          <div><span className="font-medium">Ngày:</span> {ticket.date}</div>
          <div><span className="font-medium">Giờ:</span> {ticket.time}</div>
        </div>
      </div>
      {/* Giá và trạng thái */}
      <div className="flex flex-col items-end gap-2 min-w-[120px]">
        <div className="text-xl font-bold text-blue-800">{ticket.price.toLocaleString()}₫</div>
        <StatusIcon status={ticket.status} />
      </div>
    </div>
  </div>
);

const TicketDetailPanel = ({ ticket, onClose }) => {
  if (!ticket) return null;
  return (
    <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-xl p-6 overflow-auto z-50 animate-slide-in">
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-2"
      >
        <FaTimes /> Đóng
      </button>
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Chi tiết vé {ticket.id}</h2>
      <p><strong>Chuyến bay:</strong> {ticket.flightNumber}</p>
      <p><strong>Nơi đi:</strong> {ticket.departure}</p>
      <p><strong>Nơi đến:</strong> {ticket.destination}</p>
      <p><strong>Ngày:</strong> {ticket.date}</p>
      <p><strong>Giờ:</strong> {ticket.time}</p>
      <p><strong>Giá vé:</strong> {ticket.price.toLocaleString()}₫</p>
      <p><strong>Trạng thái:</strong> {ticket.status}</p>
    </div>
  );
};

const TicketListPage = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-8">Danh sách vé máy bay</h1>
      <div className="flex flex-col gap-6">
        {flightTickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} onSelect={setSelectedTicket} />
        ))}
      </div>
      {/* Panel chi tiết vé */}
      {selectedTicket && (
        <TicketDetailPanel ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
      {/* Overlay khi panel mở */}
      {selectedTicket && (
        <div
          onClick={() => setSelectedTicket(null)}
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
        />
      )}
    </div>
  );
};

export default TicketListPage;
