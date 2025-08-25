import { useState, useEffect } from "react";
import axios from "axios";

export default function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch] = useState("");

  // Gọi API lấy dữ liệu
  useEffect(() => {
    axios
      .get("http://localhost:8080/datve/admin/all")
      .then((res) => {
        console.log("✅ Received data:", res.data);
        setTickets(Array.isArray(res.data) ? res.data : []);
      })
      .catch((error) => {
        console.error("❌ Error fetching tickets:", error);
        setTickets([]);
      });
  }, []);

  // Lọc theo search
  const filteredTickets = tickets.filter((t) =>
    t.ma_dat_ve?.toLowerCase().includes(search.toLowerCase())
  );

  // Thống kê
  const total = tickets.length;
  const daThanhToan = tickets.filter((t) => t.trang_thai === "Đã thanh toán").length;
  const daHuy = tickets.filter((t) => t.trang_thai === "Đã hủy").length;

  return {
    tickets,
    selectedTicket,
    setSelectedTicket,
    search,
    setSearch,
    filteredTickets,
    total,
    daThanhToan,
    daHuy,
  };
}
