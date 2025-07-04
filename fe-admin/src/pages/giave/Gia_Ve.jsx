import React, { useState } from "react";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaCheckCircle,
  FaTimesCircle,
  FaTicketAlt,
  FaSearch,
} from "react-icons/fa";

// Dữ liệu vé máy bay mẫu
const flightTickets = [
  {
    id: "FT001",
    flightNumber: "VN123",
    price: 2200000,
    departure: "Hà Nội",
    destination: "TP.HCM",
    date: "2025-07-10",
    time: "08:00",
    status: "available", // available, booked, cancelled
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
  {
    id: "FT003",
    flightNumber: "QH789",
    price: 2100000,
    departure: "Đà Nẵng",
    destination: "Hà Nội",
    date: "2025-07-15",
    time: "19:45",
    status: "cancelled",
  },
  {
    id: "FT004",
    flightNumber: "VN456",
    price: 2500000,
    departure: "Hà Nội",
    destination: "Nha Trang",
    date: "2025-07-20",
    time: "10:00",
    status: "available",
  },
  {
    id: "FT005",
    flightNumber: "VJ789",
    price: 2000000,
    departure: "TP.HCM",
    destination: "Phú Quốc",
    date: "2025-07-22",
    time: "12:30",
    status: "booked",
  },
];

// Hàm render trạng thái vé
const renderStatus = (status) => {
  switch (status) {
    case "available":
      return (
        <span className="flex items-center gap-1 text-green-600 font-semibold">
          <FaCheckCircle /> Còn vé
        </span>
      );
    case "booked":
      return (
        <span className="flex items-center gap-1 text-yellow-600 font-semibold">
          <FaTicketAlt /> Đã hết
        </span>
      );
    case "cancelled":
      return (
        <span className="flex items-center gap-1 text-red-600 font-semibold">
          <FaTimesCircle /> Đã hủy
        </span>
      );
    default:
      return null;
  }
};

const Gia_Ve = () => {
  const [search, setSearch] = useState("");

  const filteredTickets = flightTickets.filter(
    (t) =>
      t.flightNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.departure.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase()) ||
      t.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">Danh sách vé máy bay</h1>
      <p className="mb-6 text-gray-600">
        Tra cứu, so sánh và đặt vé cho các chuyến bay sắp tới.
      </p>
      {/* Thanh tìm kiếm */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm chuyến bay, nơi đi, nơi đến, trạng thái..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 w-full pl-10"
          />
          <FaSearch className="absolute left-3 top-2.5 text-blue-400" />
        </div>
      </div>
      {/* Bảng danh sách vé */}
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="min-w-full bg-white rounded-xl divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-100 to-cyan-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                Mã vé
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                Chuyến bay
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                Nơi đi
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                Nơi đến
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                Ngày
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                Giờ
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                Giá vé
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold text-blue-700 uppercase">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((t) => (
              <tr key={t.id} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-blue-800">{t.id}</td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <FaPlaneDeparture className="text-blue-500" />
                  {t.flightNumber}
                </td>
                <td className="px-6 py-4">{t.departure}</td>
                <td className="px-6 py-4">{t.destination}</td>
                <td className="px-6 py-4">{t.date}</td>
                <td className="px-6 py-4">{t.time}</td>
                <td className="px-6 py-4 text-blue-700 font-bold">
                  {t.price.toLocaleString()}₫
                </td>
                <td className="px-6 py-4 text-center">{renderStatus(t.status)}</td>
              </tr>
            ))}
            {filteredTickets.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-400">
                  Không tìm thấy vé phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Gia_Ve;
