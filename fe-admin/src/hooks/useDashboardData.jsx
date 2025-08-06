import { useEffect, useState } from "react";
import axios from "axios";

export const useDashboardData = () => {
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalFlights, setTotalFlights] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [bookingsByMonth, setBookingsByMonth] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [
          bookingsRes,
          flightsRes,
          usersRes,
          recentFlightsRes,
          recentBookingsRes,
          revenueRes
        ] = await Promise.all([
          axios.get("http://localhost:8080/dashboard/dat_ve/total"),
          axios.get("http://localhost:8080/chuyen_bay"),
          axios.get("http://localhost:8080/khach_hang"),
          axios.get("http://localhost:8080/chuyen_bay"),
          axios.get("http://localhost:8080/dat_ve"),
          axios.get("http://localhost:8080/dashboard/total_revenue")
        ]);

        setTotalBookings(bookingsRes.data.total_bookings);
        setTotalFlights(flightsRes.data.length);
        setNewUsers(usersRes.data.length);

        // Tính tổng doanh thu
        setTotalRevenue(revenueRes.data.total_revenue || 0);




        // Số vé đã đặt trong 5 tháng gần đây
        const now = new Date();
        const months = [];
        for (let i = 4; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push({
            label: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
            count: 0,
          });
        }
        recentBookingsRes.data.forEach((item) => {
          const date = new Date(item.ngay_dat || item.created_at);
          const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          const found = months.find((m) => m.label === label);
          if (found) found.count += 1;
        });
        setBookingsByMonth(months);

        // 5 chuyến bay sắp tới
        const now2 = new Date();
        const upcoming = recentFlightsRes.data
          .filter(item => new Date(item.gio_di) > now2)
          .sort((a, b) => new Date(a.gio_di) - new Date(b.gio_di))
          .slice(0, 5);
        setUpcomingTrips(upcoming);

        // Map ma_khach_hang sang ten_khach_hang
        const khachHangMap = {};
        usersRes.data.forEach(kh => {
          khachHangMap[kh.ma_khach_hang] = kh.ten_khach_hang;
        });

        // 3 vé được đặt gần nhất, gán thêm tên khách hàng
        const recent = recentBookingsRes.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3)
          .map(item => ({
            ...item,
            ten_khach_hang: khachHangMap[item.ma_khach_hang] || "Không rõ"
          }));
        setRecentBookings(recent);

      } catch (err) {
        console.error("Lỗi khi tải dữ liệu dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return {
    totalBookings,
    totalFlights,
    newUsers,
    bookingsByMonth,
    upcomingTrips,
    recentBookings,
    totalRevenue,
    loading,
  };
};
export default useDashboardData;