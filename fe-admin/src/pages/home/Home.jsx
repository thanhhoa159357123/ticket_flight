import React, { useState } from "react";
import { Plane, Ticket, UserPlus, DollarSign } from "lucide-react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useDashboardData } from "../../hooks/useDashboardData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
} from "recharts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// ---------- Small Components ----------
const InfoCard = ({ icon: Icon, label, value, loading }) => (
  <div className="flex items-center p-4 bg-white rounded-2xl shadow hover:shadow-lg transition">
    <div className="p-3 bg-blue-100 rounded-full mr-4">
      <Icon className="w-6 h-6 text-blue-600" />
    </div>
    <div>
      <h4 className="text-gray-500 text-sm">{label}</h4>
      {loading ? (
        <Skeleton width={60} height={20} />
      ) : (
        <p className="text-xl font-bold text-gray-800">{value}</p>
      )}
    </div>
  </div>
);

const TripCard = ({ chuyenBay }) => {
  const gioDi = chuyenBay.gio_di || chuyenBay.thoi_gian_di;
  const gioDen = chuyenBay.gio_den || chuyenBay.thoi_gian_den;

  const formatTime = (time) =>
    time
      ? new Date(time).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition transform hover:scale-[1.02] flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="font-bold text-blue-600 text-xl">
          {chuyenBay.ma_chuyen_bay}
        </span>
        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
          {chuyenBay.ma_hang_bay}
        </span>
      </div>

      {/* Tuyến bay */}
      <div className="flex items-center justify-center text-gray-900 font-medium">
        <span className="text-lg font-semibold">{chuyenBay.ma_san_bay_di}</span>
        <Plane className="mx-3 w-5 h-5 text-blue-500" />
        <span className="text-lg font-semibold">
          {chuyenBay.ma_san_bay_den}
        </span>
      </div>

      {/* Thời gian */}
      <div className="grid grid-cols-2 gap-6 text-sm text-gray-600">
        <div className="text-center">
          <p className="font-semibold text-gray-700 mb-1">Khởi hành</p>
          <p>{formatTime(gioDi)}</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-700 mb-1">Đến nơi</p>
          <p>{formatTime(gioDen)}</p>
        </div>
      </div>
    </div>
  );
};

const BookingCard = ({ booking }) => {
  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  return (
    <div className="bg-white p-4 rounded-2xl shadow hover:shadow-md transition flex flex-col gap-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="font-bold text-blue-700 text-base">
          {booking.ten_khach_hang || booking.ma_khach_hang}
        </span>
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold">
          {booking.trang_thai || "Chưa thanh toán"}
        </span>
      </div>

      {/* Thông tin vé */}
      <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-700">
        <p>
          <span className="font-medium">Mã đặt vé:</span> {booking.ma_dat_ve}
        </p>
        <p>
          <span className="font-medium">Chuyến bay:</span>{" "}
          {Array.isArray(booking.ma_chuyen_bay)
            ? booking.ma_chuyen_bay.join(", ")
            : booking.ma_chuyen_bay || "-"}
        </p>
        <p>
          <span className="font-medium">Hạng vé:</span>{" "}
          {Array.isArray(booking.ma_hang_ve)
            ? booking.ma_hang_ve.join(", ")
            : booking.ma_hang_ve || "-"}
        </p>
        <p>
          <span className="font-medium">Ngày đặt:</span>{" "}
          {formatDate(booking.ngay_dat)}
        </p>
      </div>
    </div>
  );
};
// ---------- Custom Tooltip for Chart ----------
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded-lg p-2 text-sm">
        <p className="font-semibold text-gray-700">{label}</p>
        <p className="text-blue-600">Bookings: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// ---------- Main Page ----------
const Home = () => {
  const {
    totalBookings,
    totalFlights,
    newUsers,
    totalRevenue,
    bookingsByMonth,
    upcomingTrips,
    recentBookings,
    loading,
  } = useDashboardData();

  const [search, setSearch] = useState("");

  const filteredBookings = recentBookings.filter((b) =>
    b.ten_khach_hang.toLowerCase().includes(search.toLowerCase())
  );

  const top5UpcomingTrips = upcomingTrips.slice(0, 5);

  return (
    <div className="p-6 space-y-8 bg-gray-100 min-h-screen">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <InfoCard
          icon={Ticket}
          label="Tổng vé đã đặt"
          value={totalBookings}
          loading={loading}
        />
        <InfoCard
          icon={Plane}
          label="Tổng chuyến bay"
          value={totalFlights}
          loading={loading}
        />
        <InfoCard
          icon={UserPlus}
          label="Clients"
          value={newUsers}
          loading={loading}
        />
        <InfoCard
          icon={DollarSign}
          label="Total Revenue"
          value={
            totalRevenue !== undefined && totalRevenue !== null
              ? Number(totalRevenue).toLocaleString("vi-VN") + " ₫"
              : "0 ₫"
          }
          loading={loading}
        />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Performance */}
        <div className="col-span-1 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-bold text-gray-700">Sales Performance</h2>
          <p className="text-sm text-gray-400 mb-4">Last 6 months</p>

          {loading ? (
            <div className="h-[220px] bg-gray-100 rounded-xl animate-pulse" />
          ) : bookingsByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={bookingsByMonth}>
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "transparent" }}
                />
                <Bar
                  dataKey="count"
                  fill="url(#blueGradient)"
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#2563eb" }}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">No sales data available.</p>
          )}
        </div>

        {/* Upcoming Trips */}
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            Next Coming Trips
          </h2>
          {loading ? (
            <Skeleton count={5} height={80} />
          ) : top5UpcomingTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {top5UpcomingTrips.map((trip, index) => (
                <TripCard key={index} chuyenBay={trip} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Không có chuyến bay sắp tới.</p>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="bg-white p-6 rounded-2xl shadow col-span-1">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Lịch</h2>
          <Calendar />
        </div>

        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-2xl shadow col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-700">Đặt Vé Gần Đây</h2>
            <input
              type="text"
              placeholder="Tìm khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>
          {loading ? (
            <Skeleton count={3} height={90} />
          ) : filteredBookings.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredBookings.map((booking, index) => (
                <BookingCard key={index} booking={booking} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Không có đặt vé nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
