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
          bookingsRes,       // thống kê đặt vé
          flightsRes,        // tất cả chuyến bay
          usersRes,          // danh sách KH
          upcomingRes,       // chuyến bay sắp tới (API backend đã lọc)
          datveRes,          // tất cả vé đã đặt
          revenueRes,        // hóa đơn
        ] = await Promise.all([
          axios.get("http://localhost:8080/datve/thong_ke"),
          axios.get("http://localhost:8080/chuyenbay"),
          axios.get("http://localhost:8080/khachhang"),
          axios.get("http://localhost:8080/chuyenbay/upcoming"),
          axios.get("http://localhost:8080/datve"),
          axios.get("http://localhost:8080/hoadon"),
        ]);

        setTotalBookings(bookingsRes.data.total_bookings);
        setTotalFlights(flightsRes.data.length);
        setNewUsers(usersRes.data.length);
        setUpcomingTrips(upcomingRes.data.data || []);

        // 👉 Tính tổng doanh thu
        const sumRevenue = revenueRes.data.reduce(
          (acc, item) => acc + (item.tong_tien || 0),
          0
        );
        setTotalRevenue(sumRevenue);

        // 👉 Số vé 5 tháng gần đây
        const now = new Date();
        const months = [];
        for (let i = 4; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push({
            label: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
            count: 0,
          });
        }
        datveRes.data.forEach((item) => {
          const date = new Date(item.ngay_dat || item.created_at);
          const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          const found = months.find((m) => m.label === label);
          if (found) found.count += 1;
        });


        
        setBookingsByMonth(months);

        // 👉 Map ma_khach_hang sang ten_khach_hang
        const khachHangMap = {};
        usersRes.data.forEach((kh) => {
          khachHangMap[kh.ma_khach_hang] = kh.ten_khach_hang;
        });

        // 👉 3 vé gần nhất
        const recent = datveRes.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3)
          .map((item) => ({
            ...item,
            ten_khach_hang: khachHangMap[item.ma_khach_hang] || "Không rõ",
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
