import axios from "axios";
import { BASE_URL } from "../apiConfig";

export const fetchAirports = async () => {
  // ✅ Kiểm tra cache để giảm gọi API thừa
  const cached = sessionStorage.getItem("airports");
  if (cached) return JSON.parse(cached);

  try {
    const res = await axios.get(`${BASE_URL}/sanbay`);
    const data = Array.isArray(res.data) ? res.data : [];
    const formatted = data.map((item) => ({
      name: item.ten_san_bay,
      code: item.ma_san_bay,
    }));

    sessionStorage.setItem("airports", JSON.stringify(formatted));
    return formatted;
  } catch (error) {
    console.error("❌ Lỗi fetch airports:", error);
    return []; // ✅ Tránh UI bị crash
  }
};
