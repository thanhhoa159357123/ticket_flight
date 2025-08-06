import React from "react";
import { Plane, Ticket, UserPlus, DollarSign } from "lucide-react"; // Thêm DollarSign
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useDashboardData } from "../../hooks/useDashboardData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center p-4 bg-white rounded-2xl shadow hover:shadow-lg transition">
    <div className="p-3 bg-blue-100 rounded-full mr-4">
      <Icon className="w-6 h-6 text-blue-600" />
    </div>
    <div>
      <h4 className="text-gray-500 text-sm">{label}</h4>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);


const TripCard = ({ chuyenBay }) => (
  <div className="bg-white p-4 rounded-2xl shadow text-sm">
    <div className="flex justify-between items-center">
      <span className="font-semibold text-blue-600">{chuyenBay.ma_chuyen_bay}</span>
      <span className="text-blue-700 text-base font-semibold">
        {chuyenBay.gio_di
          ? new Date(chuyenBay.gio_di).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : ""}
      </span>
    </div>
    <div className="mt-2 text-gray-600">
      {chuyenBay.san_bay_di} → {chuyenBay.san_bay_den}
    </div>
  </div>
);

const BookingCard = ({ booking }) => (
  <div className="bg-white p-4 rounded-2xl shadow text-sm flex flex-col gap-2">
    <div className="font-bold text-blue-700 text-base">{booking.ten_khach_hang}</div>
    <div className="font-semibold text-gray-500">{booking.ma_ve}</div>
    <div className="text-black text-lg font-semibold">
      {booking.ngay_dat
        ? new Date(booking.ngay_dat).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : ""}
    </div>
  </div>
);

const Home = () => {
  const {
    totalBookings,
    totalFlights,
    newUsers,
    totalRevenue, // Thêm biến này từ hook nếu đã có
    bookingsByMonth,
    upcomingTrips,
    recentBookings,
  } = useDashboardData();

  const top5UpcomingTrips = upcomingTrips.slice(0, 5);
  return (
    <div className="p-6 space-y-8 bg-gray-100 min-h-screen">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <InfoCard icon={Ticket} label="Tổng vé đã đặt" value={totalBookings} />
        <InfoCard icon={Plane} label="Tổng chuyến bay" value={totalFlights} />
        <InfoCard icon={UserPlus} label="Người dùng mới" value={newUsers} />
        <InfoCard
          icon={DollarSign}
          label="Doanh thu"
          value={
            totalRevenue !== undefined && totalRevenue !== null
              ? Number(totalRevenue).toLocaleString("vi-VN") + " ₫"
              : "0 ₫"
          }
        />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ số vé đã đặt 5 tháng gần đây */}
        <div className="col-span-1 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Số Vé Đã Đặt 5 Tháng Gần Đây</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={bookingsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming Trips - chỉ lấy 5 chuyến gần nhất */}
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Chuyến Bay Sắp Tới</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {top5UpcomingTrips.map((trip, index) => (
              <TripCard key={index} chuyenBay={trip} />
            ))}
          </div>
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
          <h2 className="text-lg font-bold text-gray-700 mb-4">Đặt Vé Gần Đây</h2>
          <div className="flex flex-col gap-4">
            {recentBookings.map((booking, index) => (
              <BookingCard key={index} booking={booking} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;