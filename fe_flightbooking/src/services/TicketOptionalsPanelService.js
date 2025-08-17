// services/TicketOptionalsPanelService.jsx
import axios from "axios";

export const fetchSingleTicketPackage = async (maGiaVe) => {
  if (!maGiaVe) {
    throw new Error("Mã giá vé không hợp lệ");
  }

  try {
    // ✅ Gọi endpoint mới với pattern matching
    const response = await axios.get(`http://localhost:8000/ve/${maGiaVe}`);
    
    // ✅ API có thể trả về object hoặc array
    const data = response.data;
    return Array.isArray(data) ? data : [data];
    
  } catch (error) {
    console.error("❌ Error fetching ticket packages:", error);
    throw error;
  }
};

export const fetchMultipleTicketPackages = async (maGiaVes) => {
  if (!Array.isArray(maGiaVes) || maGiaVes.length === 0) {
    throw new Error("Danh sách mã vé không hợp lệ");
  }

  try {
    const response = await axios.post(
      "http://localhost:8000/ve/chi-tiet-ve-nhieu",
      { ma_gia_ves: maGiaVes }
    );

    return response.data || [];
  } catch (error) {
    console.error("❌ Error fetching multiple packages:", error);
    throw error;
  }
};
