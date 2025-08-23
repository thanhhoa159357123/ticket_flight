import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

// ✅ Tạo axios instance để dễ quản lý interceptor, timeout
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000, // tránh treo UI
  headers: {
    "Content-Type": "application/json",
  },
});

export const ticketService = {
  // ✅ Lấy toàn bộ danh sách vé (có cache)
  getTicketPrices: async () => {
    const cached = sessionStorage.getItem("ticketPrices");
    if (cached) return JSON.parse(cached);

    try {
      const { data } = await api.get("/ve");
      const result = Array.isArray(data) ? data : [];

      // Cache vào sessionStorage để tăng tốc
      sessionStorage.setItem("ticketPrices", JSON.stringify(result));

      return result;
    } catch (err) {
      console.error("❌ Error fetching ticket prices:", err);
      return []; // ✅ Tránh crash UI
    }
  },

  // ✅ Tìm chuyến bay theo điều kiện
  searchFlights: async (params) => {
    try {
      const { data } = await api.post("/search-flights", params);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("❌ Error searching flights:", err);
      return [];
    }
  },
};

// Optional alias cho tương thích cũ
export const TicketService = ticketService.getTicketPrices;
