import axios from "axios";
import { BASE_URL } from "../apiConfig";

export const searchFlights = async ({ from, to, selected }) => {
  try {
    const url = `${BASE_URL}/ve/search-ve`;
    const response = await axios.get(url, {
      params: {
        from_airport: from,
        to_airport: to,
        ten_hang_ve: selected
      },
      timeout: 8000, // ✅ Timeout 8s để tránh treo UI
    });

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("❌ Lỗi searchFlights:", error);
    throw error;
  }
};
