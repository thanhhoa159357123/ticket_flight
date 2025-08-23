import axios from "axios";
import { BASE_URL } from "../apiConfig";

// Hàm fetch an toàn, tái sử dụng
const safeFetch = async (url) => {
  try {
    const res = await axios.get(url);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error(`❌ Lỗi fetch API: ${url}`, err);
    return []; // ✅ Luôn trả về mảng rỗng để tránh crash UI
  }
};

export const fetchTripTypes = () => safeFetch(`${BASE_URL}/loaichuyendi`);
export const fetchSeatPositions = () => safeFetch(`${BASE_URL}/hangve`);
