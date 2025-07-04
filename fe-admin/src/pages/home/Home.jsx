import React, { useState } from "react";
import {
  DollarSign, Plane, Ticket, UserPlus, Search
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { Calendar } from "react-calendar";
import 'react-calendar/dist/Calendar.css';

// Dữ liệu mẫu
const revenueData = [
  { month: "T1", revenue: 20 },
  { month: "T2", revenue: 25 },
  { month: "T3", revenue: 22 },
  { month: "T4", revenue: 30 },
  { month: "T5", revenue: 28 },
  { month: "T6", revenue: 35 },
  { month: "T7", revenue: 40 },
];

const topDestinations = [
  { city: "Hà Nội", percent: 30 },
  { city: "TP.HCM", percent: 25 },
  { city: "Paris", percent: 20 },
  { city: "Tokyo", percent: 15 },
];

const bookings = [
  {
    id: "BK001",
    name: "Nguyễn Văn A",
    flight: "VN123",
    Airport: "Hà Nội",
    destination: "TP.HCM",
    seat: "12A",
    time: "2025-07-10 08:00",
    price: 2200000,
  },
  {
    id: "BK002",
    name: "Trần Thị B",
    flight: "VJ456",
    Airport: "TP.HCM",
    destination: "Đà Nẵng",
    seat: "7C",
    time: "2025-07-12 15:30",
    price: 1800000,
  },
  {
    id: "BK003",
    name: "Lê Minh C",
    flight: "QH789",
    Airport: "Đà Nẵng",
    destination: "Hà Nội",
    seat: "3B",
    time: "2025-07-15 19:45",
    price: 2100000,
  },
];

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#fbbf24'];

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md flex items-center gap-4">
    <div className={`bg-${color}-100 text-${color}-600 p-4 rounded-full shadow`}>
      <Icon className="w-7 h-7" />
    </div>
    <div>
      <h4 className="text-xs text-gray-500 font-semibold mb-1">{label}</h4>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <main className="p-8 max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-700 mb-2 drop-shadow">Welcome back, Admin 👋</h1>
            <p className="text-gray-600 text-lg">Here's what's happening with your travel business today.</p>
          </div>
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full py-2 pl-10 pr-4 rounded-2xl border border-gray-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-blue-400" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <StatCard icon={Ticket} label="Total Bookings" value="1,248" color="blue" />
          <StatCard icon={Plane} label="Total Flights" value="87" color="green" />
          <StatCard icon={DollarSign} label="Revenue" value="₫120M" color="yellow" />
          <StatCard icon={UserPlus} label="New Users" value="321" color="rose" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="bg-white col-span-2 p-7 rounded-2xl shadow-lg h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-700">Revenue Overview</h2>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={revenueData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => `${value}M`} contentStyle={{ fontSize: '14px' }} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-7 rounded-2xl shadow-lg h-[400px] flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Top Destinations</h2>
            <PieChart width={250} height={250}>
              <Pie
                data={topDestinations}
                dataKey="percent"
                nameKey="city"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={({ percent }) => `${(percent).toFixed(0)}%`}
              >
                {topDestinations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
            <ul className="mt-4 space-y-1 text-sm text-gray-600">
              {topDestinations.map((d, i) => (
                <li key={i}><span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>{d.city}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Calendar & Upcoming Flights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="bg-white p-7 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Calendar</h2>
            <Calendar onChange={setDate} value={date} className="border-none w-full rounded-xl" />
          </div>

          <div className="bg-white p-7 rounded-2xl shadow-lg col-span-2">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Upcoming Trip</h2>
            <table className="w-full text-sm rounded-xl overflow-hidden">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="py-2">Flight</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Seats</th>
                  <th>Time</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((f) => (
                  <tr key={f.id} className="border-b hover:bg-blue-50 transition">
                    <td className="py-2 font-medium text-blue-700">{f.flight}</td>
                    <td>{f.Airport}</td>
                    <td>{f.destination}</td>
                    <td>{f.seat}</td>
                    <td>{f.time}</td>
                    <td className="text-blue-600 font-semibold">{f.price.toLocaleString()}₫</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Messages + Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Messages</h2>
            <div className="space-y-4 text-sm text-gray-700">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 shadow-sm">
                <p className="font-semibold">Europia Hotel</p>
                <p className="text-xs text-gray-500">We are pleased to announce...</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 shadow-sm">
                <p className="font-semibold">Global Travel Co</p>
                <p className="text-xs text-gray-500">We have updated our...</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-2xl shadow-lg col-span-2">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Recent Bookings</h2>
            <table className="w-full text-sm rounded-xl overflow-hidden">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="py-2">Booking ID</th>
                  <th>Customer</th>
                  <th>Flight</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b hover:bg-blue-50 transition">
                    <td className="py-2 font-medium text-blue-700">{b.id}</td>
                    <td>{b.name}</td>
                    <td>{b.flight}</td>
                    <td className="text-blue-600 font-semibold">{b.price.toLocaleString()}₫</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
