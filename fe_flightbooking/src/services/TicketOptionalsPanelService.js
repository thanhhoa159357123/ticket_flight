// services/TicketOptionalsPanelService.jsx
import axios from "axios";

// ✅ Axios instance dùng chung, dễ quản lý
const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 8000,
});

export const fetchSingleTicketPackage = async (maGiaVe) => {
  if (!maGiaVe) throw new Error("Mã giá vé không hợp lệ");

  // ✅ Thêm caching phía client: nếu data đã fetch thì lấy từ cache
  const cacheKey = `ticket_package_${maGiaVe}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  try {
    const { data } = await api.get(`/ve/${maGiaVe}`);
    const result = Array.isArray(data) ? data : [data];

    sessionStorage.setItem(cacheKey, JSON.stringify(result));
    return result;
  } catch (error) {
    console.error("❌ Lỗi khi fetch gói vé:", error);
    throw error;
  }
};
